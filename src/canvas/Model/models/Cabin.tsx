import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useAsset } from "@/store/CanvasProvider";

type GLTFResult = GLTF & {
  nodes: {
    cabin: THREE.Mesh;
    cabin_a: THREE.Mesh;
  };
  materials: {
    h: THREE.MeshStandardMaterial;
    ha: THREE.MeshStandardMaterial;
  };
};

export default function Cabin(props: JSX.IntrinsicElements["group"]) {
  const model = useAsset("cabin");
  const { nodes, materials } = model as GLTFResult;

  return (
    <group {...props} dispose={null} scale={0.6}>
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.6, 0.6, 1.5]} position={[0, 1, -1]} />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cabin.geometry}
          material={materials.h}
        />
      </RigidBody>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cabin_a.geometry}
        material={materials.ha}
      />
    </group>
  );
}

useGLTF.preload("/assets/models/cabin.glb");
