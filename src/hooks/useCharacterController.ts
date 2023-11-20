import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Quaternion, Vector3, MathUtils, Object3D, Group } from 'three';
import { RapierRigidBody, useRapier } from '@react-three/rapier';
import { useInputs } from '@/canvas/Game/InputProvider';
import { RoomUser } from '@/types';
import { isEmpty, isNumber } from 'lodash';
import { serverRoomSendQueue } from '@/lib/rivet';
import { shallow } from 'zustand/shallow';
import { useGameServer } from '@/store/App';
import { useBotnetAuth } from '@/store/Auth';
import { getGuestId } from '@/store/AuthProvider';

const PLAYERSPEED = 4;

function useCharacterController(
  character: Object3D,
  rigidBody: RapierRigidBody,
  playerTextGroup?: Group | null,
  playerData?: Partial<RoomUser>,
) {
  const userInputs = useInputs();
  const { world } = useRapier();
  const controlled = useMemo(() => !playerData, [playerData]);

  const [gameRoom] = useGameServer(state => [state.gameRoom], shallow);
  const [userId] = useBotnetAuth(state => [
    state.session?.user?.id || getGuestId(),
  ]);

  /**
   * Use x,y player data from gameserver if not user controlled
   */
  const [x, y, posX, posY, posZ] = useMemo(() => {
    if (!controlled || !isEmpty(playerData)) {
      return [
        playerData?.x || 0,
        playerData?.y || 0,
        playerData?.posX,
        playerData?.posY,
        playerData?.posZ,
      ];
    }

    return [userInputs.x, userInputs.y];
  }, [playerData, controlled, userInputs]);

  const characterController = useMemo(() => {
    if (!character) {
      return null;
    }

    const characterController = world.createCharacterController(0.01);
    characterController.enableSnapToGround(0.5);
    characterController.setApplyImpulsesToDynamicBodies(true);
    characterController.enableAutostep(1, 0.1, true);
    characterController.setMinSlopeSlideAngle(MathUtils.degToRad(30));
    return characterController;
  }, [world, character]);

  useFrame((_, delta) => {
    const characterMesh = character;
    const characterRigidBody = rigidBody;
    const characterText = playerTextGroup;

    if (!characterMesh || !characterController) {
      return;
    }

    if (!characterRigidBody && controlled) return;

    const movement = new Vector3();
    movement.z = -y; // accommodate for webgl z-axis (forward is negative)
    movement.x = x;

    if (movement.length() !== 0) {
      const angle = Math.atan2(movement.x, movement.z);
      const characterRotation = new Quaternion().setFromAxisAngle(
        new Vector3(0, 1, 0),
        angle,
      );
      characterMesh.quaternion.slerp(characterRotation, 0.1);
    }
    movement.normalize().multiplyScalar(PLAYERSPEED * delta);
    movement.y = -1;

    if (controlled) {
      characterController.computeColliderMovement(
        characterRigidBody?.collider(0),
        movement,
      );
      const newPosition = new Vector3()
        //@ts-ignore
        .copy(characterRigidBody.translation())
        //@ts-ignore
        .add(characterController.computedMovement());

      characterRigidBody.setNextKinematicTranslation(newPosition);
      //@ts-ignore
      characterMesh.position.lerp(characterRigidBody.translation(), 0.1);

      const textPosition = new Vector3(
        newPosition.x,
        newPosition.y + 1.7,
        newPosition.z - 0.1,
      );

      if (characterText) {
        characterText.position.lerp(textPosition, 0.1);
      }

      if (gameRoom?.send) {
        serverRoomSendQueue.add(async () => {
          gameRoom.send('action', {
            userId,
            x,
            y,
            z: 0,
            displayName: '', // todo for authenticated users
            posX: newPosition.x,
            posY: newPosition.y,
            posZ: newPosition.z,
          });
        });
      }
    } else if (isNumber(posX) && isNumber(posY) && isNumber(posZ)) {
      const newPosition = new Vector3(posX, posY, posZ);
      const textPosition = new Vector3(posX + 0.1, posY + 1.5, posZ - 0.5);

      characterMesh.position.lerp(newPosition, 0.1);

      if (characterText) {
        characterText.position.lerp(textPosition, 0.1);
      }
    }
  });
}

export default useCharacterController;
