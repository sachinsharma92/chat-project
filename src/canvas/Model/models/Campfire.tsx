import * as THREE from 'three';
import React, { useEffect, useRef } from 'react';
import {
  useGLTF,
  useAnimations,
  GradientTexture,
  GradientType,
} from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import { campfireModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    camp: THREE.Mesh;
    fire: THREE.Mesh;
  };
  materials: {
    camp: THREE.MeshStandardMaterial;
    fire: THREE.MeshStandardMaterial;
  };
};

export default function Campfire(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    campfireModelPath,
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    if (actions && actions['fire']) {
      actions['fire'].play();
    }
  }, [actions]);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <RigidBody position={[0, 0.08, 0]} colliders={false} type="fixed">
          <CylinderCollider args={[0.6, 0.7]} position={[0, 0.35, 0]} />
          <mesh
            castShadow
            receiveShadow
            name="camp"
            geometry={nodes.camp.geometry}
            material={materials.camp}
          />
          <mesh
            castShadow
            receiveShadow
            name="fire"
            geometry={nodes.fire.geometry}
            morphTargetDictionary={nodes.fire.morphTargetDictionary}
            morphTargetInfluences={nodes.fire.morphTargetInfluences}
          >
            <meshToonMaterial
              emissive={'yellow'}
              emissiveIntensity={0.2}
              transparent
              opacity={0.4}
            >
              <GradientTexture
                // @ts-ignore
                type={GradientType.Radial}
                stops={[0.0, 0.3, 1]}
                colors={['yellow', 'orange', 'red']}
              />
            </meshToonMaterial>
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
}

useGLTF.preload(campfireModelPath);
