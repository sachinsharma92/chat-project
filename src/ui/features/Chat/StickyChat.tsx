import { useAppStore } from '@/store/App';
import { DialogEnums, MobileDrawerEnums } from '@/types/dialog';
import { useBotnetAuth } from '@/store/Auth';
import ChatInput from './ChatInput';
import './StickyChat.css';

/**
 * Bottom bar chat input
 * @returns
 */
const StickyChat = () => {
  const [showMobileDrawerType, setShowMobileDrawer, setShowDialog] =
    useAppStore(state => [
      state.showMobileDrawerType,
      state.setShowMobileDrawer,
      state.setShowDialog,
    ]);
  const [authIsLoading] = useBotnetAuth(state => [state.isLoading]);

  return (
    <div
      className="sticky-chat"
      onClick={() => {
        if (authIsLoading) {
          return;
        }

        setShowDialog(false, DialogEnums.none);
        setShowMobileDrawer(true, MobileDrawerEnums.chat);
      }}
    >
      {showMobileDrawerType !== MobileDrawerEnums.chat && (
        <ChatInput hideExpand className="sticky-chat-input" />
      )}
      <div className="sticky-chat-cover"></div>
    </div>
  );
};

export default StickyChat;
