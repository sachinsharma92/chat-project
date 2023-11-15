import { ChatMessageProps } from '@/types';

import './UserMessage.css';

const UserMessage = (props: Partial<ChatMessageProps>) => {
  const { message } = props;

  return (
    <div className="user-message">
      <p>{message}</p>
    </div>
  );
};

export default UserMessage;
