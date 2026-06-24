'use client';
import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
  forwardRef,
  type KeyboardEvent,
  type MutableRefObject,
} from 'react';

import { useTheme } from '@hooks/useTheme';
import { useLogger } from '@hooks/useLogger';
import { KEYBOARD_KEYS } from '@constants';
import { useAnimationFrame, get } from '@utils';
import { convertToInlineBoxStyles } from '@tokens';

import { SelectContext } from '@components/atoms/Select/hooks';
import { Portal } from '@components/layout';
import type { SelectContextType, Option, SelectOnSelect } from '@components';
import type { InlineBoxStyles } from '@types';

import { COMPONENT_NAME, EMPTY_CLIENT_RECT } from './constants';
import { MenuTriggerStyled, MenuContentStyled } from './MenuStyled';
import type { MenuProps, MenuRef } from './';

export const Menu = forwardRef<MenuRef, MenuProps>(
  (
    {
      onSelect,
      children,
      content,
      itemIdentifier = (selected, current) => selected?.value === current?.value,
      closeOnSelect = true,
      minHeight: defaultMinHeight,
      maxHeight: defaultMaxHeight,
      offsetX: defaultOffsetX,
      offsetY: defaultOffsetY,
      placement,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const logger = useLogger();

    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<Option>();
    const [apiControlTarget, setApiControlTarget] = useState<EventTarget | null>();

    const hostRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const menuPositionRef = useRef<{ top: number; left: number }>({
      top: 0,
      left: 0,
    });

    const minHeight = defaultMinHeight || get(theme, 'menu.attrs.minHeight');
    const maxHeight = defaultMaxHeight || get(theme, 'menu.attrs.maxHeight');
    const offsetX = defaultOffsetX || get(theme, 'menu.attrs.offsetX', 0);
    const offsetY = defaultOffsetY || get(theme, 'menu.attrs.offsetY', 0);

    const getBetterPosition = useCallback(
      ({ width, height }: DOMRect) => {
        const hostRect = hostRef.current ? hostRef.current.getBoundingClientRect() : EMPTY_CLIENT_RECT;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scrollX = window.scrollX || window.pageXOffset || 0;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        // Handle placement prop for explicit positioning (default: bottom-right)
        const effectivePlacement = placement || 'bottom-right';

        // Calculate initial viewport-based coordinates based on placement
        let viewportLeft: number;
        let viewportTop: number;

        switch (effectivePlacement) {
          case 'top-left': {
            viewportLeft = hostRect.left - width - offsetX;
            viewportTop = hostRect.top - height - offsetY;
            break;
          }
          case 'top-right': {
            viewportLeft = hostRect.right + offsetX;
            viewportTop = hostRect.top - height - offsetY;
            break;
          }
          case 'bottom-left': {
            viewportLeft = hostRect.left - width - offsetX;
            viewportTop = hostRect.bottom + offsetY;
            break;
          }
          case 'bottom-right': {
            viewportLeft = hostRect.right + offsetX;
            viewportTop = hostRect.bottom + offsetY;
            break;
          }
        }

        // Handle horizontal overflow - bind to closest edge based on placement when no space
        const overflowsRight = viewportLeft + width > viewportWidth;
        const overflowsLeft = viewportLeft < 0;

        if (overflowsRight || overflowsLeft) {
          // For left placements ('top-left', 'bottom-left'), bind to left edge
          if (effectivePlacement === 'top-left' || effectivePlacement === 'bottom-left') {
            viewportLeft = offsetX;
          }
          // For right placements ('top-right', 'bottom-right'), bind to right edge
          else {
            viewportLeft = viewportWidth - width - offsetX;
          }
        }

        // Handle vertical overflow - bind to closest edge based on placement when no space
        const overflowsBottom = viewportTop + height > viewportHeight;
        const overflowsTop = viewportTop < 0;

        if (overflowsBottom || overflowsTop) {
          // For top placements ('top-left', 'top-right'), bind to top edge
          if (effectivePlacement === 'top-left' || effectivePlacement === 'top-right') {
            viewportTop = offsetY;
          }
          // For bottom placements ('bottom-left', 'bottom-right'), bind to bottom edge
          else {
            viewportTop = viewportHeight - height - offsetY;
          }
        }

        // For absolute positioning in Portal (renders to document.body),
        // when body/html are not positioned (position: static, the default),
        // absolute positioning works relative to the initial containing block (viewport)
        // We need to convert viewport coordinates to document coordinates by adding scroll offsets
        // This ensures the menu appears in the correct position even when the page is scrolled
        return {
          left: viewportLeft + scrollX,
          top: viewportTop + scrollY,
        };
      },
      [placement, offsetX, offsetY]
    );

    const _onSelect: SelectOnSelect = useCallback(
      ({ event, data }) => {
        logger.debug(`${COMPONENT_NAME}: Select`, {
          value: data?.value,
          name: data?.name,
          previousValue: internalValue?.value,
          previousName: internalValue?.name,
        });
        onSelect?.({
          event,
          data,
        });
        setInternalValue(data);
        if (closeOnSelect) {
          setIsOpen(false);
        }
      },
      [onSelect, closeOnSelect, internalValue]
    );

    const onClickHandler = useCallback(() => {
      setIsOpen((prev) => {
        const willOpen = !prev;

        logger.debug(`${COMPONENT_NAME}: ${willOpen ? 'Open' : 'Close'}`, {
          trigger: 'toggle',
        });

        return willOpen;
      });
    }, []);

    const contextValue: SelectContextType = {
      onSelect: _onSelect,
      value: internalValue,
      itemIdentifier,
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (
        ((forwardedRef as MutableRefObject<MenuRef>)?.current?.isOpen || isOpen) &&
        event.key === KEYBOARD_KEYS.ESCAPE
      ) {
        logger.debug(`${COMPONENT_NAME}: Close`, {
          trigger: 'escape',
        });
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event: Event) => {
      if (
        !hostRef?.current?.contains((apiControlTarget || event.target) as Node) &&
        !contentRef?.current?.contains(event.target as Node)
      ) {
        logger.debug(`${COMPONENT_NAME}: Close`, {
          trigger: 'outsideClick',
        });
        setIsOpen(false);
        setApiControlTarget(null);
      }
    };

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleKeyDown as any);
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('keydown', handleKeyDown as any);
        document.removeEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown as any);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    useAnimationFrame(() => {
      if (contentRef.current && isOpen) {
        const contentRect = contentRef.current.getBoundingClientRect();
        const { top: documentTop, left: documentLeft } = getBetterPosition(contentRect);
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY || window.pageYOffset || 0;

        // Calculate available space using viewport coordinates
        // getBetterPosition returns document coordinates, so we need to convert back to viewport
        const viewportTop = documentTop - scrollY;
        const availableSpace = viewportHeight - viewportTop - offsetY;

        menuPositionRef.current = { top: documentTop, left: documentLeft };

        if (contentRef.current) {
          contentRef.current.style.left = `${documentLeft}px`;
          contentRef.current.style.top = `${documentTop}px`;

          if (maxHeight) {
            contentRef.current.style.maxHeight = `${Math.min(maxHeight, availableSpace)}px`;
          }

          if (minHeight) {
            contentRef.current.style.minHeight = `${Math.min(minHeight, availableSpace)}px`;
          }
        }
      }
    });

    useImperativeHandle(
      forwardedRef,
      () => ({
        ref: hostRef,
        isOpen,
        selectedValue: internalValue,
        onSelect: _onSelect,
        open: (target?: EventTarget | null) => {
          logger.debug(`${COMPONENT_NAME}: Open`, {
            trigger: 'ref',
          });
          if (isOpen) return;
          setApiControlTarget(target || null);
          setIsOpen(true);
        },
        close: (target?: EventTarget | null) => {
          logger.debug(`${COMPONENT_NAME}: Close`, {
            trigger: 'ref',
          });
          if (!isOpen) return;
          setApiControlTarget(target || null);
          setIsOpen(false);
        },
      }),
      [isOpen, internalValue, _onSelect]
    );

    return (
      <SelectContext.Provider value={contextValue}>
        <MenuTriggerStyled onClick={onClickHandler} theme={theme} ref={hostRef} data-testid={COMPONENT_NAME} {...rest}>
          {children}
        </MenuTriggerStyled>
        {isOpen && (
          <Portal withWrapper={false}>
            <MenuContentStyled
              ref={contentRef}
              data-testid={COMPONENT_NAME}
              theme={theme}
              {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
            >
              {content}
            </MenuContentStyled>
          </Portal>
        )}
      </SelectContext.Provider>
    );
  }
);

Menu.displayName = COMPONENT_NAME;
