import { map, omit, pick, trim } from 'lodash';
import { supabaseClient } from '.';
import { IBot, ISpace } from '@/types';
import { SupabaseResult } from '@/types/supbase';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

const spacesProfilesTable = 'spaces_profiles';
const spacesBotsTable = 'spaces_bots';

/**
 * Get space profile by id
 * @param spaceId
 * @returns
 */
export const getSpaceProfile = async (
  spaceId: string,
): Promise<SupabaseResult<ISpace[]>> => {
  const response = await supabaseClient
    .from(spacesProfilesTable)
    .select('*')
    .eq('id', trim(spaceId));

  if (response?.error) {
    return {
      error: response.error,
    };
  }

  return {
    data: map(response.data, d => camelcaseKeys(d)) as ISpace[],
  };
};

/**
 * Update space profile properties
 * @param spaceId
 * @param props
 * @returns
 */
export const updateSpaceProfileProperties = async (
  spaceId: string,
  props: Partial<ISpace>,
) => {
  const sanitizedProps = snakecaseKeys(omit(props, ['id']));

  return await supabaseClient
    .from(spacesProfilesTable)
    .update({ ...sanitizedProps })
    .eq('id', trim(spaceId));
};

/**
 * Get all space bots by space id
 * @param spaceId
 * @returns
 */
export const getSpaceBots = async (
  spaceId: string,
): Promise<SupabaseResult<IBot[]>> => {
  const response = await supabaseClient
    .from<'spaces_bots', IBot>(spacesBotsTable)
    .select('*')
    .eq('space_id', trim(spaceId));

  if (response?.error) {
    return { error: response.error };
  }

  return {
    data: response?.data as IBot[],
  };
};

/**
 * Get space bot by id
 * @param id
 */
export const getSpaceBotById = async (
  id: string,
): Promise<SupabaseResult<IBot[]>> => {
  const response = await supabaseClient
    .from<'spaces_bots', IBot>(spacesBotsTable)
    .select('*')
    .eq('id', trim(id));

  if (response?.error) {
    return { error: response.error };
  }

  return {
    data: response?.data as IBot[],
  };
};

/**
 * Update space bot profile properties
 * @param formId
 * @param props
 * @returns
 */
export const updateSpaceBotProfileProperties = async (
  formId: string,
  props: { greeting: string; description: string },
) => {
  return await supabaseClient
    .from(spacesBotsTable)
    .update({ ...snakecaseKeys(pick(props, ['description', 'greeting'])) })
    .eq('form_id', trim(formId));
};

/**
 * Create space bot profile
 * @param params
 * @returns
 */
export const createSpaceBotProfile = async (params: {
  id: string;
  spaceId: string;
  owner: string;
  formId: string;
}) => {
  const props = snakecaseKeys(
    pick(params, ['spaceId', 'id', 'owner', 'formId']),
  );

  return await supabaseClient.from(spacesBotsTable).insert({ ...props });
};
