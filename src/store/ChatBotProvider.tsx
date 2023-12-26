'use client';

import {
  head,
  includes,
  isEmpty,
  isNumber,
  isString,
  map,
  pick,
  toString,
} from 'lodash';
import {
  Dispatch,
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Client } from 'colyseus.js';
import { useBotData } from './App';
import { ChatMessage, ChatRoomState } from '@/colyseus/schemas';
import { useBotnetAuth } from './Auth';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useAuth } from '@/hooks';
import { ChatMessageProps } from '@/types';
import { environment, isDevelopment } from '@/lib/environment';
import { timeout } from '@/lib/utils';

import PQueue from 'p-queue';

import camelcaseKeys from 'camelcase-keys';

import posthog from 'posthog-js';
import { BotChatEvents } from '@/hooks/useBotChat';
import { ArraySchema } from '@colyseus/schema';

export const getBotServerHost = () => {
  return process.env.NEXT_PUBLIC_BOTNET_SOCKET_SERVER_HOST;
};

export const getBotServerPort = () => {
  return process.env.NEXT_PUBLIC_BOTNET_SOCKET_SERVER_PORT;
};

export const ChatRoomName = 'ChatRoom';

export const chatBotErrorChannel = 'chatBotError';

export const chatBotResponseChannel = 'chatBot';

export const chatBotResponseEndChannel = 'chatBotEnd';

export const chatBotAudioResponseChannel = 'chatBotAudio';

function convertURIToBinary(base64: string) {
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }

  return arr;
}

enum ChatBotProviderActions {}

interface IChatBotGameContextState {}

type Action = {
  type: keyof typeof ChatBotProviderActions;
  data: any;
};

const initialState: IChatBotGameContextState = {};

export const ChatBotResponseTextQueue: string[] = [];

export const ChatBotResponseQueue = new PQueue({ concurrency: 1 });

export const ChatBotAudioResponseQueue = new PQueue({
  concurrency: 1,
});

export const ChatBotStateContext = createContext<{
  state: IChatBotGameContextState;
  dispatch: Dispatch<Action>;
  sendChat: (message: string) => void;
  leaveChatRoom: () => Promise<void>;
  connectChatRoom: () => Promise<void>;
}>(
  // @ts-ignore
  null,
);

