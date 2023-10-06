'use client';

import { RivetClient } from '@rivet-gg/api';
import { cloneDeep, isEmpty, isObject } from 'lodash';
import PQueue from 'p-queue';

export const serverRoomSendQueue = new PQueue({ concurrency: 1 });

export const serverRoomReceiveQueue = new PQueue({ concurrency: 2 });

export const RIVET = new RivetClient({
  token: process.env.NEXT_PUBLIC_RIVET_TOKEN,
});

export const findRivetConnection = async (
  gameMode: string,
  preventAutoCreateLobby: boolean = false,
  props?: Record<string, any>,
) => {
  const res = await RIVET.matchmaker.lobbies.find({
    preventAutoCreateLobby,
    gameModes: [gameMode],
    ...(!isEmpty(props) &&
      isObject(props) && { verificationData: { ...props } }),
  });

  // new reference
  return cloneDeep(res);
};

export const joinRivetConnection = async (lobbyId: string) => {
  const res = await RIVET.matchmaker.lobbies.join({
    lobbyId,
  });

  // new reference
  return cloneDeep(res);
};
