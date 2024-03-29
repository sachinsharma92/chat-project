import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { cabinModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    cabin_a: THREE.Mesh;
    cabin: THREE.Mesh;
  };
  materials: {
    cabin_a: THREE.MeshStandardMaterial;
    cabin: THREE.MeshStandardMaterial;
  };
};

export default function Cabin(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(cabinModelPath) as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.3, 0.6, 1.1]} position={[0, 1, -0.85]} />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cabin_a.geometry}
          material={materials.cabin_a}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cabin.geometry}
          material={materials.cabin}
        ></mesh>
      </RigidBody>
    </group>
  );
}

useGLTF.preload(cabinModelPath);
