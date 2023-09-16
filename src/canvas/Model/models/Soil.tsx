import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { soilModelPath } from '@/constants'

type GLTFResult = GLTF & {
  nodes: {
    soil: THREE.Mesh
  }
  materials: {
    soil: THREE.MeshStandardMaterial
  }
}

export default function Soil(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(soilModelPath) as GLTFResult
  return (
    <>
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.soil.geometry} material={materials.soil} position={[0, 0.01, 0]}  />
    </group>
    
    </>
  )
}

useGLTF.preload(soilModelPath)
