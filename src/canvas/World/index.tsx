'use client';

import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import LoadingReveal from '../LoadingReveal';
import Scene from '../Scene';
import useAssetLoader from '@/hooks/useAssetLoader';

const World = () => {
  useAssetLoader();
  return (
    <>
      <Canvas
        camera={{
          fov: 55,
          position: [0, 4, 10],
          rotation: [THREE.MathUtils.degToRad(-25), 0, 0],
        }}
        gl={{
          antialias: false,
          toneMappingExposure: 1.2,
          toneMapping: THREE.CineonToneMapping,
        }}
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <color attach="background" args={['#87CEEB']} />
        <Scene />
        <Environment preset="sunset" />
        <LoadingReveal />
      </Canvas>
    </>
  );
};

export default World;
