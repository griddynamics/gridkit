'use client';
import { useEffect, useState, useMemo } from 'react';
import { getWindow } from '@utils';

const getInitialMatches = (query: string, w: (Window & typeof globalThis) | Record<string, never>): boolean => {
  if (typeof w.matchMedia !== 'function') {
    return false;
  }
  const mediaQueryList = w.matchMedia(query);
  return mediaQueryList?.matches ?? false;
};

export const useMediaQuery = (query: string): boolean => {
  const windowMemo = useMemo(() => getWindow(), []);
  const [matches, setMatches] = useState<boolean>(() => getInitialMatches(query, windowMemo));

  useEffect(() => {
    if (typeof windowMemo.matchMedia !== 'function') {
      return;
    }

    const mediaQueryList = windowMemo.matchMedia(query);

    if (!mediaQueryList) {
      return;
    }

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQueryList.addEventListener('change', listener);
    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query, windowMemo]);

  return matches;
};
