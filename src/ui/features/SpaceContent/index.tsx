import { useMemo, useState } from 'react';
import { head } from 'lodash';
import { HomeIcon } from '@/icons';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar/Avatar';
import HomeSpace from './HomeSpace';
import BotChat from './BotChat';

import './SpaceContent.css';
import SpaceDescription from '../SpaceDescription';

export enum SpaceContentTabEnum {
  'chat' = 'chat',
  'world' = 'world',
  'home' = 'home',
}

const SpaceContent = () => {
  const { spaceInfo } = useSelectedSpace();

  const spaceName = useMemo(
    () => spaceInfo?.spaceName || spaceInfo?.host?.displayName || 'Botnet',
    [spaceInfo],
  );

  const [spaceContentTab, setSpaceContentTab] = useState<
    SpaceContentTabEnum | string
  >(SpaceContentTabEnum.home);

  const spaceDescription = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);

    return (
      spaceBotInfo?.description ||
      spaceInfo?.description ||
      'Welcome to Botnet!'
    );
  }, [spaceInfo]);

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
            <Button className="subscribe">Subscribe</Button>
            <Button className="share">Share</Button>
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
          setSpaceContentTab(v);
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
            value={SpaceContentTabEnum.world}
            className="space-content-nav-trigger"
          >
            World
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={SpaceContentTabEnum.home}
          className="space-content-tabs-content box-border mt-[24px] w-full"
        >
          <HomeSpace setSpaceContentTab={t => setSpaceContentTab(t)} />
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
