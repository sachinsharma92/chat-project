import Bulletin from '../Bulletin';
import { useWindowResize } from '@/hooks';
import { mobileWidthBreakpoint } from '@/constants';
import './ChatMobile.css';

const ChatMobile = () => {
  const { availableWidth } = useWindowResize();

  return (
    <div className="chat-mobile">
      <Bulletin
        // custom tailwind css to handle input on mobile screens
        classNameForChatFormInput={
          availableWidth <= mobileWidthBreakpoint ? 'input-scale' : ''
        }
      />
    </div>
  );
};

export default ChatMobile;
