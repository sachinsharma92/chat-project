'use client';

import { useBotChat } from '@/hooks/useBotChat';
import { Microphone, MoreIcon, ResetIcon } from '@/icons';
import { useBotData } from '@/store/App';
import { ChatBotStateContext } from '@/store/ChatBotProvider';
import { OpenAIRoles } from '@/types';
import { map } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import BotMessage from '../SpaceContent/BotChat/BotMessage';
import UserMessage from '../SpaceContent/BotChat/UserMessage';

import './GameScreenBotChat.css';

const GameScreenBotChat = () => {
  const { handleSubmit, setValue, register } = useForm();

  const { sendChat } = useContext(ChatBotStateContext);

  const [botRoomIsResponding, recentUserChat, recentBotChat, chatRoom] =
    useBotData(state => [
      state.botRoomIsResponding,
      state.recentUserChat,
      state.recentBotChat,
      state.chatRoom,
    ]);

  const [resettingChat, setResettingChat] = useState(false);

  const chatStreamDomRef = useRef<any>(null);

  const { chatMessages: sanitizedChatMessages, resetChat } = useBotChat();

  const handleSendChat = (data: any) => {
    const message = data?.message;

    if (!message || botRoomIsResponding || !chatRoom) {
      return;
    }

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

    sendChat(message);
    setValue('message', '');
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
    <div className="game-screen-bot-chat">
      <div className="game-screen-bot-chat-content">
        <div className="game-screen-chat-stream" ref={chatStreamDomRef}>
          <ul className='px-4'>
            {map(sanitizedChatMessages, message => {
              const key = `${message?.id}`;
              const isBot = message?.role === OpenAIRoles.assistant;
              const chat = message?.message;

              return (
                <li key={key}>
                  {isBot && (
                    <BotMessage
                      message={chat}
                      className="game-screen-chat-stream-bot-message"
                    />
                  )}
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

          {/* <div className="absolute top-[8px] w-full flex justify-end items-center box-border p-0 pr-[2px] mb-[8px]">
            <Button
              className="game-screen-bot-chat-reset-chat"
              onClick={onResetChat}
              isLoading={resettingChat}
            >
              <ResetIcon />
              <p>Reset Chat</p>
            </Button>
          </div> */}
        </div>

        <form
          onSubmit={handleSubmit(handleSendChat)}
          className="game-screen-chat-input-container z-50"
        >
          <div className='suggestion-section'>
            <button className="suggestion">
              Yeah I mean I guess...
            </button>
            <button className="suggestion">
              Yeah I mean I guess...
            </button>
            <button className="suggestion">
              Yeah I mean I guess...
            </button>
            <button className="suggestion">
              Yeah I mean I guess...
            </button>
            <button className="suggestion">
              Yeah I mean I guess...
            </button>
          </div>

          <div className='flex w-full gap-1 px-4'>
            <TextInput
              {...register('message', {
                required: false,
              })}
              placeholder="Message...."
              className="chat-form-input text-xs"
            />
            <Button className="chat-btn">
              <Microphone />
            </Button>
            <Button className="chat-btn">
              <MoreIcon />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameScreenBotChat;
