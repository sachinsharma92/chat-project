'use client';

import { includes, last, size, split } from 'lodash';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Fetch active username
 * @returns
 */
export const useUsername = () => {
  const pathname = usePathname();

  const username = useMemo(() => {
    const matchStrings = split(pathname, '/');

    if (size(matchStrings) === 2) {
      const targetUsername = last(matchStrings);

      if (
        !includes(
          [
            'not-found',
            'login',
            'auth',
            'privacy-policy',
            'settings',
            'register',
            'terms',
            'reset-password',
            'forgot-password',
            'oauth/',
          ],
          targetUsername,
        )
      ) {
        return targetUsername;
      }
    }

    return '';
  }, [pathname]);

  return {
    username,
  };
};
