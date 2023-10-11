'use client';

import { filter, head, isEmpty, map } from 'lodash';
import { shallow } from 'zustand/shallow';
import { useMemo } from 'react';

import Player from '../Game/Player';
import { useGameServer } from '@/store/Spaces';
import { useBotnetAuth } from '@/store/Auth';
import { guestId } from '@/store/GameServerProvider';

/**
 * Handle matchmaking online players
 * @returns
 */
const Multiplayer = () => {
  const [gameRoom, players] = useGameServer(
    state => [state.gameRoom, state.players],
    shallow,
  );
  const [userId] = useBotnetAuth(state => [state.session?.user?.id || guestId]);

  const otherPlayers = useMemo(
    () =>
      filter(
        players,
        player => !isEmpty(player?.userId) && player?.userId !== userId,
      ),
    [userId, players],
  );

  const controlledPlayer = useMemo(
    () =>
      head(
        filter(
          players,
          player => !isEmpty(player?.userId) && player?.userId === userId,
        ),
      ) || {},
    [userId, players],
  );

  return (
    <>
      {gameRoom && !isEmpty(otherPlayers) && (
        <group name="OtherPlayers">
          {map(otherPlayers, player => {
            const playerId = player?.userId;
            const key = `${playerId}Player`;

            return <Player player={player} key={key} />;
          })}
        </group>
      )}

      <group name="ControlledGroup">
        <Player player={{ ...controlledPlayer, userId }} controlled />
      </group>
    </>
  );
};

export default Multiplayer;
