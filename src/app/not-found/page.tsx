import { Metadata } from 'next';
import { BotnetIcon } from '@/icons';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { isDevelopment, isStaging } from '@/lib/environment';
import Link from 'next/link';
import './page.css';

export const metadata: Metadata = {
  title: 'Botnet - Page not found',
  description: 'Page not found',
};

const NotFound = () => {
  const defaultSpaceId =
    // in prod force navigate to zero two's space
    // for users landed in botnet.com and not logged in
    isStaging || isDevelopment
      ? '554eb516-1a29-4739-b748-d239248607d3'
      : '5b1e8603-144c-4b13-842a-ada5533ea43c';

  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="app-logo">
          <BotnetIcon height={64} width={64} />
        </div>
        <div className="not-found-text">
          <h1>404</h1>
          <p>{"This page doesn't exist."}</p>
        </div>

        <Link
          href={`/?space=${defaultSpaceId}`}
          className="relative w-[400px] box-border flex justify-center items-center mt-[24px]"
        >
          Return to Homepage
          <ChevronRightIcon
            height={'20px'}
            width={'20px'}
            className="ml-[4px] mt-[2px]"
          />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
