import { isEmpty, isUndefined } from 'lodash';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Allows you to read/delete/update query parameters
 * @returns
 */
const useRouterQuery = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair and op code
  const createQueryString = useCallback(
    (name?: string, value?: string, op?: 'add' | 'remove') => {
      const params = new URLSearchParams(searchParams);

      if (op === 'add' && name && !isUndefined(value)) {
        params.set(name, value);
      } else if (op === 'remove' && name && !isUndefined(value)) {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  /**
   * Create or update parameter value
   * @param key
   * @param value
   */
  const setQuery = useCallback(
    (key: string, value: string, targetPathname?: string) => {
      router.push(
        (targetPathname ? targetPathname : pathname) +
          '?' +
          createQueryString(key, value, 'add'),
      );
    },
    [pathname, router, createQueryString],
  );

  /**
   * Remove query parameter
   * @param key
   * @param value
   */
  const removeQuery = useCallback(
    (key: string, value: string, targetPathname?: string) => {
      const newQuery = createQueryString(key, value, 'remove');

      router.push(
        (targetPathname ? targetPathname : pathname) +
          (!isEmpty(newQuery) ? '?' : '') +
          newQuery,
      );
    },
    [pathname, router, createQueryString],
  );

  /**
   * Navigate to new pathname and retains current search parameters
   */
  const navigate = useCallback(
    (targetPathname: string) => {
      const newQuery = createQueryString();
      router.push(targetPathname + (!isEmpty(newQuery) ? '?' : '') + newQuery);
    },
    [router, createQueryString],
  );

  return { searchParams, navigate, removeQuery, setQuery };
};

export default useRouterQuery;
