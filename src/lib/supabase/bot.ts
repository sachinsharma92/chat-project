import { pick, trim } from 'lodash';
import { supabaseClient } from '.';
import { v4 as uuid } from 'uuid';
import { IBotFormAnswers } from '@/types';
import snakecaseKeys from 'snakecase-keys';

export const updateOrCreateAICloneFormProperties = async (
  props: Partial<IBotFormAnswers>,
  id?: string,
) => {
  const updatedProps = snakecaseKeys(
    pick(props, [
      'name',
      'description',
      'greeting',
      'backstory',
      'meta',
      'spaceId',
      'owner',
      'updatedAt',
    ]),
  );

  if (id) {
    await supabaseClient
      .from('user_bot_form_answers')
      .update({ ...updatedProps })
      .eq('id', trim(id));

    return {
      id,
    };
  } else {
    const newId = uuid();

    await supabaseClient
      .from('user_bot_form_answers')
      .insert({ ...updatedProps, id: newId });

    return {
      id: newId,
    };
  }
};

export const getAICloneCompletedForms = async (spaceId: string) => {
  return await supabaseClient
    .from('user_bot_form_answers')
    .select('*')
    .eq('space_id', spaceId)
    .limit(10);
};
