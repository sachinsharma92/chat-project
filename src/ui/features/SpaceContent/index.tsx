'use client';
import Button from '@/components/common/Button';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { CloseIcon, ExpandV2Icon, UnionIcon } from '@/icons';
import { head } from 'lodash';
import dynamic from 'next/dynamic';
import { FC, useMemo, useState } from 'react';
import CreateAccount from '../CreateAccount';
import GiftCard from '../GiftCard';
import SpaceDescription from '../SpaceDescription';

import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import './SpaceContent.css';

const HomeSpace = dynamic(() => import('./HomeSpace'), { ssr: false });


interface SpaceContentProps {
  fullScreenHandler?: () => void;
  isFullScreen: boolean;
}

const SpaceContent: FC<SpaceContentProps> = ({ fullScreenHandler, isFullScreen }) => {
  const { spaceInfo } = useSelectedSpace();
  const [isCreateAccount, setCreateAccount] = useState(false);
  const [isGiftSelect, setGiftSelect] = useState(false);
  const [isInfoSection, setInfoSection] = useState(false);

  const spaceBotInfo = useMemo(() => head(spaceInfo?.bots), [spaceInfo]);

  const spaceName = useMemo(
    () => spaceInfo?.host?.displayName || spaceInfo?.spaceName || 'Botnet',
    [spaceInfo],
  );

  const spaceDescription = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);

    return (
      spaceBotInfo?.description ||
      spaceInfo?.description ||
      'Welcome to Botnet!'
    );
  }, [spaceInfo]);

  return (
    <div className={`space-content-container ${isGiftSelect && 'popup-style' || isCreateAccount && 'popup-style'}`}>
      <div className="space-content-header p-4">
        <div className="flex gap-1 w-full">
          <div className="space-content-header-right flex justify-between items-center bg-black w-full pr-2 pl-[2px]">
            <div className="space-content-header-main">
              <div className="w-8 h-8 overflow-hidden">
                <img
                  src={
                    spaceBotInfo?.background || '/assets/botnet-avatar-bg.jpg'
                  }
                  alt="Background preview"
                  className='h-full'
                />
              </div>
              <div>
                <Button
                  onClick={() => setInfoSection(true)}
                  className="space-name p-0 uppercase text-xs text-white font-medium"
                >
                  {spaceName} {!isInfoSection ? <TriangleDownIcon /> : <TriangleUpIcon />}
                </Button>
                <p className="text-xs text-white leading-3 font-light">20.1k Followers</p>
              </div>
            </div>
            <Button
              className="subscribe transition-btn hover:opacity-60"
              onClick={() => setCreateAccount(true)}
            >
              Follow
            </Button>
          </div>
          <div className="flex gap-1">
            <div className="share-button-style">
              <Button>
                <UnionIcon />
              </Button>
            </div>

            <div className="expand-min-options">
              <Button onClick={fullScreenHandler}>
                {!isFullScreen ? <ExpandV2Icon /> : <CloseIcon />}
              </Button>
            </div>
          </div>
        </div>

        {isInfoSection && (
          <div className="info-card bg-black p-2 w-full">
            <div className="flex justify-between">
              <h4 className="text-xs uppercase text-white">About</h4>
              <Button className="text-xs text-white p-0" onClick={() => setInfoSection(false)}>Close</Button>
            </div>
            <SpaceDescription text={spaceDescription} />
          </div>
        )}

        {!isGiftSelect && <Button
          onClick={() => setGiftSelect(true)}
          className="text-white uppercase bg-black h-[22px] flex justify-center items-center text-xs w-full hover:opacity-60 transition-btn"
        >
          Gift
        </Button>}
      </div>

      {/* Create Account component here */}
      {isCreateAccount && (
        <CreateAccount
          closeHandler={() => setCreateAccount(false)}
        />
      )}

      {/* Gift component here */}
      {isGiftSelect && (
        <GiftCard closeHandler={() => setGiftSelect(false)} />
      )}

      <HomeSpace />
    </div>
  );
};

export default SpaceContent;
