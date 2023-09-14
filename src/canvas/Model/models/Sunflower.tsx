import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { sunflowerModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    sunflower: THREE.Mesh;
  };
  materials: {
    sunflower: THREE.MeshStandardMaterial;
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
  const { nodes } = useGLTF(sunflowerModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      Sunflower: nodes.sunflower,
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

export default function Sunflower(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null}>
      <instances.Sunflower />
    </group>
  );
}

useGLTF.preload(sunflowerModelPath);
