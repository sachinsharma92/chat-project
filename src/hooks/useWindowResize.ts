import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';

export const initialAvailableHeight =
  window?.visualViewport?.height || window?.innerHeight;
export const initialAvailableWidth =
  window?.visualViewport?.width || window?.innerWidth;

/**
 * Listen to window resize event and return available viewport height & width
 * @param props
 * @returns
 */
const useWindowResize = <T extends unknown>(props: T) => {
  const [availableHeight, setAvailableHeight] = useState(
    initialAvailableHeight,
  );
  const [availableWidth, setAvailableWidth] = useState(initialAvailableWidth);

  useEffect(() => {
    const onResize = () => {
      try {
        const availableHeight =
          window?.visualViewport?.height || window?.innerHeight;
        const availableWidth =
          window?.visualViewport?.width || window?.innerWidth;

        if (isNumber(availableHeight)) {
          setAvailableHeight(availableHeight);
        }

        if (isNumber(availableWidth)) {
          setAvailableWidth(availableWidth);
        }
      } catch {}
    };

    if (window?.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize, false);
    } else {
      window.addEventListener('resize', onResize, false);
    }

    onResize();

    return () => {
      try {
        if (window?.visualViewport) {
          window.visualViewport.removeEventListener('resize', onResize, false);
        } else {
          window.removeEventListener('resize', onResize, false);
        }
      } catch {}
    };
  }, [props]);

  return {
    availableWidth,
    availableHeight,
  };
};

export default useWindowResize;
