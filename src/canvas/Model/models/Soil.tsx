import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useAsset } from "@/store/CanvasProvider";


type GLTFResult = GLTF & {
  nodes: {
    clearing: THREE.Mesh;
  };
  materials: {
    ["Material.004"]: THREE.MeshStandardMaterial;
  };
};

export default function Soil(props: JSX.IntrinsicElements["group"]) {
  const model = useAsset("soil");
  const { nodes, materials } = model as GLTFResult;

  return (
    <group {...props} dispose={null} position={[0.5, 0.015, 6.7]}>
      <mesh
        receiveShadow
        geometry={nodes.clearing.geometry}
        material={materials["Material.004"]}
        position={[0, 0.01, 0]}
        scale={2}
      />
    </group>
  );
}

useGLTF.preload("/assets/models/soil.glb");
