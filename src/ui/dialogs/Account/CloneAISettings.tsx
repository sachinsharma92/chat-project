import TextInput from '@/ui/common/TextInput';
import Button from '@/ui/common/Button';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { useBotnetAuth } from '@/store/Auth';
import { defaultCloneAIGreetingPhrase } from '@/utils/bot';
import { useEffect, useMemo, useState } from 'react';
import { filter, head, isEmpty, toString } from 'lodash';
import {
  createSpaceBotProfile,
  getAICloneCompletedForms,
  updateOrCreateAICloneFormProperties,
  updateSpaceBotProfileProperties,
} from '@/lib/supabase';
import { IBotFormAnswers } from '@/types';
import { v4 as uuid } from 'uuid';
import { useSpacesStore } from '@/store/Spaces';
import LoadingSpinner from '@/ui/common/LoadingSpinner';
import './CloneAISettings.css';

const CloneAISettings = () => {
  const [displayName, userId] = useBotnetAuth(state => [
    state.displayName,
    state.session?.user?.id as string,
  ]);
  const [updating, setUpdating] = useState(false);
  const [fetchingFormData, setFetchingFormData] = useState(true);
  const [botFormAnswers, setBotFormAnswers] =
    useState<Partial<IBotFormAnswers> | null>(null);
  const [spaces, setSpaceInfo] = useSpacesStore(state => [
    state.spaces,
    state.setSpaceInfo,
  ]);
  // owned space, not necessarily active/selected
  const spaceInfo = useMemo(() => {
    const find = filter(
      spaces,
      space => !isEmpty(space?.id) && space?.owner === userId,
    );
    return head(find);
  }, [spaces, userId]);
  // owned space id
  const spaceId = useMemo(() => {
    return spaceInfo?.id as string;
  }, [spaceInfo]);

  const {
    register,
    handleSubmit,
    // setValue,
    // watch,
    formState: { errors },
  } = useForm();

  /** Form error message */
  const errorMessage = useMemo(() => {
    return (
      errors?.greeting?.message ||
      errors?.description?.message ||
      errors?.backstory?.message ||
      errors?.characteristics?.message ||
      ''
    );
  }, [errors]);

  const onSave = async (data: any) => {
    // store changes

    try {
      if (updating || fetchingFormData) {
        return;
      }

      setUpdating(true);
      const formId = botFormAnswers?.id as string;
      const { greeting, backstory, description, characteristics } = data;
      const meta = {
        ...(botFormAnswers?.meta || {}),
        characteristics,
      };
      const creatingNew = !formId;
      const cloneFormProps = {
        spaceId,
        greeting,
        backstory,
        description,
        meta,
        owner: userId,
        updatedAt: new Date().toISOString(),
        name: '',
      };
      const resUpdateOrCreate = await updateOrCreateAICloneFormProperties(
        cloneFormProps,
        formId,
      );

      if (!isEmpty(resUpdateOrCreate?.id) && creatingNew) {
        const newFormId = resUpdateOrCreate?.id;
        const newSpaceBotProps = {
          spaceId,
          id: uuid(),
          owner: userId,
          formId: newFormId,
        };

        setBotFormAnswers({ ...cloneFormProps, id: resUpdateOrCreate?.id });
        await createSpaceBotProfile(newSpaceBotProps);

        if (spaceInfo?.bots) {
          spaceInfo.bots.push(newSpaceBotProps);
          setSpaceInfo(spaceId, spaceInfo);
        }
      } else if (!creatingNew) {
        await updateSpaceBotProfileProperties(formId, { greeting });
      }
    } catch (err: any) {
      console.log('onSave() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Fetch most recently accomplished bot forms, i.e. AI clones
   */
  useEffect(() => {
    const get = async () => {
      if (userId && spaceId) {
        const { data, error } = await getAICloneCompletedForms(spaceId);

        if (data && !error) {
          setBotFormAnswers(head(data));
          setFetchingFormData(false);
        }
      }
    };

    get();
  }, [userId, spaceId]);

  return (
    <div className="clone-ai-settings">
      {fetchingFormData && <LoadingSpinner />}
      {!fetchingFormData && (
        <form
          onSubmit={handleSubmit(onSave)}
          className="clone-ai-settings-form"
        >
          <div className="greetings">
            <label className="label" htmlFor="displayName">
              Greeting
            </label>
            <TextInput
              className="input"
              variant={'primary'}
              placeholder={defaultCloneAIGreetingPhrase(displayName)}
              {...register('greeting', {
                required: 'Greeting should not be empty.',
                value: toString(botFormAnswers?.greeting),
              })}
            />

            <p className="tip">Conversation starter</p>

            <label className="label" htmlFor="description">
              Description
            </label>
            <TextInput
              className="input"
              variant={'primary'}
              placeholder="Let's talk about movies!"
              {...register('description', {
                required: 'Please provide a description.',
                value: toString(botFormAnswers?.description),
              })}
            />
            <p className="tip">A short details about your space and AI clone</p>

            <label className="label" htmlFor="backstory">
              Backstory
            </label>

            <TextareaAutosize
              className="textarea"
              placeholder="I grew up in East Texas playing video games. I love to talk about video game mechanics and strategies."
              {...register('backstory', {
                required: 'Character backstory is required.',
                value: toString(botFormAnswers?.backstory),
              })}
              maxLength={500}
              maxRows={12}
              minRows={4}
            />

            <label className="label" htmlFor="backstory">
              Characteristics
            </label>

            <TextareaAutosize
              className="textarea"
              placeholder="I'm optimistic. I'm business minded so I might convince you to buy some from what I'm selling."
              {...register('characteristics', {
                required: 'Please describe your character.',
                value: toString(botFormAnswers?.meta?.characteristics),
              })}
              maxLength={240}
              maxRows={6}
              minRows={3}
            />
          </div>

          {!isEmpty(errorMessage) && (
            <div className="input-error">
              <p>{toString(errorMessage)}</p>
            </div>
          )}

          <Button
            isLoading={updating || fetchingFormData}
            className="save-button"
            type="submit"
            variant="primary"
          >
            <p>Save</p>
          </Button>
        </form>
      )}
    </div>
  );
};

export default CloneAISettings;
