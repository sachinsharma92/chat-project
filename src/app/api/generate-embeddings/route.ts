import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import { getSpaceBotById } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';
import { head, isEmpty, isUndefined, omit, last, size, toString } from 'lodash';
import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import { applyApiRoutesAuth } from '../botchat/route';
import {
  getUserContextById,
  insertNewUserCloneContext,
  insertNewUserCloneContextWithEmbeddings,
  updateUserCloneContext,
} from '@/lib/supabase/embeddings';
import { IUserContextType } from '@/types';

export type GenerateEmbeddingsBodyRequest = {
  context: string;
  userId: string;
  useContextId?: string;
  botId?: string;
  type?: IUserContextType;
};
export const openAIEmbeddingModel = 'text-embedding-ada-002';

/**
 * Generate new / update existing context embedding vector values
 * @param request
 * @returns
 */
export async function POST(request: Request) {
  try {
    const headers = request.headers;
    const authorization = headers.get('Authorization');
    const refreshToken = headers.get('X-RefreshToken') as string;
    const accessToken = last(
      toString(authorization).split('BEARER '),
    ) as string;
    // @todo eval model

    const {
      context,
      botId,
      userId,
      useContextId,
      type,
    }: GenerateEmbeddingsBodyRequest = await request.json();
    const authRes = await applyApiRoutesAuth(accessToken, refreshToken);

    if (!context || size(context) < 3) {
      return returnCommonStatusError('Context should not be empty');
    }

    if (!authRes || authRes?.error || !userId) {
      return returnApiUnauthorizedError();
    }

    const spaceBotRes = await getSpaceBotById(botId as string);

    if (spaceBotRes?.error) {
      // verify bot id
      return returnCommonStatusError('Invalid space bot');
    }

    if (useContextId && !isEmpty(useContextId)) {
      const userContextRes = await getUserContextById(useContextId);

      if (userContextRes?.error) {
        return returnCommonStatusError('Existing record does not exist');
      }
    }

    const openai = getOpenAI();
    const response = await openai.embeddings.create({
      model: openAIEmbeddingModel,
      input: toString(context),
    });

    if (response?.data) {
      const embeddingsArray = response?.data;
      const embedding = head(embeddingsArray)?.embedding;

      if (!isUndefined(embedding)) {
        // update
        if (useContextId) {
          const updateRes = await updateUserCloneContext(useContextId, {
            context,
            embedding,
            updatedAt: new Date().toISOString(),
          });

          if (updateRes?.error) {
            return returnCommonStatusError(updateRes?.error?.message);
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
          // create new record
          const ctxProps = {
            type,
            context,
            botId,
            owner: userId,
          };
          const contextPayload = await insertNewUserCloneContext({
            ...ctxProps,
          });

          // @ts-ignore
          if (contextPayload?.id && !contextPayload?.error) {
            await insertNewUserCloneContextWithEmbeddings({
              embedding,
              // @ts-ignore
              id: contextPayload.id,
              ...omit(ctxProps, ['type']),
            });

            return NextResponse.json(
              {
                success: true,
                payload: contextPayload,
              },
              {
                status: 200,
              },
            );
          } else {
            // @ts-ignore
            return returnCommonStatusError(contextPayload.error);
          }
        }
      } else {
        return returnCommonStatusError('embedding undefined');
      }
    } else {
      return returnCommonStatusError('Failed openai.embeddings.create');
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/generate-embeddings err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
