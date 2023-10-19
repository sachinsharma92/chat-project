'use client';

import StickyChat from '../Chat/StickyChat';
import dynamic from 'next/dynamic';
import AppNavigation from '../AppNavigation';
import Bulletin from '../Bulletin';
import Configurator from '@/ui/avatar/Configurator';

import './MainComponent.css';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';

const InfoSidebar = dynamic(
  () => import('@/ui/features/InfoSidebar/InfoSidebar'),
  {
    ssr: false,
  },
);

const Avatar = dynamic(() => import('@/ui/avatar'), {
  ssr: false,
});

// const Game = dynamic(() => import('@/ui/game'), {
//   ssr: false,
// });

const MainComponent = () => {
  const { availableWidth } = useWindowResize();
  return (
    <div className="main-component flex w-full fix-screen-overflow">
      <AppNavigation />

      <div className="info-side-bar-container">
        <InfoSidebar />
      </div>

      <div className="game-screen">
        <Configurator />
        <div className="world">
          <Avatar />
        </div>
      </div>

      <div className="bulletin-container">
        <Bulletin />
      </div>

      {availableWidth < mobileWidthBreakpoint && <StickyChat />}
    </div>
  );
};

export default MainComponent;
