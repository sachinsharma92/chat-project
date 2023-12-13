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
import { head, isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/auth';
import { ISpace, OpenAIRoles } from '@/types';
import { v4 as uuid } from 'uuid';
import { useUsername } from '@/hooks/useUsername';

import PQueue from 'p-queue';

export const saveSpacePropertiesQueue = new PQueue({ concurrency: 1 });

const SpacesProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [addSpace, setSpaceInfo] = useSpacesStore(state => [
    state.addSpace,
    state.setSpaceInfo,
  ]);
  const [setChatMessages] = useBotData(state => [state.setChatMessages]);
  const { spaceId } = useSelectedSpace();
  const router = useRouter();

  const [restoreChatHistory] = useBotData(state => [state.restoreChatHistory]);

  const { username } = useUsername();

  const notFound = useCallback(() => {
    router.push('/not-found');
  }, [router]);

  const fetchingSpace = useRef(false);

  /**
   * Store space id
   */
  useEffect(() => {
    if (addSpace && spaceId) {
      addSpace({ id: spaceId });
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
        addSpace({ id: targetSpaceId });
      }

      console.log(
        'getSpaceInfo() spaceId',
        targetSpaceId,
        'username',
        username,
      );

      fetchingSpace.current = true;
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
        const spaceBotInfo = head(spaceBotsData);
        const greeting = spaceBotInfo?.greeting || '';
        const botGreeting = {
          id: uuid(),
          authorId: '',
          message: greeting,
          role: OpenAIRoles.assistant,
        };

        setSpaceInfo(targetSpaceId, { ...props });

        if (greeting) {
          setChatMessages([botGreeting]);
          restoreChatHistory([botGreeting]);
        }

        fetchingSpace.current = false;
      } else if (error) {
        // redirect user to 404 page
        if (notFound) {
          notFound();
        } else {
          router.push('/not-found');
        }
      }
    };

    getSpaceInfo();

    // eslint-disable-next-line
  }, [
    spaceId,
    username,
    router?.push,
    addSpace,
    setChatMessages,
    restoreChatHistory,
    notFound,
    setSpaceInfo,
  ]);

  return <>{children}</>;
};

export default SpacesProvider;
