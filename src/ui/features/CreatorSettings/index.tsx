'use client';

import { useCreatorSpace } from '@/hooks';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import Button from '@/components/common/Button';
import dynamic from 'next/dynamic';
import Appearance from './Apperance';
import CreatorProfile from './CreatorProfile';
import Personality from './Personality';

// import AppNavigation from '../AppNavigation';
// import Voice from './Voice';

import { isProduction } from '@/lib/environment';
import { ArrowLeft } from 'lucide-react';
import './CreatorSettings.css';

export enum CreatorSettingsView {
  'profile' = 'profile',
  'personality' = 'personality',
  'appearance' = 'appearance',
  'voice' = 'voice',
  'community' = 'community',
}

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
      <div className="creator-settings-content">
        <div className="creator-settings-content-left">
          <div className="creator-settings-content-nav">
            <div className="relative flex justify-start flex-col">
              <Button
                className="relative h-[36px] w-[36px] p-[6px] rounded-[80px] bg-[#F5F5F5]"
                onClick={navigateToSpace}
              >
                <ArrowLeft height={'18px'} width={'18px'} />
              </Button>
              <p className="font-bold mt-10 mb-6 text-xl">{spaceName}</p>
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
              {!isProduction && (
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
              )}
              {!isProduction && (
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
              )}
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
