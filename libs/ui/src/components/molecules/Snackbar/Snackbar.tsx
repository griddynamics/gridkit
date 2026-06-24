'use client';
import { useState, useEffect, forwardRef, useCallback } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';

import { convertToInlineBoxStyles } from '@tokens';
import type { InlineBoxStyles } from '@types';
import { ANIMATION_DURATION, DEFAULT_VARIANT, COMPONENT_NAME } from './constants';
import {
  SnackbarStyled,
  CloseButtonWrapperStyled,
  SnackbarActionsContainerStyled,
  CloseButtonIconStyled,
  SnackbarIconStyled,
  SnackbarBodyStyled,
  SnackbarContentStyled,
  SnackbarTitleStyled,
  SnackbarDescriptionStyled,
} from './SnackbarStyled';
import { SnackbarProps } from './Snackbar.types';

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  (
    {
      title,
      message,
      variant = DEFAULT_VARIANT,
      isAnimated = true,
      duration,
      onClose,
      action,
      colored = false,
      dismissOnClick = true,
      icon,
      position,
      ...restProps
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
      logger.debug(`${COMPONENT_NAME}: Close`, {
        variant,
        position,
        title,
        hasAction: !!action,
      });
      setIsClosing(true);

      setTimeout(
        () => {
          onClose?.();
        },
        isAnimated ? ANIMATION_DURATION : 0
      );
    }, [isAnimated, onClose, variant, position, title, action]);

    useEffect(() => {
      if (!duration) return;
      logger.debug(`${COMPONENT_NAME}: Auto-dismiss timer started`, {
        duration,
        variant,
        position,
      });
      const timer = setTimeout(() => {
        logger.debug(`${COMPONENT_NAME}: Auto-dismiss timer fired`, {
          variant,
          position,
        });
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }, [duration, handleClose, variant, position]);

    const handleClick = useCallback(() => {
      if (!dismissOnClick) return;
      logger.debug(`${COMPONENT_NAME}: Click (dismiss)`, {
        variant,
        position,
        title,
      });
      handleClose();
    }, [dismissOnClick, handleClose, variant, position, title]);

    return (
      <SnackbarStyled
        ref={forwardedRef}
        $variant={variant}
        $colored={colored}
        $isClosing={isClosing}
        $isAnimated={isAnimated}
        onClick={dismissOnClick ? handleClick : undefined}
        theme={theme}
        role="alert"
        aria-live="polite"
        aria-hidden={isClosing}
        data-testid={COMPONENT_NAME}
        {...convertToInlineBoxStyles(restProps as InlineBoxStyles)}
      >
        {onClose && (
          <CloseButtonWrapperStyled theme={theme} onClick={handleClose} aria-label="Close notification">
            <CloseButtonIconStyled theme={theme} $variant={variant} />
          </CloseButtonWrapperStyled>
        )}

        <SnackbarBodyStyled theme={theme}>
          {icon || <SnackbarIconStyled theme={theme} $variant={variant} />}
          <SnackbarContentStyled theme={theme}>
            <SnackbarTitleStyled theme={theme}>{title}</SnackbarTitleStyled>
            {message && <SnackbarDescriptionStyled theme={theme}>{message}</SnackbarDescriptionStyled>}
            {action && <SnackbarActionsContainerStyled theme={theme}>{action}</SnackbarActionsContainerStyled>}
          </SnackbarContentStyled>
        </SnackbarBodyStyled>
      </SnackbarStyled>
    );
  }
);
