import { ISpaceLink } from '@/types';
import { filter, isEmpty } from 'lodash';
import { updateSpaceProfileProperties } from '.';

/**
 * Update space links data by space id
 * @param spaceId
 * @param links
 */
export const updateSpaceLinks = async (
  spaceId: string,
  links: ISpaceLink[],
) => {
  const filtered = filter(
    links,
    link => !isEmpty(link?.name) || !isEmpty(link?.link),
  );

  return await updateSpaceProfileProperties(spaceId, {
    links: { data: filtered },
  });
};