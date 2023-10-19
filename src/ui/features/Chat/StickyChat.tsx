import { useAppStore } from '@/store/Spaces';
import { DialogEnums, MobileDrawerEnums } from '@/types/dialog';
import { useBotnetAuth } from '@/store/Auth';
import ChatInput from './ChatInput';
import './StickyChat.css';

/**
 * Bottom bar chat input
 * @returns
 */
const StickyChat = () => {
  const [setShowMobileDrawer, setShowDialog] = useAppStore(state => [
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
      <ChatInput hideExpand className="sticky-chat-input" />
    </div>
  );
};

export default StickyChat;
