import { useMemo } from "react";

import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3, MathUtils, Object3D } from "three";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import { useInputs } from "@/canvas/Game/InputProvider";

const PLAYERSPEED = 4;

function useCharacterController(
  character: Object3D,
  rigidBody: RapierRigidBody
) {
  const { x, y } = useInputs();
  const { world } = useRapier();

  const characterController = useMemo(() => {
    const characterController = world.createCharacterController(0.01);
    characterController.enableSnapToGround(0.5);
    characterController.setApplyImpulsesToDynamicBodies(true);
    characterController.enableAutostep(1, 0.1, true);
    characterController.setMinSlopeSlideAngle(MathUtils.degToRad(30));
    return characterController;
  }, [world]);

  useFrame((_, delta) => {
    const characterRigidBody = rigidBody;
    if (!characterRigidBody) return;
    const characterMesh = character;

    const movement = new Vector3();
    movement.z = -y; // accommodate for webgl z-axis (forward is negative)
    movement.x = x;

    if (movement.length() !== 0) {
      const angle = Math.atan2(movement.x, movement.z);
      const characterRotation = new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        angle
      );
      characterMesh.quaternion.slerp(characterRotation, 0.1);
    }
    movement.normalize().multiplyScalar(PLAYERSPEED * delta);
    movement.y = -1;

    characterController.computeColliderMovement(
      characterRigidBody?.collider(0),
      movement
    );
    const newPosition = new Vector3()
      //@ts-ignore
      .copy(characterRigidBody.translation())
      //@ts-ignore
      .add(characterController.computedMovement());

    characterRigidBody.setNextKinematicTranslation(newPosition);
    //@ts-ignore
    characterMesh.position.lerp(characterRigidBody.translation(), 0.1);
  });
}

export default useCharacterController;
