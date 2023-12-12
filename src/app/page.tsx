import { getCreatorPageMetadata } from '@/lib/utils/meta';
import './page.css';
import CreatorPage from './creatorPage';

/**
 * Dynamic metadata when spaceId value is provided from query format: ?space=spaceId
 * @param props
 * @returns
 */
export async function generateMetadata(props: any) {
  return await getCreatorPageMetadata(props);
}

async function Page() {
  return <CreatorPage />;
}

export default Page;
