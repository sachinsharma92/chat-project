import { ChatMessageProps } from '@/types';
import { isEmpty, toString } from 'lodash';
import { useMemo } from 'react';
import Avatar from '@/components/common/Avatar/Avatar';
import './Message.css';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { HeartIcon } from '@/icons';

export enum MessageRoles {
  'assistant' = 'assistant',
  'user' = 'user',
}

const Message = (props: ChatMessageProps) => {
  const { role, authorInfo, authorId, message, time } = props;
  const { spaceInfo } = useSelectedSpace();
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
        <p className="chat-message">
          {isAIAssistant && (
            <span>{spaceInfo?.host?.displayName || 'NPC Bot'}</span>
          )}
          {!isEmpty(authorInfo?.displayName) && !isAIAssistant && (
            <span>{authorInfo?.displayName}</span>
          )}
          {toString(message)}
          {time && <div className="chat-timestamp"> {time} </div>}
        </p>
        <div className="heart-icon"> <HeartIcon /> </div>
      </div>
    </div>
  );
};

export default Message;
