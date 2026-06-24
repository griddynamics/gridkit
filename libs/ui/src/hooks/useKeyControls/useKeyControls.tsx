'use client';
import { useEffect } from 'react';
import { UseKeyControlsOptions } from '@types';

export const useKeyControls = ({ ref, keyHandlers }: UseKeyControlsOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as Node;

      // Only handle keys if the event target is inside
      // the component or the component is hovered/focused
      if (!ref.current || !ref.current.contains(target)) return;

      const handler = keyHandlers[event.key];
      if (handler) handler(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyHandlers, ref]);
};
