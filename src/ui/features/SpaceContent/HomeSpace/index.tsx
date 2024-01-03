'use client';

import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { FileIcon, Microphone } from '@/icons';
import { useAppStore, useBotData } from '@/store/App';
import { SpaceContentTabEnum } from '@/types';
import { head, trimStart } from 'lodash';
import { useContext, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBotChat } from '../../../../hooks/useBotChat';

import Avatar from '@/components/common/Avatar/Avatar';
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';
import SpaceDescription from '../../SpaceDescription';
import SpaceLinks from '../../SpaceLinks';

import { ChatBotStateContext } from '@/store/ChatBotProvider';
import './HomeSpace.css';
import SpeechToText from '@/components/common/SpeechToText';

const HomeSpace = () => {
  const [setSpaceContentTab] = useAppStore(state => [state.setSpaceContentTab]);
  const { spaceInfo } = useSelectedSpace();
  const { handleSubmit, register, setValue } = useForm();
  const [botRoomIsResponding] = useBotData(state => [
    state.botRoomIsResponding,
  ]);

  const [isRecording, setIsRecording] = useState(false);

  const { isLoading: botChatIsLoading } = useBotChat();
  const { sendChat } = useContext(ChatBotStateContext);

  const spaceDescription = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);

    return (
      spaceInfo?.host?.bio ||
      spaceBotInfo?.description ||
      spaceInfo?.description ||
      'Welcome to Botnet!'
    );
  }, [spaceInfo]);

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

  const switchToChat = (data: any) => {
    const message = data?.message;

    if (!message || botChatIsLoading || isRecording) {
      return;
    }

    setSpaceContentTab(SpaceContentTabEnum.chat);

    if (!botRoomIsResponding) {
      sendChat(message);
      setValue('message', '');
    }
  };

  return (
    <>
      <div className="home-space">
        <div className="space-description">
          <SpaceDescription text={spaceDescription} />
        </div>
        <SpaceLinks />
      </div>

      <form onSubmit={handleSubmit(switchToChat)} className="cta-greeting-chat">
        <div className="greetings">
          <div className="greetings-bot-avatar">
            <Avatar height={32} width={32} src={botDisplayImage} />
          </div>
          {botChatIsLoading && <p>{'. . . '}</p>}
          {!botChatIsLoading && <p>{greeting}</p>}
        </div>

        <div className="cta-chat-input-container">
          {!isRecording && (
            <>
              <Button className="attach-file">
                <FileIcon />
              </Button>
              <TextInput
                className="cta-chat-input-container-text-input"
                {...register('message', {
                  required: false,
                })}
                placeholder="Message...."
                // @ts-ignore
                maxLength={120}
              />
              <Button
                className="mic"
                onClick={() => {
                  if (botChatIsLoading || botRoomIsResponding) {
                    return;
                  }

                  setValue('message', '');
                  setIsRecording(true);
                }}
                isDisabled={botRoomIsResponding || botChatIsLoading}
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
        </div>

        <div className="bg-[#f5f5f5] rounded-xl mt-4 py-2 text-center text-black font-semibold">
          Botnet is free to use during the public beta
        </div>
      </form>
    </>
  );
};

export default HomeSpace;
