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

const World = () => {
  useAssetLoader();
  const [showThreeJsPerformance, setShowThreeJsPerformance] = useState(false);
  const setDirection = useDirectionStore(state => state.setDirection);

  useHotkeys(
    'cmd+.,ctrl+.',
    () => {
      setShowThreeJsPerformance(!showThreeJsPerformance);
    },
    { enabled: true },
  );

  return (
    <>
      <Canvas
        gl={{
          antialias: false,
        }}
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        {showThreeJsPerformance && <Perf />}
        <Scene />
        <LoadingReveal />
        <EffectComposer multisampling={0} autoClear={false}>
          <BrightnessContrast brightness={0.15} contrast={0.4} />
          <SMAA />
        </EffectComposer>
      </Canvas>
      <div className="absolute bottom-5 left-10">
        <Joystick
          baseColor="gray"
          stickColor="white"
          size={100}
          stickSize={50}
          move={e => setDirection(e)}
          stop={e => setDirection(e)}
        />
      </div>
    </>
  );
};

export default World;
