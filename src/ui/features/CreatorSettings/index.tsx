'use client';

import { useCreatorSpace } from '@/hooks';
import { useMemo, useState } from 'react';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

import dynamic from 'next/dynamic';
import Button from '@/components/common/Button';
import CreatorProfile from './CreatorProfile';
import Personality from './Personality';
import Appearance from './Apperance';

// import AppNavigation from '../AppNavigation';
// import Voice from './Voice';

import './CreatorSettings.css';

export enum CreatorSettingsView {
  'profile' = 'profile',
  'personality' = 'personality',
  'appearance' = 'appearance',
  'voice' = 'voice',
  'community' = 'community',
}

const AppNavigation = dynamic(() => import('../AppNavigation'), { ssr: false });
const Voice = dynamic(() => import('./Voice'), { ssr: false });

const CreatorSettings = () => {
  const { spaceInfo } = useCreatorSpace();

  const spaceName = useMemo(
    () => spaceInfo?.host?.displayName || spaceInfo?.spaceName || 'Botnet',
    [spaceInfo],
  );

  const [creatorView, setCreatorView] = useState(CreatorSettingsView.profile);

  const router = useRouter();

  const navigateToSpace = () => {
    if (spaceInfo?.id) {
      router.push(`/?space=${spaceInfo.id}`);
    }
  };

  const pickCreatorView = (view: CreatorSettingsView) => {
    setCreatorView(view);
  };

  return (
    <div className="creator-settings">
      <div className="creator-settings-header-nav">
        <AppNavigation />
      </div>

      <div className="creator-settings-content">
        <div className="creator-settings-content-left">
          <div className="creator-settings-content-nav">
            <div className="relative h-[40px] flex justify-start items-center box-border">
              <Button
                className="relative h-[36px] w-[36px] box-border p-[6px] rounded-[80px] bg-[#F5F5F5]"
                onClick={navigateToSpace}
              >
                <ArrowLeftIcon height={'16px'} width={'16px'} />
              </Button>
              <p className="ml-[40px]">{spaceName}</p>
            </div>

            <ul>
              <li>
                <Button
                  onClick={() => pickCreatorView(CreatorSettingsView.profile)}
                  className={cn(
                    'relative',
                    creatorView === CreatorSettingsView.profile
                      ? 'creator-settings-nav-active'
                      : '',
                  )}
                >
                  Profile
                </Button>
              </li>
              <li>
                <Button
                  onClick={() =>
                    pickCreatorView(CreatorSettingsView.personality)
                  }
                  className={cn(
                    'relative',

                    creatorView === CreatorSettingsView.personality
                      ? 'creator-settings-nav-active'
                      : '',
                  )}
                >
                  Personality
                </Button>
              </li>
              <li>
                <Button
                  onClick={() =>
                    pickCreatorView(CreatorSettingsView.appearance)
                  }
                  className={cn(
                    'relative',
                    creatorView === CreatorSettingsView.appearance
                      ? 'creator-settings-nav-active'
                      : '',
                  )}
                >
                  Appearance
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => pickCreatorView(CreatorSettingsView.voice)}
                  className={cn(
                    'relative',
                    creatorView === CreatorSettingsView.voice
                      ? 'creator-settings-nav-active'
                      : '',
                  )}
                >
                  Voice
                </Button>
              </li>
            </ul>
          </div>
        </div>
        <div className="creator-settings-content-right">
          {creatorView === CreatorSettingsView.profile && <CreatorProfile />}
          {creatorView === CreatorSettingsView.personality && <Personality />}
          {creatorView === CreatorSettingsView.appearance && <Appearance />}
          {creatorView === CreatorSettingsView.voice && <Voice />}
        </div>
      </div>
    </div>
  );
};

export default CreatorSettings;
