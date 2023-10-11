'use client';

import {
  IAppState,
  ISpaceStoreState,
  IGameServerState,
  RoomUser,
  ISpace,
  CampRoom,
  BotRoom,
} from '@/types';
import { create } from 'zustand';
import { Client } from 'colyseus.js';
import { DialogEnums } from '@/types/dialog';
import { includes, map } from 'lodash';

export const useAppStore = create<IAppState>()(set => ({
  expandInfoSidebar: false,
  expandBulletinSidebar: false,
  showDialog: false,
  showDialogType: DialogEnums.none,

  setShowDialog: (showDialog: boolean, showDialogType: DialogEnums) =>
    set(() => ({ showDialog, showDialogType })),
  setExpandBulletinSidebar: expandBulletinSidebar =>
    set(() => ({ expandBulletinSidebar: Boolean(expandBulletinSidebar) })),
  setExpandInfoSidebar: expandInfoSidebar =>
    set(() => ({ expandInfoSidebar: Boolean(expandInfoSidebar) })),
}));

export const useSpacesStore = create<ISpaceStoreState>()(set => ({
  spaces: [],
  /** Insert or update existing space */
  addSpace: (space: Partial<ISpace>) =>
    set(state => {
      const spaceIds = map(state.spaces, s => s?.id);

      if (space?.id && includes(spaceIds, space?.id)) {
        return {
          ...state,
          spaces: map(state.spaces, s => {
            if (s?.id === space?.id) {
              return { ...s, ...space };
            }

            return s;
          }),
        };
      }

      if (space?.id) {
        return { ...state, spaces: [...state.spaces, space] };
      }

      return state;
    }),
  /** Update space info */
  setSpaceInfo: (spaceId: string, props: Record<string, any>) =>
    set(state => ({
      spaces: map(state.spaces, space => {
        if (space?.id && space?.id === spaceId) {
          return { ...space, ...props };
        }

        return space;
      }),
    })),
  clearCampsList: () =>
    set(state => ({ ...state, selectedSpaceId: '', spaces: [] })),
}));

export const useGameServer = create<IGameServerState>()(set => ({
  clientConnection: null,
  gameRoom: null,
  botRoom: null,
  roomChatMessages: [],
  isConnecting: false,
  players: [],
  botRoomIsResponding: false,
  setBotRoomIsResponding: (botRoomIsResponding: boolean) =>
    set(() => ({ botRoomIsResponding })),
  setBotRoom: (botRoom: BotRoom) => set(() => ({ botRoom })),
  setRoomChatMessages: roomChatMessages => set(() => ({ roomChatMessages })),
  setPlayers: (players: RoomUser[]) => set(() => ({ players })),
  startConnecting: () => set(() => ({ isConnecting: true })),
  endConnecting: () => set(() => ({ isConnecting: false })),
  setRoom: (gameRoom: CampRoom) => {
    set(() => ({ gameRoom }));
  },
  setClientConnection: (clientConnection: Client) => {
    set(() => ({ clientConnection }));
  },
}));
