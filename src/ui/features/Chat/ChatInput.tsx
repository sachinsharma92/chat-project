'use client';

import cx from 'classnames';
import Button from '../../../components/common/Button';
import TextInput from '../../../components/common/TextInput';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PaperPlane, ExpandIcon, Microphone, CameraIcon } from '@/icons';
import { isEmpty, isString, toLower, toString } from 'lodash';
import { useBotChat } from './hooks/useBotChat';
import { useWindowResize } from '@/hooks';
import { useAppStore, useBotData } from '@/store/Spaces';
import '../../../components/common/styles/Button.css';
import './ChatInput.css';

export type ChatInputPropsType = {
  hideExpand?: boolean;
  className?: string;
  classNameForChatFormInput?: string;
};

export const isChatFocused = () => {
  const activeElemenet = document?.activeElement;

  if (activeElemenet && activeElemenet.classList.contains('chat-form-input')) {
    return true;
  }

  return false;
};

const ChatInput = (props: ChatInputPropsType) => {
  const { register, handleSubmit, setValue } = useForm();
  const { sendBotChatMessage } = useBotChat();
  const { availableWidth } = useWindowResize();
  const [expandBulletinSidebar, setExpandBulletinSidebar] = useAppStore(
    state => [state.expandBulletinSidebar, state.setExpandBulletinSidebar],
  );
  const [botRoomIsResponding] = useBotData(state => [
    state.botRoomIsResponding,
  ]);
  const { hideExpand, className, classNameForChatFormInput } = props;

  const sendChat = (data: any) => {
    const { chatInput } = data;

    if (botRoomIsResponding) {
      return;
    }

    if (chatInput) {
      sendBotChatMessage(toString(chatInput));
      setValue('chatInput', '');
    }
  };

  /**
   * Auto focus chat input on 'enter'.
   * Blur input on 'esc'
   * For desktop devices only.
   */
  useEffect(() => {
    const onKeyDown = (evt: any) => {
      const k = evt?.key;
      const keyCode = evt?.keyCode;
      const chatInput = document.querySelector(
        '.chat-form-input',
      ) as HTMLInputElement;

      if (toLower(k) === 'escape' || keyCode === 27) {
        if (chatInput?.blur) {
          chatInput.blur();
        }
      }

      if (toLower(k) === 'enter' || keyCode === 13) {
        if (chatInput?.focus) {
          chatInput.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown, false);

    return () => {
      window.removeEventListener('keydown', onKeyDown, false);
    };
  }, [availableWidth]);

  return (
    <div
      className={cx('chat-input', {
        [`${className}`]: isString(className) && !isEmpty(className),
      })}
    >
      <Button type="button" className="toggle-emojis dark-button">
        <CameraIcon />
      </Button>

      <form
        onSubmit={handleSubmit(sendChat)}
        className={cx('chat-form', 'flex justify-center items-center', {
          ['chat-form-expand']: hideExpand,
        })}
      >
        <TextInput
          className={cx('chat-form-input', {
            [`${classNameForChatFormInput}`]: !isEmpty(
              classNameForChatFormInput,
            ),
          })}
          placeholder={`"Enter" to chat`}
          {...register('chatInput', { required: false })}
        />
        <Button
          type="submit"
          className={cx('send-button', 'flex justify-center items-center')}
        >
          <PaperPlane height={'20px'} width={'20px'} />
        </Button>
      </form>

      <Button type="button" className="microphone dark-button">
        <Microphone />
      </Button>

      {!hideExpand && (
        <Button
          className={'expand-chat'}
          onClick={() => {
            setExpandBulletinSidebar(!expandBulletinSidebar);
          }}
        >
          <ExpandIcon />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
