'use client';

import PhaserProvider from '@/store/PhaserProvider';
import './Game.css';

const Game = () => {
  return (
    <PhaserProvider>
      <div id="phaser-container"></div>
    </PhaserProvider>
  );
};

export default Game;
