import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { useAsset } from '@/store/CanvasProvider';
import { villagerModelPath } from '@/contants';

type GLTFResult = GLTF & {
  nodes: {
    hat: THREE.Mesh;
    head: THREE.Mesh;
    shoes: THREE.Mesh;
    body: THREE.Mesh;
    hair: THREE.Mesh;
    bag: THREE.Mesh;
    truanks: THREE.Mesh;
    shirt: THREE.Mesh;
  };
  materials: {
    villager: THREE.MeshStandardMaterial;
  };
};

export default function Villager(props: JSX.IntrinsicElements['group']) {
  const model = useAsset('villager');
  const { nodes, materials } = model as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.hat.geometry} material={materials.villager} />
      <mesh geometry={nodes.head.geometry} material={materials.villager} />
      <mesh geometry={nodes.shoes.geometry} material={materials.villager} />
      <mesh geometry={nodes.body.geometry} material={materials.villager} />
      <mesh geometry={nodes.hair.geometry} material={materials.villager} />
      <mesh geometry={nodes.bag.geometry} material={materials.villager} />
      <mesh geometry={nodes.truanks.geometry} material={materials.villager} />
      <mesh geometry={nodes.shirt.geometry} material={materials.villager} />
    </group>
  );
}

useGLTF.preload(villagerModelPath);
