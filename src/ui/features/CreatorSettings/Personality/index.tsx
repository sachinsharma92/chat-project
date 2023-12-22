'use client';

import { useForm } from 'react-hook-form';
import { isEmpty, map, pick, size, toString, trim } from 'lodash';
import { useAuth, useCreatorSpace } from '@/hooks';
import { useEffect, useMemo, useState } from 'react';
import {
  createSpaceBotProfile,
  updateOrCreateAICloneFormProperties,
  updateSpaceBotProfilePropertiesByFormId,
} from '@/lib/supabase';
import { IBotFormAnswers } from '@/types';
import { useBotnetAuth } from '@/store/Auth';
import { defaultCloneAIGreetingPhrase } from '@/lib/utils/bot';
import { useSpacesStore } from '@/store/App';
import { v4 } from 'uuid';
import { useSpaceBotForm } from '@/hooks/useSpaceBotForm';

import TextareaAutosize from 'react-textarea-autosize';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import Knowledge from './Knowledge';
import './Personality.css';

const Personality = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // owned space, not necessarily active/selected
  const { spaceId, spaceInfo } = useCreatorSpace();

  const [updating, setUpdating] = useState(false);

  const [displayName] = useBotnetAuth(state => [state.displayName]);

  const { botFormAnswers, fetchingFormData, setBotFormAnswers } =
    useSpaceBotForm();

  const { userId } = useAuth();

  const [setSpaceInfo] = useSpacesStore(state => [state.setSpaceInfo]);

  const [error, setError] = useState('');

  const updatePersonalityProps = async (
    updatedProps: Partial<IBotFormAnswers>,
  ) => {
    if (!spaceId || isEmpty(updatedProps)) {
      return;
    }

    let formId = botFormAnswers?.id || '';
    const cloneFormProps = {
      ...updatedProps,
      spaceId,
      owner: userId,
      updatedAt: new Date().toISOString(),
      name: '',
    };
    const resUpdateOrCreate = await updateOrCreateAICloneFormProperties(
      cloneFormProps,
      formId,
    );
    const creatingNew = !formId;

    if (!isEmpty(resUpdateOrCreate?.id) && creatingNew) {
      formId = resUpdateOrCreate?.id;
      const newSpaceBotProps = {
        spaceId,
        formId,
        description: updatedProps?.description || '',
        id: v4(),
        owner: userId,
      };

      setBotFormAnswers({ ...cloneFormProps, id: resUpdateOrCreate?.id });
      await createSpaceBotProfile(newSpaceBotProps);

      if (spaceInfo?.bots) {
        spaceInfo.bots.push(newSpaceBotProps);
        setSpaceInfo(spaceId, spaceInfo);
      }
    } else {
      setBotFormAnswers({ ...botFormAnswers, ...cloneFormProps });
    }

    if (formId) {
      if (updatedProps?.greeting || updatedProps?.description) {
        await updateSpaceBotProfilePropertiesByFormId(formId, {
          ...pick(updatedProps, ['greeting', 'description']),
        });
      }

      // update description state copy
      if (spaceInfo?.bots && !isEmpty(updatedProps?.description)) {
        spaceInfo.bots = map(spaceInfo.bots, bot => {
          if (bot?.formId === formId) {
            return {
              ...bot,
              ...pick(updatedProps, ['greeting', 'description']),
            };
          }

          return bot;
        });
      }

      // update state info state copy
      if (spaceInfo) {
        setSpaceInfo(spaceId, spaceInfo);
      }
    }
  };

  const onSave = async (data: any) => {
    try {
      const updatedProps = pick(data, [
        'instructions',
        'greeting',
        'backstory',
      ]);

      if (
        fetchingFormData ||
        !data ||
        !spaceId ||
        !updatedProps ||
        isEmpty(updatedProps)
      ) {
        return;
      }

      if (isEmpty(trim(updatedProps?.instructions))) {
        setError('Instructions are required.');
        return;
      }

      setError('');
      setUpdating(true);

      await updatePersonalityProps(updatedProps);
    } catch (err: any) {
      console.log('Personality onSave() err:', err?.message);

      setError(err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const greetings = useMemo(() => {
    if (botFormAnswers?.greeting) {
      return botFormAnswers.greeting;
    }

    return defaultCloneAIGreetingPhrase(displayName);
  }, [displayName, botFormAnswers]);

  const backstory = useMemo(
    () => toString(botFormAnswers?.backstory),
    [botFormAnswers],
  );

  const instructions = useMemo(
    () => toString(botFormAnswers?.instructions),
    [botFormAnswers],
  );

  /**
   * Consume updated backstory
   */
  useEffect(() => {
    setValue('backstory', backstory);
  }, [backstory, setValue]);

  /**
   * Consume updated instructions
   */
  useEffect(() => {
    setValue('instructions', instructions);
  }, [instructions, setValue]);

  const errorMessage = useMemo(
    () =>
      error ||
      errors?.displayName?.message?.toString() ||
      errors?.username?.message?.toString(),
    [errors, error],
  );

  return (
    <div className="personality">
      <h1> Personality </h1>
      <form onSubmit={handleSubmit(onSave)} className="relative box-border">
        <section>
          <h2>Instructions </h2>
          <TextareaAutosize
            maxLength={300}
            maxRows={5}
            minRows={3}
            {...register('instructions', {
              required: 'Instructions are required.',
              value: instructions,
            })}
          />

          <div className="settings-tip">
            <p>
              What does this Bot do? How does it behave? What should it avoid
              doing?
            </p>

            <p className="relative text-[#666]">
              {`${size(watch('instructions'))} / 300`}
            </p>
          </div>
        </section>

        <section>
          <h2>Base Model</h2>

          {/** @ts-ignore */}
          <TextInput defaultValue="GPT 3.5" readOnly={true} />
        </section>

        <section>
          <h2>Greetings</h2>

          <div className="settings-tip justify-start">
            <p> What would they say to introduce themselves?</p>

            <p className="relative text-[#666]">
              {`${size(watch('greetings'))} / 300`}
            </p>
          </div>

          <TextInput
            {...register('greeting', {
              required: 'A greetings text is required.',
              value: greetings,
            })}
          />
        </section>

        <section>
          <h2>Backstory </h2>

          <TextareaAutosize
            maxLength={300}
            maxRows={5}
            minRows={3}
            {...register('backstory', {
              required: 'A character with a backstory is required.',
              value: backstory,
            })}
          />

          <div className="settings-tip">
            <p>What is the Bot’s history?</p>
            <p className="relative text-[#666]">
              {`${size(watch('backstory'))} / 300`}
            </p>
          </div>
        </section>

        <section>
          <h2>
            Knowledge <span>(Optional)</span>
          </h2>

          <div className="settings-tip justify-start">
            <p> Add files that this Bot would have knowledge of</p>
          </div>

          {isEmpty(botFormAnswers) && (
            <Knowledge
              botFormAnswers={botFormAnswers}
              updatePersonalityProps={updatePersonalityProps}
            />
          )}
        </section>

        {!isEmpty(errorMessage) && (
          <div className="settings-cta-error">
            <p>{errorMessage}</p>
          </div>
        )}

        <div className="settings-cta">
          <Button type="submit" isLoading={updating || fetchingFormData}>
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Personality;
