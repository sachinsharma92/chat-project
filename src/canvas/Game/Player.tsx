import React, { useEffect, useRef } from 'react';
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { Object3D } from 'three';
import { useAsset } from '@/store/CanvasProvider';
import useCharacterController from '@/hooks/useCharacterController';
import useAnimationController from '@/hooks/useAnimationController';

function Player() {
  const playerModel = useAsset('avatar');
  const playerRef = useRef<any>(null);
  const rigidBodyRef = useRef<any>(null);

  useEffect(() => {
    if (playerModel) {
      playerModel.scene.scale.set(0.6, 0.6, 0.6);
      playerModel.scene.traverse((child: Object3D) => {
        if (child?.isObject3D) {
          child.castShadow = true;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useCharacterController(playerRef.current, rigidBodyRef.current);
  useAnimationController(playerModel);

  return (
    <>
      <RigidBody
        type="kinematicPosition"
        ref={rigidBodyRef}
        position={[0, 2, 5]}
      >
        <CuboidCollider args={[0.2, 0.6, 0.2]} position={[0, 0.6, 0]} />
      </RigidBody>
      <primitive
        castShadow
        receiveShadow
        rotation={[0, -Math.PI, 0]}
        ref={playerRef}
        object={playerModel.scene}
      />
    </>
  );
}

export default Player;
