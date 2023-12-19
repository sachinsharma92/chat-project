'use client';

import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useBotData, useSpacesStore } from './App';
import {
  getBotChatMessagesByPage,
  getSpaceBots,
  getSpaceProfile,
  getUserProfileById,
  getUserProfileByUsername,
} from '@/lib/supabase';
import { cloneDeep, head, isArray, isEmpty, map, size } from 'lodash';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/auth';
import { ChatMessageProps, ISpace, OpenAIRoles } from '@/types';
import { v4 as uuid } from 'uuid';
import { useUsername } from '@/hooks/useUsername';
import { useBotnetAuth } from './Auth';

import PQueue from 'p-queue';

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

  const [restoreChatHistory] = useBotData(state => [state.restoreChatHistory]);

  const { username } = useUsername();

  const [isLoading, userId] = useBotnetAuth(state => [
    state.isLoading,
    state?.session?.user?.id || '',
  ]);

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

        fetchingSpace.current = '';
      } else if (error) {
        // redirect user to 404 page
        notFound();
      }
    };

    getSpaceInfo();
  }, [
    spaceId,
    username,
    router,
    addSpace,
    setChatMessages,
    restoreChatHistory,
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
        const greeting = spaceBotInfo?.greeting || '';
        const botGreeting = {
          id: uuid(),
          authorId: '',
          message: greeting,
          role: OpenAIRoles.assistant,
        };
        const chatHistoryRes = await getBotChatMessagesByPage(
          1,
          spaceId,
          userId,
        );
        const chatMessages = chatHistoryRes?.data || [];
        const sanitizedChatMessages: ChatMessageProps[] = map(
          chatMessages,
          message => {
            return cloneDeep(message) as ChatMessageProps;
          },
        );

        console.log(
          'fetchChatHistory() chatMessages:',
          size(sanitizedChatMessages),
        );

        if (!isEmpty(sanitizedChatMessages) && isArray(chatMessages)) {
          setChatMessages([botGreeting, ...sanitizedChatMessages.reverse()]);
        } else if (greeting) {
          restoreChatHistory([botGreeting]);
        }
      } catch (err: any) {
        console.log('fetchChatHistory() err:', err?.message);
      } finally {
        setFetchingChatHistory(false);
      }
    };

    if (spaceId && !isLoading && !isEmpty(spaceInfo?.bots)) {
      fetchChatHistory();
    }
  }, [
    spaceId,
    spaceInfo?.bots,
    isLoading,
    userId,
    setFetchingChatHistory,
    setChatMessages,
    restoreChatHistory,
  ]);

  return <>{children}</>;
};

export default SpacesProvider;
