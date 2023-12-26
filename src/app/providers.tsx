'use client';

import { ReactNode } from 'react';
import AuthProvider from '@/store/AuthProvider';
import SpacesProvider from '@/store/SpacesProvider';
import dynamic from 'next/dynamic';

const DialogProvider = dynamic(() => import('@/store/DialogProvider'), {
  ssr: false,
});

const ChatBotProvider = dynamic(() => import('@/store/ChatBotProvider'));

/**
 * HOC that hosts all app context/providers
 * @param props
 * @returns
 */
const Providers = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <AuthProvider>
      <SpacesProvider>
        <ChatBotProvider>
          <DialogProvider>{children}</DialogProvider>
        </ChatBotProvider>
      </SpacesProvider>
    </AuthProvider>
  );
};

export default Providers;
