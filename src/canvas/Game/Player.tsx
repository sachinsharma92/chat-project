'use client';

import { useEffect, useRef, useState } from 'react';
import { CuboidCollider, RigidBody } from '@react-three/rapier';
import { Object3D } from 'three';
import { ICampModel } from '@/types';
import { useGLTF } from '@react-three/drei';
import { avatarModelPath } from '@/constants';
import PlayerCamera from './PlayerCamera';

function Player() {
  const avatarModel = useGLTF(avatarModelPath);
  const playerRef = useRef<any>(null);
  const rigidBodyRef = useRef<any>(null);
  const initPlayer = useRef(false);

  // private model copy
  const [playerModel, setPlayerModel] = useState<ICampModel | null>(null);

  useEffect(() => {
    if (avatarModel?.scene && !initPlayer?.current) {
      initPlayer.current = true;
      console.log('init Player');

      try {
        // use main model for controlled user (main avatar)
        avatarModel.scene.scale.set(0.6, 0.6, 0.6);
        avatarModel.scene.traverse((child: Object3D) => {
          if (child?.isObject3D) {
            child.castShadow = true;
          }
        });

        setPlayerModel(avatarModel);
      } catch (err: any) {
        console.log('init Player err:', err?.message);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarModel?.scene]);

  return (
    <>
      {playerModel && <PlayerCamera character={playerRef.current} />}

      {playerModel && (
        <RigidBody
          type="kinematicPosition"
          ref={rigidBodyRef}
          position={[0, 2, -3.6]}
        >
          <CuboidCollider args={[0.2, 0.6, 0.2]} position={[0, 0.6, 0]} />
        </RigidBody>
      )}
    </>
  );
}

export default Player;
