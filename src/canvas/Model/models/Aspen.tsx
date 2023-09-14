import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { aspenModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    aspen: THREE.Mesh;
    aspen_leef: THREE.Mesh;
  };
  materials: {
    aspen: THREE.MeshStandardMaterial;
    aspen_leef: THREE.MeshStandardMaterial;
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
  const { nodes } = useGLTF(aspenModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      Aspen: nodes.aspen,
      Aspenleef: nodes.aspen_leef,
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

export default function Aspen(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.5, 0.5, 0.5]} position={[0, 0.5, 0]} />
        <instances.Aspen />
        <instances.Aspenleef />
      </RigidBody>
    </group>
  );
}

useGLTF.preload(aspenModelPath);
