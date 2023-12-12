'use client';

import { useSpacesStore } from '@/store/App';
import { filter, head } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useUsername } from './useUsername';

/**
 * Get info of active/selected space
 * @returns
 */
export const useSelectedSpace = () => {
  const searchParams = useSearchParams();
  const paramSpaceId = useMemo(() => searchParams.get('space'), [searchParams]);

  const { username } = useUsername();

  const [spaces] = useSpacesStore(state => [state.spaces]);

  const spaceInfo = useMemo(
    () =>
      head(
        filter(
          spaces,
          space =>
            space?.id === paramSpaceId || space?.host?.username === username,
        ),
      ) || null,
    [spaces, paramSpaceId, username],
  );

  return { spaceInfo, spaceId: paramSpaceId || spaceInfo?.id || '' };
};
