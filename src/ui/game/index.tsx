'use client';

import PhaserProvider from '@/store/PhaserProvider';
import JoystickController from './JoystickController';
import { useEffect } from 'react';
import {
  joystickProviderStoreRef,
  useDirectionStore,
} from '@/store/JoystickProvider';
import './Game.css';

const Game = () => {
  const direction = useDirectionStore(state => state.direction);
  useEffect(() => {
    // Sync React state with store
    joystickProviderStoreRef.setDirection(direction);
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
