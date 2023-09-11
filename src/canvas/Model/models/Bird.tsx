import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import { useAsset } from '@/store/CanvasProvider';
import { birdModelPath } from '@/contants';

type GLTFResult = GLTF & {
  nodes: {
    bird: THREE.Mesh;
    bird001: THREE.Mesh;
    bird002: THREE.Mesh;
    bird003: THREE.Mesh;
  };
  materials: {
    bird: THREE.MeshStandardMaterial;
  };
};

export default function Bird(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const model = useAsset('bird');
  const { nodes, materials, animations } = model as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (actions && actions['fly']) {
      actions['fly'].play();
    }
  }, [actions]);

  //* Birds path
  const [birdPosition, setBirdPosition] = useState(0);
  const curvePoints: THREE.Vector3[] = [];
  const radius = 12;
  const numPoints = 10;

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / (numPoints - 1)) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = 3;
    const z = 2 - Math.sin(angle) * radius;
    curvePoints.push(new THREE.Vector3(x, y, z));
  }

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(curvePoints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((_, delta) => {
    if (group.current && curve) {
      setBirdPosition(prevPosition => prevPosition + 0.05 * delta);
      if (birdPosition > 1) {
        setBirdPosition(0);
      }
      group.current.position.copy(curve.getPointAt(birdPosition));
      group.current.rotation.y = Math.atan2(
        curve.getTangentAt(birdPosition).x,
        curve.getTangentAt(birdPosition).z,
      );
    }
  });

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <mesh
            castShadow
            receiveShadow
            name="bird"
            geometry={nodes.bird.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird.morphTargetDictionary}
            morphTargetInfluences={nodes.bird.morphTargetInfluences}
            position={[-0.07, 0.18, 0.54]}
            scale={[0.04, 0.01, 0.04]}
          />
          <mesh
            castShadow
            receiveShadow
            name="bird001"
            geometry={nodes.bird001.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird001.morphTargetDictionary}
            morphTargetInfluences={nodes.bird001.morphTargetInfluences}
            position={[-0.31, -0.01, -0.16]}
            scale={[0.04, 0.01, 0.04]}
          />
          <mesh
            castShadow
            receiveShadow
            name="bird002"
            geometry={nodes.bird002.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird002.morphTargetDictionary}
            morphTargetInfluences={nodes.bird002.morphTargetInfluences}
            position={[0.11, 0.13, -0.64]}
            scale={[0.04, 0.01, 0.04]}
          />
          <mesh
            castShadow
            receiveShadow
            name="bird003"
            geometry={nodes.bird003.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird003.morphTargetDictionary}
            morphTargetInfluences={nodes.bird003.morphTargetInfluences}
            position={[0.36, -0.06, 0.26]}
            scale={[0.04, 0.01, 0.04]}
          />
        </group>
      </group>
    </>
  );
}

useGLTF.preload(birdModelPath);
