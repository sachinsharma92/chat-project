import { useSpacesStore } from '@/store/App';
import { useBotnetAuth } from '@/store/Auth';
import { filter, head, isEmpty } from 'lodash';
import { useMemo } from 'react';

/**
 * Returns space info of logged in host
 */
const useCreatorSpace = () => {
  const [userId] = useBotnetAuth(state => [
    state?.session?.user?.id || '',
    state.displayName,
  ]);
  const [spaces] = useSpacesStore(state => [state.spaces]);
  // owned space, not necessarily active/selected
  const spaceInfo = useMemo(() => {
    const find = filter(
      spaces,
      space => !isEmpty(space?.id) && space?.owner === userId,
    );
    return head(find);
  }, [spaces, userId]);

  const spaceId = useMemo(() => spaceInfo?.id, [spaceInfo]);

  return {
    spaceId,
    spaceInfo,
  };
};

export default useCreatorSpace;
