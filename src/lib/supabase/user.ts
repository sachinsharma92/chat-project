'use client';

import { supabaseClient } from '.';

export const getUserProfileById = async (userId: string) => {
  if (!userId) {
    return null;
  }

  return await supabaseClient
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId);
};

export const updateDisplayName = async (
  userId: string,
  displayName: string,
) => {
  if (!displayName || !userId) {
    return;
  }

  return await supabaseClient
    .from('user_profiles')
    .update({
      display_name: displayName,
    })
    .eq('user_id', userId);
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
