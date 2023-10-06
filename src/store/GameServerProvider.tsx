'use client';

import { ReactNode, useEffect } from 'react';
import { useWorldStore } from './CanvasProvider';
import { createId } from '@paralleldrive/cuid2';
import { includes, isFunction, trim } from 'lodash';
import { Client } from 'colyseus.js';
import { CampRoom, RoomUser } from '@/types';
import {
  findRivetConnection,
  serverRoomReceiveQueue,
  serverRoomSendQueue,
} from '@/lib/rivet';
import { useGameServer } from './Spaces';
import { useBotnetAuth } from './Auth';
import { getNameFromEmail, getUserIdFromSession } from '@/utils';
import { consumeChatMessages, consumeUsers } from '@/utils/gameserver';

export const guestId = createId();

/**
 *
 * @param param0
 * @returns
 */
export const GameServerProvider = ({ children }: { children?: ReactNode }) => {
  const { isStarted } = useWorldStore(state => ({
    isStarted: state.isStarted,
  }));
  const [session, sessionChecked, displayName, email] = useBotnetAuth(state => [
    state.session,
    state.sessionChecked,
    state.displayName,
    state.email,
  ]);

  const {
    room,
    isConnecting,
    setPlayers,
    setUserId,
    startConnecting,
    endConnecting,
    setRoom,
    setClientConnection,
    setRoomChatMessages,
  } = useGameServer(state => ({
    userId: state.userId,
    room: state.room,
    isConnecting: state.isConnecting,
    setPlayers: state.setPlayers,
    setUserId: state.setUserId,
    startConnecting: state.startConnecting,
    endConnecting: state.endConnecting,
    setRoom: state.setRoom,
    setClientConnection: state.setClientConnection,
    setRoomChatMessages: state.setRoomChatMessages,
  }));

  // Connect matchmaking using Rivet's API
  // check camp-gameserver repo for full implementation
  useEffect(() => {
    const connectToGameServer = async () => {
      try {
        if (isConnecting) {
          return;
        }
        console.log('connectToGameServer()');

        startConnecting();

        const gameMode = 'default';
        const res = await findRivetConnection(gameMode, false);

        if (res?.lobby?.ports) {
          const port = res.lobby.ports[gameMode] || res.lobby.ports?.default;
          const secure =
            port?.isTls || includes(window.location.protocol, 'https');
          const playerToken = res?.player?.token;
          const loggedInUserId = getUserIdFromSession(session);
          const userId = loggedInUserId || trim(guestId);
          const colyseusConnection = new Client({
            secure,
            pathname: '',
            port: port.port,
            hostname: port.hostname,
          });

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
            displayName: displayName || '',
          })) as CampRoom;

          setClientConnection(colyseusConnection);
          setUserId(userId);
          setRoom(room);
          endConnecting();

          if (room) {
            if (room.state?.users) {
              serverRoomReceiveQueue.add(() => {
                setPlayers(consumeUsers(room.state.users));
              });
            }

            /**
             * Listen to room state changes
             */
            room.onStateChange(state => {
              if (state?.users && isFunction(setPlayers)) {
                serverRoomReceiveQueue.add(() => {
                  setPlayers(consumeUsers(state.users));
                });
              }

              if (state?.chatMessages && isFunction(setRoomChatMessages)) {
                setRoomChatMessages(consumeChatMessages(state.chatMessages));
              }
            });
          }
        }
      } catch (err: any) {
        console.log('connectToGameServer() err:', err?.message);
      }
    };

    if (isStarted && !room && sessionChecked) {
      connectToGameServer();
    }
  }, [
    isStarted,
    isConnecting,
    room,
    session,
    sessionChecked,
    displayName,
    setRoomChatMessages,
    setPlayers,
    setUserId,
    startConnecting,
    endConnecting,
    setClientConnection,
    setRoom,
  ]);

  /**
   * Update user profile in game server
   */
  useEffect(() => {
    if (!isStarted || !sessionChecked || !room?.send) {
      return;
    }

    // store user info in game server
    const loggedInUserId = getUserIdFromSession(session);
    const userId = loggedInUserId || guestId;
    // @todo get pos data from player instance on Phaser
    const posX = 0;
    const posY = 0;
    const posZ = 0;
    const x = 0;
    const y = 0;
    const z = 0;

    serverRoomSendQueue.add(async () => {
      console.log(`room.send('updateUser')`);
      room.send('updateUser', {
        userId,
        posX,
        posY,
        posZ,
        x,
        y,
        z,
        isGuest: false,
        displayName: loggedInUserId
          ? displayName || getNameFromEmail(email)
          : '',
      });
    });

    // eslint-disable-next-line
  }, [
    displayName,
    room?.send,
    email,
    sessionChecked,
    isStarted,
    session?.user?.id,
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
            serverRoomReceiveQueue.add(() => {
              setPlayers(consumeUsers(roomState.users));
            });
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
