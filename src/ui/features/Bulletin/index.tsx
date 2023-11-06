import cx from 'classnames';
import { useCallback, useEffect, useMemo } from 'react';
import { ChatIcon, CrossIcon } from '@/icons';
import { InterTight } from '@/app/fonts';
import { useAppStore, useBotData } from '@/store/App';
import { filter, isEmpty, isString, map } from 'lodash';
import { MobileDrawerEnums } from '@/types/dialog';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import Message from '../Chat/Message';
import ChatInput from '../Chat/ChatInput';
import BotResponding from '../Chat/BotResponding';
import Pinned from '../Chat/Pinned';
import Button from '@/components/common/Button';

import './Bulletin.css';

const Bulletin = (props: {
  className?: string;
  classNameForChatFormInput?: string;
}) => {
  const { className, classNameForChatFormInput } = props;
  const [expandBulletinSidebar, setShowMobileDrawer] = useAppStore(state => [
    state.expandBulletinSidebar,
    state.setShowMobileDrawer,
  ]);

  const [botRoomIsResponding, chatMessages] = useBotData(state => [
    state.botRoomIsResponding,
    state.chatMessages,
  ]);

  const { availableWidth } = useWindowResize();

  const sanitizedChatMessages = useMemo(
    () => filter(chatMessages, line => !isEmpty(line?.id)),
    [chatMessages],
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
    if (!isEmpty(sanitizedChatMessages)) {
      scrollChatToBottom();
    }
  }, [botRoomIsResponding, sanitizedChatMessages, scrollChatToBottom]);

  const hideMobileChat = () => {
    setShowMobileDrawer(false, MobileDrawerEnums.none);
  };

  return (
    <div
      className={cx('bulletin', {
        'bulletin-hide': !expandBulletinSidebar,
        [`${className}`]: !isEmpty(className) && isString(className),
      })}
    >
      <div className="bulletin-header">
        <div className="bulletin-left">
          <ChatIcon height={'16px'} width={'16px'} />
          <h1 className={cx(InterTight.className, 'bulletin-label')}>Chat</h1>
        </div>
        <div className="bulletin-right">
          {availableWidth < mobileWidthBreakpoint && (
            <Button onClick={hideMobileChat} className="close-button">
              <CrossIcon />
            </Button>
          )}
        </div>
      </div>
      <div className="bulletin-chat-stream">
        <Pinned className="bulletin-pinned" />
        <ul>
          {map(sanitizedChatMessages, line => {
            const key = `BulletinChat${line.id}`;
            const shortTime = new Intl.DateTimeFormat('en', {
              timeStyle: 'short',
            });
            const createdAt = line?.createdAt;
            const timestamp = shortTime.format(
              createdAt ? new Date(createdAt) : Date.now(),
            );

            return (
              <li key={key}>
                <Message
                  id={line.id}
                  authorId={line.authorId}
                  authorInfo={line.authorInfo}
                  role={line.role}
                  time={timestamp}
                  message={line?.message}
                />
              </li>
            );
          })}

          {botRoomIsResponding && <BotResponding />}
        </ul>
      </div>
      <div className="bulletin-chat-input-wrap">
        <ChatInput
          className="bulletin-chat"
          classNameForChatFormInput={classNameForChatFormInput}
          hideExpand
        />
      </div>
    </div>
  );
};

export default Bulletin;
