import { ChatMessageProps, OpenAIRoles } from '@/types';
import { isEmpty, toString } from 'lodash';
import { useMemo } from 'react';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { HeartIcon } from '@/icons';
import Avatar from '@/components/common/Avatar/Avatar';
import './Message.css';

const Message = (props: ChatMessageProps & { pinned?: boolean }) => {
  const { role, authorInfo, authorId, message, time, pinned } = props;
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
        {!pinned && (
          <div className="heart-icon">
            <HeartIcon />
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
