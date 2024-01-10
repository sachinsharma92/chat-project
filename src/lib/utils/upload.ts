import { publicBucketName, uploadAvatarImage } from '@/lib/supabase/storage';
import { createId } from '@paralleldrive/cuid2';
import { head, includes } from 'lodash';
import { base64ToBlob, getImageBase64, scaleImageToJpeg } from './image';
import { supabaseClient } from '../supabase';

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

    const onImageSelectHandler = async function () {
      // @ts-ignore
      const files = this.files as File[];
      const file = head(files);
      const fileType = file?.type;
      const fileSize = file?.size as number;
      const fileName = file?.name as string;
      const fileSizeLimitErr =
        fileSize < 0 || (fileSize && fileSize > 6_240_000);

      if (onEnd && (fileSizeLimitErr || !file || !fileType)) {
        onEnd();
      }

      let sanitizedFile: File | Blob | null | undefined = file;

      if (fileSizeLimitErr) {
        // 5MB limit for now
        reject(new Error('File size limit reached'));
        return;
      } else if (!fileType || !file) {
        reject(new Error('Invalid file type'));
        return;
      }

      // for all png and image files
      // we scale down profile avatars to jpeg file types at 0.9 quality
      // why? to save storage costs since we could potentially hit thousands of user records-
      // with at least 2 MB images
      if (
        fileType.includes('image/jpeg') ||
        fileType.includes('image/jpg') ||
        fileType.includes('image/png')
      ) {
        const b64 = await getImageBase64(file);
        const { value: updatedB64, err: scaleError } = await scaleImageToJpeg(
          b64 as string,
          'image/jpeg',
          0.9,
        );

        if (!scaleError && updatedB64) {
          sanitizedFile = base64ToBlob(updatedB64, 'image/jpeg');

          console.log('image downscale');
        } else {
          reject(new Error('Invalid file type'));
          return;
        }
      }

      if (sanitizedFile) {
        uploadAvatarImage(sanitizedFile, createId(), fileName)
          .then(url => {
            resolve(url);
          })
          .catch(err => reject(err))
          .finally(() => {
            try {
              input?.remove();
            } catch (err: any) {
              console.log('uploadAvatarImage() err:', err?.message);
            } finally {
              if (onEnd) {
                onEnd();
              }
            }
          });
      }
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

      input?.remove();
    };
    input.setAttribute('id', imageAvatarUploadFileInputId);
    input.setAttribute('multiple', 'false');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    document.body.appendChild(input);
    input.click();
  });

export const uploadUserVocalSampleFile = <T extends unknown[]>(
  userId: string,
  onStart?: CallBackFunc<T>,
  onEnd?: CallBackFunc<T>,
): Promise<
  { url: string; fileName: string; fileType: string; size: number } | undefined
