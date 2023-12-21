'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { HomeIcon, VerifyIcon, VolumeIcon } from '@/icons';
import { useAppStore } from '@/store/App';
import { SpaceContentTabEnum } from '@/types';
import { head } from 'lodash';
import { useMemo } from 'react';

import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button';
import dynamic from 'next/dynamic';
import SpaceDescription from '../SpaceDescription';
import BotChat from './BotChat';

import { Heart, StarIcon } from 'lucide-react';
import './SpaceContent.css';
import { StarFilledIcon } from '@radix-ui/react-icons';

const HomeSpace = dynamic(() => import('./HomeSpace'), { ssr: false });

const SpaceContent = () => {
  const { spaceInfo } = useSelectedSpace();

  const [spaceContentTab, setSpaceContentTab] = useAppStore(state => [
    state.spaceContentTab,
    state.setSpaceContentTab,
  ]);

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

  const onSharePage = () => {
    // pop up share
    if (navigator?.share) {
      const title = `Botnet -${spaceName}`;
      navigator.share({ title, text: title, url: `${window.location.href}` });
    }
  };

  return (
    <div className="space-content-container">
      <div className="space-content-header">
        {/* <div className="space-content-header-left">
          <div className="space-content-avatar">
            <Avatar name={head(spaceName)} src={spaceInfo?.image} />
          </div>
        </div> */}
        <div className="space-content-header-right flex justify-between items-center bg-red w-full">
          <div className='space-content-header-main'>
            <p className="space-name">{spaceName}</p>
            <Button className="volumeIcon"><VolumeIcon /></Button>
            <Button className="VerifyIcon"><VerifyIcon /></Button>
          </div>
          <Button className="subscribe"><Heart size={18} /></Button>
          {/* <div className="relative flex justify-start items-center p-0 box-border ">
            <Button className="share" onClick={onSharePage}>
              Share
            </Button>
          </div> */}
        </div>
      </div>

      <div className="space-content-header-mobile">
        <div className="space-content-header-mobile-creator">
          <div className="space-content-avatar">
            <Avatar
              height={40}
              width={40}
              name={head(spaceName)}
              src={spaceInfo?.image}
            />
          </div>
          <p className="space-name">{spaceName}</p>
        </div>
        <Button className="subscribe space-content-header-mobile-subscribe">
          Subscribe
        </Button>
      </div>

      <div className="space-description-mobile">
        <SpaceDescription text={spaceDescription} />
      </div>

      <Tabs
        defaultValue="home"
        className="space-content-tabs shadow-none"
        value={spaceContentTab}
        onValueChange={v => {
          setSpaceContentTab(v as SpaceContentTabEnum);
        }}
      >
        <TabsList className="space-content-nav">
          <TabsTrigger
            value={SpaceContentTabEnum.home}
            className="space-content-nav-trigger"
          >
            <HomeIcon />
          </TabsTrigger>
          <TabsTrigger
            value={SpaceContentTabEnum.chat}
            className="space-content-nav-trigger"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value={SpaceContentTabEnum.reviews}
            className="space-content-nav-trigger"
          >
            Reviews <div className='review-sec'><StarFilledIcon /> 4.7 <span> (123)</span></div>
          </TabsTrigger>
          <TabsTrigger
            value={SpaceContentTabEnum.pastChats}
            className="space-content-nav-trigger"
          >
            Past Chats
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={SpaceContentTabEnum.home}
          className="space-content-tabs-content box-border mt-[24px] w-full"
        >
          <HomeSpace />
        </TabsContent>
        <TabsContent
          value={SpaceContentTabEnum.chat}
          className="space-content-tabs-content box-border mt-[24px] w-full"
        >
          <BotChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SpaceContent;
