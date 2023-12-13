'use client';

import { EyeOpenIcon, FileIcon, Microphone, ResetIcon } from '@/icons';
import { useForm } from 'react-hook-form';
import { useBotData } from '@/store/App';
import { useEffect, useMemo, useRef } from 'react';
import { filter, isEmpty, map } from 'lodash';
import { useBotChat } from '../../Chat/hooks/useBotChat';
import { OpenAIRoles } from '@/types';

import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';

import './BotChat.css';

const BotChat = () => {
  const { handleSubmit, register, setValue } = useForm();

  const { sendBotChatMessage, resetChat } = useBotChat();

  const [botRoomIsResponding, chatMessages] = useBotData(state => [
    state.botRoomIsResponding,
    state.chatMessages,
  ]);

  const chatStreamDomRef = useRef<any>(null);

  const sanitizedChatMessages = useMemo(
    () => filter(chatMessages, line => !isEmpty(line?.id)),
    [chatMessages],
  );

  const sendChat = (data: any) => {
    const message = data?.message;

    if (!message || botRoomIsResponding) {
      return;
    }

    setValue('message', '');
    sendBotChatMessage(message);
  };

  /**
   * Clear chat array
   */
  const onResetChat = () => {
    resetChat();
  };

  /** Scroll on new chat */
  useEffect(() => {
    /** Scroll stream chat down bottom  */
    const scrollChatToBottom = () => {
      const timeoutId = setTimeout(() => {
        const chatStreamDom = chatStreamDomRef?.current;

        if (
          chatStreamDom?.scroll &&
          sanitizedChatMessages &&
          !botRoomIsResponding
        ) {
          chatStreamDom.scroll({
            top: chatStreamDom.scrollHeight,
            behavior: 'smooth',
          });
        }

        clearTimeout(timeoutId);
      }, 300);
    };

    if (!botRoomIsResponding) {
      scrollChatToBottom();
    }
  }, [botRoomIsResponding, sanitizedChatMessages]);

  return (
    <div className="bot-chat">
      <div className="chat-stream" id="chat-stream" ref={chatStreamDomRef}>
        <div className="relative w-full flex justify-end items-center box-border p-0 pr-[2px] mb-[8px]">
          <Button className="reset-chat" onClick={onResetChat}>
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
        </ul>
      </div>

      {!botRoomIsResponding && (
        <form
          onSubmit={handleSubmit(sendChat)}
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
    </div>
  );
};

export default BotChat;
