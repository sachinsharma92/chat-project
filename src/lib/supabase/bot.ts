import { isEmpty, map, pick, trim } from 'lodash';
import { supabaseClient } from '.';
import { v4 as uuid } from 'uuid';
import { IBotFormAnswers } from '@/types';
import { IBotChatMessage, SupabaseResult } from '@/types/supabase';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

export const userBotFormAnswersTable = 'user_bot_form_answers';
export const botChatMessagesTable = 'bot_chat_messages';

/**
 * Update item form 'user_bot_form_answers' for clone AI settings
 * @param props
 * @param id
 * @returns
 */
export const updateOrCreateAICloneFormProperties = async (
  props: Partial<IBotFormAnswers>,
  id?: string,
): Promise<{ id: string }> => {
  const updatedProps = snakecaseKeys(
    pick(props, [
      'name',
      'description',
      'greeting',
      'backstory',
      'meta',
      'spaceId',
      'owner',
      'instructions',
      'updatedAt',
      'knowledge',
    ]),
  );

  if (id) {
    await supabaseClient
      .from(userBotFormAnswersTable)
      .update({ ...updatedProps })
      .eq('id', trim(id));

    return {
      id,
    };
  } else {
    const newId = uuid();

    await supabaseClient
      .from(userBotFormAnswersTable)
      .insert({ ...updatedProps, id: newId });

    return {
      id: newId,
    };
  }
};

/**
 * Get all bot form accomplished answers by space id
 * @param spaceId
 * @returns
 */
export const getAICloneCompletedForms = async (
  spaceId: string,
): Promise<SupabaseResult<IBotFormAnswers[]>> => {
  const response = await supabaseClient
    .from<'user_bot_form_answers', IBotFormAnswers>(userBotFormAnswersTable)
    .select('*')
    .eq('space_id', trim(spaceId))
    .limit(10);

  if (response?.error) {
    return {
      error: response.error,
    };
  }

  return {
    data: response.data as IBotFormAnswers[],
  };
};

/**
 * Get form answer by id
 * @param formId
 * @param spaceId
 * @returns
 */
export const getBotFormAnswerById = async (
  formId: string,
  spaceId: string,
): Promise<SupabaseResult<IBotFormAnswers[]>> => {
  const response = await supabaseClient
    .from(userBotFormAnswersTable)
    .select('*')
    .eq('id', formId)
    .eq('space_id', spaceId);

  if (response?.error) {
    return {
      error: response.error,
    };
  }

  return {
    data: map(response.data, d => camelcaseKeys(d)) as IBotFormAnswers[],
  };
};

/**
 * Fetch user and bot chat history by page
 * @param page
 * @param afterTimestamp
 * @param limit
 */
export const getBotChatMessagesByPage = async (
  page: number,
  spaceId: string,
  userId: string,
  afterTimestamp?: string,
  limit?: number,
): Promise<SupabaseResult<IBotChatMessage[]>> => {
  if (!limit || limit < 0) {
    limit = 100;
  }

  const startIndex = (page - 1) * limit;

  let query = supabaseClient
    .from('bot_chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .range(startIndex, startIndex + limit - 1)
    .eq('space_id', trim(spaceId))
    .eq('session_id', trim(userId));

  console.log('afterTimestamp', afterTimestamp);

  if (afterTimestamp && !isEmpty(afterTimestamp)) {
    query = query.gte('created_at', afterTimestamp);
  }

  const response = await query;

  if (response?.error) {
    return { error: response.error };
  }

  return {
    data: map(response.data || [], d => camelcaseKeys(d)) as IBotChatMessage[],
  };
};
