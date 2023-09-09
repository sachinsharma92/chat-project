import { useInputs } from '@/canvas/Game/InputProvider';
import { ICampModel, RoomUser } from '@/types';
import { useAnimations } from '@react-three/drei';
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';

function useAnimationController(
  model: ICampModel,
  playerData?: Partial<RoomUser>,
) {
  const userInputs = useInputs();
  const controlled = useMemo(() => !playerData, [playerData]);

  /**
   * Use x,y player data from gameserver if not user controlled
   */
  const [x, y] = useMemo(() => {
    if (!controlled || !isEmpty(playerData)) {
      return [playerData?.x || 0, playerData?.y || 0];
    }

    return [userInputs.x, userInputs.y];
  }, [playerData, controlled, userInputs]);

  const { actions } = useAnimations(model?.animations, model?.scene);

  const animationName = useMemo(
    () => (x === 0 && y === 0 ? 'idle' : 'run'),
    [x, y],
  );

  useEffect(() => {
    const action = actions[animationName];

    if (action) {
      action.reset().fadeIn(0.5).play();

      return () => {
        action.fadeOut(0.5);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animationName]);
}

export default useAnimationController;
