'use client';

import InfoSidebar from '../InfoSidebar/InfoSidebar';
import StickyChat from '../Chat/StickyChat';

import UserAvatar from '@/ui/common/UserAvatar';
import dynamic from 'next/dynamic';
import './MainComponent.css';
import AppHeader from '../AppHeader';

const World = dynamic(() => import('@/canvas/World'), { ssr: false });

function MainComponent() {
  return (
    <>
      <div className="main-component flex flex-col w-full fix-screen-overflow">
        <AppHeader />
        <div className="game-screen w-full">
          <div className="world absolute h-full w-full top-0 left-0">
            <World />
          </div>
          <InfoSidebar />
          <UserAvatar className="right-sidebar-user absolute" />
          <StickyChat />
        </div>
      </div>
    </>
  );
}

export default MainComponent;
