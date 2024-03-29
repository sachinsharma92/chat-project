import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { roseModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    rose: THREE.Mesh;
  };
  materials: {
    rose: THREE.MeshStandardMaterial;
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
  const { nodes } = useGLTF(roseModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      Rose: nodes.rose,
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

export default function Rose(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null} scale={1.1}>
      <instances.Rose />
    </group>
  );
}

useGLTF.preload(roseModelPath);
