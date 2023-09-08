import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

function useThirdPersonCamera(character: any) {
  const { camera } = useThree();
  useFrame(() => {
    const characterMesh = character;
    const characterPosition = characterMesh.position;

    const cameraOffset = new Vector3(0, 4, 6);
    cameraOffset.add(characterPosition);

    const targetOffset = new Vector3(0, 3, 3);
    targetOffset.add(characterPosition);

    camera.position.copy(cameraOffset);
    camera.lookAt(targetOffset);
  });
}

export default useThirdPersonCamera;
