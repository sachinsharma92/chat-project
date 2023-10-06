'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';
import { useAppStore } from './Spaces';
import { DialogEnums } from '@/types/dialog';
import Auth from '@/ui/dialogs/Auth';
import '../ui/common/styles/Dialog.css';
import OnboardDisplayName from '@/ui/dialogs/OnboardDisplayName';

const DialogProvider = (props: { children?: ReactNode }) => {
  const { children } = props;
  const [showDialog, showDialogType] = useAppStore(state => [
    state.showDialog,
    state.showDialogType,
  ]);

  return (
    <Dialog.Root open={showDialog}>
      {children}
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          {showDialogType === DialogEnums.auth && <Auth />}
          {showDialogType === DialogEnums.onboardDisplayName && (
            <OnboardDisplayName />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DialogProvider;
