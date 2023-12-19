'use client';

import {
  getSpaceBots,
  getSpaceProfile,
  getUserProfileById,
  supabaseClient,
} from '@/lib/supabase';
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
import { ceil, head, includes, isEmpty } from 'lodash';
import { Session } from '@supabase/supabase-js';
import { useGameServer, useSpacesStore } from './App';
import {
  getUserIdFromSession,
  isPathnameAppRoute,
  isPathnameForUpdatePassword,
  timeout,
} from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useRouterQuery } from '@/hooks';
import { IUser } from '@/types/auth';
import { v4 as uuid } from 'uuid';
import { botnetGuestIdLocalStorageKey } from '@/constants';
import { isDevelopment, isStaging } from '@/lib/environment';

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

/**
 * Persist guest id for rate limit
 * @returns
 */
export const getGuestId = (): string => {
  let guestId = localStorage.getItem(botnetGuestIdLocalStorageKey);

  if (!guestId) {
    guestId = uuid();
    localStorage.setItem(botnetGuestIdLocalStorageKey, guestId);
  }

  return guestId;
};

const reducer = (state: IAuthAppState, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export const defaultSpaceId =
  isStaging || isDevelopment
    ? '554eb516-1a29-4739-b748-d239248607d3'
    : '5b1e8603-144c-4b13-842a-ada5533ea43c';

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
    setUsername,
    setBio,
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
    state.setUsername,
    state.setBio,
  ]);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [addSpace, setSpaceInfo] = useSpacesStore(state => [
    state.addSpace,
    state.setSpaceInfo,
  ]);
  const [botRoom, setBotRoom] = useGameServer(state => [
    state.botRoom,
    state.setBotRoom,
  ]);
  const pathname = usePathname();
  const router = useRouter();
  const { searchParams, navigate } = useRouterQuery();
  const paramSpaceId = useMemo(() => searchParams.get('space'), [searchParams]);

  const fromAuthPage = useMemo(
    () =>
      pathname?.startsWith('/login') ||
      pathname?.startsWith('/register') ||
      pathname?.startsWith('/auth'),
    [pathname],
  );

  /**
   * Sign out user session from supabase auth
   */
  const signOutUser = useCallback(async () => {
    setSession(null);
    setIsLoading(true);

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
            const targetProfile = head(res.data);
            const props = targetProfile as IUser;
            const {
              displayName = '',
              handle = '',
              image = '',
              spaceId = '',
              username: profileUsername = '',
              bio = '',
            } = props;

            setImage(image);
            setHandle(handle);
            setDisplayName(displayName);
            setUsername(profileUsername);
            setBio(bio);

            console.log('getUserProfile() spaceId:', spaceId);

            if (!isEmpty(spaceId)) {
              addSpace({ id: spaceId, owner: userId });

              /**
               * Fetch user space profile
               */
              getSpaceProfile(spaceId)
                .then(async params => {
                  const { data, error } = params;

                  if (!error && !isEmpty(data)) {
                    /**
                     * If space info exist, fetch bot clone data
                     */
                    getSpaceBots(spaceId)
                      .then(resBots => {
                        const spaceInfo = head(data);
                        const spaceBotsData = resBots?.data;
                        const props = {
                          ...spaceInfo,
                          host: targetProfile,
                          bots: spaceBotsData || [],
                        };

                        if (spaceInfo) {
                          setSpaceInfo(spaceId, props);
                        }
                      })
                      .catch(console.log);
                  }
                })
                .catch(console.log);
            }

            if (!pathname?.startsWith('/settings') && recentlyCreated) {
              // navigate host to dashboard page
              navigate('/settings');
            } else if (fromAuthPage) {
              router.push('/?space=' + defaultSpaceId);
            }

            setIsLoading(false);
          } else if (res?.data && !res?.error) {
            // force sign out can't find user in db and not network error
            signOutUser();
          }
        }
      } catch (err: any) {
        console.log('getUserProfile() err:', err?.message);
      }
    },
    [
      router,
      pathname,
      fromAuthPage,
      setSpaceInfo,
      navigate,
      signOutUser,
      addSpace,
      setIsLoading,
      setImage,
      setHandle,
      setDisplayName,
      setUsername,
      setBio,
    ],
  );

  /**
   * Init store session
   */
  useEffect(() => {
    if (!router) {
      return;
    }

    supabaseClient.auth
      .getSession()
      .then(({ data: { session: newSession } }) => {
        if (sessionChecked) {
          return;
        }

        console.log('init session check');

        setSessionChecked(true);

        const fromAuthPage =
          pathname?.startsWith('/login') ||
          pathname?.startsWith('/register') ||
          pathname?.startsWith('/auth');

        if (
          (pathname === '/' && !paramSpaceId) ||
          (newSession?.user && paramSpaceId !== defaultSpaceId) ||
          (newSession?.user && fromAuthPage) ||
          !newSession
        ) {
          if (
            // only redirect if user is not updating password
            !isPathnameForUpdatePassword(pathname) &&
            // only redirect if user is not on predefined routes
            (!isPathnameAppRoute(pathname) || includes(pathname, '/settings'))
          ) {
            // in prod force navigate to zero two's space
            // for users landed in botnet.com and not logged in
            router.replace(
              window.location.origin + '/?space=' + defaultSpaceId,
              {},
            );
          }
        }

        if (newSession && !isEmpty(newSession?.user)) {
          setIsLoading(true);
          setSession(newSession);
          getUserProfile(newSession);
          setEmail(newSession?.user?.email || '');
        } else {
          setIsLoading(false);
        }
      })
      .catch(console.log);
  }, [
    router,
    pathname,
    sessionChecked,
    paramSpaceId,
    navigate,
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
