import { isDevelopment } from '../environment';

/**
 * Convert File object to base64 string
 * @param file
 * @returns
 */
export const getImageBase64 = (
  file: File,
): Promise<string | ArrayBuffer | null> =>
  new Promise(resolve => {
    const fr = new FileReader();
    fr.onload = async function () {
      resolve(this.result);
    };
    fr.onerror = () => {
      resolve('');
    };
    fr.readAsDataURL(file);
  });

/**
 * Convert base54 src string to scaled jpeg file
 * @param src
 * @param type
 * @param quality
 * @param maxW
 * @param maxH
 * @returns
 */
export function scaleImageToJpeg(
  src: string,
  type: string = 'jpeg',
  quality = 0.5,
  maxW = 0,
  maxH = 0,
): Promise<{ err?: boolean; value?: string }> {
  return new Promise(resolve => {
    const img = new Image();

    img.onload = function () {
      try {
        let h =
          // @ts-ignore
          typeof this.naturalHeight === 'number' && this.naturalHeight > 0
            ? // @ts-ignore
              this.naturalHeight
            : // @ts-ignore
              this.height;
        let w =
          // @ts-ignore
          typeof this.naturalWidth === 'number' && this.naturalWidth > 0
            ? // @ts-ignore
              this.naturalWidth
            : // @ts-ignore
              this.width;

        if (w > maxW && maxW > 0) {
          const ratio = maxW / w;

          w = Math.ceil(ratio * w);

          if (maxH <= 0) {
            h = Math.ceil(ratio * h);
          }
        }

        if (h > maxH && maxH > 0) {
          const ratio = maxH / h;

          h = Math.ceil(ratio * h);
        }

        const fileType = type.indexOf('jpeg') > -1 ? 'image/jpeg' : 'image/png';
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = Math.ceil(w);
        canvas.height = Math.ceil(h);
        const canvas2dContext = canvas.getContext('2d');

        if (canvas2dContext) {
          canvas2dContext.drawImage(img, 0, 0, canvas.width, canvas.height);
          const value = canvas.toDataURL(fileType, quality);
          resolve({ value, err: false });
        } else {
        }
      } catch (err: any) {
        console.log(err?.message);
        resolve({ err: true });
      }

      img.remove();
    };

    if (isDevelopment) {
      img.crossOrigin = 'Anonymous';
    }

    img.onerror = function (err: any) {
      console.log(err?.message);
      resolve({ err: true });
      img.remove();
    };

    img.src = src;
  });
}

/**
 * Convert base64 to window.Blob type
 * @param b64Data
 * @param type
 * @returns
 */
export function base64ToBlob(
  b64Data: string,
  type: string,
): Blob | File | null {
  try {
    if (b64Data.indexOf('data:image') >= 0) {
      b64Data = b64Data.substring(
        b64Data.indexOf('base64,') + 'base64,'.length,
        b64Data.length,
      );
    }

    const byteCharacters = window.atob(b64Data);
    const byteArrays = [];
    const sliceSize = 512;

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const createdBlob = new Blob(byteArrays, {
      type: type ? type : 'image/jpeg',
    });
    return createdBlob;
  } catch (err) {
    console.error(err);

    return null;
  }
}
