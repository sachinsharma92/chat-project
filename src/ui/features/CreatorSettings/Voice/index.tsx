'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreatorSpace } from '@/hooks';
import { head, isEmpty, size } from 'lodash';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useUserPrivateData } from '@/hooks/useUserPrivateData';
import { IUserPrivateProps } from '@/types/supabase';
import { CrossIcon } from '@/icons';

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
    formState: { errors },
  } = useForm();
  const { userPrivateData, setUserPrivateData } = useUserPrivateData();

  const errorMessage = useMemo(
    () => errors?.description?.message?.toString() || '',
    [errors],
  );

  const onSave = (data: any) => {
    if (!isEmpty(data) && botId) {
      //
    }
  };

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
                  setUserPrivateData={(u: IUserPrivateProps) =>
                    setUserPrivateData(u)
                  }
                />
              )}

              <div className="flex justify-start items-center box-border w-full mt-6 mb-4">
                <Button
                  type="submit"
                  className="add-sample-button bg-[#f5f5f5]"
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
                  required: false,
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
                  These don’t have to be exact but help inform the Voice
                  generation.
                </p>
              </div>

              <div className="creator-voice-label">
                <label>Language</label>
                <div>
                  <TextInput
                    {...register('language', { required: false })}
                    placeholder="English"
                  />
                  <Button>
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
                  <Button>
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
                  <Button>
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
                  <Button>
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
              <Button type="submit">Save</Button>
            </div>
          </TabsContent>
          <TabsContent value="template"></TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default Voice;
