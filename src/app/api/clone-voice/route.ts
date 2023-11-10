import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import FormData from 'form-data';
import fetch from 'node-fetch';
import { last, toString } from 'lodash';
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
import axios from 'axios';

export interface CloneVoiceBodyRequest {
  fileUrl: string;
  spaceBotId: string;
}

export interface CloneVoiceResponse {
  voiceId: string;
  message?: string;
}

export async function POST(request: Request) {
  const headers = request.headers;
  const authorization = headers.get('Authorization');
  const refreshToken = headers.get('X-RefreshToken') as string;
  const accessToken = last(toString(authorization).split('BEARER ')) as string;
  const { fileUrl, spaceBotId }: CloneVoiceBodyRequest = await request.json();
  const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
  const validAuth = authRes && !authRes?.error && accessToken && refreshToken;

  if (!validAuth) {
    return returnApiUnauthorizedError();
  }

  if (!spaceBotId) {
    throw new Error('Missing spaceBotId');
  }

  if (!fileUrl || !fileUrl?.endsWith('.mp3')) {
    return returnCommonStatusError('Invalid file');
  }

  try {
    const mp3Response = await fetch(fileUrl);

    if (!mp3Response?.ok) {
      throw new Error('File not found');
    }

    const formData = new FormData();
    const elevenlabsUrl = getElevenLabsAddVoicesApiBaseUrl();
    const fileName = `${spaceBotId}-voice.mp3`;
    const elevenLabsApiKey = getElevenLabsApiKey();

    formData.append(`${spaceBotId}'s voice`, mp3Response.body, fileName);

    console.log('fetch(elevenlabsUrl)', formData);

    const elevenLabsResponse = await axios.post(elevenlabsUrl, formData, {
      headers: {
        'content-type': 'multipart/form-data',
        ...formData.getHeaders(),
        Accept: 'application/json',
        'xi-api-key': elevenLabsApiKey,
      },
      validateStatus: function (status) {
        return status >= 200 && status <= 500;
      },
    });
    const elevenLabsResponseData = elevenLabsResponse?.data;
    const voiceId = elevenLabsResponseData?.voiceId;

    console.log('elevenLabsResponse', elevenLabsResponse);

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
            elevenLabsResponseData?.detail?.message ||
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
