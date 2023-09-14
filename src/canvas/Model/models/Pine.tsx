import * as THREE from 'three';
import { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { pineModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    pine_leef: THREE.Mesh;
    pine: THREE.Mesh;
  };
  materials: {
    pine_leef: THREE.MeshStandardMaterial;
    pine: THREE.MeshStandardMaterial;
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
  const { nodes } = useGLTF(pineModelPath) as GLTFResult;
  const instances = useMemo(
    () => ({
      Pineleef: nodes.pine_leef,
      Pine: nodes.pine,
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

export default function Pine(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context);
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.2, 0.4, 0.2]} position={[0, 0.6, 0]} />
        <instances.Pineleef />
        <instances.Pine />
      </RigidBody>
    </group>
  );
}

useGLTF.preload(pineModelPath);
