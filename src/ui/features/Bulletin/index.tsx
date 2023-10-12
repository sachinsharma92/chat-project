import cx from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import { ChatIcon, CrossIcon } from '@/icons';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import { InterTight } from '@/app/fonts';
import { useAppStore, useGameServer } from '@/store/Spaces';
import { filter, isEmpty, map } from 'lodash';
import Message from '../Chat/Message';
import Button from '@/ui/common/Button';
import ChatInput from '../Chat/ChatInput';
import './Bulletin.css';
import BotResponding from '../Chat/BotResponding';
import Pinned from '../Chat/Pinned';

const Bulletin = () => {
  const [expandBulletinSidebar, setExpandBulletinSidebar] = useAppStore(
    state => [state.expandBulletinSidebar, state.setExpandBulletinSidebar],
  );
  const [roomChatMessages, botRoomIsResponding] = useGameServer(state => [
    state.roomChatMessages,
    state.botRoomIsResponding,
  ]);
  const { availableWidth } = useWindowResize();

  /**
   * Hide bulletin on resize and hits mobile screen expected breakpoint
   */
  useEffect(() => {
    if (availableWidth < mobileWidthBreakpoint && expandBulletinSidebar) {
      setExpandBulletinSidebar(false);
    }
  }, [availableWidth, expandBulletinSidebar, setExpandBulletinSidebar]);

  const sanitizedChatMessages = useMemo(
    () => filter(roomChatMessages, line => !isEmpty(line?.id)),
    [roomChatMessages],
  );

  /** Scroll stream chat down bottom  */
  const scrollChatToBottom = useCallback(() => {
    const chatStreamDom = document.querySelector('.bulletin-chat-stream > ul');

    if (chatStreamDom?.scroll) {
      const timeoutId = setTimeout(() => {
        chatStreamDom.scroll({
          top: chatStreamDom.scrollHeight,
          behavior: 'smooth',
        });

        clearTimeout(timeoutId);
      }, 200);
    }

    // eslint-disable-next-line
  }, [botRoomIsResponding]);

  /** Scroll on new chat */
  useEffect(() => {
    if (botRoomIsResponding && !isEmpty(sanitizedChatMessages)) {
      scrollChatToBottom();
    }
  }, [botRoomIsResponding, sanitizedChatMessages, scrollChatToBottom]);

  return (
    <div
      className={cx('bulletin', { 'bulletin-hide': !expandBulletinSidebar })}
    >
      <div className="bulletin-header">
        <div className="bulletin-left">
          <ChatIcon height={'16px'} width={'16px'} />
          <h1 className={cx(InterTight.className, 'bulletin-label')}>
            Bulletin
          </h1>
        </div>
        <div className="bulletin-right">
          <Button
            className="bulletin-close"
            onClick={() => setExpandBulletinSidebar(false)}
          >
            <CrossIcon />
          </Button>
        </div>
      </div>
      <div className="bulletin-chat-stream">
        <Pinned className="bulletin-pinned" />
        <ul>
          {map(sanitizedChatMessages, line => {
            const key = `BulletinChat${line.id}`;

            return (
              <li key={key}>
                <Message
                  id={line.id}
                  authorId={line.authorId}
                  authorInfo={line.authorInfo}
                  role={line.role}
                  message={line?.message}
                />
              </li>
            );
          })}

          {botRoomIsResponding && <BotResponding />}
        </ul>
      </div>
      <div className="bulletin-chat-input-wrap">
        <ChatInput className="bulletin-chat" hideExpand />
      </div>
    </div>
  );
};

export default Bulletin;
