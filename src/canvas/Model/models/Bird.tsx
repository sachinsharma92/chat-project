import * as THREE from 'three';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useFrame } from '@react-three/fiber';
import { birdModelPath } from '@/constants';

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
  const { nodes, materials, animations } = useGLTF(birdModelPath) as GLTFResult;
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
      let newPosition = birdPosition + 0.02 * delta;
      if (newPosition > 1) {
        newPosition = 0;
      }
      setBirdPosition(newPosition);
      group.current.position.copy(curve.getPointAt(newPosition));
      group.current.rotation.y = Math.atan2(
        curve.getTangentAt(newPosition).x,
        curve.getTangentAt(newPosition).z,
      );
    }
  });

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <group>
          <mesh
            name="bird"
            castShadow
            receiveShadow
            geometry={nodes.bird.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird.morphTargetDictionary}
            morphTargetInfluences={nodes.bird.morphTargetInfluences}
            position={[-0.07, 0.18, 0.54]}
            scale={[0.04, 0.01, 0.04]}
          />
          <mesh
            name="bird001"
            castShadow
            receiveShadow
            geometry={nodes.bird001.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird001.morphTargetDictionary}
            morphTargetInfluences={nodes.bird001.morphTargetInfluences}
            position={[-0.31, -0.01, -0.16]}
            scale={[0.04, 0.01, 0.04]}
          />
          <mesh
            name="bird002"
            castShadow
            receiveShadow
            geometry={nodes.bird002.geometry}
            material={materials.bird}
            morphTargetDictionary={nodes.bird002.morphTargetDictionary}
            morphTargetInfluences={nodes.bird002.morphTargetInfluences}
            position={[0.11, 0.13, -0.64]}
            scale={[0.04, 0.01, 0.04]}
          />
          <mesh
            name="bird003"
            castShadow
            receiveShadow
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
