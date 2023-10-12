'use client';

import cx from 'classnames';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import './ChatInput.scss';
import { useForm } from 'react-hook-form';
import { PaperPlane, EmojiSmileIcon, ExpandIcon, ChatIcon } from '@/icons';
import { isEmpty, isFunction, isString, toString } from 'lodash';
import { usePlayersChat } from './hooks/usePlayersChat';
import { useHotkeys } from 'react-hotkeys-hook';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import { useAppStore, useGameServer } from '@/store/Spaces';
import '../../common/styles/Button.css';

type ChatInputPropsType = {
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
  const {
    register,
    handleSubmit,
    setValue,
    // setError,
    // watch,
    // formState: { errors },
  } = useForm();
  const { sendBotChatMessage } = usePlayersChat();
  const { availableWidth } = useWindowResize();
  const [expandBulletinSidebar, setExpandBulletinSidebar] = useAppStore(
    state => [state.expandBulletinSidebar, state.setExpandBulletinSidebar],
  );
  const [botRoomIsResponding] = useGameServer(state => [
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
   * Auto focus chat input on enter.
   * For desktop devices only.
   */
  useHotkeys(
    'enter',
    () => {
      if (!isChatFocused() && availableWidth > mobileWidthBreakpoint) {
        const chatInput = document.querySelector(
          '.chat-form-input',
        ) as HTMLInputElement;

        if (isFunction(chatInput?.focus)) {
          chatInput.focus();
        }
      }
    },
    { enabled: true },
  );

  return (
    <div
      className={cx('chat-input', {
        [`${className}`]: isString(className) && !isEmpty(className),
      })}
    >
      <Button
        type="button"
        className={cx(
          'toggle-emojis',
          'flex justify-center items-center dark-button',
        )}
      >
        <EmojiSmileIcon />
      </Button>

      <form
        onSubmit={handleSubmit(sendChat)}
        className={cx('chat-form', 'flex justify-center items-center')}
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

      <Button
        type="button"
        className="chat flex justify-center items-center dark-button"
      >
        <ChatIcon />
      </Button>

      {!hideExpand && (
        <Button
          className={cx(
            'expand-chat',
            'flex justify-center items-center dark-button',
          )}
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
