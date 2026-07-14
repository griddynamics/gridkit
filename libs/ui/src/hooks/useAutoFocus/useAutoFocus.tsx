'use client';
import { useEffect, RefObject } from 'react';

export const useAutoFocus = <T extends HTMLElement>(ref: RefObject<T>, autoFocus: boolean) => {
  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus?.();
    }
  }, [autoFocus]);
};
