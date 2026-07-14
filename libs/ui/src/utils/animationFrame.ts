'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom React hook that runs a callback on every animation frame,
 * with optional throttling.
 *
 * @param {() => void} callback - The function to be called on each animation frame.
 * @param {number} [throttleMs=0] - Optional throttle interval in milliseconds. If set, the callback will not be called more often than this interval.
 *
 * @example
 * // Call on every animation frame
 * useAnimationFrame(() => { ... });
 *
 * // Call at most once every 100ms
 * useAnimationFrame(() => { ... }, 100);
 */
export function useAnimationFrame(callback: () => void, throttleMs = 0) {
  const callbackRef = useRef(callback);
  const lastCallRef = useRef(0);

  callbackRef.current = callback;

  useEffect(() => {
    let id: number;

    function loop() {
      const now = Date.now();

      if (!throttleMs || now - lastCallRef.current >= throttleMs) {
        lastCallRef.current = now;
        callbackRef.current();
      }

      id = requestAnimationFrame(loop);
    }

    id = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(id);
    };
  }, [throttleMs]);
}
