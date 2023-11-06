'use client';

import { useBotnetAuth } from '@/store/Auth';
import { useContext, useMemo } from 'react';
import { isEmpty, isFunction, last, size } from 'lodash';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExitIcon, ExternalLinkIcon } from '@radix-ui/react-icons';
import { useCreatorSpace, useRouterQuery } from '@/hooks';
import { copyTextToClipboard } from '@/lib/utils';
import { BotnetIcon } from '@/icons';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar/Avatar';
import CloneAISettings from './CloneAISettings';
import SpaceSettings from './SpaceSettings';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Profile from './Profile';
import Links from './Links';
import CloneAudio from './CloneAudio';

import './CreatorDashboard.css';
import { AuthStateContext } from '@/store/AuthProvider';
import { useRouter } from 'next/navigation';

const CreatorDashboard = () => {
  const [isLoading, session, image, email, displayName] = useBotnetAuth(
    state => [
      state.isLoading,
      state.session,
      state.image,
      state.email,
      state.displayName,
    ],
  );

  const { signOutUser } = useContext(AuthStateContext);

  const { setQuery, searchParams } = useRouterQuery();

  const tabSelected = searchParams.get('tab');

  const router = useRouter();

  const { spaceInfo } = useCreatorSpace();

  const showLoadingSpinner = useMemo(
    () => !spaceInfo || !session || isEmpty(session) || isLoading,
    [isLoading, session, spaceInfo],
  );

  const copyURLToSpace = () => {
    let origin = window.location.origin;

    if (last(origin) === '/') {
      origin = origin.substring(0, size(origin) - 1);
    }

    copyTextToClipboard(`${origin}/?space=${spaceInfo?.id}`);
  };

  const navigateToSpace = () => {
    if (spaceInfo?.id) {
      router.push(`/?space=${spaceInfo.id}`);
    }
  };

  const onSignOut = () => {
    if (isFunction(signOutUser)) {
      signOutUser();

      router.push('/');
    }
  };

  return (
    <div className="relative flex justify-start items-center w-full h-full top-0 left-0 creator-dashboard-container">
      <div className="creator-dashboard-header">
        <div className="botnet-logo">
          <BotnetIcon height={40} width={40} />
        </div>
      </div>

      {showLoadingSpinner && (
        <div className="creator-dashboard-content-loading">
          <LoadingSpinner width={30} />
        </div>
      )}
      <div className="creator-dashboard-content">
        {!showLoadingSpinner && (
          <>
            <div className="creator-dashboard-content-left">
              <div className="creator-dashboard-content-profile-view">
                <Avatar
                  height={50}
                  width={50}
                  src={image}
                  name={displayName || email}
                />

                {displayName && <p>{displayName}</p>}
              </div>
              <div className="creator-url-info">
                <p>Share your space to your socials</p>
                <Button className="url-copy-button" onClick={copyURLToSpace}>
                  Copy URL
                </Button>
              </div>
              <Button
                className="navigate-space-button"
                onClick={navigateToSpace}
              >
                <p>Navigate to your space </p>
                <ExternalLinkIcon />
              </Button>
              <Button className="sign-out-button" onClick={onSignOut}>
                <p>Sign Out</p>
                <ExitIcon />
              </Button>
            </div>
            <div className="creator-dashboard-content-right w-[720px]">
              <Tabs defaultValue={tabSelected || 'profile'} className="w-full">
                <TabsList className="bg-[#F8F6F0] h-[40px] pl-2 pr-2 pt-1 pb-1 box-border overflow-hidden rounded-[32px]">
                  <TabsTrigger
                    value="profile"
                    className="tabs-trigger text-base"
                    onClick={() => {
                      setQuery('tab', 'profile');
                    }}
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="links"
                    className="tabs-trigger text-base"
                    onClick={() => {
                      setQuery('tab', 'links');
                    }}
                  >
                    Links
                  </TabsTrigger>

                  <TabsTrigger
                    value="space"
                    className="tabs-trigger text-base"
                    onClick={() => {
                      setQuery('tab', 'space');
                    }}
                  >
                    Space
                  </TabsTrigger>

                  <TabsTrigger
                    value="clone"
                    className="tabs-trigger text-base"
                    onClick={() => {
                      setQuery('tab', 'clone');
                    }}
                  >
                    AI Clone
                  </TabsTrigger>
                  <TabsTrigger
                    value="audio"
                    className="tabs-trigger text-base"
                    onClick={() => {
                      setQuery('tab', 'audio');
                    }}
                  >
                    Audio
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="mt-6 w-full">
                  <Profile />
                </TabsContent>
                <TabsContent value="links" className="mt-6 w-full">
                  <Links />
                </TabsContent>
                <TabsContent value="space" className="mt-6 w-full">
                  <SpaceSettings />
                </TabsContent>
                <TabsContent value="clone" className="mt-6 w-full">
                  <CloneAISettings />
                </TabsContent>
                <TabsContent value="audio" className="mt-6 w-full">
                  <CloneAudio />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
