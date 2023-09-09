'use client';

import { GameServerProvider } from '@/store/GameServerProvider';
import { ReactNode } from 'react';

const Providers = (props: { children: ReactNode }) => {
  const { children } = props;

  return <GameServerProvider>{children}</GameServerProvider>;
};

export default Providers;
