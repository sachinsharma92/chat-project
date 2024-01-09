import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
import FormData from 'form-data';
import axios from 'axios';
import fs from 'fs';

dotenv.config({ path: `.env.local` });

import {
  filter,
  isEmpty,
  isObject,
  isString,
  last,
  size,
  toString,
  trim,
} from 'lodash';
import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import {
  getElevenLabsAddVoicesApiBaseUrl,
  getElevenLabsApiKey,
  getElevenLabsEditVoiceApiBaseUrl,
} from '@/lib/elevenlabs';
import {
  applyApiRoutesAuth,
  updateSpaceBotProfilePropertiesById,
} from '@/lib/supabase';
import { CloneVoiceBodyRequest } from '@/types';
import { isDevelopment } from '@/lib/environment';

/**
 * HOW TO HIT THIS ENDPOINT
 */

// const cloneVoiceProps: CloneVoiceBodyRequest = {
//   fileUrls: [
//      'your-file-url-hosted-in-supabase-here.com'
// ],
//   labels: { age: 'young', accent: 'british' },
//   description: `A young Filipino in his 20s that's well taught and can speak English`,
//   name: 'Robert Espina',
//   spaceBotId: botId,
// };

// const reqHeaders = getSupabaseAuthHeaders();
// await APIClient.post<CloneVoiceResponse>(
//   '/api/clone-voice',
//   cloneVoiceProps,
//   {
//     headers: reqHeaders,
//   },
// );

/**
 * Accepts audio/mpeg/mp3 file only stored in supabase storage
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  const headers = request.headers;
  const authorization = headers.get('Authorization');
  const refreshToken = headers.get('X-RefreshToken') as string;
  const accessToken = last(toString(authorization).split('BEARER ')) as string;
  const {
    fileUrls,
    name,
    description,
    spaceBotId,
    voiceId,
    labels,
  }: CloneVoiceBodyRequest = await request.json();
  const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
  const validAuth = authRes && !authRes?.error && accessToken && refreshToken;
  const isEditing = voiceId && isString(voiceId) && !isEmpty(voiceId);
  const sanitizedFileUrls = filter(
    fileUrls || [],
    url => isString(url) && !isEmpty(url),
  );

  const streams: fs.ReadStream[] = [];
  const validUrls = [];

  if (!validAuth) {
    return returnApiUnauthorizedError();
  }

  if (!spaceBotId) {
    throw new Error('Missing spaceBotId');
  }

  if (!sanitizedFileUrls || isEmpty(sanitizedFileUrls)) {
    return returnCommonStatusError('Invalid file');
  }

  if (!name) {
    return returnCommonStatusError('Name is required.');
  }

  if (!description) {
    return returnCommonStatusError('Description is required.');
  }

  if (isDevelopment) {
    console.log('isEditing', isEditing, voiceId);
  }

  try {
    const elevenlabsUrl = isEditing
      ? getElevenLabsEditVoiceApiBaseUrl(voiceId)
      : getElevenLabsAddVoicesApiBaseUrl();
    const elevenLabsApiKey = getElevenLabsApiKey();
    const formData = new FormData();

    for (let i = 0; i < size(sanitizedFileUrls); i++) {
      try {
        const fileUrl = sanitizedFileUrls[i];
        const mp3Response = await axios.get(fileUrl, {
          responseType: 'stream',
        });

        streams.push(mp3Response.data);

        formData.append('files', mp3Response.data, {
          contentType: 'audio/mpeg',
        });

        validUrls.push(fileUrl);
      } catch (err) {}
    }

    const handleStreamEnd = (stream: fs.ReadStream): Promise<void> => {
      return new Promise(resolve => {
        if (!stream || stream?.closed) {
          resolve();
          return;
        }

        stream.once('end', () => {
          resolve();
        });
        stream.once('close', () => {
          resolve();
        });
      });
    };

    const handleStreamsToEnd = async () => {
      for (let i = 0; i < size(streams); i++) {
        const stream = streams[i];
        await handleStreamEnd(stream);
      }
    };

    const destroyStreams = () => {
      for (let i = 0; i < size(streams); i++) {
        const stream = streams[i];

        if (stream) {
          stream.destroy();
        }
      }
    };

    formData.append('name', trim(toString(name)));
    formData.append('description', trim(description));

    if (!isEmpty(labels) && isObject(labels)) {
      formData.append('labels', JSON.stringify(labels));
    }

    const addOrEditVoice = (): Promise<string | null | void> => {
      return new Promise((resolve, reject) => {
        axios
          .post(elevenlabsUrl, formData, {
            headers: {
              ...formData.getHeaders(),
              Accept: 'application/json',
              'xi-api-key': elevenLabsApiKey,
              'Access-Control-Allow-Origin': '*',
            },
            validateStatus: function (status) {
              return status >= 200 && status <= 500;
            },
          })
          .then(async elevenLabsResponse => {
            const elevenLabsResponseData: any = elevenLabsResponse?.data;
            const newVoiceId = toString(elevenLabsResponseData?.voice_id);
            const errMessage =
              // @ts-ignore
              elevenLabsResponseData?.detail?.message ||
              elevenLabsResponseData?.msg ||
              elevenLabsResponseData?.message;

            if (errMessage) {
              reject(new Error(errMessage));
              destroyStreams();
            } else {
              await handleStreamsToEnd();
              destroyStreams();
              resolve(isEditing ? voiceId : newVoiceId);
            }
          })
          .catch(reject);
      });
    };

    const latestVoiceId = await addOrEditVoice();

    if (latestVoiceId) {
      const { error: updateError } = await updateSpaceBotProfilePropertiesById(
        spaceBotId,
        { voiceId: latestVoiceId },
      );

      if (updateError) {
        throw new Error(updateError?.message);
      }

      return NextResponse.json(
        {
          isEditing,
          validUrls,
          voiceId: latestVoiceId,
        },
        {
          status: 200,
        },
      );
    } else {
      throw new Error('Empty voice id');
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/clone-voice err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
