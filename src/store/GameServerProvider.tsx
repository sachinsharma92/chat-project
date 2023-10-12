'use client';

import { ReactNode, useEffect, useMemo, useState } from 'react';
import { useWorldStore } from './CanvasProvider';
import { createId } from '@paralleldrive/cuid2';
import { includes, isArray, isFunction, map } from 'lodash';
import { Client } from 'colyseus.js';
import { BotRoom, CampRoom, RoomUser } from '@/types';
import {
  findRivetConnection,
  serverRoomReceiveQueue,
  serverRoomSendQueue,
} from '@/lib/rivet';
import { useGameServer } from './Spaces';
import { useBotnetAuth } from './Auth';
import { getNameFromEmail, getUserIdFromSession } from '@/utils';
import { consumeChatMessages, consumeUsers } from '@/utils/gameserver';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';

export const guestId = createId();

/**
 * Game server handler, make sure to instatiate this once
 * @param param0
 * @returns
 */
export const GameServerProvider = ({ children }: { children?: ReactNode }) => {
  const { isStarted } = useWorldStore(state => ({
    isStarted: state.isStarted,
  }));
  const [session, sessionChecked, displayName, email, image, authIsLoading] =
    useBotnetAuth(state => [
      state.session,
      state.sessionChecked,
      state.displayName,
      state.email,
      state.image,
      state.isLoading,
    ]);

  const {
    botRoom,
    gameRoom,
    isConnecting,
    setBotRoomIsResponding,
    setPlayers,
    startConnecting,
    endConnecting,
    setRoom,
    setClientConnection,
    setRoomChatMessages,
    setBotRoom,
  } = useGameServer(state => ({
    botRoom: state.botRoom,
    gameRoom: state.gameRoom,
    isConnecting: state.isConnecting,
    setBotRoomIsResponding: state.setBotRoomIsResponding,
    setPlayers: state.setPlayers,
    startConnecting: state.startConnecting,
    endConnecting: state.endConnecting,
    setRoom: state.setRoom,
    setClientConnection: state.setClientConnection,
    setRoomChatMessages: state.setRoomChatMessages,
    setBotRoom: state.setBotRoom,
  }));

  const { spaceId, spaceInfo } = useSelectedSpace();
  const [colyseusConnection, setColyseusConnection] = useState<Client | null>(
    null,
  );
  const loggedInUserId = useMemo(
    () => getUserIdFromSession(session),
    [session],
  );
  // present user id
  const userId = useMemo(() => loggedInUserId || guestId, [loggedInUserId]);

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

          const colyseusConnection = new Client({
            secure,
            pathname: '',
            port: port.port as number,
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

          setColyseusConnection(colyseusConnection);
          setClientConnection(colyseusConnection);
          setRoom(room);
          endConnecting();

          if (room.state?.users) {
            serverRoomReceiveQueue.add(() => {
              setPlayers(consumeUsers(room.state.users));
            });
          }

          if (room) {
            /**
             * Listen to gameRoom state changes
             */
            room.onStateChange(state => {
              // @todo resub on spaceId change
              if (state?.users && isFunction(setPlayers) && spaceId) {
                serverRoomReceiveQueue.add(() => {
                  setPlayers(consumeUsers(state.users));
                });
              }
            });
          }
        }
      } catch (err: any) {
        console.log('connectToGameServer() err:', err?.message);
      }
    };

    if (isStarted && !gameRoom && spaceId && sessionChecked) {
      connectToGameServer();
    }
  }, [
    userId,
    loggedInUserId,
    isStarted,
    isConnecting,
    gameRoom,
    session,
    sessionChecked,
    displayName,
    spaceId,
    setPlayers,
    startConnecting,
    endConnecting,
    setClientConnection,
    setRoom,
  ]);

  /**
   * Update user profile in game server
   */
  useEffect(() => {
    if (!isStarted || !gameRoom?.send || !spaceId) {
      return;
    }

    // @todo get pos data from player instance on Phaser
    const posX = 0;
    const posY = 0;
    const posZ = 0;
    const x = 0;
    const y = 0;
    const z = 0;
    const hostFromEmail = getNameFromEmail(email);

    serverRoomSendQueue.add(async () => {
      console.log(`gameRoom.send('updateUser')`);
      gameRoom.send('updateUser', {
        userId,
        posX,
        posY,
        posZ,
        x,
        y,
        z,
        isGuest: !loggedInUserId,
        displayName: loggedInUserId ? displayName || hostFromEmail : '',
      });
    });

    // eslint-disable-next-line
  }, [
    userId,
    spaceId,
    displayName,
    loggedInUserId,
    gameRoom?.send,
    email,
    isStarted,
  ]);

  /**
   * Listen to 'users' state changes and record new players
   */
  useEffect(() => {
    let unsub: null | Function = null;

    if (!isConnecting) {
      const roomState = gameRoom?.state;

      if (roomState && roomState?.users?.onChange) {
        unsub = roomState.users.onChange((userUpdated: RoomUser) => {
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
  }, [gameRoom, isConnecting, gameRoom?.state, setPlayers]);

  // connect to bot chat room 1:1
  // we can only connect to chat room if we've established connection with game room
  useEffect(() => {
    const connectBotChatServer = async () => {
      if (
        !colyseusConnection ||
        !spaceId ||
        !gameRoom ||
        authIsLoading ||
        botRoom ||
        isConnecting ||
        !spaceInfo
      ) {
        return;
      }

      try {
        startConnecting();
        console.log('connectBotChatServer()');

        const userId = loggedInUserId || guestId;
        const room = (await colyseusConnection.joinOrCreate('botChat', {
          userId,
          spaceId,
        })) as BotRoom;
        const channel = `chat-${userId}-receive`;
        setBotRoom(room);

        if (room) {
          // Listen to chat messages stream from bot room
          room.onMessage(channel, message => {
            if (message && isArray(message?.chats)) {
              setRoomChatMessages(
                consumeChatMessages(
                  // @todo types
                  // @ts-ignore
                  map(message?.chats, c => {
                    return {
                      ...c,
                      isGuest: !loggedInUserId,
                      authorInfo: { image, displayName: 'You' },
                    };
                  }),
                ),
              );
            }
          });
        }

        if (room?.onStateChange) {
          room.onStateChange(state => {
            // @ts-ignore
            if (state?.userBotChatInfo) {
              // @ts-ignore
              state?.userBotChatInfo.forEach(info => {
                if (info?.userId === userId && setBotRoomIsResponding) {
                  serverRoomReceiveQueue.add(() => {
                    setBotRoomIsResponding(
                      info?.isOpenAIChatCompletionProcessing as boolean,
                    );
                  });
                }
              });
            }
          });
        }
      } catch (err: any) {
        console.log('connectBotChatServer() err:', err?.message);
      } finally {
        endConnecting();
      }
    };

    connectBotChatServer();
  }, [
    spaceInfo,
    botRoom,
    loggedInUserId,
    spaceId,
    colyseusConnection,
    gameRoom,
    authIsLoading,
    isConnecting,
    image,
    setBotRoomIsResponding,
    setRoomChatMessages,
    startConnecting,
    endConnecting,
    setBotRoom,
  ]);

  return <>{children}</>;
};
