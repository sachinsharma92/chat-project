'use client';

import { Canvas } from '@react-three/fiber';
import LoadingReveal from '../LoadingReveal';
import Scene from '../Scene';
import useAssetLoader from '@/hooks/useAssetLoader';
import {
  EffectComposer,
  SMAA,
  BrightnessContrast,
} from '@react-three/postprocessing';
import { useState } from 'react';
import { Perf } from 'r3f-perf';
import { useHotkeys } from 'react-hotkeys-hook';
import { Joystick } from 'react-joystick-component';
import { useDirectionStore } from '@/store';
import { Leva } from 'leva';

const World = () => {
  useAssetLoader();

  const [adminPanelControls, setAdminPanelControls] = useState({
    showLevaControls: false,
    showThreeJsPerformance: false,
  });
  const setDirection = useDirectionStore(state => state.setDirection);

  useHotkeys(
    'cmd+.,ctrl+.',
    () => {
      setAdminPanelControls({
        ...adminPanelControls,
        showThreeJsPerformance: !adminPanelControls?.showThreeJsPerformance,
      });
    },
    { enabled: true },
  );

  useHotkeys(
    'cmd+/,ctrl+/',
    () => {
      setAdminPanelControls({
        ...adminPanelControls,
        showLevaControls: !adminPanelControls?.showLevaControls,
      });
    },
    { enabled: true },
  );

  return (
    <>
      <Leva collapsed hidden={!adminPanelControls?.showLevaControls} />
      <Canvas
        gl={{
          antialias: false,
        }}
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {adminPanelControls?.showThreeJsPerformance && <Perf />}
        <Scene />
        <LoadingReveal />
        <EffectComposer multisampling={0} autoClear={false}>
          <BrightnessContrast brightness={0.15} contrast={0.4} />
          <SMAA />
        </EffectComposer>
      </Canvas>
      <div className="absolute bottom-2 left-2">
        <Joystick
          baseColor="gray"
          stickColor="white"
          size={112}
          stickSize={50}
          move={e => setDirection(e)}
          stop={e => setDirection(e)}
        />
      </div>
    </>
  );
};

export default World;
