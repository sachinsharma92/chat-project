import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export * from './user';
export * from './bot';
export * from './spaces';

/**
 * RSC apply supabase auth
 * @param accessToken
 * @param refreshToken
 * @returns
 */
export const applyApiRoutesAuth = async (
  accessToken: string,
  refreshToken: string,
) => {
  try {
    return await supabaseClient.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (err) {
    // @todo send sentry
    return null;
  }
};
