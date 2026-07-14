'use client';

import { ChangeEvent, useCallback, RefObject } from 'react';

export const useDynamicHeightAdjustment = (ref: RefObject<HTMLTextAreaElement>, dynamicHeightAdjustment: boolean) => {
  return useCallback(
    (_event?: ChangeEvent<HTMLTextAreaElement>) => {
      if (!dynamicHeightAdjustment || !ref.current) return;
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight || _event?.target?.scrollHeight}px`;
    },
    [dynamicHeightAdjustment, ref]
  );
};
