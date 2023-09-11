/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 soil.glb -T -S -t
*/

import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useAsset } from '@/store/CanvasProvider';
import { soilModelPath } from '@/contants';

type GLTFResult = GLTF & {
  nodes: {
    clearing: THREE.Mesh;
  };
  materials: {
    ['Material.004']: THREE.MeshStandardMaterial;
  };
};

export default function Soil(props: JSX.IntrinsicElements['group']) {
  const model = useAsset('soil');
  const { nodes, materials } = model as GLTFResult;
  return (
    <group {...props} dispose={null} position={[0.5, 0.055, 4]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.clearing.geometry}
        material={materials['Material.004']}
        position={[0, 0.01, 0]}
        scale={3}
      />
    </group>
  );
}

useGLTF.preload(soilModelPath);