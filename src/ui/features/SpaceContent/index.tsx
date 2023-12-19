'use client';

import { useMemo } from 'react';
import { head } from 'lodash';
import { HomeIcon } from '@/icons';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceContentTabEnum } from '@/types';
import { useAppStore } from '@/store/App';

import dynamic from 'next/dynamic';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar/Avatar';
import BotChat from './BotChat';
import SpaceDescription from '../SpaceDescription';

import './SpaceContent.css';

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
        <div className="space-content-header-left">
          <div className="space-content-avatar">
            <Avatar name={head(spaceName)} src={spaceInfo?.image} />
          </div>
        </div>
        <div className="space-content-header-right">
          <p className="space-name">{spaceName}</p>
          <div className="relative flex justify-start items-center p-0 box-border mt-[16px]">
            <Button className="subscribe hidden h-0 w-0">Subscribe</Button>
            <Button className="share" onClick={onSharePage}>
              Share
            </Button>
          </div>
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
        className="space-content-tabs"
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
          {/* <TabsTrigger
            value={SpaceContentTabEnum.world}
            className="space-content-nav-trigger"
          >
            World
          </TabsTrigger> */}
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
