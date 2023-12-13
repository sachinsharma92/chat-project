import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import FormData from 'form-data';
import axios from 'axios';
import { isEmpty, last, toString, trim } from 'lodash';
import { applyApiRoutesAuth } from '../bot-chat/route';
import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import {
  getElevenLabsAddVoicesApiBaseUrl,
  getElevenLabsApiKey,
} from '@/lib/elevenlabs';
import { updateSpaceBotProfilePropertiesById } from '@/lib/supabase';
import { CloneVoiceBodyRequest } from '@/types';

// export const config = {
//   api: {
//     bodyparser: false, // disallow body parsing, consume as stream
//   },
//   runtime: 'nodejs',
// };

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const headers = request.headers;
  const authorization = headers.get('Authorization');
  const refreshToken = headers.get('X-RefreshToken') as string;
  const accessToken = last(toString(authorization).split('BEARER ')) as string;
  const { fileUrl, name, description, spaceBotId }: CloneVoiceBodyRequest =
    await request.json();
  const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
  const validAuth = authRes && !authRes?.error && accessToken && refreshToken;

  if (!validAuth) {
    return returnApiUnauthorizedError();
  }

  if (!spaceBotId) {
    throw new Error('Missing spaceBotId');
  }

  if (!fileUrl || !fileUrl?.includes('.mp3')) {
    return returnCommonStatusError('Invalid file');
  }

  try {
    const elevenlabsUrl = getElevenLabsAddVoicesApiBaseUrl();
    const fileName = `${spaceBotId}-voice.mp3`;
    const elevenLabsApiKey = getElevenLabsApiKey();
    const mp3Response = await axios.get(fileUrl, {
      responseType: 'stream',
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
    });
    const chunks = [];

    for await (const chunk of mp3Response.data) {
      chunks.push(chunk);
    }

    const formData = new FormData();
    const labels = {};

    if (!isEmpty(trim(description))) {
      formData.append('description', description);
    }

    formData.append('files', mp3Response.data, fileName);
    formData.append('labels', JSON.stringify(labels));
    formData.append('name', trim(name));

    const elevenLabsResponse = await axios.post(elevenlabsUrl, formData, {
      headers: {
        'xi-api-key': elevenLabsApiKey,
        'Access-Control-Allow-Origin': '*',
      },
      validateStatus: function (status) {
        return status >= 200 && status <= 500;
      },
    });
    const elevenLabsResponseData: any = elevenLabsResponse?.data;
    const voiceId = elevenLabsResponseData?.voiceId || '';

    if (voiceId) {
      const { error: updateError } = await updateSpaceBotProfilePropertiesById(
        spaceBotId,
        { voiceId },
      );

      if (updateError) {
        throw new Error(updateError?.message);
      }

      return NextResponse.json(
        {
          voiceId,
        },
        {
          status: 200,
        },
      );
    } else {
      return NextResponse.json(
        {
          message:
            // @ts-ignore
            elevenLabsResponse?.detail?.message ||
            elevenLabsResponseData?.msg ||
            elevenLabsResponseData?.message ||
            elevenLabsResponse?.statusText,
        },

        {
          status: elevenLabsResponse?.status,
        },
      );
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/clone-voice err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
