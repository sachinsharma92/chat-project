import { uploadAvatarIamge } from '@/lib/supabase/storage';
import { createId } from '@paralleldrive/cuid2';
import { head } from 'lodash';

// @ts-ignore
type CallBackFunc<T extends unknown[]> = (...args: any) => Promise<any> | void;

export const uploadImageAvatarFile = <T extends unknown[]>(
  onStart?: CallBackFunc<T>,
  onEnd?: CallBackFunc<T>,
): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    const imageAvatarUploadFileInputId = 'imageAvatarUploadFileInputId';

    let input = document.getElementById(
      imageAvatarUploadFileInputId,
    ) as HTMLInputElement;

    if (input?.remove) {
      input.remove();
    }

    input = document.createElement('input');

    if (onStart) {
      onStart();
    }

    const onImageSelectHandler = function () {
      // @ts-ignore
      const files = this.files as File[];
      const file = head(files);
      const fileType = file?.type;
      const fileSize = file?.size as number;
      const fileName = file?.name as string;
      const fileSizeLimitErr =
        fileSize < 0 || (fileSize && fileSize > 5_240_000);

      if (onEnd && (fileSizeLimitErr || !file || !fileType)) {
        onEnd();
      }

      if (fileSizeLimitErr) {
        // 5MB limit for now
        reject(new Error('File size limit reached'));
        return;
      } else if (!fileType || !file) {
        reject(new Error('Invalid file type'));
        return;
      }

      uploadAvatarIamge(file, createId(), fileName)
        .then(url => {
          resolve(url);
        })
        .catch(err => reject(err))
        .finally(() => {
          try {
            input?.remove();
          } catch {
          } finally {
            if (onEnd) {
              onEnd();
            }
          }
        });
    };

    const onImageError = function (err: any) {
      if (onEnd) {
        onEnd();
      }

      if (err?.message) {
        reject(err);
      } else {
        reject(new Error('Something went wrong'));
      }
    };

    input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/png, image/jpeg');

    input.onchange = onImageSelectHandler;
    input.onerror = onImageError;
    input.oncancel = function () {
      if (onEnd) {
        onEnd();
      }
    };
    input.setAttribute('id', imageAvatarUploadFileInputId);
    input.setAttribute('multiple', 'false');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    document.body.appendChild(input);
    input.click();
  });
