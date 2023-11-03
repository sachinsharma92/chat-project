import camelcaseKeys from 'camelcase-keys';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useBotData } from '@/store/App';
import { head, isEmpty, map, pick } from 'lodash';
import { isResponseStatusSuccess } from '@/lib/utils';
import { ChatMessageProps, OpenAIRoles } from '@/types';
import { useBotnetAuth } from '@/store/Auth';
import { guestId } from '@/store/GameServerProvider';
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/hooks';
import { APIClient } from '@/lib/api';
import { BotChatPostResponse } from '@/app/api/botchat/route';

/**
 * Call function to send message to bot
 * @returns
 */
export const useBotChat = () => {
  const [
    botRoomIsResponding,
    chatMessages,
    setBotRoomIsResponding,
    setChatMessages,
  ] = useBotData(state => [
    state.botRoomIsResponding,
    state.chatMessages,
    state.setBotRoomIsResponding,
    state.setChatMessages,
  ]);
  const { spaceId, spaceInfo } = useSelectedSpace();
  const [userId, displayName, image] = useBotnetAuth(state => [
    state.session?.user?.id || guestId,
    state.displayName,
    state.image,
  ]);
  const { getSupabaseAuthHeaders } = useAuth();

  /**
   * Send a chat message for 1:1 bot chat
   * @param message
   */
  const sendBotChatMessage = async (message: string) => {
    try {
      if (botRoomIsResponding) {
        return;
      }

      if (message && spaceId) {
        const chatMessage: ChatMessageProps = {
          id: uuid(),
          message,
          spaceId,
          authorId: userId,
          authorInfo: {
            displayName,
            image,
          },
          role: OpenAIRoles.user,
          createdAt: new Date().toISOString(),
        };
        const messageHistory: Partial<ChatMessageProps>[] = map(
          chatMessages,
          message => pick(message, ['role', 'message']),
        );

        setBotRoomIsResponding(true);
        setChatMessages([...chatMessages, chatMessage]);
        const bot = camelcaseKeys(head(spaceInfo?.bots) || {});
        const authHeaders = getSupabaseAuthHeaders();

        const res = await APIClient.post<BotChatPostResponse>(
          '/api/botchat',
          {
            message,
            spaceId,
            messageHistory,
            botFormId: bot?.formId,
            authorId: userId,
          },
          {
            headers: {
              ...authHeaders,
            },
          },
        );
        const resData = res?.data;

        if (isResponseStatusSuccess(res) && !isEmpty(resData?.messages)) {
          const responseMessage = head(resData?.messages || []) as Record<
            string,
            any
          >;

          // store chat
          // insert completed chat
          setChatMessages([
            ...chatMessages,
            chatMessage,
            {
              ...pick(camelcaseKeys(responseMessage), [
                'id',
                'role',
                'spaceId',
                'message',
                'createdAt',
              ]),
            } as ChatMessageProps,
          ]);
        }

        setBotRoomIsResponding(false);
      }
    } catch (err: any) {
      console.log('sendBotChatMessage() err:', err?.message);
    }
  };

  return {
    sendBotChatMessage,
  };
};
