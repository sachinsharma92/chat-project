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
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import BottomDropdown from '../BottomDropdown/BottomDropdown';
import BotMessage from '../SpaceContent/BotChat/BotMessage';
import UserMessage from '../SpaceContent/BotChat/UserMessage';

import './GameScreenBotChat.css';

const GameScreenBotChat = () => {
  const [record, setRecord] = useState();
  let wavesurfer;

  const { handleSubmit, setValue, register } = useForm();

  const { sendChat } = useContext(ChatBotStateContext);
  const [resettingChat, setResettingChat] = useState(false);

  const [botRoomIsResponding, recentUserChat, recentBotChat, chatRoom] =
    useBotData(state => [
      state.botRoomIsResponding,
      state.recentUserChat,
      state.recentBotChat,
      state.chatRoom,
    ]);

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
    'Yeah I mean I guess...',
    'Yeah I mean I guess...',
    'Yeah I mean I guess...',
  ];


  const createWaveSurfer = () => {
    if (wavesurfer) { wavesurfer.destroy() }

    wavesurfer = WaveSurfer.create({
      container: "#wave",
      waveColor: "white",
      progressColor: "green",
      barWidth: 2,
      barGap: 5,
      barRadius: 20,
      height: 20,
      audioRate: 10
    });

    const recordTest = wavesurfer.registerPlugin(
      RecordPlugin.create({ scrollingWaveform: true })
    );
    setRecord(recordTest)
  };

  const handleRecord = () => {
    if (record) {
      // @ts-ignore: Unreachable code error
      record.startRecording()

    }
    console.log(record, 'check record');
  };

  useEffect(() => {
    // if (isRecording) {
    //   createWaveSurfer();
    // }
    createWaveSurfer();
  }, []);



  return (
    <div className="game-screen-bot-chat">
      <div className="game-screen-bot-chat-content">
        <div className="game-screen-chat-stream" ref={chatStreamDomRef}>
          <ul className="px-4">
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

        <form
          onSubmit={handleSubmit(handleSendChat)}
          className="game-screen-chat-input-container z-50"
        >
          <div className="suggestion-section">
            {badgeData.map((items, index) => (
              <button key={index} className="suggestion">
                {items}
              </button>
            ))}
          </div>

          <div className="flex w-full gap-1 px-4">
            <div className='flex relative gap-1 w-full'>
              {!isRecording && (
                <>
                  <TextInput
                    {...register('message', {
                      required: false,
                    })}
                    placeholder="Message...."
                    className="chat-form-input text-xs"
                  />
                  <div onClick={handleRecord}>
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

              {isRecording && (
                <SpeechToText
                  stopRecording={() => setIsRecording(false)}
                  consumeText={text => setValue('message', trimStart(text))}
                />
              )}
              <div id='wave' className="h-[23px] absolute w-[82%] top-[5px] left-[10px] z-50 bg-black" />
            </div>
            <BottomDropdown resetHandler={onResetChat} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default GameScreenBotChat;
