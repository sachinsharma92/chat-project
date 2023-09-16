import { useRef } from 'react';

type UseDebounceCallbackReturnType<T extends unknown[]> = (
  ...args: T
) => Promise<any> | void;

type CallBackFunc<T extends unknown[]> = (...args: T) => Promise<any> | void;

const useDebounce = <T extends unknown[]>(
  cb: CallBackFunc<T>,
  delay: number,
): UseDebounceCallbackReturnType<T> => {
  const timeoutId = useRef(null);

  return function debounce(...args) {
    // @ts-ignore
    clearTimeout(timeoutId.current);

    // @ts-ignore
    timeoutId.current = setTimeout(() => {
      cb(...args);
      // @ts-ignore
      clearTimeout(timeoutId.current);
    }, delay || 100);
  };
};

export default useDebounce;
