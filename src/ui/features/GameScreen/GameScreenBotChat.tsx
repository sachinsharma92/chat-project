'use client';

import { useForm } from 'react-hook-form';
import { FileIcon, Microphone } from '@/icons';
import { useBotData } from '@/store/App';
import { useBotChat } from '../../../hooks/useBotChat'; 
import { useMemo } from 'react';
import { filter, isEmpty, map } from 'lodash';
import { OpenAIRoles } from '@/types';


import BotMessage from '../SpaceContent/BotChat/BotMessage';
import UserMessage from '../SpaceContent/BotChat/UserMessage';  
import Button from '@/components/common/Button';
import TextInput from '@/components/common/TextInput';

import './GameScreenBotChat.css';

const GameScreenBotChat = () => {
  const { handleSubmit, setValue, register } = useForm();

  const { sendBotChatMessage } = useBotChat();

  const [botRoomIsResponding, chatMessages] = useBotData(state => [
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

  const sanitizedChatMessages = useMemo(
    () => filter(chatMessages, line => !isEmpty(line?.id)),
    [chatMessages],
  );

  return (
    <div className="game-screen-bot-chat">
      <div className="game-screen-bot-chat-content">
        <div className="game-screen-chat-stream">
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
          </ul>
        </div>

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
