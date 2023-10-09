'use client';

import { getUserProfileById, supabaseClient } from '@/lib/supabase';
import {
  Dispatch,
  ReactNode,
  useEffect,
  createContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react';
import { useBotnetAuth } from './Auth';
import { head, isEmpty, isFunction, toString } from 'lodash';
import { Session } from '@supabase/supabase-js';
import { useGameServer, useSpacesStore } from './Spaces';
import { getUserIdFromSession } from '@/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { guestId } from './GameServerProvider';

interface IAuthAppState {}

enum ACTIONS {
  'SIGN_OUT_USER' = 'SIGN_OUT_USER',
}

type Action = {
  type: keyof typeof ACTIONS;
  data: any;
};

const initialState: IAuthAppState = {};

export const AuthStateContext = createContext<{
  state: IAuthAppState;
  dispatch: Dispatch<Action>;
  signOutUser: () => Promise<void>;
}>(
  // @ts-ignore
  null,
);

const reducer = (state: IAuthAppState, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const AuthProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [
    setSession,
    setSessionChecked,
    setImage,
    setDisplayName,
    setHandle,
    setEmail,
  ] = useBotnetAuth(state => [
    state.setSession,
    state.setSessionChecked,
    state.setImage,
    state.setDisplayName,
    state.setHandle,
    state.setEmail,
  ]);
  const [setSelectedSpaceId, addSpace] = useSpacesStore(state => [
    state.setSelectedSpaceId,
    state.addSpace,
  ]);
  const [setGameServerUserId] = useGameServer(state => [state.setUserId]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSpaceId = useMemo(
    () => searchParams.get('space'),
    [searchParams],
  );

  /**
   * Fetch logged in user data
   */
  const getUserProfile = useCallback(
    async (session: Session) => {
      const userId = getUserIdFromSession(session);

      if (!isEmpty(userId)) {
        const res = await getUserProfileById(userId);
        console.log('getUserProfile()');

        if (res?.data && !isEmpty(res?.data)) {
          const targetProfile = head(res.data);
          const displayName = toString(targetProfile?.display_name);
          const image = toString(targetProfile?.image);
          const handle = toString(targetProfile?.handle);
          const spaceId = toString(targetProfile?.space_id);

          setImage(image);
          setHandle(handle);
          setDisplayName(displayName);
          setGameServerUserId(userId);

          if (spaceId && isFunction(addSpace)) {
            addSpace({ id: spaceId });
          }

          if (!isEmpty(spaceId) && !selectedSpaceId) {
            setSelectedSpaceId(spaceId);
            router.push(`/?space=${spaceId}`);
          }
        }
      }
    },
    // eslint-disable-next-line
    [
      router?.push,
      selectedSpaceId,
      setImage,
      addSpace,
      setHandle,
      setSelectedSpaceId,
      setGameServerUserId,
      setDisplayName,
    ],
  );

  /**
   * Init store session
   */
  useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({ data: { session } }) => {
        console.log('init session:', session);

        if (setSession) {
          setSession(session);
        }

        if (session && !isEmpty(session?.user)) {
          getUserProfile(session);
        }

        setEmail(session?.user?.email || '');
        setSessionChecked(true);
      })
      .catch(() => {
        setSessionChecked(true);
      });
  }, [
    getUserProfile,
    setSession,
    setSessionChecked,
    setImage,
    setHandle,
    setEmail,
    setDisplayName,
  ]);

  /**
   * Listen to auth session change
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (setSession) {
        setSession(session);
      }

      if (session) {
        setEmail(session?.user?.email || '');
        getUserProfile(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [getUserProfile, setEmail, setSession]);

  /**
   * Sign out user session from supabase auth
   */
  const signOutUser = async () => {
    setSession(null);
    setGameServerUserId(guestId);

    const { error } = await supabaseClient.auth.signOut();

    if (error?.message) {
      console.log('supabaseClient.auth.signOut() err:', error?.message);
    } else {
      setEmail('');
      setHandle('');
      setDisplayName('');
    }
  };

  return (
    <AuthStateContext.Provider value={{ state, dispatch, signOutUser }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
