import { ICampModel, RoomUser } from '@/types';
import { ReactNode } from 'react';
import useAnimationController from '@/hooks/useAnimationController';

const PlayerAnimation = (props: {
  model: ICampModel;
  playerData?: Partial<RoomUser>;
  children?: ReactNode;
}) => {
  const { model, playerData, children } = props;

  useAnimationController(model, playerData);

  return <>{children}</>;
};

export default PlayerAnimation;
