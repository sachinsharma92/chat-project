'use client';

import { useForm } from 'react-hook-form';
import { FileIcon, Microphone } from '@/icons';

import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';

import './GameScreenBotChat.css';
import { useBotData } from '@/store/App';
import { useBotChat } from '../Chat/hooks/useBotChat';

const GameScreenBotChat = () => {
  const { handleSubmit, setValue, register } = useForm();

  const { sendBotChatMessage } = useBotChat();

  const [botRoomIsResponding] = useBotData(state => [
    state.botRoomIsResponding,
    state.chatMessages,
  ]);

  const sendChat = (data: any) => {
    const message = data?.message;

    if (!message || botRoomIsResponding) {
      return;
    }

    setValue('message', '');
    sendBotChatMessage(message);
  };

  return (
    <div className="game-screen-bot-chat">
      <div className="game-screen-bot-chat-content">
        <form
          onSubmit={handleSubmit(sendChat)}
          className="game-screen-chat-input-container"
        >
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
          <Button className="game-screen-mic">
            <Microphone />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default GameScreenBotChat;
