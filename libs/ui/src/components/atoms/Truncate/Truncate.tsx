'use client';
import { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';

import { COMPONENT_NAME } from './constants';
import { TruncateStyled } from './TruncateStyled';
import type { TruncateProps, TruncateRef } from './';

export const Truncate = forwardRef<TruncateRef, TruncateProps>(
  ({ children, lines = 1, styles = {}, ...rest }, forwardedRef) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
      if (!containerRef.current) {
        return;
      }

      logger.debug(`${COMPONENT_NAME}: Component mounted/updated`, {
        lines,
        hasChildren: !!children,
      });

      const checkTruncation = () => {
        const container = containerRef.current;
        if (!container) {
          return;
        }

        const isTrunc = container.scrollHeight > container.clientHeight;

        setIsTruncated(isTrunc);
      };

      const container = containerRef.current;
      if (!container) {
        return;
      }

      requestAnimationFrame(() => {
        checkTruncation();
      });

      // Also check on resize
      const resizeObserver = new ResizeObserver(() => {
        checkTruncation();
      });
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        logger.debug(`${COMPONENT_NAME}: Cleanup`, { lines });
      };
    }, [children, lines]);

    // Expose ref API
    useImperativeHandle(
      forwardedRef,
      () => ({
        ref: containerRef,
        isTruncated,
      }),
      [isTruncated]
    );

    return (
      <TruncateStyled
        ref={containerRef}
        theme={theme}
        styles={styles}
        $lines={lines}
        data-testid={COMPONENT_NAME}
        {...rest}
      >
        {children}
      </TruncateStyled>
    );
  }
);

Truncate.displayName = COMPONENT_NAME;
