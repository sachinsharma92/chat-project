'use client';

import PhaserProvider from '@/store/PhaserProvider';
import './Game.css';
import JoystickController from './JoystickController';
import { useEffect } from 'react';
import { store, useDirectionStore } from '@/store/JoystickProvider';

const Game = () => {
  const direction = useDirectionStore(state => state.direction);
  useEffect(() => {
    // Sync React state with store
    store.setDirection(direction);
  }, [direction]);
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
