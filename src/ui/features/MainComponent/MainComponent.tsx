'use client';

import StickyChat from '../Chat/StickyChat';
import dynamic from 'next/dynamic';
import './MainComponent.css';
import AppNavigation from '../AppNavigation';
import { useEffect } from 'react';

const World = dynamic(() => import('@/canvas/World'), { ssr: false });
const InfoSidebar = dynamic(
  () => import('@/ui/features/InfoSidebar/InfoSidebar'),
  {
    ssr: false,
  },
);

function MainComponent() {
  /**
   * Record entry time to check duration(in seconds)-
   *  it'll take to fully load 3D world
   */
  useEffect(() => {
    // @ts-ignore
    if (!window?.entryTimestamp) {
      // @ts-ignore
      window.entryTimestamp = Date.now();
    }
  }, []);

  return (
    <div className="main-component flex flex-col w-full fix-screen-overflow">
      <AppNavigation />
      <div className="game-screen w-full">
        <div className="world absolute h-full w-full top-0 left-0">
          <World />
        </div>
        <StickyChat />
        <InfoSidebar />
      </div>
    </div>
  );
}

export default MainComponent;
