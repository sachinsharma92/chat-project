'use client';

import { appRoutes, updatePasswordRoutes } from '@/constants';
import { AxiosResponse } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { filter, includes, isEmpty, split, toString } from 'lodash';
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

export function isResponseStatusSuccess(res: Partial<AxiosResponse>) {
  return res?.status === 200 || res?.status === 201;
}

export function copyTextToClipboard(text: string) {
  return new Promise(resolve => {
    text = `${text}`;
    const textArea = document.createElement('textarea');
    const valueSTR = text;

    textArea.value = valueSTR;
    textArea.setAttribute('value', valueSTR);
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, valueSTR.length);

    if (document?.execCommand && document.execCommand('copy')) {
      textArea.remove();
      return resolve({ err: false });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(valueSTR).then(
        () => {
          textArea.remove();
          return resolve({ err: false });
        },

        err => {
          console.log(`copyTextToClipboard err ${err?.message}`);
          textArea.remove();
          return resolve({ err: true });
        },
      );
    } else {
      textArea.remove();
      return resolve({ err: true });
    }
  });
}

export const isPathnameAppRoute = (pathname: string) => {
  return includes(appRoutes, pathname);
};

export const isPathnameForUpdatePassword = (pathname: string) => {
  return !isEmpty(filter(updatePasswordRoutes, p => pathname?.startsWith(p)));
};

export function convertURIToBinary(base64: string) {
  let raw = window.atob(base64);
  let rawLength = raw.length;
  let arr = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    arr[i] = raw.charCodeAt(i);
  }

  return arr;
}

export function blobToBase64(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const base64data = split(toString(event?.target?.result), ',')[1];

      resolve(base64data);
    };

    // Define what happens in case of error
    reader.onerror = function (error) {
      reject(error);
    };

    // Read the blob as DataURL (base64)
    reader.readAsDataURL(blob);
  });
}
