'use client';

import { useForm } from 'react-hook-form';
import { FileIcon, Microphone, ResetIcon } from '@/icons';
import { useBotData } from '@/store/App';
import { useContext, useEffect, useRef, useState } from 'react';
import { map, trimStart } from 'lodash';
import { OpenAIRoles } from '@/types';
import { ChatBotStateContext } from '@/store/ChatBotProvider';
import { useBotChat } from '@/hooks/useBotChat';

import BotMessage from '../SpaceContent/BotChat/BotMessage';
import UserMessage from '../SpaceContent/BotChat/UserMessage';
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';

import './GameScreenBotChat.css';
import SpeechToText from '@/components/common/SpeechToText';

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

  const {
    chatMessages: sanitizedChatMessages,
    isLoading,
    resetChat,
  } = useBotChat();

  const [isRecording, setIsRecording] = useState(false);

  const handleSendChat = (data: any) => {
    const message = data?.message;

    if (
      !message ||
      botRoomIsResponding ||
      !chatRoom ||
      isLoading ||
      isRecording
    ) {
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
          <ul>
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

          <div className="absolute top-[8px] w-full flex justify-end items-center box-border p-0 pr-[2px] mb-[8px]">
            <Button
              className="game-screen-bot-chat-reset-chat"
              onClick={onResetChat}
              isLoading={resettingChat}
            >
              <ResetIcon />
              <p>Reset Chat</p>
            </Button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handleSendChat)}
          className="game-screen-chat-input-container"
        >
          {!isRecording && (
            <>
              <Button className="game-screen-attach-file">
                <FileIcon />
              </Button>
              <TextInput
                {...register('message', {
                  required: false,
                })}
                placeholder="Message...."
                className="chat-form-input"
              />

              <Button
                className="game-screen-mic"
                onClick={() => {
                  if (isLoading) {
                    return;
                  }

                  setValue('message', '');
                  setIsRecording(true);
                }}
                isDisabled={botRoomIsResponding || isLoading}
                disabled={botRoomIsResponding}
              >
                <Microphone />
              </Button>
            </>
          )}

          {isRecording && (
            <SpeechToText
              stopRecording={() => setIsRecording(false)}
              consumeText={text => setValue('message', trimStart(text))}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default GameScreenBotChat;
