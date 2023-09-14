import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { RigidBody } from '@react-three/rapier';
import { boardModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    board: THREE.Mesh;
  };
  materials: {
    board: THREE.MeshStandardMaterial;
  };
};

export default function Board(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(boardModelPath) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed">
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.board.geometry}
          material={materials.board}
        />
      </RigidBody>
    </group>
  );
}

useGLTF.preload(boardModelPath);
