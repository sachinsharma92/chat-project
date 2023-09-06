'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import LoadingReveal from '../LoadingReveal';
import Scene from '../Scene';
import useAssetLoader from '@/hooks/useAssetLoader';
import {
  EffectComposer,
  SMAA,
  BrightnessContrast,
} from '@react-three/postprocessing';
import { Perf } from 'r3f-perf';
import { useHotkeys } from 'react-hotkeys-hook';
import { useState } from 'react';

const World = () => {
  useAssetLoader();

  const [showThreeJsPerformance, setShowThreeJsPerformance] = useState(false);

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
        camera={{
          fov: 50,
          position: [0, 4, 6],
          rotation: [THREE.MathUtils.degToRad(-25), 0, 0],
        }}
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
          <BrightnessContrast brightness={0.15} contrast={0.3} />
          <SMAA />
        </EffectComposer>
      </Canvas>
    </>
  );
};

export default World;
