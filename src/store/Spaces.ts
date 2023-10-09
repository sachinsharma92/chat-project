'use client';

import {
  IAppState,
  ISpaceStoreState,
  IGameServerState,
  RoomUser,
  ISpace,
} from '@/types';
import { create } from 'zustand';
import { Room, Client } from 'colyseus.js';
import { DialogEnums } from '@/types/dialog';

export const useAppStore = create<IAppState>()(set => ({
  expandInfoSidebar: false,
  expandBulletinSidebar: false,
  showDialog: false,
  showDialogType: DialogEnums.none,

  setShowDialog: (showDialog: boolean, showDialogType: DialogEnums) =>
    set({ showDialog, showDialogType }),
  setExpandBulletinSidebar: expandBulletinSidebar =>
    set({ expandBulletinSidebar: Boolean(expandBulletinSidebar) }),
  setExpandInfoSidebar: expandInfoSidebar =>
    set({ expandInfoSidebar: Boolean(expandInfoSidebar) }),
}));

export const useSpacesStore = create<ISpaceStoreState>()(set => ({
  spaces: [],
  selectedSpaceId: '',
  addSpace: (space: Partial<ISpace>) =>
    set(state => ({ spaces: [...state.spaces, space] })),
  setSelectedSpaceId: (selectedSpaceId: string) =>
    set(() => ({ selectedSpaceId })),
  clearCampsList: () =>
    set(state => ({ ...state, selectedSpaceId: '', spaces: [] })),
}));

export const useGameServer = create<IGameServerState>()(set => ({
  userId: '',
  clientConnection: null,
  room: null,
  roomChatMessages: [],
  isConnecting: false,
  players: [],
  setRoomChatMessages: roomChatMessages => set(() => ({ roomChatMessages })),
  setPlayers: (players: RoomUser[]) => set(() => ({ players })),
  setUserId: (userId: string) => set(() => ({ userId })),
  startConnecting: () => set(() => ({ isConnecting: true })),
  endConnecting: () => set(() => ({ isConnecting: false })),
  setRoom: (room: Room) => {
    set(() => ({ room }));
  },
  setClientConnection: (clientConnection: Client) => {
    set(() => ({ clientConnection }));
  },
}));
