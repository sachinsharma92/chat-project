import { RigidBody } from '@react-three/rapier';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import Model from '../Model';
import { CloudShaderMaterial } from './CloudShader';
import { ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { GradientTexture, useTexture } from '@react-three/drei';
import {
  interpolateColor,
  interpolatedSunPosition,
  interpolatedTime,
  night,
  tilt,
} from '@/canvas/Utils';
import {
  bigCloudTexturePath,
  grassTexturePath,
  middleCloudTexturePath,
  smallCloudTexturePath,
} from '@/constants';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      cloudShaderMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

const Environment = () => {
  // Refs
  const ref = useRef<THREE.DirectionalLight>(null);
  const $shader = useRef<THREE.ShaderMaterial>(null);

  // Assets
  const grass = useTexture(grassTexturePath);
  grass.anisotropy = 10;
  grass.colorSpace = THREE.SRGBColorSpace;
  grass.minFilter = THREE.NearestFilter;
  grass.magFilter = THREE.NearestFilter;
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(7, 5);

  const { times } = useControls('time', {
    times: {
      value: 0,
      min: 0,
      max: 24,
      step: 1,
    },
  });

  useEffect(() => {
    if (ref.current) {
      gsap.to(ref.current.color, {
        duration: 3,
        color: interpolateColor(times),
        ease: 'ease.out',
      });
      gsap.to(ref.current.position, {
        duration: 3,
        x: interpolatedSunPosition(times),
        ease: 'ease.out',
      });
    }
  }, [times]);

  const bigCloud = useTexture(bigCloudTexturePath);
  bigCloud.wrapS = bigCloud.wrapT = THREE.RepeatWrapping;
  const mediumCloud = useTexture(middleCloudTexturePath);
  mediumCloud.wrapS = mediumCloud.wrapT = THREE.RepeatWrapping;
  const smallCloud = useTexture(smallCloudTexturePath);
  smallCloud.wrapS = smallCloud.wrapT = THREE.RepeatWrapping;

  useFrame((_, delta) => {
    if ($shader.current) {
      $shader.current.uniforms.uTime.value += delta;
    }
  });

  const {
    skyColor,
    cloudColor,
    smallNoise,
    mediumNoise,
    largeNoise,
    sunColor,
    uvScale,
    edgeColor,
  } = useControls('clouds', {
    skyColor: {
      value: '#80B6F3',
    },
    cloudColor: {
      value: '#ffffff',
    },
    sunColor: {
      value: '#a6a6a4',
    },
    edgeColor: {
      value: '#ffffff',
    },
    smallNoise: {
      value: 16.0 * 4,
      min: 0.0,
      max: 100.0,
    },
    mediumNoise: {
      value: 0.25 * 4,
      min: 0.0,
      max: 2.0,
    },
    largeNoise: {
      value: 0.1 * 4,
      min: 0.0,
      max: 1.0,
    },
    uvScale: {
      value: 4.0,
      min: 0.0,
      max: 10.0,
    },
  });

  return (
    <>
      <directionalLight
        ref={ref}
        castShadow
        color={interpolateColor(times)}
        intensity={2}
        position={[6, 10, 7]}
        shadow-camera-near={-1}
        shadow-camera-far={100}
        shadow-camera-top={30}
        shadow-camera-right={30}
        shadow-camera-left={-30}
        shadow-camera-bottom={-30}
        shadow-mapSize-width={1024 * 3}
        shadow-mapSize-height={1024 * 3}
        shadow-bias={-0.001}
        shadow-normalBias={0.01}
      />
      <ambientLight intensity={interpolatedTime(times) === night ? 0.2 : 0.6} />

      <RigidBody type="fixed" rotation={[tilt, 0, 0]} position={[0, -1.3, 0]}>
        <mesh name="floor" receiveShadow position={[0, -0.968, 0]}>
          <boxGeometry args={[50, 2, 30]} />
          <meshToonMaterial map={grass} />
        </mesh>
      </RigidBody>

      <mesh
        scale={3.7}
        rotation={[-Math.PI / 2 + 0.2, 0, 0]}
        position={[0.15, -0.14, -5.3]}
      >
        <circleGeometry />
        <meshToonMaterial opacity={0.1} transparent color="#a0dcac" />
      </mesh>
      {/* cloud */}
      <mesh>
        <sphereGeometry args={[50]} />
        <cloudShaderMaterial
          transparent
          side={THREE.BackSide}
          ref={$shader}
          // @ts-ignore
          uCloudTexture={bigCloud}
          uMNoise={mediumCloud}
          uLNoise={mediumCloud}
          uSNoise={smallCloud}
          key={CloudShaderMaterial.key}
          uSmall={smallNoise}
          uMedium={mediumNoise}
          uLarge={largeNoise}
          uCloudColor={cloudColor}
          uSkyColor={skyColor}
          uSunColor={sunColor}
          uvScale={uvScale}
          uEdgeColor={edgeColor}
        />
      </mesh>
      {/* skydome */}
      <mesh>
        <sphereGeometry args={[51, 16, 16]} />
        <meshBasicMaterial fog={false} side={THREE.BackSide}>
          <GradientTexture
            stops={[0.35, 0.4, 0.45, 0.5, 0.55]}
            colors={interpolatedTime(times)}
          />
        </meshBasicMaterial>
      </mesh>
      <Suspense fallback={null}>
        <group position={[-0.5, 0, -6.4]} rotation-x={tilt} scale={1.3}>
          <Model />
        </group>
      </Suspense>
    </>
  );
};

export default Environment;
