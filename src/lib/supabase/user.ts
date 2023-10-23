import { SupabaseResult } from '@/types/supbase';
import { supabaseClient } from '.';
import { IUser } from '@/types/auth';
import { map, omit } from 'lodash';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

const userProfilesTable = 'user_profiles';

/**
 * Fetch user profile by id
 * @param userId
 * @returns
 */
export const getUserProfileById = async (
  userId: string,
): Promise<SupabaseResult<IUser[]>> => {
  const response = await supabaseClient
    .from<'user_profiles', IUser>(userProfilesTable)
    .select('*')
    .eq('user_id', userId);

  if (response.error) {
    return { error: response.error };
  }

  return {
    data: map(response.data, d => camelcaseKeys(d)) as IUser[],
  };
};

/**
 * Update user profile properties
 * @param userId
 * @param props
 * @returns
 */
export const updateUserProfileProps = async (
  userId: string,
  props: Partial<IUser>,
) => {
  const response = await supabaseClient
    .from('user_profiles')
    .update(snakecaseKeys(omit(props, ['id', 'createdAt', 'deletedAt'])))
    .eq('user_id', userId);

  return response;
};

export const updateUserImageUrl = async (userId: string, image: string) => {
  if (!image || !userId) {
    return;
  }

  return await supabaseClient
    .from('user_profiles')
    .update({ image })
    .eq('user_id', userId);
};
