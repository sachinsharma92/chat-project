'use client';

import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ReactNode, useEffect } from 'react';
import { useSpacesStore } from './Spaces';
import {
  getSpaceBots,
  getSpaceProfile,
  getUserProfileById,
} from '@/lib/supabase';
import { head, isEmpty } from 'lodash';
import { useRouter } from 'next/navigation';
import { IUser } from '@/types/auth';
import { ISpace } from '@/types';

const SpacesProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [addSpace, setSpaceInfo] = useSpacesStore(state => [
    state.addSpace,
    state.setSpaceInfo,
  ]);
  const { spaceId } = useSelectedSpace();
  const router = useRouter();

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
          setSpaceInfo(spaceId, { ...props });
        } else if (error) {
          // redirect user to 404 page
          router.push('/not-found');
        }
      }
    };

    getSpaceInfo();

    // eslint-disable-next-line
  }, [spaceId, router?.push, setSpaceInfo]);

  return <>{children}</>;
};

export default SpacesProvider;
