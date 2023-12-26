'use client';

import { EyeOpenIcon, FileIcon, Microphone, ResetIcon } from '@/icons';
import { useForm } from 'react-hook-form';
import { useBotData } from '@/store/App';
import { useContext, useEffect, useRef, useState } from 'react';
import { map } from 'lodash';
import { OpenAIRoles } from '@/types';
import { ChatBotStateContext } from '@/store/ChatBotProvider';
import { useBotChat } from '@/hooks/useBotChat';

import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import './BotChat.css';

const BotChat = () => {
  const { handleSubmit, register, setValue } = useForm();

  const [botRoomIsResponding, recentBotChat, recentUserChat] = useBotData(
    state => [
      state.botRoomIsResponding,
      state.recentBotChat,
      state.recentUserChat,
    ],
  );

  const { sendChat } = useContext(ChatBotStateContext);

  const {
    resetChat,
    chatMessages: sanitizedChatMessages,
    isLoading,
  } = useBotChat();

  const [resettingChat, setResettingChat] = useState(false);

  const chatStreamDomRef = useRef<any>(null);

  const handleChat = async (data: any) => {
    const message = data?.message;

    if (!message || resettingChat || botRoomIsResponding) {
      return;
    }

    sendChat(message);
    setValue('message', '');

    const audioElem = document.getElementById('bot-audio') as HTMLAudioElement;
    const audioSource = document.getElementById(
      'bot-audio-source',
    ) as HTMLSourceElement;

    if (audioElem && audioSource) {
      // ios audio fix
      audioSource.src =
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

      audioElem.load();
      audioElem.play();
    }
  };

  /**
   * Clear chat array
   */
  const onResetChat = async () => {
    try {
      if (resettingChat) {
        return;
      }

      setResettingChat(true);

      await resetChat();
    } catch {
    } finally {
      setResettingChat(false);
    }
  };

  /** Scroll on new chat */
  useEffect(() => {
    /** Scroll stream chat down bottom  */
    const scrollChatToBottom = () => {
      const chatStreamDom = chatStreamDomRef?.current;

      if (chatStreamDom?.scroll) {
        chatStreamDom.scroll({
          top: chatStreamDom.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    scrollChatToBottom();
  }, [botRoomIsResponding, sanitizedChatMessages, recentBotChat]);

  return (
    <div className="bot-chat">
      <div
        className="chat-stream"
        id="space-content-chat-stream"
        ref={chatStreamDomRef}
      >
        <div className="relative w-full flex justify-end items-center box-border p-0 pr-[2px] mb-[8px]">
          <Button
            className="reset-chat"
            onClick={onResetChat}
            isLoading={resettingChat}
          >
            <ResetIcon />
            <p>Reset Chat</p>
          </Button>
          <Button className="hidden w-0 h-0 overflow-hidden">
            <EyeOpenIcon />
            <p>Hide Chat</p>
          </Button>
        </div>

        <ul>
          {map(sanitizedChatMessages, message => {
            const key = `${message?.id}`;
            const isBot = message?.role === OpenAIRoles.assistant;
            const chat = message?.message;

            return (
              <li key={key}>
                {isBot && <BotMessage message={chat} />}
                {!isBot && <UserMessage message={chat} />}
              </li>
            );
          })}

          {botRoomIsResponding && (
            <>
              <li>
                <UserMessage message={recentUserChat} />
              </li>
              <li>
                <BotMessage message={recentBotChat} />
              </li>
            </>
          )}
        </ul>
      </div>

      {!botRoomIsResponding && (
        <form
          onSubmit={handleSubmit(handleChat)}
          className="chat-input-container"
        >
          <Button className="attach-file">
            <FileIcon />
          </Button>
          <TextInput
            {...register('message', {
              required: false,
            })}
            placeholder="Message...."
            className="chat-form-input"
            // @ts-ignore
            maxLength={120}
          />
          <Button className="mic">
            <Microphone />
          </Button>
        </form>
      )}

      {isLoading && (
        <div className="bot-chat-loading">
          <LoadingSpinner width={30} />
        </div>
      )}
    </div>
  );
};

export default BotChat;
