import axios from 'axios';
import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { getOpenAIConfiguration } from '@/lib/openai';
import { head, last, toString } from 'lodash';
import { isResponseStatusSuccess } from '@/lib/utils';
import { returnCommonStatusError } from '@/lib/utils/routes';
import { applyApiRoutesAuth } from '../botchat/route';

dotenv.config({ path: `.env.local` });

export type GenerateEmbeddingsBodyRequest = {
  message: string;
  model: string;
  userId: string;
};

export async function POST(request: Request) {
  try {
    const headers = request.headers;
    const authorization = headers.get('Authorization');
    const refreshToken = headers.get('X-RefreshToken') as string;
    const accessToken = last(
      toString(authorization).split('BEARER '),
    ) as string;
    // @todo eval model
    const { message = '', model = 'gpt' }: GenerateEmbeddingsBodyRequest =
      await request.json();
    const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
    const openAIConfig = getOpenAIConfiguration();
    const response = await axios({
      method: 'POST',
      url: '/v1/embeddings',
      baseURL: 'https://api.openai.com',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `BEARER ${openAIConfig?.apiKey}`,
      },
      data: {
        model: 'text-embedding-ada-002',
        input: toString(message),
      },
    });

    if (!model) {
      return returnCommonStatusError();
    }

    if (isResponseStatusSuccess(response) && response?.data) {
      const embeddingsArray = response.data?.data;
      const embeddings = head(embeddingsArray);

      if (authRes && !authRes?.error) {
        // save embeddings
        console.log('embeddings', embeddings);
      }

      return NextResponse.json(
        {
          success: true,
        },
        {
          status: 200,
        },
      );
    } else {
      return returnCommonStatusError(response.data.message || '');
    }
  } catch (err: any) {
    return returnCommonStatusError(err?.message || '');
  }
}
