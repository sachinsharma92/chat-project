import { IUserContext, IUserContextEmbedding, IUserContextType } from '@/types';
import { supabaseClient } from '.';
import { v4 as uuid } from 'uuid';
import snakecaseKeys from 'snakecase-keys';
import { map, omit, trim } from 'lodash';
import { SupabaseResult } from '@/types/supabase';
import camelcaseKeys from 'camelcase-keys';

const userContextsTable = 'user_contexts';

const userOpenAIContextEmbeddingsTable = 'user_openai_context_embeddings';

/**
 * Insert new user context
 * @param props
 * @returns
 */
export const insertNewUserCloneContext = async (
  props: Partial<IUserContext>,
): Promise<SupabaseResult<IUserContext[]>> => {
  const sanitizedProps = snakecaseKeys(props);
  const newContext = snakecaseKeys({
    id: uuid(),
    createdAt: new Date().toISOString(),
    ...sanitizedProps,
  });

  const response = await supabaseClient
    .from<'user_contexts', IUserContext>(userContextsTable)
    // @ts-ignore
    .insert(newContext);

  if (response?.error) {
    return { error: response.error };
  }

  return {
    data: map([newContext], d => camelcaseKeys(d)) as IUserContext[],
  };
};

/**
 * Insert new user context + embeddings
 * @param props
 * @returns
 */
export const insertNewUserCloneContextWithEmbeddings = async (
  props: Partial<IUserContextEmbedding>,
) => {
  const sanitizedProps = snakecaseKeys(props);
  const newContext = snakecaseKeys({
    id: uuid(),
    createdAt: new Date().toISOString(),
    ...sanitizedProps,
  });
  const response = await supabaseClient
    .from(userOpenAIContextEmbeddingsTable)
    .insert(newContext);

  if (response?.error) {
    return { error: response.error };
  }

  return newContext as IUserContextEmbedding;
};

/**
 * Update user clone context
 * @param id
 * @param props
 */
export const updateUserCloneContextEmbeddings = async (
  id: string,
  props: Partial<IUserContextEmbedding>,
) => {
  const sanitizedProps = snakecaseKeys(props);
  const response = await supabaseClient
    // update contexts table
    .from(userContextsTable)
    .update(omit(sanitizedProps, ['id', 'embedding']))
    .eq('id', id);

  if (!response?.error) {
    return await supabaseClient
      // update open AI embeddings
      .from(userOpenAIContextEmbeddingsTable)
      .update(omit(sanitizedProps, ['id']))
      .eq('id', id);
  }

  return response;
};

/**
 * Delete user context record by id
 * @returns
 */
export const deleteUserContextEmbedding = async (id: string) => {
  return await supabaseClient
    .from(userOpenAIContextEmbeddingsTable)
    .delete()
    .eq('id', trim(id));
};

/**
 * Delete user readable context
 * @param id
 * @returns
 */
export const deleteUserContext = async (id: string) => {
  return await supabaseClient
    .from(userContextsTable)
    .delete()
    .eq('id', trim(id));
};

/**
 * Fetch user clone context by id
 * @param id
 * @returns
 */
export const getUserContextById = async (
  id: string,
): Promise<SupabaseResult<IUserContext[]>> => {
  const response = await supabaseClient
    .from<'user_contexts', IUserContext>(userContextsTable)
    .select('*')
    .eq('id', trim(id));

  if (response?.error) {
    return {
      error: response.error,
    };
  }

  return {
    data: response?.data as IUserContext[],
  };
};

export const userContextItemsLimit = 5;

/**
 * Get context list by page
 * @param page
 * @returns
 */
export const getUserContextListByPage = async (
  page = 1,
  botId: string,
  type: IUserContextType,
): Promise<SupabaseResult<IUserContext[]>> => {
  const start = (page - 1) * userContextItemsLimit;
  const end = start + (userContextItemsLimit - 1);
  const response = await supabaseClient
    .from<'user_contexts', IUserContext>(userContextsTable)
    .select('*')
    .range(start, end)
    .eq('bot_id', botId)
    .eq('type', type);

  if (response?.error) {
    return {
      error: response.error,
    };
  }

  return {
    data: response?.data as IUserContext[],
  };
};
