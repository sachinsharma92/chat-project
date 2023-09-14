import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { whiteflowerModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    whiteFlower: THREE.Mesh;
  };
  materials: {
    whiteFlower: THREE.MeshStandardMaterial;
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
  const { nodes } = useGLTF(whiteflowerModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      WhiteFlower: nodes.whiteFlower,
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

export default function Whiteflower(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null}>
      <instances.WhiteFlower />
    </group>
  );
}

useGLTF.preload(whiteflowerModelPath);
