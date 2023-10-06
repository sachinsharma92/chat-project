'use client';

import Phaser from 'phaser';
import { create } from 'zustand';
import { ReactNode, useEffect, useRef } from 'react';
import { isFunction } from 'lodash';
import { IPhaserGameState } from '@/types';
import { HomeScene } from '@/ui/game/scenes/HomeScene';
import { MapScene } from '@/ui/game/scenes/MapScene';
import { useWorldStore } from './CanvasProvider';

export const usePhaserStore = create<IPhaserGameState>(set => ({
  phaserGame: null,
  setPhaserGame: phaserGame => {
    if (phaserGame) {
      return set({ phaserGame });
    }
  },
}));

export const getPhaserWidth = () => {
  try {
    return window.innerWidth < 720 ? window.innerWidth : window.innerWidth - 70;
  } catch {
    return 0;
  }
};

const PhaserProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const init = useRef(false);
  const [setPhaserGame] = usePhaserStore(state => [state?.setPhaserGame]);
  const { start } = useWorldStore();

  useEffect(() => {
    if (!init?.current && isFunction(setPhaserGame)) {
      const phaserConfig: Phaser.Types.Core.GameConfig = {
        height: window.innerHeight,
        width: getPhaserWidth(),
        type: Phaser.AUTO,
        antialias: true,
        antialiasGL: true,
        backgroundColor: '#ede6d4', // || '#f3f3f3',
        scale: {
          autoCenter: Phaser.Scale.CENTER_BOTH,
          parent: 'phaser-container',
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 0 },
          },
        },
        scene: [MapScene, HomeScene],
      };

      const game = new Phaser.Game(phaserConfig);
      game.scene.start('MapScene');
      setPhaserGame(game);

      if (isFunction(start)) {
        start();
      }
    }
  }, [setPhaserGame, start]);

  return <>{children}</>;
};

export default PhaserProvider;
