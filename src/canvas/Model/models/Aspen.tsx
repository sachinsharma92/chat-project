import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useAsset } from '@/store/CanvasProvider';

type GLTFResult = GLTF & {
  nodes: {
    RetopoFlow004: THREE.Mesh;
    Plane245: THREE.Mesh;
  };
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial;
    ['Material.005']: THREE.MeshStandardMaterial;
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
  const model = useAsset('aspen');
  const { nodes } = model as GLTFResult;

  const instances = useMemo(
    () => ({
      RetopoFlow: nodes.RetopoFlow004,
      Plane: nodes.Plane245,
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
    <group {...props} dispose={null} scale={0.2}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.5, 2, 0.5]} position={[0, -5.3, 0]} />
        <instances.RetopoFlow position={[-0.07, 0.95, -0.05]} />
        <instances.Plane position={[-0.23, 3.93, -0.15]} />
      </RigidBody>
    </group>
  );
}

useGLTF.preload('/assets/models/aspen.glb');
