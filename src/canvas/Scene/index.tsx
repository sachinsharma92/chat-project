import { Physics } from '@react-three/rapier';
import InputProvider from '../Game/InputProvider';
import Environment from '../Environment';
import Player from '../Game/Player';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';

const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (window.innerWidth > window.innerHeight) {
      // Landscape
      if (cameraRef.current) {
        cameraRef.current.fov = 50;
      }
    } else {
      // Portrait
      if (cameraRef.current) {
        cameraRef.current.fov = 70;
        cameraRef.current.position.z = 4;
      }
    }
  });
  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 4, 6]}
        fov={50}
        rotation={[THREE.MathUtils.degToRad(-25), 0, 0]}
      />
      <Physics>
        <InputProvider>
          <group ref={groupRef} position={[0, -1, -1]}>
            <Environment />
          </group>
          <Player />
        </InputProvider>
      </Physics>
    </>
  );
};

export default Scene;
