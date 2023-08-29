import ChatInput from './ChatInput';
import './StickyChat.scss';

/**
 * Bottom bar chat input
 * @returns
 */
const StickyChat = () => {
  return (
    <div className="sticky-chat">
      <ChatInput />
    </div>
  );
};

export default StickyChat;
