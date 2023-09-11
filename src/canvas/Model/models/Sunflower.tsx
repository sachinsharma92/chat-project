import * as THREE from 'three';
import { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useAsset } from '@/store/CanvasProvider';
import { sunflowerModelPath } from '@/contants';

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
  const model = useAsset('sunflower');
  const { nodes } = model as GLTFResult;

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
    <group scale={1.4} {...props} dispose={null}>
      <instances.Sunflower />
    </group>
  );
}

useGLTF.preload(sunflowerModelPath);
