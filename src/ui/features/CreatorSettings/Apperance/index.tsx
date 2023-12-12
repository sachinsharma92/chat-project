'use client';

import { InterTight } from '@/app/fonts';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';
import { AIIcon } from '@/icons';
import {
  supabaseClient,
  updateSpaceBotProfilePropertiesByFormId,
  updateUserPrivateDataProps,
} from '@/lib/supabase';
import { useAuth } from '@/hooks';
import { isEmpty, toString, trim } from 'lodash';
import { APIClient } from '@/lib/api';
import { GenerateBackgroundPostResponse } from '@/app/api/generate-background/route';
import { useUserPrivateData } from '@/hooks/useUserPrivateData';
import { publicBucketName } from '@/lib/supabase/storage';
import { base64ToBlob } from '@/lib/utils/image';
import { useSpaceBotForm } from '@/hooks/useSpaceBotForm';

import TextareaAutosize from 'react-textarea-autosize';
import Button from '@/components/common/Button';
import './Appearance.css';

const Appearance = () => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const { userId, getSupabaseAuthHeaders } = useAuth();
  const [updating, setUpdating] = useState(false);
  const { userPrivateData, setUserPrivateData } = useUserPrivateData();

  const { botFormAnswers, fetchingFormData } = useSpaceBotForm();

  const memoedUserId = useMemo(() => userId, [userId]);

  const backgroundUrl = useMemo(
    () =>
      userPrivateData?.appearance?.backgroundUrl ||
      // @ts-ignore
      userPrivateData?.appearance?.background_url ||
      '',
    [userPrivateData],
  );

  const onSaveBackground = async (data: any) => {
    try {
      if (!data || isEmpty(data)) {
        return;
      }

      const backgroundPrompt = trim(data?.background || '');

      if (backgroundPrompt) {
        setUpdating(true);

        const authHeaders = getSupabaseAuthHeaders();
        const reqHeaders = {
          ...authHeaders,
        };
        const res = await APIClient.post<GenerateBackgroundPostResponse>(
          '/api/generate-background',
          {
            prompt: backgroundPrompt,
          },
          {
            headers: reqHeaders,
          },
        );
        const resData = res?.data;
        const updatedBackgroundB64 = resData?.b64;
        const updatedBackgroundUrl = resData?.url;
        const backgroundImageBlob = base64ToBlob(
          updatedBackgroundB64,
          'image/png',
        );

        if (updatedBackgroundUrl && userPrivateData && backgroundImageBlob) {
          const fileName = `${userId}/background_${Date.now()}.png`;
          const { data: uploadData } = await supabaseClient.storage
            .from(publicBucketName)
            .upload(fileName, backgroundImageBlob, {
              contentType: 'image/png',
            });

          if (uploadData?.path) {
            const path = uploadData?.path;
            const { data: urlData } = supabaseClient.storage
              .from(publicBucketName)
              .getPublicUrl(path);
            const url = urlData?.publicUrl;
            const updatedAppearance = {
              background:
                backgroundPrompt ||
                toString(userPrivateData?.appearance?.background),
              backgroundUrl: url,
            };
            const botFormId = botFormAnswers?.id;

            setUserPrivateData({
              ...userPrivateData,
              appearance: { ...updatedAppearance },
            });

            await updateUserPrivateDataProps(memoedUserId, {
              appearance: { ...updatedAppearance },
            });

            if (botFormId) {
              await updateSpaceBotProfilePropertiesByFormId(botFormId, {
                background: url,
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.log('onSaveBackground() err:', err?.message);
    } finally {
      setUpdating(false);
    }
  };

  const onSaveAvatar = () => {};

  const errorMessage = useMemo(
    () => errors?.background?.message?.toString(),
    [errors],
  );

  /**
   * Store value
   */
  useEffect(() => {
    if (userPrivateData?.appearance?.background) {
      setValue('background', userPrivateData?.appearance?.background);
    }
  }, [userPrivateData?.appearance?.background, setValue]);

  return (
    <div className="creator-appearance">
      <h1 className={InterTight.className}> Appearance </h1>

      <form onSubmit={handleSubmit(onSaveBackground)}>
        <section>
          <h2>Background </h2>
          <TextareaAutosize
            placeholder="VR360 panorama, vibrant astrological tapestry, constellations backdrop. Massive, detailed Gundam, mechanized warrior. Iridescent nebulas, galaxies at a distance. Anime-style depiction, VR360 immersive vision."
            maxLength={300}
            maxRows={5}
            minRows={3}
            {...register('background', {
              required: 'Please provide a description.',
              value: userPrivateData?.appearance?.background,
            })}
          />

          {!isEmpty(errorMessage) && (
            <div className="settings-cta-error">
              <p>{errorMessage}</p>
            </div>
          )}

          <div className="flex justify-start items-center box-border w-full mt-6 mb-4">
            <Button
              isLoading={updating || !userPrivateData || fetchingFormData}
              type="submit"
              className="regenerate-button bg-[#f5f5f5]"
            >
              <AIIcon />
              <p>Regenerate </p>
            </Button>
          </div>
        </section>
      </form>

      <form onSubmit={handleSubmit(onSaveAvatar)}>
        <section>
          <h2>Hair </h2>
        </section>

        <section>
          <h2>Face </h2>
        </section>

        <section>
          <h2>Body </h2>
        </section>

        <div className="settings-cta">
          <Button
            type="submit"
            className="relative w-[500px] box-border"
            isLoading={updating || !userPrivateData || fetchingFormData}
          >
            Save
          </Button>
        </div>
      </form>

      {!isEmpty(backgroundUrl) && (
        <div className="creator-appearance-background-container">
          <img src={backgroundUrl} alt="Background preview" />
        </div>
      )}
    </div>
  );
};

export default Appearance;
