import { Session } from '@supabase/supabase-js';

export interface IUser {
  id: string;
  displayName: string;
  image: string;
  email?: string;
  handle?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  spaceId?: string;
  bio?: string;
  username?: string;
}

export interface IAppAuthState {
  session: Session | null;
  displayName: string;
  email: string;
  handle: string;
  image: string;
  username: string;
  sessionChecked: boolean;
  isLoading: boolean;
  bio: string;
  setBio: (bio: string) => void;
  setUsername: (username: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setImage: (image: string) => void;
  setSessionChecked: (sessionChecked: boolean) => void;
  setHandle: (handle: string) => void;
  setSession: (s: Session | null) => void;
  setDisplayName: (n: string) => void;
  setEmail: (email: string) => void;
}
