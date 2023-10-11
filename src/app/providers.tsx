import dynamic from 'next/dynamic';
import AuthProvider from '@/store/AuthProvider';
import { GameServerProvider } from '@/store/GameServerProvider';
import { ReactNode } from 'react';
import SpacesProvider from '@/store/SpacesProvider';

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
    <DialogProvider>
      <AuthProvider>
        <SpacesProvider>
          <GameServerProvider> {children}</GameServerProvider>
        </SpacesProvider>
      </AuthProvider>
    </DialogProvider>
  );
};

export default Providers;
