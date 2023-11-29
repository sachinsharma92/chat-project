'use client';

import camelcaseKeys from 'camelcase-keys';
import EventEmitter from 'events';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useBotData } from '@/store/App';
import { head, isEmpty, map, pick, size, toString } from 'lodash';
import { isResponseStatusSuccess } from '@/lib/utils';
import { ChatMessageProps, OpenAIRoles } from '@/types';
import { useBotnetAuth } from '@/store/Auth';
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/hooks';
import { APIClient } from '@/lib/api';
import { BotChatPostResponse } from '@/app/api/bot-chat/route';
import { getGuestId } from '@/store/AuthProvider';
import { BotAudioResponse } from '@/app/api/bot-audio/route';
import { useMemo, useRef } from 'react';
import { isDevelopment, isStaging } from '@/lib/environment';

export const BotChatEvents = new EventEmitter();

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
  const syncAudioIntervalId = useRef<NodeJS.Timer | null | number>(null);

  const greeting = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);
    const greeting = spaceBotInfo?.greeting;

    return greeting || `Hi! What's on your mind?`;
  }, [spaceInfo]);

  /**
   * Grab mp3 file from protected route
   * @param message
   */
  const playBotAudio = (message: string): Promise<void> =>
    new Promise(async resolve => {
      try {
        const authHeaders = getSupabaseAuthHeaders();
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
            headers: {
              ...authHeaders,
              Accept: 'audio/mpeg',
            },
            responseType: 'blob',
          },
        );
        const resHeaders = audioRes?.headers;
        // @ts-ignore
        const audioBlob = new Blob([audioRes.data], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        if (
          resHeaders &&
          !isEmpty(resHeaders) &&
          resHeaders['x-visemes-data']
        ) {
          // send event for viseme facial data
          try {
            const visemes = JSON.parse(resHeaders['x-visemes-data']);
            const visemeData = visemes?.visemeData;
            const visemeQueue = [...visemeData];
            const evtPayload = {
              audioUrl,
              audioBlob,
              visemes: visemeData,
            };

            BotChatEvents.emit('audio', evtPayload);

            const emitVisemesEventForAudio = () => {
              if (isDevelopment || isStaging) {
                console.log('emitVisemesEventForAudio()');
              }

              const currentTime = audio.currentTime * 10000000; // Convert to 100 nanoseconds units
              const visemes = [];

              // Emit all visemes that should have occurred up until the current time
              while (
                visemeQueue.length > 0 &&
                // @ts-ignore
                head(visemeQueue)?.AudioOffset <= currentTime
              ) {
                const visemeEvent = visemeQueue.shift();
                const payload = {
                  VisemeId: visemeEvent.VisemeId,
                };

                visemes.push(payload);
              }

              if (!isEmpty(visemes)) {
                BotChatEvents.emit('visemes', { visemes });
              }
            };

            const clearVisemesIntervalEmit = () => {
              clearInterval(syncAudioIntervalId.current as number);
              syncAudioIntervalId.current = null;

              // end close mouth
              BotChatEvents.emit('visemes', {
                visemes: [
                  {
                    VisemeId: 1,
                  },
                  {
                    VisemeId: 0,
                  },
                ],
              });
            };

            const audio = document.getElementById(
              'bot-audio',
            ) as HTMLAudioElement;
            const onAudioEnd = () => {
              resolve();
              clearVisemesIntervalEmit();

              if (audio) {
                // safely unsubscribe
                audio.removeEventListener('error', onAudioEnd);
                audio.removeEventListener('pause', onAudioEnd);
                audio.removeEventListener('ended', onAudioEnd);
              }
            };

            if (audio) {
              audio.src = audioUrl;

              audio.addEventListener('play', () => {
                // run interval to sync lipsync with audio
                // in each interval function call we emit an event
                syncAudioIntervalId.current = setInterval(
                  emitVisemesEventForAudio,
                  400,
                );
              });
              audio.addEventListener('ended', onAudioEnd);
              audio.addEventListener('error', onAudioEnd);
              audio.play();
              // listen pause after play
              audio.addEventListener('pause', onAudioEnd);
            }
          } catch (err: any) {
            console.log(
              `JSON.parse(resHeaders['x-visemes-data'])() err:`,
              err?.message,
            );
          }
        }
      } catch (err: any) {
        console.log('playBotAudio() err:', err?.message);
      }
    });

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
        const botGreeting = {
          id: uuid(),
          authorId: '',
          message: greeting,
          role: OpenAIRoles.assistant,
        };
        const firstChatMessage = !messageHistory || isEmpty(messageHistory);
        const updatedMessages = [
          ...(firstChatMessage && !isEmpty(greeting) ? [botGreeting] : []),
          ...chatMessages,
          chatMessage,
        ];

        setBotRoomIsResponding(true);
        setChatMessages(updatedMessages);
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
          await playBotAudio(responseMessage);

          // store chat
          // insert completed chat
          setChatMessages([
            ...updatedMessages,
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

  const resetChat = () => {
    const botGreeting = {
      id: uuid(),
      authorId: '',
      message: greeting,
      role: OpenAIRoles.assistant,
    };
    const messageHistory: Partial<ChatMessageProps>[] = map(
      chatMessages,
      message => pick(message, ['role', 'message']),
    );

    if (
      isEmpty(messageHistory) ||
      size(messageHistory) <= 1 ||
      botRoomIsResponding
    ) {
      return;
    }

    setChatMessages([botGreeting]);
  };

  return { resetChat, sendBotChatMessage };
};
