import { ChatMessageProps, OpenAIRoles } from '@/types';
import { isEmpty, toString } from 'lodash';
import { useMemo } from 'react';
import Avatar from '@/components/common/Avatar/Avatar';
import './Message.css';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { HeartIcon } from '@/icons';

const Message = (props: ChatMessageProps) => {
  const { role, authorInfo, authorId, message, time } = props;
  const { spaceInfo } = useSelectedSpace();
  const isAIAssistant = useMemo(() => role === OpenAIRoles.assistant, [role]);
  const assistantDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );

  return (
    <div className="chat-line-message">
      <div className="chat-line-avatar">
        <Avatar
          src={
            isAIAssistant ? assistantDisplayImage : toString(authorInfo?.image)
          }
          name={authorInfo?.displayName || authorId || ''}
        />
      </div>
      <div className="chat-line-content">
        <h5 className="chat-message">
          {isAIAssistant && (
            <span>{spaceInfo?.host?.displayName || 'NPC Bot'}</span>
          )}
          {!isEmpty(authorInfo?.displayName) && !isAIAssistant && (
            <span>{authorInfo?.displayName}</span>
          )}
          {toString(message)}
          {time && <p className="chat-timestamp"> {time} </p>}
        </h5>
        <div className="heart-icon">
          <HeartIcon />
        </div>
      </div>
    </div>
  );
};

export default Message;
