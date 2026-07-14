'use client';
import { forwardRef, useEffect, useCallback } from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { convertToInlineBoxStyles } from '@tokens';
import { KEYBOARD_KEYS } from '@constants';
import { get } from '@utils';
import { Icon } from '@components/atoms/Icon';

import { Portal } from '@components/layout/Portal';

import type { InlineBoxStyles } from '@types';
import { COMPONENT_NAME } from './constants';
import {
  CloseButtonStyled,
  ModalBodyStyled,
  ModalContentStyled,
  ModalFooterStyled,
  ModalHeaderStyled,
  ModalOverlayStyled,
  ModalTitleStyled,
} from './ModalStyled';
import type { ModalProps } from './Modal.types';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen = false,
      isCustomView = false,
      onClose,
      showCloseButton = true,
      closeOnClickOutside = true,
      closeOnEscape,
      title,
      children,
      footer,
      styles,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();
    const icons = get(theme, 'modal.icons', {});
    const isHeaderVisible = title || !!(showCloseButton && onClose);

    const handleOverlayClick = useCallback(() => {
      logger.debug(`${COMPONENT_NAME}: Close`, {
        trigger: 'overlay',
        closeOnClickOutside: closeOnClickOutside,
      });
      if (closeOnClickOutside) {
        onClose?.();
      }
    }, [onClose, closeOnClickOutside, logger]);

    const handleCloseButtonClick = useCallback(() => {
      logger.debug(`${COMPONENT_NAME}: Close`, {
        trigger: 'closeButton',
      });
      onClose?.();
    }, [onClose, logger]);

    useEffect(() => {
      // @TODO: create modal context or manager
      if (!closeOnEscape) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (onClose && event.key === KEYBOARD_KEYS.ESCAPE) {
          logger.debug(`${COMPONENT_NAME}: Close`, {
            trigger: 'escape',
          });
          onClose?.();
        }
      };

      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, closeOnEscape, onClose, logger]);

    if (!isOpen) return null;

    return (
      <Portal blocksScroll>
        <ModalOverlayStyled onClick={handleOverlayClick} theme={theme}>
          <ModalContentStyled
            ref={forwardedRef}
            onClick={(event: Event) => event.stopPropagation()}
            data-testid={COMPONENT_NAME}
            theme={theme}
            styles={styles}
            {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
          >
            {isCustomView ? (
              children
            ) : (
              <>
                {isHeaderVisible && (
                  <ModalHeaderStyled theme={theme} $withTitle={!!title} data-testid={`${COMPONENT_NAME}-header`}>
                    {title && (
                      <ModalTitleStyled theme={theme} data-testid={`${COMPONENT_NAME}-title`}>
                        {title}
                      </ModalTitleStyled>
                    )}
                    {showCloseButton && onClose && (
                      <CloseButtonStyled
                        onClick={handleCloseButtonClick}
                        data-testid="close-button"
                        theme={theme}
                        aria-label="Close modal"
                      >
                        <Icon {...get(icons, 'close', { name: 'cross' })} />
                      </CloseButtonStyled>
                    )}
                  </ModalHeaderStyled>
                )}

                {children && (
                  <ModalBodyStyled theme={theme} data-testid={`${COMPONENT_NAME}-body`}>
                    {children}
                  </ModalBodyStyled>
                )}

                {footer && (
                  <ModalFooterStyled theme={theme} data-testid={`${COMPONENT_NAME}-footer`}>
                    {footer}
                  </ModalFooterStyled>
                )}
              </>
            )}
          </ModalContentStyled>
        </ModalOverlayStyled>
      </Portal>
    );
  }
);

Modal.displayName = COMPONENT_NAME;
