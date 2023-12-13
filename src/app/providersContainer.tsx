'use client';

import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
import posthog from 'posthog-js';

const Providers = dynamic(() => import('./providers'), {
  ssr: false,
});

const ProvidersContainer = (props: { children: ReactNode }) => {
  const { children } = props;

  /**
   * Init Posthog analytics
   */
  useEffect(() => {
    console.log('posthog()');

    posthog.init('phc_kE1lssmypGcIkZuU1kTpOuqmfalHTSvwfsVcRDX7uDA', {
      api_host: 'https://app.posthog.com',
    });
  }, []);

  return <Providers>{children}</Providers>;
};

export default ProvidersContainer;
