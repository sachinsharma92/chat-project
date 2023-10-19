import { useSelectedSpace } from '@/hooks/useSelectedSpace';
import { useMemo } from 'react';
import { head, isEmpty, isString } from 'lodash';
import Message from './Message';
import cx from 'classnames';
import './Pinned.css';
import { OpenAIRoles } from '@/types';

const Pinned = (props: { className?: string }) => {
  const { spaceInfo } = useSelectedSpace();
  const { className } = props;

  const host = useMemo(() => spaceInfo?.host, [spaceInfo]);

  const message = useMemo(() => {
    const spaceBotInfo = head(spaceInfo?.bots);
    const greeting = spaceBotInfo?.greeting;

    return greeting || `Hi! What's on your mind?`;
  }, [spaceInfo]);

  if (!host?.id) {
    return <></>;
  }

  return (
    <div
      className={cx('pinned-message', {
        [`${className}`]: !isEmpty(className) && isString(className),
      })}
    >
      <div className="pinned-label">
        <p>Pinned</p>
      </div>

      <Message
        pinned
        id="pinned-message-id"
        role={OpenAIRoles.user}
        message={message}
        authorId={host?.id as string}
        authorInfo={host}
      />
    </div>
  );
};

export default Pinned;
