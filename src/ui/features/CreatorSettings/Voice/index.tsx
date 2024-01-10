'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth, useCreatorSpace } from '@/hooks';
import { filter, head, isEmpty, map, pick, size } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserPrivateData } from '@/hooks/useUserPrivateData';
import {
  ICloneAudioItem,
  ICloneAudioProps,
  IUserPrivateProps,
} from '@/types/supabase';
import { CrossIcon } from '@/icons';
import { uploadUserVocalSampleFile } from '@/lib/utils/upload';
import { updateUserPrivateDataProps } from '@/lib/supabase';
import { useBotnetAuth } from '@/store/Auth';
import { CloneVoiceBodyRequest, CloneVoiceResponse } from '@/types';
import { APIClient } from '@/lib/api';
import { maxVocalSampleAudioFiles } from '@/constants';

import Button from '@/components/common/Button';
import TextareaAutosize from 'react-textarea-autosize';
import TextInput from '@/components/common/TextInput';
import VocalSamples from './VocalSamples';
import './Voice.css';

const Voice = () => {
  const { spaceInfo } = useCreatorSpace();
  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);
  const botId = useMemo(() => spaceBotInfo?.id || '', [spaceBotInfo]);
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const { userPrivateData, setUserPrivateData } = useUserPrivateData();

  const [error, setError] = useState('');

  const errorMessage = useMemo(
    () => errors?.description?.message?.toString() || error || '',
    [errors, error],
  );

  const [displayName] = useBotnetAuth(state => [state.displayName]);

  const [uploading, setUploading] = useState(false);

  const [updating, setUpdating] = useState(false);

  const { userId, getSupabaseAuthHeaders } = useAuth();

  const cloneAudio: ICloneAudioProps = useMemo(
    () => userPrivateData?.cloneAudio || ({} as ICloneAudioProps),
    [userPrivateData],
  );

  const storedVoiceId = useMemo(() => cloneAudio?.voiceId, [cloneAudio]);

  const isLoading = useMemo(
    () => uploading || updating || !userPrivateData || isEmpty(userPrivateData),
    [userPrivateData, uploading, updating],
  );

  const onSave = async (data: any) => {
    if (isLoading) {
      return;
    }

    if (!displayName) {
      setError('Please provide a name for your profile first.');
      return;
    }

    try {
      if (!isEmpty(data) && botId) {
        setUpdating(true);
        setError('');

        const labelProps = pick(data, ['language', 'age', 'accent', 'energy']);
        const language = labelProps?.language || '';
        const age = labelProps?.age || '';
        const accent = labelProps?.accent;
        const energy = labelProps?.energy;

        if (!language) {
          setError('Please specify a language for your profile.');
          return;
        }

        const description = data?.description;
        const labels = { language, age, accent, energy };

        const updatedUserPrivateData: Partial<IUserPrivateProps> = {
          cloneAudio: {
            ...(userPrivateData?.cloneAudio || {}),
            labels,
            data: userPrivateData?.cloneAudio?.data || [],
            description,
          },
        };

        const fileUrls = filter(
          map(
            userPrivateData?.cloneAudio?.data || [],
            audioData => audioData?.url,
          ),
        );

        const saveData = async () => {
          setUserPrivateData({
            ...userPrivateData,
            ...updatedUserPrivateData,
          } as IUserPrivateProps);

          await updateUserPrivateDataProps(userId, {
            ...updatedUserPrivateData,
          });
        };

        if (fileUrls && !isEmpty(fileUrls)) {
          // trigger API
          const cloneVoiceProps: CloneVoiceBodyRequest = {
            fileUrls,
            labels,
            description,
            voiceId: storedVoiceId || '',
            name: displayName,
            spaceBotId: botId,
          };
          const reqHeaders = getSupabaseAuthHeaders();
          const res = await APIClient.post<CloneVoiceResponse>(
            // trigger clone voice endpoint here
            '/api/clone-voice',
            cloneVoiceProps,
            {
              headers: reqHeaders,
            },
          );
          const resData = res?.data;
          const updatedVoiceId = resData?.voiceId;

          if (
            updatedVoiceId &&
            updatedUserPrivateData?.cloneAudio &&
            updatedUserPrivateData?.cloneAudio?.voiceId !== updatedVoiceId
          ) {
            // save voice id
            updatedUserPrivateData.cloneAudio.voiceId = updatedVoiceId;
          }

          await saveData();
        } else {
          await saveData();
        }
      }
    } catch (err: any) {
      console.log('onSave() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const onAddVocalSamples = async () => {
    // upload and save in private_data
    if (isLoading) {
      return;
    }

    try {
      const res = await uploadUserVocalSampleFile(
        userId,
        () => setUploading(true),
        () => setUploading(false),
      );

      if (res?.url && !isEmpty(res?.url)) {
        const currentData = userPrivateData?.cloneAudio?.data || [];
        const newItem: ICloneAudioItem = {
          url: res.url,
          name: res.fileName,
          size: res.size,
        };
        const updatedUserPrivateData: Partial<IUserPrivateProps> = {
          cloneAudio: {
            ...(userPrivateData?.cloneAudio || {}),
            data: [...currentData, newItem],
          },
        };

        setUserPrivateData({
          ...userPrivateData,
          ...updatedUserPrivateData,
        } as IUserPrivateProps);

        await updateUserPrivateDataProps(userId, {
          ...updatedUserPrivateData,
        });
      }
    } catch (err: any) {
      console.log('onAddVocalSamples() err:', err?.message);
    } finally {
      setUploading(false);
    }
  };

  const cloneAudioFiles: ICloneAudioItem[] = useMemo(
    () => userPrivateData?.cloneAudio?.data || [],
    [userPrivateData],
  );

  const maxAudioFilesReached = useMemo(
    () => size(cloneAudioFiles) >= maxVocalSampleAudioFiles,
    [cloneAudioFiles],
  );

  /**
   * Consume value change
   */
  useEffect(() => {
    if (!isEmpty(cloneAudio?.labels)) {
      const labels = cloneAudio.labels;
      const language = labels?.language || '';
      const age = labels?.age || '';
      const accent = labels?.accent;
      const energy = labels?.energy;
      const description = cloneAudio?.description;

      if (language) {
        setValue('language', language);
      }

      if (age) {
        setValue('age', age);
      }

      if (accent) {
        setValue('accent', accent);
      }

      if (energy) {
        setValue('energy', energy);
      }

      if (description) {
        setValue('description', description);
      }
    }
  }, [cloneAudio, setValue]);

  return (
    <div className="creator-voice">
      <h1> Voice </h1>
      <Tabs defaultValue="custom">
        <form onSubmit={handleSubmit(onSave)}>
          <section>
            <h2>Voice Type </h2>
            <TabsList className="creator-voice-tabs-list">
              <TabsTrigger
                className="creator-voice-tabs-trigger"
                value="custom"
              >
                Custom
              </TabsTrigger>
              <TabsTrigger
                className="creator-voice-tabs-trigger"
                value="template"
              >
                Template
              </TabsTrigger>
            </TabsList>
          </section>

          <TabsContent value="custom">
            <section>
              <h2>Vocal Samples </h2>

              <div className="settings-tip">
                <p>What would they say to introduce themselves?</p>
              </div>

              {!isEmpty(userPrivateData) && (
                <VocalSamples
                  userPrivateData={userPrivateData}
                  blockUpdate={isLoading}
                  setUpdating={b => setUpdating(b)}
                  setUserPrivateData={(u: IUserPrivateProps) => {
                    setUserPrivateData(u);
                  }}
                />
              )}

              <div className="flex justify-start items-center box-border w-full mt-6 mb-4">
                <Button
                  type="submit"
                  className="add-sample-button bg-[#f5f5f5]"
                  onClick={onAddVocalSamples}
                  isLoading={isLoading}
                  isDisabled={maxAudioFilesReached}
                  disabled={maxAudioFilesReached}
                >
                  <p>Add Sample </p>
                </Button>
              </div>
            </section>
            <section>
              <h2>
                Voice Description <span>(Optional)</span>
              </h2>

              <TextareaAutosize
                maxLength={300}
                maxRows={5}
                minRows={3}
                placeholder='e.g. "An old American male voice with a slight hoarseness in his throat. Perfect for news.”'
                {...register('description', {
                  required: 'Description is required.',
                })}
              />

              <div className="settings-tip">
                <p>How would you describe the voice?</p>

                <p className="relative text-[#666]">
                  {`${size(watch('instructions'))} / 300`}
                </p>
              </div>
            </section>

            <section>
              <h2>
                Labels <span>(Optional)</span>
              </h2>
              <div className="settings-tip">
                <p>
                  {`These don’t have to be exact but help inform the Voice
                  generation.`}
                </p>
              </div>

              <div className="creator-voice-label">
                <label>Language</label>
                <div>
                  <TextInput
                    {...register('language', { required: false })}
                    placeholder="English"
                  />
                  <Button
                    onClick={() => {
                      if (isLoading) {
                        return;
                      }

                      setValue('language', '');
                    }}
                  >
                    <CrossIcon />
                  </Button>
                </div>
              </div>

              <div className="creator-voice-label">
                <label>Accent</label>
                <div>
                  <TextInput
                    {...register('accent', { required: false })}
                    placeholder="American"
                  />
                  <Button
                    onClick={() => {
                      if (isLoading) {
                        return;
                      }
                      setValue('accent', '');
                    }}
                  >
                    <CrossIcon />
                  </Button>
                </div>
              </div>

              <div className="creator-voice-label">
                <label>Age </label>
                <div>
                  <TextInput
                    {...register('age', { required: false })}
                    placeholder="20"
                  />
                  <Button
                    onClick={() => {
                      if (isLoading) {
                        return;
                      }
                      setValue('age', '');
                    }}
                  >
                    <CrossIcon />
                  </Button>
                </div>
              </div>

              <div className="creator-voice-label">
                <label>Energy </label>
                <div>
                  <TextInput
                    {...register('energy', { required: false })}
                    placeholder="High"
                  />
                  <Button
                    onClick={() => {
                      if (isLoading) {
                        return;
                      }
                      setValue('energy', '');
                    }}
                  >
                    <CrossIcon />
                  </Button>
                </div>
              </div>
            </section>

            {!isEmpty(errorMessage) && (
              <div className="settings-cta-error">
                <p>{errorMessage}</p>
              </div>
            )}

            <div className="creator-voice-custom-cta settings-cta">
              <Button type="submit" isLoading={isLoading}>
                Save
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="template"></TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default Voice;
