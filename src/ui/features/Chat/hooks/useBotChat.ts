import camelcaseKeys from 'camelcase-keys';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useBotData } from '@/store/App';
import { head, isEmpty, map, pick, toString } from 'lodash';
import { isResponseStatusSuccess } from '@/lib/utils';
import { ChatMessageProps, OpenAIRoles } from '@/types';
import { useBotnetAuth } from '@/store/Auth';
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/hooks';
import { APIClient } from '@/lib/api';
import { BotChatPostResponse } from '@/app/api/bot-chat/route';
import { getGuestId } from '@/store/AuthProvider';
import { BotAudioResponse } from '@/app/api/bot-audio/route';

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
    state.session?.user?.id || getGuestId(),
    state.displayName,
    state.image,
  ]);
  const { getSupabaseAuthHeaders } = useAuth();

  /**
   * Grab mp3 file from protected route
   * @param message
   */
  const playBotAudio = async (message: string) => {
    try {
      const authHeaders = getSupabaseAuthHeaders();
      const reqHeaders = {
        ...authHeaders,
      };
      const spaceBot = head(spaceInfo?.bots);
      const spaceBotId = toString(spaceBot?.id);
      const audioRes = await APIClient.post<BotAudioResponse>(
        '/api/bot-audio',
        {
          userId,
          message,
          spaceId,
          spaceBotId,
        },
        {
          headers: reqHeaders,
        },
      );

      if (audioRes?.data?.publicUrl?.endsWith('.mp3')) {
        const publicUrl = audioRes?.data?.publicUrl;
        const audio = document.getElementById('bot-audio') as HTMLAudioElement;

        if (audio) {
          audio.src = publicUrl;
          audio.play();
        }
      }
    } catch (err: any) {
      console.log('playBotAudio() err:', err?.message);
    }
  };

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
        const reqHeaders = {
          ...authHeaders,
        };
        const res = await APIClient.post<BotChatPostResponse>(
          '/api/bot-chat',
          {
            message,
            spaceId,
            messageHistory,
            botFormId: bot?.formId,
            authorId: userId,
          },
          {
            headers: reqHeaders,
          },
        );
        const resData = res?.data;

        if (isResponseStatusSuccess(res) && !isEmpty(resData?.messages)) {
          const responseMessagePayload = head(
            resData?.messages || [],
          ) as Record<string, any>;
          const responseMessage = responseMessagePayload?.message;
          console.log(responseMessage);

          await playBotAudio(responseMessage);

          // store chat
          // insert completed chat
          setChatMessages([
            ...chatMessages,
            chatMessage,
            {
              ...pick(camelcaseKeys(responseMessagePayload), [
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
