import dotenv from 'dotenv';

dotenv.config({ path: `.env.local` });

import { getSpaceBotById } from '@/lib/supabase';
import { NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';
import {
  head,
  isEmpty,
  isUndefined,
  omit,
  last,
  size,
  toString,
  includes,
  split,
  trim,
} from 'lodash';
import {
  returnApiUnauthorizedError,
  returnCommonStatusError,
} from '@/lib/utils/routes';
import { applyApiRoutesAuth } from '../bot-chat/route';
import {
  getUserContextById,
  insertNewUserCloneContext,
  insertNewUserCloneContextWithEmbeddings,
  updateUserCloneContextEmbeddings,
} from '@/lib/supabase/embeddings';
import { Readable } from 'stream';
import { IUserContext, IUserContextType } from '@/types';
import { isDevelopment } from '@/lib/environment';
import axios from 'axios';
// @ts-ignore
import pdf from 'pdf-extraction';

export interface GenerateEmbeddingsBodyRequest {
  context?: string;
  userId: string;
  useContextId?: string;
  botId?: string;
  type?: IUserContextType;
  fileUrl?: string;
}

export interface GenerateEmbeddingsResponse {
  success?: boolean;
  payload?: IUserContext;
  contextEmbeddingsIds?: string[];
}

export const openAIEmbeddingModel = 'text-embedding-ada-002';

async function processPDF(stream: Readable) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const res = await pdf(Buffer.concat(chunks));

  return res?.text;
}

async function processText(stream: Readable) {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(chunk);
  }

  const text = Buffer.concat(chunks).toString('utf-8');
  return text;
}

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
      fileUrl,
    }: GenerateEmbeddingsBodyRequest = await request.json();
    const authRes = await applyApiRoutesAuth(accessToken, refreshToken);
    const isFile = fileUrl && !isEmpty(fileUrl);

    if ((!context || size(context) < 3) && !fileUrl) {
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

    if (isFile) {
      const isPdf = includes(fileUrl, '.pdf');
      const isText = includes(fileUrl, '.txt');
      const response = await axios.get(fileUrl, {
        responseType: 'stream',
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
      });

      if (isPdf) {
        const content = await processPDF(response.data);
        const pages = split(content, '\n\n');
        const contextEmbeddingsIds: string[] = [];

        for (const textPage of pages) {
          const sanitized = trim(textPage);

          try {
            if (sanitized) {
              const response = await openai.embeddings.create({
                model: openAIEmbeddingModel,
                input: toString(sanitized),
              });

              if (response?.data) {
                const embeddingsArray = response?.data;
                const embedding = head(embeddingsArray)?.embedding;
                const ctxProps = {
                  type,
                  botId,
                  context: sanitized,
                  owner: userId,
                };
                const contextRes = await insertNewUserCloneContext({
                  ...ctxProps,
                });
                const contextPayload = head(contextRes?.data);

                if (contextPayload?.id && !contextRes?.error) {
                  contextEmbeddingsIds.push(contextPayload.id);
                  await insertNewUserCloneContextWithEmbeddings({
                    embedding,
                    id: contextPayload.id,
                    ...omit(ctxProps, ['type']),
                  });
                }
              }
            }
          } catch (err: any) {
            console.log('const textPage of pages err:', err?.message);
          }
        }

        return NextResponse.json(
          { contextEmbeddingsIds, success: true },
          {
            status: 200,
          },
        );
      } else if (isText) {
        const content = await processText(response.data);

        if (isDevelopment) {
          console.log('isText content', content);
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
        throw new Error('Invalid file type');
      }
    } else {
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
            const updateRes = await updateUserCloneContextEmbeddings(
              useContextId,
              {
                embedding,
                updatedAt: new Date().toISOString(),
              },
            );

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
            const contextRes = await insertNewUserCloneContext({
              ...ctxProps,
            });
            const contextPayload = head(contextRes?.data);

            if (contextPayload?.id && !contextRes?.error) {
              await insertNewUserCloneContextWithEmbeddings({
                embedding,
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
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log('/api/generate-embeddings err:', error?.message);
    }

    return returnCommonStatusError(error?.message || '');
  }
}
