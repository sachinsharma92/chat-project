import cx from 'classnames';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import './ChatInput.scss';
import { useForm } from 'react-hook-form';
import { Microphone, PaperPlane, EmojiSmileIcon, ExpandIcon } from '@/icons';

type ChatInputPropsType = {
  hideExpand?: boolean;
};

const ChatInput = (props: ChatInputPropsType) => {
  const {
    register,
    handleSubmit,
    // setError,
    // watch,
    // formState: { errors },
  } = useForm();
  const { hideExpand } = props;

  const sendChat = (data: any) => {
    const { chatInput } = data;

    if (chatInput) {
      // todo send chat
    }
  };

  return (
    <div className="chat-input">
      <Button
        type="button"
        className={cx('start-microphone', 'center-content')}
      >
        <Microphone />
      </Button>
      <form
        onSubmit={handleSubmit(sendChat)}
        className={cx('chat-form', 'center-content')}
      >
        <TextInput
          placeholder={'Press ENTER to chat'}
          {...register('chatInput', { required: false })}
        />
        <Button className={cx('send-button', 'center-content')}>
          <PaperPlane height={'20px'} width={'20px'} />
        </Button>
      </form>
      <Button type="button" className={cx('toggle-emojis', 'center-content')}>
        <EmojiSmileIcon />
      </Button>
      {!hideExpand && (
        <Button className={cx('expand-chat', 'center-content')}>
          <ExpandIcon />
        </Button>
      )}
    </div>
  );
};

export default ChatInput;
