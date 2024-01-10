'use client';
import { useBotChat } from '@/hooks/useBotChat';
import { MicrophoneIcon } from '@/icons';
import { useBotData } from '@/store/App';
import { ChatBotStateContext } from '@/store/ChatBotProvider';
import { OpenAIRoles } from '@/types';
import { map, trimStart } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/Button';
import SpeechToText from '@/components/common/SpeechToText';
import TextInput from '@/components/common/TextInput';
import BottomDropdown from '../../BottomDropdown/BottomDropdown';
import BotMessage from '../../SpaceContent/BotChat/BotMessage';
import UserMessage from '../../SpaceContent/BotChat/UserMessage';

import './HomeSpace.css';

const HomeSpace = () => {
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

  const badgeData = [
    'Yeah I mean I guess...',
    'Yeah I mean I guess...',
    'Yeah I mean I guess...',
  ];

  return (
    <form onSubmit={handleSubmit(handleSendChat)}>
      <div className="flex w-full flex-col">
        <div className='flex items-center justify-center pb-2'>
          <h4 className='text-xs uppercase text-[#999]'>everything is imaginary</h4>
        </div>
        <div className="game-screen-chat-stream px-4" ref={chatStreamDomRef}>
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
        </div>

        <div className='game-screen-chat-input-container mt-4'>
          <div className={`flex relative gap-1 w-full px-4 ${isRecording && 'sm:flex-row-reverse'}`}>
            {!isRecording && (
              <>
                <TextInput
                  {...register('message', {
                    required: false,
                  })}
                  placeholder="Message...."
                  className="chat-form-input text-xs"
                  // @ts-ignore
                  maxLength={120}
                />
                <div>
                  <Button
                    className="chat-btn"
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
                    <MicrophoneIcon />
                  </Button>
                </div>
              </>
            )}
            <BottomDropdown resetHandler={onResetChat} />

            {isRecording && (
              <SpeechToText
                stopRecording={() => setIsRecording(false)}
                consumeText={text => setValue('message', trimStart(text))}
              />
            )}
          </div>

          <div className="suggestion-section">
            {badgeData.map((items, index) => (
              <button key={index} className="suggestion">
                {items}
              </button>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default HomeSpace;