const reducer = (state: IChatBotGameContextState, action: Action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const ChatBotProvider = (props: { children?: ReactNode }) => {
  const { children } = props;

  const [state, dispatch] = useReducer(reducer, initialState);
  const [
    chatRoom,
    botServerColyseusClient,
    leavingChatRoom,
    connectingChatroom,
    botRoomIsResponding,
    chatMessages,
    setBotServerColyseusClient,
    setChatRoom,
    setChatMessages,
    setLeavingChatRoom,
    setConnectingChatRoom,
    setBotRoomIsResponding,
    setRecentBotChat,
    setRecentUserChat,
    storeLocalChatHistory,
  ] = useBotData(state => [
    state.chatRoom,
    state.botServerColyseusClient,
    state.leavingChatRoom,
    state.connectingChatroom,
    state.botRoomIsResponding,
    state.chatMessages,
    state.setBotServerColyseusClient,
    state.setChatRoom,
    state.setChatMessages,
    state.setLeavingChatRoom,
    state.setConnectingChatRoom,
    state.setBotRoomIsResponding,
    state.setRecentBotChat,
    state.setRecentUserChat,
    state.storeLocalChatHistory,
  ]);

  const [authIsLoading, email, displayName, image, session] = useBotnetAuth(
    state => [
      state.isLoading,
      state.email,
      state.displayName,
      state.image,
      state.session,
    ],
  );

  const { userId } = useAuth();

  const { spaceId, spaceInfo } = useSelectedSpace();

  const responseTimeoutId = useRef<NodeJS.Timer | null | number>(null);

  const syncAudioIntervalId = useRef<NodeJS.Timer | null | number>(null);

  const consumeUserChatMessages = (chatMessages: ArraySchema<ChatMessage>) => {
    const sanitizedMessages = map(chatMessages, chatMessage => {
      const payload = pick(chatMessage, [
        'id',
        'spaceId',
        'message',
        'role',
        'authorId',
        'createdAt',
      ]);

      return payload as ChatMessageProps;
    });

    if (isDevelopment) {
      console.log('consumeUserChatMessages()', sanitizedMessages);
    }

    setChatMessages([...sanitizedMessages]);
  };

  const onRoomStateChange = (updatedState: ChatRoomState) => {
    if (updatedState?.users) {
      const user = updatedState.users.get(userId);

      if (user?.userId && !isEmpty(user?.chatMessages)) {
        consumeUserChatMessages(user.chatMessages);
      }

      if (user?.botIsResponding) {
        setBotRoomIsResponding(true);
      }
    }
  };

  /**
   * Error from chat message
   */
  const onChatRoomError = (params: any) => {
    console.log('onChatRoomError()', params);
    setBotRoomIsResponding(false);

    clearTimeout(responseTimeoutId.current as number);

    ChatBotResponseQueue.clear();
    ChatBotResponseTextQueue.length = 0;
  };

  const consumeChatBotResponse = useCallback(
    async (end?: boolean) => {
      // chat effect
      await timeout(200);
      const completedText = ChatBotResponseTextQueue.shift();

      if (completedText) {
        setRecentBotChat(toString(completedText));
      }

      if (end) {
        setBotRoomIsResponding(false);
        setRecentBotChat('');
        setRecentUserChat('');
      }

      if (end && !session?.user) {
        storeLocalChatHistory();
      }
    },
    [
      session?.user,
      setBotRoomIsResponding,
      storeLocalChatHistory,
      setRecentBotChat,
      setRecentUserChat,
    ],
  );

  /**
   * Chunk text response
   */
  const onChatBotResponse = useCallback(
    (payload: any) => {
      if (isString(payload?.message) && isString(payload?.completedText)) {
        const completedText = toString(payload.completedText);

        ChatBotResponseTextQueue.push(completedText);
        ChatBotResponseQueue.add(async () => {
          await consumeChatBotResponse();
        });
      }
    },
    [consumeChatBotResponse],
  );

  /**
   * End of stream response
   */
  const onChatBotLastResponse = useCallback(() => {
    console.log('onChatBotLastResponse()');
    clearTimeout(responseTimeoutId.current as number);

    ChatBotResponseQueue.add(async () => {
      await consumeChatBotResponse(true);
    });
  }, [consumeChatBotResponse]);

  const playAudio = useCallback((base64Audio: string): Promise<void> => {
    return new Promise(resolve => {
      if (!base64Audio) {
        resolve();
        return;
      }

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

      // Create a blob from the Uint8Array
      const audioBlob = new Blob([convertURIToBinary(base64Audio)], {
        type: 'audio/mpeg',
      });
      if (audioBlob) {
        const audioUrl = URL.createObjectURL(audioBlob);

        const audioSource = document.getElementById(
          'bot-audio-source',
        ) as HTMLSourceElement;
        const audioElem = document.getElementById(
          'bot-audio',
        ) as HTMLAudioElement;
        const onAudioStalled = function () {
          audioElem.load();
          audioElem.play();
          // audioElem.pause();
        };

        const onAudioPlay = () => {
          // run interval to sync lipsync with audio
          // in each interval function call we emit an event
          syncAudioIntervalId.current = setInterval(
            emitVisemesEventForAudio,
            500,
          );
        };

        const onAudioEnd = () => {
          try {
            clearVisemesIntervalEmit();

            const updatedAudioElem = document.getElementById(
              'bot-audio',
            ) as HTMLAudioElement;

            if (updatedAudioElem) {
              // safely unsubscribe
              updatedAudioElem.removeEventListener('error', onAudioEnd);
              updatedAudioElem.removeEventListener('ended', onAudioEnd);
              updatedAudioElem.removeEventListener('play', onAudioPlay);
            }

            // avoid memory leak
            URL.revokeObjectURL(audioUrl);
          } catch (err: any) {
            console.log('onAudioEnd() err:', err?.message);
          } finally {
            resolve();
          }
        };

        document.body.append(audioElem);

        audioElem.addEventListener('play', onAudioPlay);

        audioElem.muted = false;
        audioElem.volume = 1;
        audioElem.addEventListener('ended', onAudioEnd);
        audioElem.addEventListener('error', onAudioEnd);
        audioElem.addEventListener('stalled', onAudioStalled);

        audioSource.src = audioUrl;
        audioElem.load();
        audioElem.play();
      }
    });
  }, []);

  const onChatBotAudioResponse = useCallback(
    (payload: any) => {
      if (payload?.base64Audio) {
        ChatBotAudioResponseQueue.add(async () => {
          try {
            await playAudio(payload.base64Audio);
          } catch (err: any) {
            console.log('playAudio err', err?.message);
            posthog.capture('AudioError', { userId, env: environment });
          }
        });
      }
    },

    [userId, playAudio],
  );

  const emitVisemesEventForAudio = () => {
    if (isDevelopment) {
      console.log('emitVisemesEventForAudio()');
    }

    BotChatEvents.emit('visemes', {
      visemes: [
        {
          VisemeId: 0,
        },
        { VisemeId: 8 },
        { VisemeId: 4 },
        { VisemeId: 17 },
        { VisemeId: 16 },
        { VisemeId: 6 },
        { VisemeId: 21 },
      ],
    });
  };

  const connectChatRoom = useCallback(async (): Promise<void> => {
    if (
      connectingChatroom ||
      chatRoom ||
      !botServerColyseusClient ||
      authIsLoading
    ) {
      return;
    }

    setConnectingChatRoom(true);

    try {
      console.log('connectChatRoom()');

      const chatHistory = chatMessages;
      const accessToken = session?.access_token || '';
      const refreshToken = session?.refresh_token || '';
      const newChatRoom =
        await botServerColyseusClient.joinOrCreate<ChatRoomState>(
          ChatRoomName,
          {
            chatHistory,
            accessToken,
            refreshToken,
            userId,
            spaceId,
            displayName,
            image,
          },
          ChatRoomState,
        );

      if (!newChatRoom) {
        throw new Error('Empty newChatRoom');
      }

      newChatRoom.onStateChange(onRoomStateChange);
      newChatRoom.onMessage(chatBotErrorChannel, onChatRoomError);
      newChatRoom.onMessage(chatBotResponseChannel, onChatBotResponse);
      newChatRoom.onMessage(chatBotResponseEndChannel, onChatBotLastResponse);
      newChatRoom.onMessage(
        chatBotAudioResponseChannel,
        onChatBotAudioResponse,
      );
      setChatRoom(newChatRoom);

      await timeout(500);
    } catch (err: any) {
      console.log('connectChatRoom() err:', err?.message);
    } finally {
      setConnectingChatRoom(false);
    }

    // eslint-disable-next-line
  }, [
    session?.user,
    session?.access_token,
    session?.refresh_token,
    authIsLoading,
    spaceId,
    chatRoom,
    displayName,
    image,
    userId,
    connectingChatroom,
    botServerColyseusClient,
    chatMessages,
    onChatBotResponse,
    onChatBotLastResponse,
    setConnectingChatRoom,
    setChatRoom,
    setBotRoomIsResponding,
  ]);

  const leaveChatRoom = async (): Promise<void> => {
    try {
      if (!chatRoom || leavingChatRoom) {
        return;
      }

      setBotRoomIsResponding(false);
      setRecentBotChat('');
      setRecentUserChat('');
      setLeavingChatRoom(true);
      chatRoom.removeAllListeners();
      await chatRoom?.leave(true);

      setConnectingChatRoom(false);
      setChatRoom(null);
      setChatMessages([]);
    } catch (err: any) {
      console.log('leaveChatRoom() err:', err?.message);
    } finally {
      setLeavingChatRoom(true);
    }
  };

  /**
   * Initialize colyseus client
   * Connect to chat room ws client
   */
  useEffect(() => {
    const init = () => {
      if (botServerColyseusClient || !spaceId || (authIsLoading && !email)) {
        return;
      }

      const host = getBotServerHost() || '';
      const hostname =
        host.replace(/:.*/, '') ||
        window.document.location.host.replace(/:.*/, '');
      const port = parseFloat(getBotServerPort() || location?.port);
      const secure = includes(window.location.protocol, 'https');
      const url = `ws://${hostname || 'localhost'}${
        port && isNumber(port) ? `:${port}` : ''
      }`;
      const client = new Client({
        secure,
        hostname,
        pathname: '',
        ...(isNumber(port) && port > 0 && { port }),
      });

      setBotServerColyseusClient(client);

      console.log('client', client);
      console.log('ChatBotProvider init() success url:', url);
    };

    init();
  }, [
    spaceId,
    botServerColyseusClient,
    authIsLoading,
    email,
    setBotServerColyseusClient,
  ]);

  useEffect(() => {
    if (
      botServerColyseusClient &&
      !chatRoom &&
      spaceId &&
      !isEmpty(chatMessages)
    ) {
      connectChatRoom();
    }
  }, [
    botServerColyseusClient,
    chatRoom,
    spaceId,
    chatMessages,
    connectChatRoom,
  ]);

  const sendChat = (message: string) => {
    try {
      if (!chatRoom) {
        throw new Error('chatRoom undefined');
      }

      if (botRoomIsResponding) {
        return;
      }

      setBotRoomIsResponding(true);
      setRecentUserChat(message);

      const bot = camelcaseKeys(head(spaceInfo?.bots) || {});
      const botFormId = bot?.formId;
      const owner = spaceInfo?.host?.userId;
      const spaceBotId = toString(bot?.id);

      chatRoom.send('chat', {
        message,
        userId,
        owner,
        spaceBotId,
        botFormId,
        spaceId,
      });

      clearTimeout(responseTimeoutId.current as number);

      responseTimeoutId.current = setTimeout(() => {
        // responses shouldn't take 10 seconds beyond
        setBotRoomIsResponding(false);
        setRecentBotChat('');
        setRecentUserChat('');
        clearTimeout(responseTimeoutId.current as number);
      }, 15_000);
    } catch (err: any) {
      console.log('sendChat() err:', err?.message);

      setBotRoomIsResponding(false);

      posthog.capture('ChatBot', { userId, env: environment });
    }
  };

  return (
    <ChatBotStateContext.Provider
      value={{ state, dispatch, sendChat, leaveChatRoom, connectChatRoom }}
    >
      {children}
    </ChatBotStateContext.Provider>
  );
};

export default ChatBotProvider;
