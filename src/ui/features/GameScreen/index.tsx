'use client';

import { useAppStore } from '@/store/App';
import { SpaceContentTabEnum } from '@/types';
import dynamic from 'next/dynamic';
import GameScreenBotChat from './GameScreenBotChat';

import './GameScreen.css';

const ThreeJSComponent = dynamic(() => import('@/ui/three'), {
  ssr: false,
});

// const Game = dynamic(() => import('@/ui/game'), {
//   ssr: false,
// });

const GameScreen = (props: { hideBotChat?: boolean }) => {
  const [spaceContentTab] = useAppStore(state => [state.spaceContentTab]);
  const { hideBotChat } = props;

  return (
    <div className="relative w-full h-full top-0 p-0 box-border">
      <div className="world">
        {spaceContentTab !== SpaceContentTabEnum.world && (
          <canvas className="game-canvas">
            <ThreeJSComponent />
          </canvas>
        )}
        {
          /** TODO RENDER 2D game here  */
          spaceContentTab === SpaceContentTabEnum.world && <></>
        }
      </div>

      {!hideBotChat && <GameScreenBotChat />}
    </div>
  );
};

export default GameScreen;
