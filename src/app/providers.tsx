'use client';

import { ReactNode } from 'react';
import AuthProvider from '@/store/AuthProvider';
// import GameServerProvider from '@/store/GameServerProvider';
import SpacesProvider from '@/store/SpacesProvider';
import dynamic from 'next/dynamic';

const DialogProvider = dynamic(() => import('@/store/DialogProvider'), {
  ssr: false,
});

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
        <DialogProvider>{children}</DialogProvider>
      </SpacesProvider>
    </AuthProvider>
  );
};

export default Providers;
