import { useMemo } from 'react';
import { head } from 'lodash';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';

import {
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
import { useBotChat } from '../../Chat/hooks/useBotChat';
import { useBotData } from '@/store/App';

import SpaceLinks from '../../SpaceLinks';
import TextInput from '@/components/common/TextInput';
import Button from '@/components/common/Button';
import Avatar from '@/components/common/Avatar/Avatar';
import SpaceDescription from '../../SpaceDescription';

import './HomeSpace.css';

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

  const botDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

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
          <SpaceDescription text={spaceDescription} />
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
          <div className="greetings-bot-avatar">
            <Avatar height={32} width={32} src={botDisplayImage} />
          </div>
          <p>{greeting}</p>
        </div>

        <div className="cta-chat-input-container">
          <Button className="attach-file">
            <FileIcon />
          </Button>
          <TextInput
            className="cta-chat-input-container-text-input"
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
