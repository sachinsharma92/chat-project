'use client';
import Button from '@/components/common/Button';
import SpeechToText from '@/components/common/SpeechToText';
import TextInput from '@/components/common/TextInput';
import { MicrophoneIcon } from '@/icons';
import { useBotData } from '@/store/App';
import { ChatBotStateContext } from '@/store/ChatBotProvider';
import { head, trimStart } from 'lodash';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBotChat } from '../../../../hooks/useBotChat';
import BottomDropdown from '../../BottomDropdown/BottomDropdown';

import Avatar from '@/components/common/Avatar/Avatar';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import './HomeSpace.css';

const HomeSpace = () => {
  const { spaceInfo } = useSelectedSpace();
  const { isLoading: botChatIsLoading } = useBotChat();
  const { handleSubmit, setValue, register } = useForm();
  const { sendChat } = useContext(ChatBotStateContext);
  const [resettingChat, setResettingChat] = useState(false);

  const greeting = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);
    const greeting = spaceBotInfo?.greeting;

    return greeting || `Hi! What's on your mind?`;
  }, [spaceInfo]);

  const botDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

  const [botRoomIsResponding, recentBotChat, chatRoom] =
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

  // const switchToChat = (data: any) => {
  //   const message = data?.message;

  //   if (!message || botChatIsLoading || isRecording) {
  //     return;
  //   }

  //   setSpaceContentTab(SpaceContentTabEnum.chat);

  //   if (!botRoomIsResponding) {
  //     sendChat(message);
  //     setValue('message', '');
  //   }
  // };

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

  return (
    <form onSubmit={handleSubmit(handleSendChat)}>
      <div className="flex w-full flex-col">
        <div className='flex items-center justify-center pb-2'>
          <h4 className='text-xs uppercase text-[#999]'>everything is imaginary</h4>
        </div>
        <div className="greetings px-4">
          <div className='border-t flex gap-3 pt-2 w-full'>
            <div className="greetings-bot-avatar">
              <Avatar height={32} width={32} src={botDisplayImage} />
            </div>
            {botChatIsLoading && <p className='msg-text'>{'. . . '}</p>}
            {!botChatIsLoading && <p className='msg-text'>{greeting}</p>}
          </div>
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
                      if (botChatIsLoading || botRoomIsResponding) {
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
