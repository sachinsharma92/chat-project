import React, { useEffect, useRef } from 'react';
import { LoadingMaterial } from './LoadingMaterial';
import { useProgress } from '@react-three/drei';
import { ReactThreeFiber, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { useWorldStore } from '@/store/CanvasProvider';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      loadingMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

const LoadingReveal = () => {
  const $shader = useRef<THREE.ShaderMaterial>(null);
  const $mesh = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();
  const { start }: any = useWorldStore();

  let width = 2;
  let height = 2;

  useEffect(() => {
    if (progress === 100) {
      start();
      setTimeout(() => {
        if ($shader.current) {
          gsap.to($shader.current.uniforms.uScale, {
            value: 7,
            duration: 8,
            ease: 'slow',
          });
          gsap.to($shader.current.uniforms.uAlpha, {
            value: 0,
            duration: 8,
            ease: 'ease.out',
          });
        }
      }, 1000);
    }
  }, [progress, start]);

  useFrame((_, delta) => {
    if ($shader.current) {
      $shader.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <>
      <mesh ref={$mesh}>
        <planeGeometry args={[width, height]} />
        <loadingMaterial ref={$shader} key={LoadingMaterial.key} transparent />
      </mesh>
    </>
  );
};

export default LoadingReveal;
