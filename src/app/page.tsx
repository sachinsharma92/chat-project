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
  const meta = await getSpacePageMetadata(props);

  if (meta?.title) {
    return {
      title: `${meta.title} - Botnet`,
      description: meta.description,
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
