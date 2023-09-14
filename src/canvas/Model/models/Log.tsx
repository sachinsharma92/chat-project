import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { logModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    log: THREE.Mesh;
  };
  materials: {
    log: THREE.MeshStandardMaterial;
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
  const { nodes } = useGLTF(logModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      Log: nodes.log,
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

export default function Log(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null} scale={[1, 0.8, 0.8]}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.5, 0.2, 0.2]} />
        <instances.Log />
      </RigidBody>
    </group>
  );
}

useGLTF.preload(logModelPath);
