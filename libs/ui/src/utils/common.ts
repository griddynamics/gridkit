import type { ReactNode } from 'react';

export const isChildPrimitive = (children: ReactNode) => typeof children === 'string' || typeof children === 'number';

export const getWindow = (): (Window & typeof globalThis) | Record<string, never> => {
  if (typeof window === 'undefined') {
    return {} as Record<string, never>;
  }

  return window;
};
