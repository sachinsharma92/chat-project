'use client';

import {
  IAppState,
  ISpaceStoreState,
  ISpace,
  IBotData,
  SpaceContentTabEnum,
  OpenAIRoles,
} from '@/types';
import { create } from 'zustand';
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
    set(state => {
      const spaceIds = map(state.spaces, s => s?.id);

      if (includes(spaceIds, spaceId)) {
        return {
          spaces: map(state.spaces, space => {
            if (space?.id && space?.id === spaceId) {
              return { ...space, ...props };
            }

            return space;
          }),
        };
      }

      if (spaceId) {
        return {
          spaces: [...state.spaces, props],
        };
      }

      return state;
    }),
  clearCampsList: () =>
    set(state => ({ ...state, selectedSpaceId: '', spaces: [] })),
}));

export const botnetChatHistoryLocalKey = 'botnetChatHistoryLocalKey';

/**
 * For bot 1:1 chat related states
 */
export const useBotData = create<IBotData>()(set => ({
  chatMessages: [],
  botRoomIsResponding: false,
  fetchingChatHistory: false,
  botServerColyseusClient: null,
  chatRoom: null,
  leavingChatRoom: false,
  connectingChatroom: false,
  recentBotChat: '',
  recentUserChat: '',
  setRecentUserChat(recentUserChat) {
    return set(() => ({ recentUserChat }));
  },
  setRecentBotChat(recentBotChat) {
    return set(() => ({ recentBotChat }));
  },
  setConnectingChatRoom(connectingChatroom) {
    return set(() => ({ connectingChatroom }));
  },
  setLeavingChatRoom(leavingChatRoom) {
    return set(() => ({ leavingChatRoom }));
  },
  setChatRoom(chatRoom) {
    return set(() => ({ chatRoom }));
  },
  setBotServerColyseusClient(botServerColyseusClient) {
    return set(() => ({ botServerColyseusClient }));
  },
  setFetchingChatHistory(fetchingChatHistory) {
    return set(() => ({ fetchingChatHistory }));
  },

  clearChatMessages() {
    return set(() => ({ chatMessages: [] }));
  },

  setChatMessages: chatMessages => {
    set(state => {
      const incomingFirstMessage = head(chatMessages);
      const prevFirstMessage = head(state?.chatMessages);

      if (
        incomingFirstMessage?.message !== prevFirstMessage?.message &&
        !isEmpty(prevFirstMessage?.message) &&
        prevFirstMessage?.role === OpenAIRoles.assistant
      ) {
        return { chatMessages: [prevFirstMessage, ...chatMessages] };
      }

      return { chatMessages };
    });
  },
  clearLocalChatHistory() {
    localStorage.setItem(botnetChatHistoryLocalKey, JSON.stringify([]));
  },

  setBotRoomIsResponding: (botRoomIsResponding: boolean) =>
    set(() => ({ botRoomIsResponding })),

  storeLocalChatHistory() {
    // used to save chat history for non logged in users
    /// save
    console.log('storeLocalChatHistory()');

    return set(state => {
      const sanitizedChatMessages = cloneDeep(state?.chatMessages);
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

      return state;
    });
  },
  restoreLocalChatHistory(chatMessages) {
    // used to restore chat for non logged in users
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
      } else if (chatMessages && !isEmpty(chatMessages)) {
        return set(state => ({
          chatMessages: [...chatMessages, ...state.chatMessages],
        }));
      }
    } catch (err) {}
  },
}));
