import * as THREE from 'three';
import { useGLTF, meshBounds } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { RigidBody } from '@react-three/rapier';
import { useAsset, useBoardStore } from '@/store/CanvasProvider';

type GLTFResult = GLTF & {
  nodes: {
    Cube002_Baked_Baked: THREE.Mesh;
  };
  materials: {
    ['Cube.002_Baked_Baked']: THREE.MeshStandardMaterial;
  };
};

export default function Board(props: JSX.IntrinsicElements['group']) {
  const model = useAsset('board');
  const { nodes, materials } = model as GLTFResult;

  const setBoardOpen = useBoardStore(state => state.setBoardOpen);

  return (
    <group {...props} dispose={null} scale={1.3}>
      <RigidBody type="fixed">
        <mesh
          onClick={() => setBoardOpen()}
          raycast={meshBounds}
          castShadow
          receiveShadow
          geometry={nodes.Cube002_Baked_Baked.geometry}
          material={materials['Cube.002_Baked_Baked']}
        />
      </RigidBody>
    </group>
  );
}

useGLTF.preload('/assets/models/board.glb');
