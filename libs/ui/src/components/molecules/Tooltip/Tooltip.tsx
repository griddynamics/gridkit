'use client';
import { forwardRef, useCallback, type KeyboardEvent } from 'react';
import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';

import { KEYBOARD_KEYS } from '@constants';
import { Portal } from '@components/layout';

import { useTooltip } from './utils';
import { COMPONENT_NAME } from './constants';
import { TooltipStyled, TooltipWrapperStyled } from './TooltipStyled';
import type { TooltipProps } from './';

/**
 * @TODO: Cerebra
 * - investigate issue with last tooltip visibility on page focus
 */
const Tooltip = forwardRef<HTMLBaseElement, TooltipProps>(
  ({ id, children, content, position, delay, className = '', gap, as, styles, ...rest }, forwardedRef) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const { isVisible, coords, containerRef, tooltipRef, showTooltip, hideTooltip, positionWithFallback } = useTooltip(
      position,
      delay,
      gap
    );
    const tooltipClass = `${className.trim()} tooltip-${positionWithFallback}`;
    const isTooltipVisible = isVisible && !!content;

    const handleClick = useCallback(() => {
      logger.debug(`${COMPONENT_NAME}: Click`, {
        id,
        isVisible,
      });
      hideTooltip();
    }, [hideTooltip, isVisible]);

    const handleTouchStart = handleClick;

    const handleFocus = useCallback(() => {
      logger.debug(`${COMPONENT_NAME}: Focus`, { id, isVisible });
      if (!isVisible) showTooltip();
    }, [isVisible, showTooltip]);

    const handleBlur = useCallback(() => {
      logger.debug(`${COMPONENT_NAME}: Blur`, { id, isVisible });
      if (isVisible) hideTooltip();
    }, [hideTooltip, isVisible]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        const isKeyDown = [KEYBOARD_KEYS.ENTER, KEYBOARD_KEYS.SPACE].includes(e.key);
        logger.debug(`${COMPONENT_NAME}: KeyDown`, { id, key: e.key, matched: isKeyDown });
        if (isKeyDown) {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <>
        {isTooltipVisible && (
          <Portal withWrapper={false} ref={forwardedRef}>
            <TooltipStyled
              id={id}
              theme={theme}
              className={tooltipClass}
              ref={tooltipRef}
              data-testid={COMPONENT_NAME}
              role="tooltip"
              aria-hidden={!isVisible}
              styles={{ ...styles, ...coords }}
              {...rest}
            >
              {content}
            </TooltipStyled>
          </Portal>
        )}
        <TooltipWrapperStyled
          $as={as}
          ref={containerRef}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-describedby={id}
          data-testid={`${COMPONENT_NAME}-wrapper`}
        >
          {children}
        </TooltipWrapperStyled>
      </>
    );
  }
);

Tooltip.displayName = COMPONENT_NAME;

export default Tooltip;
