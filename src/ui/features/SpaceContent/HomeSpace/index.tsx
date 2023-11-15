import { useMemo } from 'react';
import { head } from 'lodash';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';

import {
  AIIcon,
  DiscordIcon,
  FileIcon,
  InstagramIcon,
  Microphone,
  TelegramIcon,
  TiktokIcon,
  XIcon,
  YouTubeIcon,
} from '@/icons';
import { SpaceContentTabEnum } from '..';
import { useForm } from 'react-hook-form';

import SpaceLinks from '../../SpaceLinks';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';

import './HomeSpace.css';
import { useBotChat } from '../../Chat/hooks/useBotChat';
import { useBotData } from '@/store/App';

type HomeSpaceProps = {
  setSpaceContentTab: (tab: SpaceContentTabEnum) => void;
};

const HomeSpace = (props: HomeSpaceProps) => {
  const { setSpaceContentTab } = props;
  const { spaceInfo } = useSelectedSpace();
  const { sendBotChatMessage } = useBotChat();
  const { handleSubmit, register, setValue } = useForm();
  const [botRoomIsResponding] = useBotData(state => [
    state.botRoomIsResponding,
  ]);

  const spaceDescription = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);

    return (
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

  const switchToChat = (data: any) => {
    const message = data?.message;

    if (!message) {
      return;
    }

    setSpaceContentTab(SpaceContentTabEnum.chat);

    if (!botRoomIsResponding) {
      setValue('message', '');
      sendBotChatMessage(message);
    }
  };

  return (
    <>
      <div className="home-space">
        <div className="space-description">
          <p>{spaceDescription}</p>
        </div>

        <SpaceLinks />

        <div className="social-links">
          <a>
            <InstagramIcon />
          </a>
          <a>
            <DiscordIcon />
          </a>
          <a>
            <TiktokIcon />
          </a>
          <a>
            <XIcon />
          </a>
          <a>
            <YouTubeIcon />
          </a>
          <a>
            <TelegramIcon />
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit(switchToChat)} className="cta-greeting-chat">
        <div className="greetings">
          <AIIcon />
          <p>{greeting}</p>
        </div>
        <div className="cta-chat-input-container">
          <Button className="attach-file">
            <FileIcon />
          </Button>
          <TextInput
            {...register('message', {
              required: false,
            })}
            placeholder="Message...."
          />
          <Button className="mic">
            <Microphone />
          </Button>
        </div>
      </form>
    </>
  );
};

export default HomeSpace;
