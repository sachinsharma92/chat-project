'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

const Providers = dynamic(() => import('./providers'), {
  ssr: false,
});

const ProvidersContainer = (props: { children: ReactNode }) => {
  const { children } = props;

  return <Providers>{children}</Providers>;
};

export default ProvidersContainer;
