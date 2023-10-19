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
import { ceil, head, isEmpty } from 'lodash';
import { Session } from '@supabase/supabase-js';
import { useAppStore, useGameServer, useSpacesStore } from './Spaces';
import { getUserIdFromSession, timeout } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { DialogEnums } from '@/types/dialog';
import camelCaseKeys from 'camelcase-keys';
import { useRouterQuery } from '@/hooks';

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
    session,
    sessionChecked,
    setSession,
    setSessionChecked,
    setImage,
    setDisplayName,
    setHandle,
    setEmail,
    setIsLoading,
  ] = useBotnetAuth(state => [
    state.session,
    state.sessionChecked,
    state.setSession,
    state.setSessionChecked,
    state.setImage,
    state.setDisplayName,
    state.setHandle,
    state.setEmail,
    state.setIsLoading,
  ]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [setShowDialog] = useAppStore(state => [state.setShowDialog]);
  const [addSpace] = useSpacesStore(state => [state.addSpace]);
  const [botRoom, setBotRoom] = useGameServer(state => [
    state.botRoom,
    state.setBotRoom,
  ]);
  const router = useRouter();
  const { searchParams, setQuery } = useRouterQuery();
  const paramSpaceId = useMemo(() => searchParams.get('space'), [searchParams]);

  /**
   * Sign out user session from supabase auth
   */
  const signOutUser = useCallback(async () => {
    setSession(null);

    const { error } = await supabaseClient.auth.signOut();

    if (error?.message) {
      console.log('supabaseClient.auth.signOut() err:', error?.message);
    } else {
      setEmail('');
      setHandle('');
      setDisplayName('');
      setImage('');
      setIsLoading(false);
      setBotRoom(null);

      if (botRoom) {
        botRoom.leave(true);
      }
    }
  }, [
    botRoom,
    setEmail,
    setSession,
    setHandle,
    setDisplayName,
    setImage,
    setIsLoading,
    setBotRoom,
  ]);

  /**
   * Fetch logged in user data
   */
  const getUserProfile = useCallback(
    async (session: Session) => {
      try {
        if (!session) {
          return;
        }

        const dateNowInSeconds = ceil(Date.now() / 1000);
        const createdDate = new Date(session?.user?.created_at);
        const createdDateInSeconds = ceil(createdDate?.getTime() / 1000);
        const recentlyCreated = dateNowInSeconds - createdDateInSeconds < 10;

        if (recentlyCreated) {
          // 1. Wait for edge function to fill new user data if account's recently created
          // 2. We could've listen to supabase changes but that's expensive
          // 3. Since we know edge function timeout is 4.5 seconds, so we wait for that exact duration
          // 4. Otherwise, if we don't wait we'd end up with an empty/null response from 'getUserProfileById'
          await timeout(4_500);
        }

        const userId = getUserIdFromSession(session);

        if (!isEmpty(userId)) {
          const res = await getUserProfileById(userId);

          if (res?.data && !isEmpty(res?.data)) {
            console.log('getUserProfile()');

            const targetProfile = head(res.data);
            const props = camelCaseKeys(targetProfile);
            const {
              displayName = '',
              handle = '',
              image = '',
              spaceId = '',
            } = props;

            setImage(image);
            setHandle(handle);
            setDisplayName(displayName);
            setIsLoading(false);

            console.log('getUserProfile() spaceId:', spaceId);

            if (recentlyCreated) {
              setShowDialog(true, DialogEnums.onboardDisplayName);
            }

            if (!isEmpty(spaceId)) {
              addSpace({ id: spaceId, owner: userId });
            }

            if (
              !isEmpty(spaceId) &&
              (!paramSpaceId || (recentlyCreated && spaceId !== paramSpaceId))
            ) {
              setQuery('space', spaceId);
            }
          } else if (res?.data && !res?.error) {
            // force sign out can't find user in db and not network error
            signOutUser();
          }
        }
      } catch (err: any) {
        console.log('getUserProfile() err:', err?.message);
      }
    },
    // eslint-disable-next-line
    [
      router?.push,
      paramSpaceId,
      signOutUser,
      setQuery,
      addSpace,
      setShowDialog,
      setIsLoading,
      setImage,
      setHandle,
      setDisplayName,
    ],
  );

  /**
   * Init store session
   */
  useEffect(() => {
    supabaseClient.auth
      .getSession()
      .then(({ data: { session: newSession } }) => {
        if (sessionChecked) {
          return;
        }

        if (newSession && !isEmpty(newSession?.user)) {
          setIsLoading(true);
          setSession(newSession);
          getUserProfile(newSession);

          setEmail(newSession?.user?.email || '');
        }
      })
      .catch(console.log)
      .finally(() => {
        setSessionChecked(true);
      });
  }, [
    sessionChecked,
    setIsLoading,
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
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      if (
        newSession &&
        // only interrupt present session when needed
        (newSession?.user?.id !== session?.user?.id ||
          newSession?.access_token !== session?.access_token)
      ) {
        setIsLoading(true);
        setSession(newSession);
        setEmail(newSession?.user?.email || '');
        getUserProfile(newSession);
      }
    });

    return () => subscription.unsubscribe();
  }, [session, setIsLoading, getUserProfile, setEmail, setSession]);

  return (
    <AuthStateContext.Provider value={{ state, dispatch, signOutUser }}>
      {children}
    </AuthStateContext.Provider>
  );
};

export default AuthProvider;
