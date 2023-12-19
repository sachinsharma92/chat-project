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
            (paramSpaceId && space?.id === paramSpaceId) ||
            (!paramSpaceId && space?.host?.username === username),
        ),
      ) || null,
    [spaces, paramSpaceId, username],
  );

  const spaceId = useMemo(
    () => paramSpaceId || spaceInfo?.id || '',
    [spaceInfo?.id, paramSpaceId],
  );

  return { spaceInfo, spaceId };
};
