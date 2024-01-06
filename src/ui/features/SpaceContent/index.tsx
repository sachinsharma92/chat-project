'use client';
import Button from '@/components/common/Button';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { BotnetIcon, CloseIcon, ExpandV2Icon, UnionIcon } from '@/icons';
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


  // Sharing Sheet code
  const shareScreenToggle = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Botnet',
        url: 'https://botnet.com/',
      }).then(() => console.log('Share Successfully')).catch((e) => console.log(e))
    }
    else {
      console.log('sharing not support');
    }
  }

  return (
    <div className={`space-content-container ${isGiftSelect && 'popup-style' || isCreateAccount && 'popup-style'}`}>
      <div className="space-content-header p-4">
        <div className="flex gap-1 w-full">
          <div className="bg-white dark:bg-black min-w-[36px] h-9 max-h-[36px] flex justify-center items-center border border-black dark:border-0 button-svg-theme">
            <BotnetIcon width={18} className="fill-black dark:fill-white" />
          </div>
          <div className="space-content-header-right flex justify-between items-center bg-white dark:bg-black w-full p-[2px] pr-2 border border-black dark:border-0">
            <div className="space-content-header-main">
              <div className="w-[30px] h-[30px]">
                <img
                  src={
                    spaceBotInfo?.background || '/assets/botnet-avatar-bg.jpg'
                  }
                  alt="Background preview"
                  className='h-full w-full'
                />
              </div>
              <div>
                <Button
                  onClick={() => setInfoSection(true)}
                  className="space-name p-0 uppercase text-xs text-black dark:text-white font-medium"
                >
                  {spaceName} {!isInfoSection ? <TriangleDownIcon /> : <TriangleUpIcon />}
                </Button>
                <p className="text-xs text-black dark:text-white leading-3 font-light">20.1k Followers</p>
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
              <Button onClick={shareScreenToggle} className="button-svg-theme">
                <UnionIcon className="fill-black dark:fill-white" />
              </Button>
            </div>

            <div className="expand-min-options" >
              <Button onClick={fullScreenHandler} className="button-svg-theme">
                {!isFullScreen ? <ExpandV2Icon className="fill-black dark:fill-white" /> : <CloseIcon className="fill-black dark:fill-white" />}
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        {isInfoSection && (
          <div className="info-card bg-white dark:bg-black p-2 w-full">
            <div className="flex justify-between">
              <h4 className="text-xs uppercase text-black dark:text-white">About</h4>
              <Button className="text-xs text-black dark:text-white p-0" onClick={() => setInfoSection(false)}>Close</Button>
            </div>
            <SpaceDescription text={spaceDescription} />
          </div>
        )}


        <div className='flex w-full gap-1'>
          <Button
            className="text-black dark:text-white uppercase bg-white dark:bg-black border border-black h-[22px] text-xs w-full hover:opacity-60 transition-btn leading-[1.5] inline-block"
          >
            Chat
          </Button>
          <Button
            className="text-black dark:text-white uppercase bg-white dark:bg-black border border-black h-[22px] text-xs w-full hover:opacity-60 transition-btn leading-[1.5] inline-block"
          >
            <div className="flex justify-center items-top gap-[2px]"> <span className="w-1 h-1 bg-black dark:bg-white rounded-full relative top-[4.5px] mr-[1px]" /> LIVE <span className="align-sub text-[8px]"> 231</span></div>
          </Button>
          <Button
            onClick={() => setGiftSelect(true)}
            className="text-black dark:text-white uppercase bg-white dark:bg-black border border-black h-[22px] text-xs w-full hover:opacity-60 transition-btn leading-[1.5] inline-block"
          >
            Gift
          </Button>


        </div>
      </div>

      {/* Create Account component here */}
      {isCreateAccount && (
        <CreateAccount
          closeHandler={() => setCreateAccount(false)}
          overlayHandler={() => setCreateAccount(false)}
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
