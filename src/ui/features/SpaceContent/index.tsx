'use client';
import Button from '@/components/common/Button';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { CloseIcon, ExpandV2Icon, UnionIcon } from '@/icons';
import { head } from 'lodash';
import dynamic from 'next/dynamic';
import { FC, useMemo, useState } from 'react';
import CreateAccount from '../Auth/CreateAccount';
import GiftCard from '../GiftCard';
import SpaceDescription from '../SpaceDescription';

import CustomModal from '@/components/common/CustomModal';
import ArrowNext from '@/icons/ArrowNext';
import ShareSheet from '@/ui/shareSheet';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import LoginAccount from '../Auth/LoginAccount';
import './SpaceContent.css';

const HomeSpace = dynamic(() => import('./HomeSpace'), { ssr: false });

interface SpaceContentProps {
  fullScreenHandler?: () => void;
  isFullScreen: boolean;
}

const SpaceContent: FC<SpaceContentProps> = ({
  fullScreenHandler,
  isFullScreen,
}) => {
  const { spaceInfo } = useSelectedSpace();
  const [isCreateAccount, setCreateAccount] = useState(false);
  const [isLoginAccount, setLoginAccount] = useState(false);
  const [isGiftSelect, setGiftSelect] = useState(false);
  const [isInfoSection, setInfoSection] = useState(false);
  const [isDesktopShareModal, setDesktopShareModal] = useState(false);

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

  function detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some(toMatchItem => {
      return navigator.userAgent.match(toMatchItem);
    });
  }

  console.log(detectMob(), 'check detectMob');

  // Sharing Sheet code
  const shareScreenToggle = () => {
    if (detectMob()) {
      if (navigator.share) {
        navigator
          .share({
            title: 'Botnet',
            url: 'https://botnet.com/',
          })
          .then(() => console.log('Share Successfully'))
          .catch(e => console.log(e));
      } else {
        console.log('sharing not support');
      }
    } else {
      setDesktopShareModal(true);
    }
  };

  const loginToggle = () => {
    setLoginAccount(true)
    setCreateAccount(false)
  }

  const registerToggle = () => {
    setCreateAccount(true)
    setLoginAccount(false)
  }

  return (
    <div className={`space-content-container`}>
      <div className="space-content-header p-4 sm:p-0">
        <div className="flex gap-1 w-full sm:p-4 sm:border-b sm:border-black">
          <Button className="bg-white dark:bg-black min-w-[36px] h-9 max-h-[36px] flex justify-center items-center border border-black dark:border-0 button-svg-theme sm:hidden">
            <ArrowNext />
          </Button>
          <div className="space-content-header-right flex justify-between items-center bg-white dark:bg-black w-full p-[2px] pr-2 sm:pr-0 border sm:border-none border-black dark:border-0">
            <div className="space-content-header-main">
              <div className="w-[30px] h-[30px] sm:w-[32px] sm:h-[32px]">
                <img
                  src={
                    spaceBotInfo?.background || '/assets/botnet-avatar-bg.jpg'
                  }
                  alt="Background preview"
                  className="h-full w-full"
                />
              </div>
              <div>
                <Button
                  onClick={() => setInfoSection(true)}
                  className="space-name p-0 uppercase text-xs text-black dark:text-white font-medium"
                >
                  {spaceName}{' '}
                  {!isInfoSection ? <TriangleDownIcon /> : <TriangleUpIcon />}
                </Button>
                <p className="text-xs text-black dark:text-white leading-3 font-light">
                  20.1k Followers
                </p>
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

            <div className="expand-min-options">
              <Button onClick={fullScreenHandler} className="button-svg-theme">
                {!isFullScreen ? (
                  <ExpandV2Icon className="fill-black dark:fill-white" />
                ) : (
                  <CloseIcon className="fill-black dark:fill-white" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        {isInfoSection && (
          <div className="info-card bg-white dark:bg-black p-2 w-full">
            <div className="flex justify-between">
              <h4 className="text-xs uppercase text-black dark:text-white">
                About
              </h4>
              <Button
                className="text-xs text-black dark:text-white p-0"
                onClick={() => setInfoSection(false)}
              >
                Close
              </Button>
            </div>
            <SpaceDescription text={spaceDescription} />
          </div>
        )}

        {/* Header Buttons */}
        <div className="flex w-full gap-1 sm:border-t sm:border-b sm:border-black sm:p-4">
          <Button className="action-button">
            Chat
          </Button>
          <Button className="action-button">
            <div className="flex justify-center items-top gap-[2px]">
              <span className="w-1 h-1 bg-black dark:bg-white rounded-full relative top-[4.5px] mr-[1px]" />{' '}
              LIVE <span className="align-sub text-[8px]"> 231</span>
            </div>
          </Button>
          <Button
            onClick={() => setGiftSelect(true)}
            className="action-button"
          >
            Gift
          </Button>
        </div>
      </div>

      {/* Create Account component here */}
      <CustomModal
        modalIsOpen={isCreateAccount}
        closeModal={() => setCreateAccount(false)}
        className="modal-center"
      >
        <CreateAccount
          closeHandler={() => setCreateAccount(false)}
          loginHandler={loginToggle}
        />
      </CustomModal>

      <CustomModal
        modalIsOpen={isLoginAccount}
        closeModal={() => setLoginAccount(false)}
        className="modal-center"
      >
        <LoginAccount
          closeHandler={() => setLoginAccount(false)}
          createHandler={registerToggle}
        />
      </CustomModal>

      {/* Desktop Share Sheet */}
      <CustomModal
        modalIsOpen={isDesktopShareModal}
        closeModal={() => setDesktopShareModal(false)}
        className="modal-center"
      >
        <ShareSheet closeHandler={() => setDesktopShareModal(false)} />
      </CustomModal>

      {/* Gift component here */}
      <CustomModal
        modalIsOpen={isGiftSelect}
        closeModal={() => setGiftSelect(false)}
        className="modal-end"
      >
        <GiftCard closeHandler={() => setGiftSelect(false)} />
      </CustomModal>

      <HomeSpace />
    </div>
  );
};

export default SpaceContent;
