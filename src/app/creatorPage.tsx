'use client';
import { useEffect } from 'react';
import { environment } from '@/lib/environment';
import dynamic from 'next/dynamic';
import posthog from 'posthog-js';

const App = dynamic(() => import('../app-ui/App'), { ssr: false });

const CreatorPage = () => {
  /**
   * Record page view
   */
  useEffect(() => {
    posthog.capture('PageView', { env: environment });
  }, []);

  return <App />;
};

export default CreatorPage;
