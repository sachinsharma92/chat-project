'use client';

import EventEmitter from 'events';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useBotData } from '@/store/App';
import { filter, head, includes, isEmpty, map, pick, size, trim } from 'lodash';
import { ChatMessageProps, OpenAIRoles } from '@/types';
import { useBotnetAuth } from '@/store/Auth';
import { useAuth } from '@/hooks';
import { useCallback, useMemo } from 'react';
import {
  getUserPrivateDataById,
  updateUserPrivateDataProps,
} from '@/lib/supabase';

export const BotChatEvents = new EventEmitter();

/**
 * Call function to send message to bot
 * @returns
 */
export const useBotChat = () => {
  const [
    botRoomIsResponding,
    chatMessages,
    recentBotChat,
    recentUserChat,
    chatRoom,
    setChatMessages,
    storeLocalChatHistory,
    clearLocalChatHistory,
  ] = useBotData(state => [
    state.botRoomIsResponding,
    state.chatMessages,
    state.recentBotChat,
    state.recentUserChat,
    state.chatRoom,
    state.setChatMessages,
    state.storeLocalChatHistory,
    state.clearLocalChatHistory,
  ]);
  const { spaceId, spaceInfo } = useSelectedSpace();
  const { userId } = useAuth();
  const [session] = useBotnetAuth(state => [state.session]);

  const resetChat = useCallback(async () => {
    const messageHistory: Partial<ChatMessageProps>[] = map(
      chatMessages,
      message => pick(message, ['role', 'message']),
    );

    if (userId && session?.user) {
      // record last user chat reset on this space
      // so we can cover from filter when fetching for chat history
      const { data: userPrivateDataList } = await getUserPrivateDataById(
        userId,
      );
      const userPrivateData = head(userPrivateDataList);
      const sanitizedSpaceIdKey = trim(spaceId).replace(/\-/g, '_');

      await updateUserPrivateDataProps(userId, {
        chatResetAtMeta: {
          ...(userPrivateData?.chatResetAtMeta || {}),
          [sanitizedSpaceIdKey]: { date: new Date().toISOString() },
        },
      });
    }

    if (chatRoom) {
      console.log(`chatRoom.send('resetChat')`);
      chatRoom.send('resetChat', {});
    }

    setChatMessages([]);
    clearLocalChatHistory();

    if (
      isEmpty(messageHistory) ||
      size(messageHistory) <= 1 ||
      botRoomIsResponding
    ) {
      return;
    }

    // eslint-disable-next-line
  }, [
    chatRoom,
    chatRoom?.state?.users,
    botRoomIsResponding,
    session,
    userId,
    chatMessages,
    spaceId,
    storeLocalChatHistory,
    setChatMessages,
  ]);

  const sanitizedChatMessages = useMemo(
    () =>
      filter(chatMessages, (line, index) => {
        const totalMessages = size(chatMessages);
        const lastUserMessage = chatMessages[totalMessages - 2];

        if (
          // do not include last message bot response
          // if response is still in progress
          botRoomIsResponding &&
          totalMessages > 2 &&
          //
          ((index === totalMessages - 1 &&
            line?.role === OpenAIRoles.assistant &&
            includes(line?.message, recentBotChat) &&
            includes(lastUserMessage?.message, recentUserChat)) ||
            // do not show user response in the chat messages array if bot show is in progress
            (index === totalMessages - 2 &&
              lastUserMessage?.role === OpenAIRoles.user &&
              line?.message === lastUserMessage?.message &&
              lastUserMessage?.message === recentUserChat))
        ) {
          return false;
        }

        return !isEmpty(line?.id);
      }),
    [chatMessages, botRoomIsResponding, recentBotChat, recentUserChat],
  );

  const isLoading = useMemo(
    () =>
      !spaceInfo ||
      isEmpty(spaceInfo?.bots) ||
      !spaceInfo?.host ||
      isEmpty(sanitizedChatMessages),
    [spaceInfo, sanitizedChatMessages],
  );

  return { resetChat, isLoading, chatMessages: sanitizedChatMessages };
};
