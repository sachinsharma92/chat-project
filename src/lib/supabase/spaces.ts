import { omit, pick, trim } from 'lodash';
import { supabaseClient } from '.';
import snakecaseKeys from 'snakecase-keys';
import { ISpace } from '@/types';

export const getSpaceProfile = async (spaceId: string) => {
  return await supabaseClient
    .from('spaces_profiles')
    .select('*')
    .eq('id', trim(spaceId));
};

export const updateSpaceProfileProperties = async (
  spaceId: string,
  props: Partial<ISpace>,
) => {
  const sanitizedProps = snakecaseKeys(omit(props, ['id']));

  return await supabaseClient
    .from('spaces_profiles')
    .update({ ...sanitizedProps })
    .eq('id', trim(spaceId));
};

export const getSpaceBots = async (spaceId: string) => {
  return await supabaseClient
    .from('spaces_bots')
    .select('*')
    .eq('space_id', trim(spaceId));
};

export const updateSpaceBotProfileProperties = async (
  formId: string,
  props: { greeting: string },
) => {
  return await supabaseClient
    .from('spaces_bots')
    .update({ ...props })
    .eq('form_id', trim(formId));
};

export const createSpaceBotProfile = async (params: {
  id: string;
  spaceId: string;
  owner: string;
  formId: string;
}) => {
  const props = snakecaseKeys(
    pick(params, ['spaceId', 'id', 'owner', 'formId']),
  );

  return await supabaseClient.from('spaces_bots').insert({ ...props });
};
