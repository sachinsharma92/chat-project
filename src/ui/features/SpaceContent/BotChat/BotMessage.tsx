'use client';

import { useMemo } from 'react';
import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { ChatMessageProps } from '@/types';
import { cn } from '@/lib/utils';
import { EllipseIcon, PlayIcon } from '@/icons';

import Avatar from '@/components/common/Avatar/Avatar';
import './BotMessage.css';
import Button from '@/components/common/Button';

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
        <Avatar
          src={assistantDisplayImage}
          name={displayName}
          className="rounded-none"
        />
      </div>
      <div className="bot-message-text">
        {message && (
          <div className="msg-box">
            {message}
            <Button className="max-h-5 float-right min-w-[44px] inline-flex bg-black sm:bg-[#f5f5f5] items-center px-[6px] py-[4px] text-xs gap-[3px] font-light ml-[5px]">
              <PlayIcon width={5.47} height={6} /> 0:03
            </Button>
          </div>

        )}
        {!message && (
          <p className="bot-message-loading">
            <EllipseIcon height={'8px'} width={'8px'} />
            <EllipseIcon height={'8px'} width={'8px'} />
            <EllipseIcon height={'8px'} width={'8px'} />
          </p>
        )}
      </div>
    </div>
  );
};

export default BotMessage;
