import * as THREE from 'three';
import React, { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useAsset } from '@/store/CanvasProvider';
import { roseModelPath } from '@/contants';

type GLTFResult = GLTF & {
  nodes: {
    sm_Flower_Rose_1: THREE.Mesh;
  };
  materials: {
    Jeremy_Test: THREE.MeshStandardMaterial;
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
  const model = useAsset('rose');
  const { nodes } = model as GLTFResult;

  const instances = useMemo(
    () => ({
      SmFlowerRose: nodes.sm_Flower_Rose_1,
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
    <group scale={1.7} {...props} dispose={null}>
      <instances.SmFlowerRose />
    </group>
  );
}

useGLTF.preload(roseModelPath);
