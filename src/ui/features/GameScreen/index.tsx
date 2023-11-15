import dynamic from 'next/dynamic';
import './GameScreen.css';
import GameScreenBotChat from './GameScreenBotChat';

const ThreeJSComponent = dynamic(() => import('@/ui/three'), {
  ssr: false,
});

// const Game = dynamic(() => import('@/ui/game'), {
//   ssr: false,
// });

const GameScreen = (props: { hideBotChat?: boolean }) => {
  const { hideBotChat } = props;

  return (
    <div className="relative w-full h-full top-0 p-0 box-border">
      <div className="world">
        <canvas className="game-canvas">
          <ThreeJSComponent />
        </canvas>
      </div>

      {!hideBotChat && <GameScreenBotChat />}
    </div>
  );
};

export default GameScreen;
