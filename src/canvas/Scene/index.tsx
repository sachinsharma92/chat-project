import { Physics } from '@react-three/rapier';
import InputProvider from '../Game/InputProvider';
import Environment from '../Environment';
import Multiplayer from '../Multiplayer';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
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
        cameraRef.current.position.z = 4;
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
        position={[0, 3, 4]}
        fov={50}
        rotation={[THREE.MathUtils.degToRad(-20), 0, 0]}
      />
      <Physics>
        <InputProvider>
          <group ref={groupRef} position={[0, -2, -2]}>
            <Environment />
          </group>
          <Multiplayer />
        </InputProvider>
      </Physics>
    </>
  );
};

export default Scene;
