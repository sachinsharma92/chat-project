'use client';

import { ReactNode } from 'react';
import { useAppStore } from './App';
import { useBotnetAuth } from './Auth';
import { MobileDrawerEnums } from '@/types/dialog';
import * as Dialog from '@radix-ui/react-dialog';
import AuthLoadingScreen from '@/ui/dialogs/AuthLoadingScreen';
import DrawerComponent from '@/components/common/Drawer';

import '@/components/common/styles/Dialog.css';

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
    showMobileDrawer,
    showMobileDrawerType,
    setShowMobileDrawer,
  ] = useAppStore(state => [
    state.showDialog,
    state.showMobileDrawer,
    state.showMobileDrawerType,
    state.setShowMobileDrawer,
  ]);

  return (
    <>
      <Dialog.Root open={showDialog} defaultOpen={false}>
        {children}
        <Dialog.Portal>
          <div className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            {/** TODO MORE DIALOG CONTENT HERE, use DialogEnums*/}
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
        content={<></>}
        closeOnOverlayClick
        onClose={() => {
          setShowMobileDrawer(false, MobileDrawerEnums.none);
        }}
      />
    </>
  );
};

export default DialogProvider;
