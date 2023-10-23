import App from '../app-ui/App';
import './page.css';
import {
  defaultDescription,
  defaultTitle,
  getSpacePageMetadata,
} from '@/lib/utils/meta';

/**
 * Dynamic metadata when spaceId value is provided from query format: ?space=spaceId
 * @param props
 * @returns
 */
export async function generateMetadata(props: any) {
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
}

async function Page() {
  return <App />;
}

export const dynamic = 'force-dynamic';
export default Page;
