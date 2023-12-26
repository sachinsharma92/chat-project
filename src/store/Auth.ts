'use client';

import { IAppAuthState } from '@/types/auth';
import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

export const useBotnetAuth = create<IAppAuthState>(set => ({
  displayName: '',
  email: '',
  handle: '',
  image: '',
  session: null,
  isLoading: true,
  sessionChecked: false,
  username: '',
  bio: '',
  setUsername(username) {
    return set(() => ({ username }));
  },
  setBio(bio) {
    return set(() => ({ bio }));
  },
  setIsLoading: (isLoading: boolean) => set(() => ({ isLoading })),
  setImage: (image: string) => set(() => ({ image })),
  setSessionChecked: (sessionChecked: boolean) =>
    set(() => ({ sessionChecked })),
  setHandle: (handle: string) => set(() => ({ handle })),
  setSession: (session: Session | null) => set(() => ({ session })),
  setEmail: (email: string) => set(() => ({ email })),
  setDisplayName: (displayName: string) => set(() => ({ displayName })),
}));
