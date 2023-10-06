import { ChatMessageProps } from '@/types';
import { isEmpty, toString } from 'lodash';
import { useMemo } from 'react';
import Avatar from '@/ui/common/Avatar/Avatar';
import './Message.css';

export enum MessageRoles {
  'assistant' = 'assistant',
  'user' = 'user',
}

const Message = (props: ChatMessageProps) => {
  const { role, authorInfo, authorId, message } = props;

  const isAIAssistant = useMemo(() => role === MessageRoles.assistant, [role]);

  return (
    <div className="chat-line-message">
      <div className="chat-line-avatar">
        <Avatar
          src={
            isAIAssistant
              ? '/assets/aibotavatar.png'
              : toString(authorInfo?.image)
          }
          name={authorInfo?.displayName || authorId || ''}
        />
      </div>
      <div className="chat-line-content">
        <p>
          {isAIAssistant && <span>{'NPC Bot'}</span>}
          {!isEmpty(authorInfo?.displayName) && !isAIAssistant && (
            <span>{authorInfo?.displayName}</span>
          )}
          {toString(message)}
        </p>
      </div>
    </div>
  );
};

export default Message;
