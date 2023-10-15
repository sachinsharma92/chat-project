import { Session } from '@supabase/gotrue-js';
import { split, toString } from 'lodash';

export const getNameFromEmail = (email: string = '') => {
  const [name] = split(toString(email), '@');

  return name;
};

export const getUserIdFromSession = (session?: Session | undefined | null) => {
  return toString(session?.user?.id);
};
