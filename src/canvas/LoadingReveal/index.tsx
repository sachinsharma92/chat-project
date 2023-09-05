import React, { useEffect, useRef } from 'react';
import { LoadingMaterial } from './LoadingMaterial';
import { useProgress, useTexture } from '@react-three/drei';
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
  const { start } = useWorldStore();

  const [tex1, tex2] = useTexture([
    '/assets/textures/one.jpg',
    '/assets/textures/two.jpg',
  ]);

  useEffect(() => {
    if (progress === 100) {
      start();
      if ($shader.current) {
        gsap.to($shader.current?.uniforms.uProgress, {
          value: 1,
          duration: 3,
          ease: 'power4.out',
        });
      }
      setTimeout(() => {
        if ($shader.current) {
          gsap.to($shader.current.uniforms.uScale, {
            value: 10,
            duration: 8,
            ease: 'slow',
          });
          gsap.to($shader.current.uniforms.uAlpha, {
            value: 0,
            duration: 8,
            ease: 'ease.out',
          });
        }
      }, 2000);
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
        <planeGeometry args={[2, 2]} />
        <loadingMaterial
          ref={$shader}
          key={LoadingMaterial.key}
          transparent
          //@ts-ignore
          uTexture={tex1}
          uImageRes={[tex1.source.data.width, tex1.source.data.height]}
          uTexture2={tex2}
        />
      </mesh>
    </>
  );
};

export default LoadingReveal;
