'use client';

import { isNumber } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

const getWindowDimension = () => {
  try {
    return {
      h: window?.visualViewport?.height || window?.innerHeight,
      w: window?.visualViewport?.width || window?.innerWidth,
    };
  } catch {
    return {
      h: 0,
      w: 0,
    };
  }
};

/**
 * Listen to window resize event and return available viewport height & width
 * @param props
 * @returns
 */
const useWindowResize = <T extends unknown>(props?: T) => {
  const [availableHeight, setAvailableHeight] = useState(
    getWindowDimension()?.h,
  );
  const [availableWidth, setAvailableWidth] = useState(getWindowDimension()?.w);

  useEffect(() => {
    const onResize = () => {
      try {
        const { h, w } = getWindowDimension();
        const availableHeight = h;
        const availableWidth = w;

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

  const height = useMemo(() => availableHeight, [availableHeight]);
  const width = useMemo(() => availableWidth, [availableWidth]);

  return {
    availableWidth: width,
    availableHeight: height,
  };
};

export default useWindowResize;
