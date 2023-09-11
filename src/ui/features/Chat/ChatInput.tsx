'use client';

import cx from 'classnames';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import './ChatInput.scss';
import { useForm } from 'react-hook-form';
import { PaperPlane, EmojiSmileIcon, ExpandIcon } from '@/icons';
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
      <Button type="button" className={cx('toggle-emojis', 'center-content')}>
        <EmojiSmileIcon />
      </Button>

      <form
        onSubmit={handleSubmit(sendChat)}
        className={cx('chat-form', 'center-content')}
      >
        <TextInput
          className="chat-form-input"
          placeholder={'Press ENTER to chat'}
          {...register('chatInput', { required: false })}
        />
        <Button className={cx('send-button', 'center-content')}>
          <PaperPlane height={'20px'} width={'20px'} />
        </Button>
      </form>
      {!hideExpand && (
        <Button className={cx('expand-chat', 'center-content')}>
          <ExpandIcon />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
