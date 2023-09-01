import * as THREE from 'three';
import { useMemo, useContext, createContext } from 'react';
import { useGLTF, Merged } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { useAsset } from '@/store/CanvasProvider';

type GLTFResult = GLTF & {
  nodes: {
    pine_leef_Baked: THREE.Mesh;
    pine_Baked: THREE.Mesh;
  };
  materials: {
    pine_leef_Baked: THREE.MeshStandardMaterial;
    pine_Baked: THREE.MeshStandardMaterial;
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
  const model = useAsset('pine');
  const { nodes } = model as GLTFResult;
  const instances = useMemo(
    () => ({
      PineleefBaked: nodes.pine_leef_Baked,
      PineBaked: nodes.pine_Baked,
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
        <instances.PineleefBaked />
        <instances.PineBaked />
      </RigidBody>
    </group>
  );
}

useGLTF.preload('/assets/models/pine.glb');
