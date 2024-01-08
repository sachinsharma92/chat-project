'use client';

import Avatar from '@/components/common/Avatar/Avatar';
import { useBotnetAuth } from '@/store/Auth';
import { ChatMessageProps } from '@/types';
import './UserMessage.css';

const UserMessage = (props: Partial<ChatMessageProps>) => {
  const { message } = props;
  const [image, displayName] = useBotnetAuth(state => [
    state.image,
    state.displayName,
  ]);


  return (
    <div className="user-message">
      <div className="bot-message-avatar">
        <Avatar src={image || '/assets/default-user.svg'} name={displayName} className="rounded-none" />
      </div>
      <p className="msg-box">{message}</p>
    </div>
  );
};

export default UserMessage;
