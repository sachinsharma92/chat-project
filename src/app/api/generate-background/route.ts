import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import { getOpenAI } from '@/lib/openai';
import { last, toString } from 'lodash';
import axios from 'axios';
import { applyApiRoutesAuth } from '@/lib/supabase';

export interface GenerateBackgroundPostResponse {
  url: string;
  b64: string;
}

export interface GenerateBackgroundBodyRequest {
  prompt: string;
}

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const headers = request.headers;
    const authorization = headers.get('Authorization');
    const refreshToken = headers.get('X-RefreshToken') as string;
    const accessToken = last(
      toString(authorization).split('BEARER '),
    ) as string;
    const { prompt }: GenerateBackgroundBodyRequest = await request.json();
    const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
    const validAuth = authRes && !authRes?.error && accessToken && refreshToken; // @todo send sentry error if validAuth === false

    if (!validAuth) {
      return returnApiUnauthorizedError();
    }

    const openai = getOpenAI();
    const response = await openai.images.generate({
      prompt: `Create background image:\n${prompt}`,
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024',
    });
    const url = response.data[0].url;

    if (!url) {
      throw new Error('Unable to generate image');
    }

    const getImageRes = await axios.get(url, {
      responseType: 'arraybuffer',
    });
    const imageBuffer = Buffer.from(getImageRes.data);

    return NextResponse.json(
      {
        url,
        b64: imageBuffer.toString('base64'),
      } as GenerateBackgroundPostResponse,
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/generate-background err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
