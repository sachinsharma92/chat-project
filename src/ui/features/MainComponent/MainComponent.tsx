'use client';

import StickyChat from '../Chat/StickyChat';
import dynamic from 'next/dynamic';
import AppNavigation from '../AppNavigation';
import MediaPlayer from '../MediaPlayer';
import Bulletin from '../Bulletin';
import { useAppStore } from '@/store/Spaces';
import './MainComponent.css';
import Configurator from '@/ui/avatar/Configurator';

const InfoSidebar = dynamic(
  () => import('@/ui/features/InfoSidebar/InfoSidebar'),
  {
    ssr: false,
  },
);

// const Game = dynamic(() => import('@/ui/game'), {
//   ssr: false,
// });

const Avatar = dynamic(() => import('@/ui/avatar'), {
  ssr: false,
});

const MainComponent = () => {
  const [expandBulletinSidebar] = useAppStore(state => [
    state.expandBulletinSidebar,
  ]);

  return (
    <div className="main-component flex w-full fix-screen-overflow">
      <AppNavigation />

      <div className="info-side-bar-container">
        <InfoSidebar />
      </div>

      <div className="game-screen">
          <Configurator />
        <div className="world">
          {/* <Game /> */}
          <Avatar />
        </div>
        <MediaPlayer />
        {!expandBulletinSidebar && <StickyChat />}
      </div>

      <div className="bulletin-container">
        <Bulletin />
      </div>
    </div>
  );
};

export default MainComponent;
