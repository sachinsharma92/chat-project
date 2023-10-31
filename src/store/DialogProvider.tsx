'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';
import { useAppStore } from './App';
import { useBotnetAuth } from './Auth';
import { DialogEnums, MobileDrawerEnums } from '@/types/dialog';
import Auth from '@/ui/dialogs/Auth';
import '../components/common/styles/Dialog.css';
import OnboardDisplayName from '@/ui/dialogs/OnboardDisplayName';
import Account from '@/ui/dialogs/Account';
import AuthLoadingScreen from '@/ui/dialogs/AuthLoadingScreen';
import DrawerComponent from '@/components/common/Drawer';
import ChatMobile from '@/ui/features/Chat/ChatMobile';

/**
 * App modal handler
 * @param props
 * @returns
 */
const DialogProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [authLoading] = useBotnetAuth(state => [state.isLoading]);
  const [
    showDialog,
    showDialogType,
    showMobileDrawer,
    showMobileDrawerType,
    setShowMobileDrawer,
  ] = useAppStore(state => [
    state.showDialog,
    state.showDialogType,
    state.showMobileDrawer,
    state.showMobileDrawerType,
    state.setShowMobileDrawer,
  ]);

  return (
    <>
      <Dialog.Root open={showDialog}>
        {children}
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            {showDialogType === DialogEnums.auth && <Auth />}
            {showDialogType === DialogEnums.onboardDisplayName && (
              <OnboardDisplayName />
            )}
            {showDialogType === DialogEnums.account && <Account />}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Cover screen if app is verifying user auth tokens/profile */}
      {authLoading && <AuthLoadingScreen />}

      {/** Mobile drawer/snackbar/toaster */}
      {/** Goes from bottom to top */}
      <DrawerComponent
        isOpen={
          showMobileDrawer && showMobileDrawerType !== MobileDrawerEnums.none
        }
        content={
          <>
            {showMobileDrawerType === MobileDrawerEnums.chat && <ChatMobile />}
          </>
        }
        closeOnOverlayClick
        onClose={() => {
          setShowMobileDrawer(false, MobileDrawerEnums.none);
        }}
      />
    </>
  );
};

export default DialogProvider;
