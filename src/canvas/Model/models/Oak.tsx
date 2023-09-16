import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { oakModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    oak_leef: THREE.Mesh;
    oak: THREE.Mesh;
  };
  materials: {
    oak_leef: THREE.MeshStandardMaterial;
    oak: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>
>;

const context = createContext({} as ContextType);
export function Instances({
  children,
  ...props
}: JSX.IntrinsicElements['group']) {
  const { nodes } = useGLTF(oakModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      Oakleef: nodes.oak_leef,
      Oak: nodes.oak,
    }),
    [nodes],
  );
  return (
    <Merged meshes={instances} {...props}>
      {(instances: ContextType) => (
        <context.Provider value={instances}>{children}</context.Provider>
      )}
    </Merged>
  );
}

export default function Oak(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null}>
      <RigidBody type={'fixed'} colliders={false}>
        <CuboidCollider args={[0.5, 0.5, 0.5]} position={[0, 0.6, 0]} />
        <instances.Oakleef />
        <instances.Oak />
      </RigidBody>
    </group>
  );
}

useGLTF.preload(oakModelPath);
