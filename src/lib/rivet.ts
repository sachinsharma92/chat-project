'use client';

import { RivetClient } from '@rivet-gg/api';
import { cloneDeep } from 'lodash';
import PQueue from 'p-queue';

export const serverRoomSendQueue = new PQueue({ concurrency: 1 });

export const serverRoomReceiveQueue = new PQueue({ concurrency: 2 });

export const RIVET = new RivetClient({
  token: process.env.NEXT_PUBLIC_RIVET_TOKEN,
});

export const findRivetConnection = async (gameMode: string) => {
  const res = await RIVET.matchmaker.lobbies.find({
    gameModes: [gameMode],
  });

  // new reference
  return cloneDeep(res);
};
