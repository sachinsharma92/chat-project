import camelcaseKeys from 'camelcase-keys';
import { getSpaceProfile, getUserProfileById } from '../supabase';
import { ISpace } from '@/types';
import { head, isEmpty } from 'lodash';
import { IUser } from '@/types/auth';

export const defaultTitle = 'Botnet';

export const defaultDescription = 'The Botnet project';

/**
 * Get metadata for spaceId search param
 * @param props
 * @returns
 */
export const getSpacePageMetadata = async (
  props: any,
): Promise<{ image?: string; title?: string; description?: string }> => {
  try {
    const spaceId = props?.searchParams?.space || '';

    if (spaceId) {
      const { data, error } = await getSpaceProfile(spaceId);

      if (data && data?.length > 0 && !error) {
        const spaceInfo = camelcaseKeys(data[0]) as ISpace;
        const spaceDescription = spaceInfo?.description as string;
        const spaceName = spaceInfo?.spaceName as string;
        const owner = spaceInfo?.owner as string;

        let title = spaceName;
        let description = spaceDescription;
        let image = spaceInfo?.image;

        if ((!title || !image) && owner) {
          const res = await getUserProfileById(owner);
          const userProfile: IUser =
            res?.data && !isEmpty(res?.data) ? head(res?.data) : null;

          if (!title) {
            title = userProfile?.displayName || '';
          }

          if (!image) {
            image = userProfile?.image;
          }
        }

        if (image) {
          image = `/api/og?avatar=${encodeURIComponent(image)}`;
        }

        if (!description && title) {
          description = `${title} Space`;
        }

        return { title, image, description };
      }
    }

    return {};
  } catch {
    return {};
  }
};
