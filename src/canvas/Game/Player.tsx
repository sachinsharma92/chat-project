'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Group, Object3D } from 'three';
import { ICampModel, RoomUser } from '@/types';
import { cloneDeep, map } from 'lodash';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import useCharacterController from '@/hooks/useCharacterController';
import PlayerAnimation from './PlayerAnimation';
import { useGLTF } from '@react-three/drei';
import { avatarModelPath } from '@/constants';

export type PlayerProps = {
  player?: Partial<RoomUser>;
  controlled?: boolean;
};

function Player(props: PlayerProps) {
  const { player, controlled } = props;

  const avatarModel = useGLTF(avatarModelPath);
  const playerRef = useRef<any>(null);
  const rigidBodyRef = useRef<any>(null);
  const playerGroupRef = useRef<Group | null>(null);
  const initPlayer = useRef(false);

  // private model copy
  const [playerModel, setPlayerModel] = useState<ICampModel | null>(null);

  const playerData = useMemo(
    // For controlled player component we don't override local player info
    () => (controlled ? undefined : player),
    [player, controlled],
  );

  useEffect(() => {
    if (avatarModel?.scene && !initPlayer?.current) {
      initPlayer.current = true;
      console.log('init Player');

      try {
        // clone model for non-controlled users (other players)
        if (!controlled) {
          const clonedModel = cloneDeep(avatarModel);
          const clonedScene = SkeletonUtils.clone(avatarModel.scene);

          const clonedScenes = map(clonedModel.scenes, scene => {
            return SkeletonUtils.clone(scene);
          });
          // @ts-ignore
          clonedModel.scene = clonedScene;
          // @ts-ignore
          clonedModel.scenes = clonedScenes;
          clonedModel.scene.scale.set(0.6, 0.6, 0.6);
          clonedModel.scene.traverse((child: Object3D) => {
            if (child?.isObject3D) {
              child.castShadow = true;
            }
          });

          setPlayerModel(clonedModel);
        } else {
          // use main model for controlled user (main avatar)
          avatarModel.scene.scale.set(0.6, 0.6, 0.6);
          avatarModel.scene.traverse((child: Object3D) => {
            if (child?.isObject3D) {
              child.castShadow = true;
            }
          });

          setPlayerModel(avatarModel);
        }
      } catch (err: any) {
        console.log('init Player err:', err?.message);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlled, avatarModel?.scene]);

  // player controller
  useCharacterController(playerRef.current, rigidBodyRef.current, playerData);

  return (
    <>
      {playerModel?.scene && (
        // player animation
        <PlayerAnimation model={playerModel} playerData={playerData} />
      )}

      {controlled && playerModel && (
        <RigidBody
          type="kinematicPosition"
          ref={rigidBodyRef}
          position={[0, 2, -1.5]}
        >
          <CuboidCollider args={[0.2, 0.6, 0.2]} position={[0, 0.6, 0]} />
        </RigidBody>
      )}

      {playerModel?.scene && (
        <group
          name={
            controlled ? 'ControlledPlayer' : `OtherPlayer${playerData?.userId}`
          }
          ref={e => (playerGroupRef.current = e)}
        >
          <primitive
            castShadow
            receiveShadow
            scale={0.7}
            rotation={[0, -Math.PI, 0]}
            ref={playerRef}
            object={playerModel?.scene}
          />
        </group>
      )}
    </>
  );
}

export default Player;
