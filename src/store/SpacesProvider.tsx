'use client';

import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useBotData, useSpacesStore } from './App';
import {
  getSpaceBots,
  getSpaceProfile,
  getUserProfileById,
  getUserProfileByUsername,
} from '@/lib/supabase';
import { head, isEmpty, toString, trim } from 'lodash';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/auth';
import { ISpace, OpenAIRoles } from '@/types';
import { v4 as uuid } from 'uuid';
import { useUsername } from '@/hooks/useUsername';
import { useBotnetAuth } from './Auth';
import { defaultCloneAIGreetingPhrase } from '@/lib/utils/bot';

import PQueue from 'p-queue';
import { useAuth } from '@/hooks';

export const saveSpacePropertiesQueue = new PQueue({ concurrency: 1 });

const SpacesProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [addSpace, setSpaceInfo] = useSpacesStore(state => [
    state.addSpace,
    state.setSpaceInfo,
  ]);
  const [setChatMessages, setFetchingChatHistory] = useBotData(state => [
    state.setChatMessages,
    state.setFetchingChatHistory,
  ]);
  const { spaceId, spaceInfo } = useSelectedSpace();
  const router = useRouter();

  const [restoreLocalChatHistory] = useBotData(state => [
    state.restoreLocalChatHistory,
  ]);

  const { username } = useUsername();

  const [isLoading, session] = useBotnetAuth(state => [
    state.isLoading,
    state.session,
  ]);
  const { userId } = useAuth();

  const notFound = useCallback(() => {
    router.push('/not-found');
  }, [router]);

  const fetchingSpace = useRef('');

  /**
   * Store space id
   */
  useEffect(() => {
    if (addSpace && spaceId) {
      addSpace({ id: spaceId });
    }

    if (fetchingSpace.current && spaceId && spaceId !== fetchingSpace.current) {
      fetchingSpace.current = '';
    }
  }, [spaceId, addSpace]);

  /**
   * Fetch space and owner info
   */
  useEffect(() => {
    const getSpaceInfo = async () => {
      let targetSpaceId = spaceId;

      if ((!spaceId && !username) || fetchingSpace.current) {
        return;
      }

      if (username && !spaceId) {
        const { data: userProfileData } = await getUserProfileByUsername(
          username,
        );
        const targetUserProfile = head(userProfileData);

        if (!targetUserProfile?.spaceId) {
          // redirect user to 404 page
          if (notFound) {
            notFound();
          } else {
            router.push('/not-found');
          }

          return;
        }

        targetSpaceId = targetUserProfile?.spaceId;
      }

      if (targetSpaceId) {
        addSpace({ id: targetSpaceId });
      }

      console.log(
        'getSpaceInfo() spaceId',
        targetSpaceId,
        'username',
        username,
      );

      fetchingSpace.current = targetSpaceId;
      const { data: spaceData, error } = await getSpaceProfile(targetSpaceId);

      if (!isEmpty(spaceData) && !error) {
        const spaceInfo = head(spaceData) as ISpace;
        const res = await getUserProfileById(spaceInfo?.owner);
        const resBots = await getSpaceBots(targetSpaceId);
        const spaceBotsData = resBots?.data;
        const spaceOwnerData = res?.data;
        const spaceOwnerProfile = head(spaceOwnerData) as IUser;
        const props = {
          ...spaceInfo,
          host: spaceOwnerProfile || {},
          bots: spaceBotsData || [],
        };

        setSpaceInfo(targetSpaceId, { ...props });
      } else if (error) {
        // redirect user to 404 page
        notFound();
      }

      fetchingSpace.current = '';
    };

    getSpaceInfo();
  }, [
    spaceId,
    username,
    router,
    addSpace,
    setChatMessages,
    notFound,
    setSpaceInfo,
  ]);

  /**
   * Fetch logged in user's chat history
   */
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setFetchingChatHistory(true);

        const spaceBotsData = spaceInfo?.bots;
        const spaceBotInfo = head(spaceBotsData);
        const greeting =
          spaceBotInfo?.greeting ||
          defaultCloneAIGreetingPhrase(
            trim(toString(spaceInfo?.host?.displayName)),
          );
        const botGreeting = {
          id: uuid(),
          authorId: '',
          message: greeting,
          role: OpenAIRoles.assistant,
        };

        if (greeting && !session?.user) {
          restoreLocalChatHistory([botGreeting]);
        } else {
          setChatMessages([botGreeting]);
        }
      } catch (err: any) {
        console.log('fetchChatHistory() err:', err?.message);
      } finally {
        setFetchingChatHistory(false);
      }
    };

    if (spaceId && !isLoading && !isEmpty(spaceInfo?.bots) && spaceInfo?.host) {
      fetchChatHistory();
    } else {
      setChatMessages([]);
    }
  }, [
    session,
    spaceId,
    spaceInfo?.host,
    spaceInfo?.bots,
    isLoading,
    userId,
    setFetchingChatHistory,
    setChatMessages,
    restoreLocalChatHistory,
  ]);

  return <>{children}</>;
};

export default SpacesProvider;
