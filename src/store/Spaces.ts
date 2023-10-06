'use client';

import {
  IAppState,
  ISpaceStoreState,
  IGameServerState,
  RoomUser,
} from '@/types';
import { create } from 'zustand';
import { Room, Client } from 'colyseus.js';
import { DialogEnums } from '@/types/dialog';

// for demo purposes only
const demoSpaces = [
  {
    image: '/assets/camp-tonari.png',
    name: 'Camp Cai',
    id: 'camp-cai-id-test-1',
    description:
      'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
    host: {
      name: 'Jeremy Cai',
      image: '',
    },
    selected: true,
  },
  {
    image: '/assets/camp-notpot.svg',
    name: 'Camp Not Pot',
    id: 'camp-not-pot-id-test-2',
    description:
      'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
    host: {
      name: 'Not Pot',
      image: '',
    },
    selected: false,
  },
  {
    image: '/assets/camp-3.svg',
    name: 'Camp 3',
    id: 'camp-3-id-test-3',
    description:
      'Welcome to my little internet campground! Enjoy the tunes and leave a message on the bulletin.',
    host: {
      name: 'Camp 3',
      image: '',
    },
    selected: false,
  },
];

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
  spaces: [...demoSpaces],
  selectedSpaceId: '',
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
