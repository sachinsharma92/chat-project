import useThirdPersonCamera from '@/hooks/useThirdPersonCamera';
import { ReactNode } from 'react';
import { Object3D } from 'three';

/**
 * Consume 'useThirdPersonCamera' hook.
 * For controlled player instance only.
 * @param props
 * @returns
 */
const PlayerCamera = (props: { children?: ReactNode; character: Object3D }) => {
  const { children, character } = props;

  useThirdPersonCamera(character);

  return <> {children || null} </>;
};

export default PlayerCamera;
