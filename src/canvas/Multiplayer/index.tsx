'use client';

import { filter, isEmpty, map } from 'lodash';
import { useGameServer } from '@/store';
import { shallow } from 'zustand/shallow';
import { useMemo } from 'react';

import Player from '../Game/Player';

/**
 * Handle matchmaking online players
 * @returns
 */
const Multiplayer = () => {
  const [room, userId, players] = useGameServer(
    state => [state.room, state.userId, state.players],
    shallow,
  );

  const otherPlayers = useMemo(
    () =>
      filter(
        players,
        player => !isEmpty(player?.userId) && player?.userId !== userId,
      ),
    [userId, players],
  );

  return (
    <>
      {room && !isEmpty(otherPlayers) && (
        <group name="OtherPlayers">
          {map(otherPlayers, player => {
            const playerId = player?.userId;
            const key = `${playerId}Player`;

            return <Player player={player} key={key} />;
          })}
        </group>
      )}

      <group name="ControlledGroup">
        <Player player={{ userId }} controlled />
      </group>
    </>
  );
};

export default Multiplayer;
