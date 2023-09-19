'use client';

import StickyChat from '../Chat/StickyChat';
import dynamic from 'next/dynamic';
import cx from 'classnames';
import AppNavigation from '../AppNavigation';
import { useEffect } from 'react';
import MediaPlayer from '../MediaPlayer';
import Bulletin from '../Bulletin';
import { useAppStore } from '@/store';
import './MainComponent.css';

const World = dynamic(() => import('@/canvas/World'), { ssr: false });
const InfoSidebar = dynamic(
  () => import('@/ui/features/InfoSidebar/InfoSidebar'),
  {
    ssr: false,
  },
);

function MainComponent() {
  const [expandBulletinSidebar] = useAppStore(state => [
    state.expandBulletinSidebar,
  ]);

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
    <div className="main-component flex w-full fix-screen-overflow">
      <AppNavigation />
      <div
        className={cx('game-screen', {
          'game-screen-bulletin-expanded': expandBulletinSidebar,
        })}
      >
        <div className="world absolute h-full w-full top-0 left-0">
          <World />
        </div>
        <MediaPlayer />
        <StickyChat />
        <InfoSidebar />
      </div>
      <Bulletin />
    </div>
  );
}

export default MainComponent;
