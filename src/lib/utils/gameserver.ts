import { ChatMessageProps, RoomUser } from '@/types';
import { ArraySchema, MapSchema } from '@colyseus/schema';
import { isEmpty, pick } from 'lodash';

/**
 * Format and consume online users
 * @param roomUsers
 * @returns
 */
export const consumeUsers = (roomUsers: MapSchema<RoomUser>) => {
  if (!roomUsers?.entries) {
    return [];
  }

  const updated: RoomUser[] = [];

  roomUsers.forEach((user: any) => {
    if (user && !isEmpty(user) && !user?.removed) {
      updated.push(
        pick(user, [
          'posX',
          'posY',
          'posZ',
          'x',
          'y',
          'z',
          'displayName',
          'userId',
          'recentChatSentDate',
          'recentChatMessage',
        ]),
      );
    }
  });

  return [...updated];
};

/**
 * Format and consume chat/stream history
 * @param chatMessages
 * @returns
 */
export const consumeChatMessages = (
  chatMessages: ArraySchema<ChatMessageProps>,
) => {
  const messages: ChatMessageProps[] = [];

  if (!chatMessages) {
    return [];
  }

  chatMessages.forEach((msg: any) => {
    if (msg && !isEmpty(msg)) {
      messages.push(
        pick(msg, [
          'message',
          'isGuest',
          'authorId',
          'authorInfo',
          'id',
          'role',
        ]),
      );
    }
  });

  return messages;
};
