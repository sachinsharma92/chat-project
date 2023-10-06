import { Session } from '@supabase/supabase-js';

export interface IUser {
  id: string;
  displayName: string;
  image: string;
}

export interface IAppAuthState {
  session: Session | null;
  displayName: string;
  email: string;
  handle: string;
  image: string;
  sessionChecked: boolean;
  setImage: (image: string) => void;
  setSessionChecked: (sessionChecked: boolean) => void;
  setHandle: (handle: string) => void;
  setSession: (s: Session | null) => void;
  setDisplayName: (n: string) => void;
  setEmail: (email: string) => void;
}
