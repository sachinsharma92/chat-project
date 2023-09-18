import { useFrame, useThree } from '@react-three/fiber';
import { Object3D, Vector3 } from 'three';

function useThirdPersonCamera(character: Object3D) {
  const { camera } = useThree();
  useFrame(() => {
    const characterMesh = character;

    if (!characterMesh) {
      return;
    }

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
