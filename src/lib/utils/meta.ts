import { getSpaceProfile, getUserProfileById } from '../supabase';
import { ISpace } from '@/types';
import { head } from 'lodash';
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
        const spaceInfo = data[0] as ISpace;
        const spaceDescription = spaceInfo?.description as string;
        const spaceName = spaceInfo?.spaceName as string;
        const owner = spaceInfo?.owner as string;

        let title = spaceName;
        let description = spaceDescription;
        let image = spaceInfo?.image;

        if ((!title || !image) && owner) {
          const res = await getUserProfileById(owner);
          const userProfile = head(res?.data) as IUser;

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

export const getCreatorPageMetadata = async (props: any) => {
  const spaceId = props?.searchParams?.space;
  const meta = await getSpacePageMetadata(props);

  if (meta?.title) {
    const { title, description, image } = meta;

    return {
      title: `${meta.title} - Botnet`,
      description: meta.description,
      viewport:
        'width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1, viewport-fit=cover',
      twitter: {
        card: 'summary_large_image',
        description,
        title,
        images: [image],
      },
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://botnet.com${spaceId ? `?space=${spaceId}` : ''}`,
        images: [
          {
            url: image,
            width: 1200,
            height: 675,
          },
        ],
      },
    };
  }

  return {
    title: defaultTitle,
    description: defaultDescription,
  };
};
