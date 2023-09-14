import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { mountainModelPath } from '@/constants';

type GLTFResult = GLTF & {
  nodes: {
    mountain: THREE.Mesh;
  };
  materials: {
    mountain: THREE.MeshStandardMaterial;
  };
};

export default function Mountain(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(mountainModelPath) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.mountain.geometry}
        material={materials.mountain}
        position={[0, 2, -6.69]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[16.72, 8.34, 8.34]}
      />
    </group>
  );
}

useGLTF.preload(mountainModelPath);
