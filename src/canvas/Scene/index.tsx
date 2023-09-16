import { Physics } from '@react-three/rapier';
import InputProvider from '../Game/InputProvider';
import Environment from '../Environment';
import Multiplayer from '../Multiplayer';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import { useControls } from 'leva';

const Scene = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { position, rotation, fov } = useControls('Camera', {
    position: {
      value: [0, 4, 4],
      step: 0.1,
    },
    rotation: {
      value: [THREE.MathUtils.degToRad(-25), 0, 0],
      step: 0.01,
    },
    fov: {
      value: 50,
      min: 0,
      max: 100,
      step: 1,
    },
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={position}
        fov={fov}
        rotation={rotation}
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
