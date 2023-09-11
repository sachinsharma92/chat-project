'use client';

import cx from 'classnames';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import './ChatInput.scss';
import { useForm } from 'react-hook-form';
import { PaperPlane, EmojiSmileIcon, ExpandIcon, ChatIcon } from '@/icons';
import { isEmpty, isString } from 'lodash';

type ChatInputPropsType = {
  hideExpand?: boolean;
  className?: string;
};

export const isChatFocused = () => {
  const activeElemenet = document?.activeElement;

  if (activeElemenet && activeElemenet.classList.contains('chat-form-input')) {
    return true;
  }

  return false;
};

const ChatInput = (props: ChatInputPropsType) => {
  const {
    register,
    handleSubmit,
    // setError,
    // watch,
    // formState: { errors },
  } = useForm();
  const { hideExpand, className } = props;

  const sendChat = (data: any) => {
    const { chatInput } = data;

    if (chatInput) {
      // todo send chat
    }
  };

  return (
    <div
      className={cx('chat-input', {
        [`${className}`]: isString(className) && !isEmpty(className),
      })}
    >
      <Button
        type="button"
        className={cx('toggle-emojis', 'flex justify-center items-center')}
      >
        <EmojiSmileIcon />
      </Button>

      <form
        onSubmit={handleSubmit(sendChat)}
        className={cx('chat-form', 'flex justify-center items-center')}
      >
        <TextInput
          className="chat-form-input"
          placeholder={'Press ENTER to chat'}
          {...register('chatInput', { required: false })}
        />
        <Button
          type="submit"
          className={cx('send-button', 'flex justify-center items-center')}
        >
          <PaperPlane height={'20px'} width={'20px'} />
        </Button>
      </form>

      <Button type="button" className="chat flex justify-center items-center">
        <ChatIcon />
      </Button>

      {!hideExpand && (
        <Button
          className={cx('expand-chat', 'flex justify-center items-center')}
        >
          <ExpandIcon />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
