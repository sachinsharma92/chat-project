import { useSpacesStore } from '@/store/App';
import { filter, head } from 'lodash';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Get info of active/selected space
 * @returns
 */
export const useSelectedSpace = () => {
  const searchParams = useSearchParams();
  const paramSpaceId = useMemo(() => searchParams.get('space'), [searchParams]);

  const [spaces] = useSpacesStore(state => [state.spaces]);
  const spaceInfo = useMemo(
    () => head(filter(spaces, space => space?.id === paramSpaceId)) || null,
    [spaces, paramSpaceId],
  );

  return {
    spaceInfo,
    spaceId: paramSpaceId || '',
  };
};
