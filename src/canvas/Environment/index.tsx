import { RigidBody } from '@react-three/rapier';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import Model from '../Model';
import { tilt, useAsset, useSkyboxStore } from '@/store/CanvasProvider';
import { CloudShaderMaterial } from './CloudShader';
import { ReactThreeFiber, useFrame } from '@react-three/fiber';

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
  const ref = useRef<THREE.DirectionalLight>(null);
  const $shader = useRef<THREE.ShaderMaterial>(null);
  const grass = useAsset('grass');
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(25, 15);
  const baseColor = '#ffffff';
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
        x: isNight ? -6 : 6,
        ease: 'ease.out',
      });
    }
  }, [isNight]);

  const bigCloud = useAsset('bigcloud');
  bigCloud.wrapS = bigCloud.wrapT = THREE.RepeatWrapping;
  const mediumCloud = useAsset('mediumcloud');
  mediumCloud.wrapS = mediumCloud.wrapT = THREE.RepeatWrapping;
  const smallCloud = useAsset('smallcloud');
  smallCloud.wrapS = smallCloud.wrapT = THREE.RepeatWrapping;

  useFrame((_, delta) => {
    if ($shader.current) {
      $shader.current.uniforms.uTime.value += delta;
    }
  });

  // const { timezone } = useControls('Skybox', {
  //   setNight: {
  //     value: false,
  //     onChange: () => {
  //       setNight();
  //     },
  //   },
  // });

  return (
    <>
      <directionalLight
        ref={ref}
        castShadow
        color={isNight ? targetColor : baseColor}
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
      <ambientLight intensity={isNight ? 0.2 : 0.5} />

      <RigidBody type="fixed" rotation={[tilt, 0, 0]} position={[0, -0.6, 0]}>
        <mesh name="floor" receiveShadow position={[0, -0.968, 0]}>
          <boxGeometry args={[50, 2, 30]} />
          <meshStandardMaterial map={grass} />
        </mesh>
      </RigidBody>

      <mesh
        scale={2.9}
        rotation={[-Math.PI / 2 + 0.1, 0, 0]}
        position={[0.15, -0.4, -1.1]}
      >
        <circleGeometry />
        <meshStandardMaterial
          // @ts-ignore
          opacity="0.13"
          transparent
          color="#a0dcac"
        />
      </mesh>

      {/* cloud */}
      <mesh>
        <sphereGeometry args={[30]} />
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
        />
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
