import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useBotData } from '@/store/Spaces';
import { head, map, pick } from 'lodash';
import { isResponseStatusSuccess } from '@/lib/utils';
import { ChatMessageProps, OpenAIRoles } from '@/types';
import { useBotnetAuth } from '@/store/Auth';
import { guestId } from '@/store/GameServerProvider';
import { v4 as uuid } from 'uuid';

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
  const [userId] = useBotnetAuth(state => [state.session?.user?.id || guestId]);

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
        const res = await axios({
          method: 'POST',
          baseURL: '/',
          url: '/api/botchat',
          data: {
            message,
            spaceId,
            messageHistory,
            botFormId: bot?.formId,
            authorId: userId,
          },
        });
        const resData = res?.data;

        if (isResponseStatusSuccess(res) && resData?.messages) {
          const responseMessage = head(resData?.messages);
          // store chat
          // insert completed chat
          setChatMessages([
            ...chatMessages,
            chatMessage,
            {
              ...pick(responseMessage, [
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
