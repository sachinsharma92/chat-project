'use client';

import { ChatMessageProps } from '@/types';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import Avatar from '@/components/common/Avatar/Avatar';
import { useMemo } from 'react';
import './UserMessage.css';

const UserMessage = (props: Partial<ChatMessageProps>) => {
  const { message } = props;
  const { spaceInfo } = useSelectedSpace();
  const assistantDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/camp-tonari.png',
    [spaceInfo],
  );
  const displayName = useMemo(() => spaceInfo?.host?.displayName, [spaceInfo]);

  return (
    <div className="user-message">
      <div className="bot-message-avatar">
        <Avatar src={assistantDisplayImage} name={displayName} className="rounded-none" />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default UserMessage;
