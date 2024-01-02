'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ExpandV2Icon, HomeIcon, UnionIcon } from '@/icons';
import { useAppStore } from '@/store/App';
import { SpaceContentTabEnum } from '@/types';
import { head } from 'lodash';
import { useMemo } from 'react';

import Button from '@/components/common/Button';
import dynamic from 'next/dynamic';
import SpaceDescription from '../SpaceDescription';

import { StarFilledIcon } from '@radix-ui/react-icons';
import './SpaceContent.css';

const BotChat = dynamic(() => import('./BotChat'));

const HomeSpace = dynamic(() => import('./HomeSpace'), { ssr: false });

const SpaceContent = () => {
  const { spaceInfo } = useSelectedSpace();


  const [spaceContentTab, setSpaceContentTab] = useAppStore(state => [
    state.spaceContentTab,
    state.setSpaceContentTab,
  ]);

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
    <div className="space-content-container">
      <div className="space-content-header">
        <div className="space-content-header-right flex justify-between items-center bg-black w-full pr-2 pl-[2px]">
          <div className='space-content-header-main'>
            <div className="w-8 h-8 overflow-hidden">
              <img
                src={spaceBotInfo?.background || '/assets/botnet-avatar-bg.jpg'}
                alt="Background preview"
              />
            </div>
            <div>
              <p className="space-name">{spaceName}</p>
              <p className="text-xs text-white">20.1k Followers</p>
            </div>
          </div>
          <Button className="subscribe">Follow</Button>
        </div>

        <div className='flex gap-1'>
          <div className='share-button-style'>
            <Button>
              <UnionIcon />
            </Button>
          </div>

          <div className="expand-min-options">
            <Button>
              <ExpandV2Icon />
            </Button>
          </div>
        </div>
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
        </TabsList >
        <TabsContent
          value={SpaceContentTabEnum.home}
          className="space-content-tabs-content box-border mt-[40px] w-full"
        >
          <HomeSpace />
        </TabsContent>
        <TabsContent
          value={SpaceContentTabEnum.chat}
          className="space-content-tabs-content box-border mt-[40px] w-full"
        >
          <BotChat />
        </TabsContent>
      </Tabs >
    </div >
  );
};

export default SpaceContent;
