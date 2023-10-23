import { AxiosResponse } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function timeout(ms: number) {
  return new Promise(resolve => {
    const _timeout = setTimeout(
      () => {
        clearTimeout(_timeout);
        return resolve(null);
      },
      ms ? ms : 50,
    );
  });
}

export * from './user';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isResponseStatusSuccess(res: AxiosResponse) {
  return res?.status === 200 || res?.status === 201;
}
