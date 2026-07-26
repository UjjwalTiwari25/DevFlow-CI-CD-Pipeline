import { useState, useEffect, useCallback } from 'react';
import { isClient } from '../utils';

/**
 * This function selects the value from a given array of breakpoints based on window width. The breakpoint serves as the max window width.
 * @param {Array} breakpoints An array containing the width breakpoint and the corresponding values. The array sent should be sorted in increasing order of width.
 * @param {*} windowWidth Width of current window
 */
function selector(breakpoints, windowWidth) {
  if (!breakpoints || !breakpoints.length) {
    return null;
  }
  let selectedValue = breakpoints[breakpoints.length - 1].value; // Assign the value for the largest width by default
  if (!windowWidth) {
    return selectedValue;
  }
  for (let index = 0; index < breakpoints.length; index++) {
    const { width, value } = breakpoints[index];
    if (windowWidth <= width) {
      selectedValue = value;
      break;
    }
  }
  return selectedValue;
}

export default function useResponsiveWindow() {
  const isWindowAvailable = isClient();

  const getSize = useCallback(
    () =>
      isWindowAvailable
        ? {
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth <= 576,
            select: (breakpoints) => selector(breakpoints, window.innerWidth),
          }
        : {
            select: (breakpoints) => selector(breakpoints),
          },
    [isWindowAvailable]
  );

  const [windowSize, setWindowSize] = useState(getSize);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    if (!isWindowAvailable) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isWindowAvailable, getSize]);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width <= 576) {
        if (!isMobile) {
          setIsMobile(true);
        }
      } else if (isMobile) {
        setIsMobile(false);
      }
    }
  }, [windowSize.width, isMobile]);

  useEffect(() => {
    if (windowSize.width) {
      if (windowSize.width <= 768) {
        if (!isMobileOrTablet) {
          setIsMobileOrTablet(true);
        }
      } else if (isMobileOrTablet) {
        setIsMobileOrTablet(false);
      }
    }
  }, [windowSize.width, isMobileOrTablet]);

  return [windowSize, isMobile, isMobileOrTablet];
}
