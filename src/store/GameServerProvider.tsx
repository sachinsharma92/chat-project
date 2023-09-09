'use client';

import { ReactNode, useEffect } from 'react';
import { useWorldStore } from './CanvasProvider';
import { useGameServer } from '.';
import { createId } from '@paralleldrive/cuid2';
import { includes, isEmpty, isFunction, pick, trim } from 'lodash';
import { Client } from 'colyseus.js';
import { CampRoom, RoomUser } from '@/types';
import { findRivetConnection } from '@/lib/rivet';
import { MapSchema } from '@colyseus/schema';

const consumeUsers = (roomUsers: MapSchema<RoomUser>) => {
  if (!roomUsers?.entries) {
    return [];
  }

  const updated: RoomUser[] = [];

  roomUsers.forEach((user: any) => {
    if (user && !isEmpty(user)) {
      updated.push(
        pick(user, [
          'posX',
          'posY',
          'posZ',
          'x',
          'y',
          'z',
          'userId',
          'displayName',
        ]),
      );
    }
  });

  return [...updated];
};

/**
 *
 * @param param0
 * @returns
 */
export const GameServerProvider = ({ children }: { children?: ReactNode }) => {
  const { isStarted } = useWorldStore(state => ({
    isStarted: state.isStarted,
  }));

  const {
    room,
    isConnecting,
    setPlayers,
    setUserId,
    startConnecting,
    endConnecting,
    setRoom,
    setClientConnection,
  } = useGameServer(state => ({
    room: state.room,
    isConnecting: state.isConnecting,
    setPlayers: state.setPlayers,
    setUserId: state.setUserId,
    startConnecting: state.startConnecting,
    endConnecting: state.endConnecting,
    setRoom: state.setRoom,
    setClientConnection: state.setClientConnection,
  }));

  // Connect matchmaking using Rivet's API
  // check camp-gameserver repo for full implementation
  useEffect(() => {
    const connectToGameServer = async () => {
      try {
        if (isConnecting) {
          return;
        }

        startConnecting();

        const gameMode = 'default';
        const res = await findRivetConnection(gameMode);

        if (res) {
          const port = res.ports[gameMode];
          const secure =
            port?.isTls || includes(window.location.protocol, 'https');
          const playerToken = res?.player?.token;
          const userId = trim(createId());
          const colyseusConnection = new Client({
            secure,
            pathname: '',
            port: port.port,
            hostname: port.hostname,
          });

          console.log('userId', userId);
          console.log(
            'colyseusConnection',
            'secure',
            secure,
            'playerToken',
            playerToken,
          );

          const displayName = ''; // todo
          // default value from <Player/>
          const posX = 0;
          const posY = 0;
          const posZ = 0;
          const x = 0;
          const y = 0;
          const z = 0;
          const room = (await colyseusConnection.joinOrCreate('camp', {
            playerToken,
            userId,
            posX,
            posY,
            posZ,
            x,
            y,
            z,
            displayName,
          })) as CampRoom;

          setClientConnection(colyseusConnection);
          setUserId(userId);
          setRoom(room);
          endConnecting();

          if (room && room.state?.users) {
            setPlayers(consumeUsers(room.state.users));
          }
        }
      } catch (err: any) {
        console.log('connectToGameServer() err:', err?.message);
      }
    };

    if (isStarted && !room) {
      connectToGameServer();
    }
  }, [
    isStarted,
    isConnecting,
    room,
    setPlayers,
    setUserId,
    startConnecting,
    endConnecting,
    setClientConnection,
    setRoom,
  ]);

  /**
   * Listen to 'users' state changes and record new players
   */
  useEffect(() => {
    let unsub: null | Function = null;

    if (!isConnecting) {
      const roomState = room?.state;

      if (roomState && roomState?.users?.onChange) {
        unsub = roomState.users.onChange((userUpdated: Partial<RoomUser>[]) => {
          if (userUpdated) {
            setPlayers(consumeUsers(roomState.users));
          }
        });
      }
    }

    return () => {
      if (unsub && isFunction(unsub)) {
        unsub();
      }
    };
  }, [room, isConnecting, room?.state, setPlayers]);

  return <>{children}</>;
};
