import { useMemo } from 'react';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ChatMessageProps } from '@/types';
import { cn } from '@/lib/utils';

import Avatar from '@/components/common/Avatar/Avatar';
import './BotMessage.css';

const BotMessage = (
  props: Partial<ChatMessageProps> & { className?: string },
) => {
  const { message, className } = props;
  const { spaceInfo } = useSelectedSpace();
  const assistantDisplayImage = useMemo(
    () =>
      spaceInfo?.image || spaceInfo?.host?.image || '/assets/aibotavatar.png',
    [spaceInfo],
  );
  const displayName = useMemo(() => spaceInfo?.host?.displayName, [spaceInfo]);

  return (
    <div className={cn('bot-message-container', className)}>
      <div className="bot-message-avatar">
        <Avatar src={assistantDisplayImage} name={displayName} />
      </div>
      <div className="bot-message-text">
        <p>{displayName}</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default BotMessage;
