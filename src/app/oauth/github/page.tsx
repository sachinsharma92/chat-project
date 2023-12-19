'use client';

import { BotnetIcon } from '@/icons';
import { useBotnetAuth } from '@/store/Auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { defaultSpaceId } from '@/store/AuthProvider';
import { timeout } from '@/lib/utils';

import LoadingSpinner from '@/components/common/LoadingSpinner';

/**
 * Component hanlder for github oauth callback
 *
 * This setup will allow future implementation of data prefetch before redirecting user to a target page/section
 * @returns
 */
const OAuthGithubRedirectPage = () => {
  const [isLoading] = useBotnetAuth(state => [state.isLoading]);

  const router = useRouter();

  /**
   * Redirect user to target(default) space if done checking session
   */
  useEffect(() => {
    const redirect = async () => {
      await timeout(300);
      router.push(`/?space=${defaultSpaceId}`);
    };

    if (!isLoading) {
      redirect();
    }
  }, [router, isLoading]);

  return (
    <div className="relative w-full h-full flex justify-center items-center box-border">
      <div className="relative w-[300px] p-[24px] box-border flex-col justify-center items-center">
        <div className="flex justify-center items-center box-border mb-4">
          <BotnetIcon height={'60px'} width={'60px'} />
        </div>
        <LoadingSpinner width={40} />
      </div>
    </div>
  );
};

export default OAuthGithubRedirectPage;
