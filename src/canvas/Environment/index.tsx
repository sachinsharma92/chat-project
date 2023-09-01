import { RigidBody } from '@react-three/rapier';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import Model from '../Model';
import { useAsset, useSkyboxStore } from '@/store/CanvasProvider';

const Environment = () => {
  const ref = useRef<THREE.DirectionalLight>(null);
  const grass = useAsset('grass');
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(35, 15);
  const baseColor = '#f8c08a';
  const targetColor = '#3575a3';

  const isNight = useSkyboxStore(state => state.isNight);

  useEffect(() => {
    if (ref.current) {
      gsap.to(ref.current.color, {
        duration: 3,
        color: isNight ? targetColor : baseColor,
        ease: 'ease.out',
      });
      gsap.to(ref.current.position, {
        duration: 3,
        x: isNight ? -2.8 : 2.8,
        ease: 'ease.out',
      });
    }
  }, [isNight]);



  return (
    <>
      {/* <fog
        attach="fog"
        color={isNight ? "#99AEBB" : 0xf0f0f0}
        near={3}
        far={25}
      /> */}
      <directionalLight
        ref={ref}
        castShadow
        color={isNight ? targetColor : baseColor}
        intensity={2}
        position={[2.8, 7.3, 4]}
        shadow-camera-near={-1}
        shadow-camera-far={100}
        shadow-camera-top={30}
        shadow-camera-right={30}
        shadow-camera-left={-30}
        shadow-camera-bottom={-30}
        shadow-mapSize-width={1024 * 2}
        shadow-mapSize-height={1024 * 2}
        shadow-bias={-0.001}
        shadow-normalBias={0.1}
      />
      <RigidBody type="fixed">
        <mesh name="floor" receiveShadow position={[0, -0.968, 0]}>
          <boxGeometry args={[50, 2, 30]} />
          <meshStandardMaterial map={grass} />
        </mesh>
      </RigidBody>

      <Suspense fallback={null}>
        <group position={[-0.5, 0, -6.4]} scale={1.3}>
          <Model />
        </group>
      </Suspense>
    </>
  );
};

export default Environment;
