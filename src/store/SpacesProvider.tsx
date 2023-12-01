'use client';

import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ReactNode, useCallback, useEffect } from 'react';
import { useBotData, useSpacesStore } from './App';
import {
  getSpaceBots,
  getSpaceProfile,
  getUserProfileById,
} from '@/lib/supabase';
import { head, isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/auth';
import { ISpace, OpenAIRoles } from '@/types';
import { v4 as uuid } from 'uuid';

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

  const notFound = useCallback(() => {
    router.push('/not-found');
  }, [router]);

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
      if (spaceId) {
        const { data: spaceData, error } = await getSpaceProfile(spaceId);

        if (!isEmpty(spaceData) && !error) {
          const spaceInfo = head(spaceData) as ISpace;
          const res = await getUserProfileById(spaceInfo?.owner);
          const resBots = await getSpaceBots(spaceId);
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

          setSpaceInfo(spaceId, { ...props });

          if (greeting) {
            setChatMessages([botGreeting]);
          }
        } else if (error) {
          // redirect user to 404 page
          if (notFound) {
            notFound();
          } else {
            router.push('/not-found');
          }
        }
      }
    };

    getSpaceInfo();

    // eslint-disable-next-line
  }, [spaceId, router?.push, notFound, setSpaceInfo]);

  return <>{children}</>;
};

export default SpacesProvider;
