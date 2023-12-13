'use client';

import {
  IAppState,
  ISpaceStoreState,
  IGameServerState,
  RoomUser,
  ISpace,
  CampRoom,
  BotRoom,
  IBotData,
  SpaceContentTabEnum,
  OpenAIRoles,
} from '@/types';
import { create } from 'zustand';
import { Client } from 'colyseus.js';
import { DialogEnums, MobileDrawerEnums } from '@/types/dialog';
import { cloneDeep, head, includes, isEmpty, map } from 'lodash';

/**
 * In-app related states
 */
export const useAppStore = create<IAppState>()(set => ({
  expandBulletinSidebar: true,
  showDialog: false,
  showDialogType: DialogEnums.none,
  showMobileDrawer: false,
  showMobileDrawerType: MobileDrawerEnums.none,
  spaceContentTab: SpaceContentTabEnum.home,
  setSpaceContentTab(spaceContentTab: SpaceContentTabEnum) {
    return set({ spaceContentTab });
  },

  setShowMobileDrawer: (
    showMobileDrawer: boolean,
    showMobileDrawerType: MobileDrawerEnums,
  ) =>
    set(() => ({
      showMobileDrawer,
      showMobileDrawerType,
    })),
  setShowDialog: (showDialog: boolean, showDialogType: DialogEnums) =>
    set(() => ({ showDialog, showDialogType })),
  setExpandBulletinSidebar: expandBulletinSidebar =>
    set(() => ({ expandBulletinSidebar: Boolean(expandBulletinSidebar) })),
}));

/**
 * Stores active space info
 */
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

/**
 * For gameserver multiplayer states
 */
export const useGameServer = create<IGameServerState>()(set => ({
  clientConnection: null,
  gameRoom: null,
  botRoom: null,
  roomChatMessages: [],
  isConnecting: false,
  players: [],
  setBotRoom: (botRoom: BotRoom | null) => set(() => ({ botRoom })),
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

export const botnetChatHistoryLocalKey = 'botnetChatHistoryLocalKey';

/**
 * For bot 1:1 chat related states
 */
export const useBotData = create<IBotData>()(set => ({
  chatMessages: [],
  botRoomIsResponding: false,
  setChatMessages: chatMessages => set(() => ({ chatMessages })),
  setBotRoomIsResponding: (botRoomIsResponding: boolean) =>
    set(() => ({ botRoomIsResponding })),
  storeChatHistory(chatMessages) {
    /// save
    if (!isEmpty(chatMessages)) {
      const sanitizedChatMessages = cloneDeep(chatMessages);
      const firstMessage = head(sanitizedChatMessages);

      if (
        firstMessage?.role === OpenAIRoles.assistant ||
        firstMessage?.role === OpenAIRoles.system
      ) {
        // remove greeting text
        sanitizedChatMessages.shift();
      }

      // @todo limit number of messages
      localStorage.setItem(
        botnetChatHistoryLocalKey,
        JSON.stringify(sanitizedChatMessages),
      );
    }
  },
  restoreChatHistory(chatMessages) {
    /// restore
    try {
      const chatMessagesStr = localStorage.getItem(botnetChatHistoryLocalKey);
      if (chatMessagesStr && !isEmpty(chatMessagesStr)) {
        const storedChatMessages = JSON.parse(chatMessagesStr);

        return set(state => {
          return {
            ...state,
            chatMessages: [...(chatMessages || []), ...storedChatMessages],
          };
        });
      }
    } catch (err) {}
  },
}));
