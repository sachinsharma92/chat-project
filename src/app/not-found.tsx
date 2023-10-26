import { Metadata } from 'next';
import NotFound from './not-found/page';

export const metadata: Metadata = {
  title: 'Botnet - Page not found',
  description: 'Page not found',
};

const Page404 = () => {
  return (
    <>
      <NotFound />
    </>
  );
};

export default Page404;
