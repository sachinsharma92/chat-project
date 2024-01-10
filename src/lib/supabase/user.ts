import {
  ICloneAudioProps,
  IUserPrivateProps,
  SupabaseResult,
} from '@/types/supabase';
import { supabaseClient } from '.';
import { IUser } from '@/types/auth';
import { map, omit, trim } from 'lodash';
import snakecaseKeys from 'snakecase-keys';
import camelcaseKeys from 'camelcase-keys';

const userProfilesTable = 'user_profiles';
const userWaitlistTable = 'user_waitlist';
const userPrivateTable = 'user_private';

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
 * Fetch user profile by username
 * @param userId
 * @returns
 */
export const getUserProfileByUsername = async (
  username: string,
): Promise<SupabaseResult<IUser[]>> => {
  const response = await supabaseClient
    .from<'user_profiles', IUser>(userProfilesTable)
    .select('*')
    .eq('username', trim(username));

  if (response.error) {
    return { error: response.error };
  }

  return {
    data: map(response.data, d => camelcaseKeys(d)) as IUser[],
  };
};

/**
 * Fetch user private data by user id
 * @param userId
 */
export const getUserPrivateDataById = async (
  userId: string,
): Promise<SupabaseResult<IUserPrivateProps[]>> => {
  const response = await supabaseClient
    .from<'user_private', IUserPrivateProps>(userPrivateTable)
    .select('*')
    .eq('owner', userId);

  if (response.error) {
    return { error: response.error };
  }

  return {
    data: map(response.data, d => {
      const props = camelcaseKeys(d) as IUserPrivateProps;

      return {
        ...props,
        appearance: camelcaseKeys(props?.appearance || {}),
        cloneAudio: camelcaseKeys(
          (props?.cloneAudio || {}) as Record<string, any>,
        ) as ICloneAudioProps,
      };
    }) as IUserPrivateProps[],
  };
};

/**
 * Update user private property
 * @param props
 */
export const updateUserPrivateDataProps = async (
  userId: string,
  props: Partial<IUserPrivateProps>,
) => {
  return await supabaseClient
    .from(userPrivateTable)
    .update(snakecaseKeys(omit(props, ['id'])))
    .eq('owner', userId);
};

/**
 * Insert new user private property
 * @param props
 */
export const insertUserPrivateDataProps = async (
  props: Partial<IUserPrivateProps>,
) => {
  return await supabaseClient.from(userPrivateTable).insert({
    ...snakecaseKeys(props),
    created_at: new Date().toISOString(),
  });
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

/**
 * Email waitlist on signup
 * @param email
 * @returns
 */
export const postEmailWaitlist = async (email: string) => {
  const response = await supabaseClient
    .from(userWaitlistTable)
    .insert({ email: trim(email) });

  return response;
};
