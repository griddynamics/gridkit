'use client';

import { useEffect, useRef } from 'react';

import { get } from '@utils';

import { TextareaUpdatedSize } from '../Textarea.types';

export const useResizeObserver = (
  ref: React.RefObject<HTMLTextAreaElement>,
  onCustomResize?: (size: TextareaUpdatedSize) => void
) => {
  // Prevent on init execution
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!ref.current || !onCustomResize) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        return;
      }

      if (onCustomResize && ref.current) {
        onCustomResize({
          width: get(ref, 'current.scrollWidth', 0),
          height: get(ref, 'current.scrollHeight', 0),
        });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [onCustomResize]);
};
