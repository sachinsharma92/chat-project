'use client';

import PhaserProvider from '@/store/PhaserProvider';
import JoystickController from './JoystickController';
import './Game.css';

const Game = () => {
  return (
    <>
      <PhaserProvider>
        <div id="phaser-container"></div>
      </PhaserProvider>
      <JoystickController />
    </>
  );
};

export default Game;
