import * as THREE from 'three';
import { Outlines, useGLTF, meshBounds } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { RigidBody } from '@react-three/rapier';
import { boardModelPath } from '@/constants';
import { useState } from 'react';

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
  const [hover, setHover] = useState(false);
  return (
    <group {...props} dispose={null}>
      <RigidBody type="fixed">
        <mesh
          raycast={meshBounds}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          castShadow
          receiveShadow
          geometry={nodes.board.geometry}
          material={materials.board}
        >
          {hover ? (
            // @ts-ignore
            <Outlines thickness={0.01} color={'white'} />
          ) : null}
        </mesh>
      </RigidBody>
    </group>
  );
}

useGLTF.preload(boardModelPath);