> =>
  new Promise((resolve, reject) => {
    const cloneAudioSampleFileInputId = 'cloneAudioSampleFileInputId';

    let input = document.getElementById(
      cloneAudioSampleFileInputId,
    ) as HTMLInputElement;

    if (input?.remove) {
      input.remove();
    }

    input = document.createElement('input');

    if (onStart) {
      onStart();
    }

    const onFileSelectHandler = async function () {
      // @ts-ignore
      const files = this.files as File[];
      const file = head(files);
      const fileSize = file?.size as number;
      const fileType = file?.type || '';
      const fileName = file?.name || '';
      const fileSizeLimitErr =
        // max 5MB for now
        fileSize < 0 || (fileSize && fileSize > 8_360_000);

      if (onEnd && (!fileName || fileSizeLimitErr || !file)) {
        onEnd();
      }

      if (fileSizeLimitErr) {
        reject(new Error('File size limit reached.'));
        return;
      }

      if (
        !fileName ||
        (!includes(fileName, 'mp3') && !includes(fileName, 'wav'))
      ) {
        reject(new Error('File not supported.'));
        return;
      } else if (!file) {
        reject(new Error('Invalid file type.'));
        return;
      }

      const storageFileName = `${userId}/${Date.now()}_${fileName}`;
      const { data, error: uploadError } = await supabaseClient.storage
        .from(publicBucketName)
        .upload(storageFileName, file);

      if (uploadError) {
        reject(new Error(uploadError?.message));
      } else if (data?.path) {
        const { data: urlData } = supabaseClient.storage
          .from(publicBucketName)
          .getPublicUrl(data?.path);
        const url = urlData?.publicUrl;

        const updatedInput = document.getElementById(
          cloneAudioSampleFileInputId,
        ) as HTMLInputElement;

        resolve({ url, size: fileSize, fileName, fileType });

        if (updatedInput) {
          updatedInput.remove();
        }
      } else {
        reject(new Error('Failed to upload.'));
      }

      if (onEnd) {
        onEnd();
      }
    };

    const onFileError = function (err: any) {
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
    input.setAttribute('accept', '.mp3, .wav');

    input.onchange = onFileSelectHandler;
    input.onerror = onFileError;
    input.oncancel = function () {
      if (onEnd) {
        onEnd();
      }

      input?.remove();

      reject(new Error('Canceled'));
    };
    input.setAttribute('id', cloneAudioSampleFileInputId);
    input.setAttribute('multiple', 'false');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    document.body.appendChild(input);
    input.click();
  });

export const uploadAIKnowledgeFile = <T extends unknown[]>(
  userId: string,
  onStart?: CallBackFunc<T>,
  onEnd?: CallBackFunc<T>,
): Promise<
  { url: string; fileName: string; fileType: string; size: number } | undefined
> =>
  new Promise((resolve, reject) => {
    const cloneKnowledgeFileInputId = 'cloneKnowledgeFileInputId';

    let input = document.getElementById(
      cloneKnowledgeFileInputId,
    ) as HTMLInputElement;

    if (input?.remove) {
      input.remove();
    }

    input = document.createElement('input');

    if (onStart) {
      onStart();
    }

    const onFileSelectHandler = async function () {
      // @ts-ignore
      const files = this.files as File[];
      const file = head(files);
      const fileSize = file?.size as number;
      const fileType = file?.type || '';
      const fileName = file?.name || '';
      const fileSizeLimitErr =
        // max 5MB for now
        fileSize < 0 || (fileSize && fileSize > 5_360_000);

      if (onEnd && (!fileName || fileSizeLimitErr || !file)) {
        onEnd();
      }

      if (fileSizeLimitErr) {
        reject(new Error('File size limit reached.'));
        return;
      }

      if (
        !fileName ||
        (!includes(fileName, 'pdf') && !includes(fileName, 'txt'))
      ) {
        reject(new Error('File not supported.'));
        return;
      } else if (!file) {
        reject(new Error('Invalid file type.'));
        return;
      }

      const storageFileName = `${userId}/${Date.now()}_${fileName}`;
      // upload files
      const { data, error: uploadError } = await supabaseClient.storage
        .from(publicBucketName)
        .upload(storageFileName, file);

      if (uploadError) {
        reject(new Error(uploadError?.message));
      } else if (data?.path) {
        const { data: urlData } = supabaseClient.storage
          .from(publicBucketName)
          .getPublicUrl(data?.path);
        const url = urlData?.publicUrl;

        resolve({ url, size: fileSize, fileName, fileType });
      } else {
        reject(new Error('Failed to upload.'));
      }

      if (onEnd) {
        onEnd();
      }
    };

    const onFileError = function (err: any) {
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
    input.setAttribute('accept', '.pdf, .txt');

    input.onchange = onFileSelectHandler;
    input.onerror = onFileError;
    input.oncancel = function () {
      if (onEnd) {
        onEnd();
      }

      input?.remove();

      reject(new Error('Canceled'));
    };
    input.setAttribute('id', cloneKnowledgeFileInputId);
    input.setAttribute('multiple', 'false');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    document.body.appendChild(input);
    input.click();
  });
