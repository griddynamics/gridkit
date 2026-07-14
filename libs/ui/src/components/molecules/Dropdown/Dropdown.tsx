'use client';
import { forwardRef, KeyboardEvent } from 'react';

import useTheme from '@hooks/useTheme';
import { KEYBOARD_KEYS } from '@constants/keyboard';
import { getClosestFocusable } from '@utils/focus';

import { DropdownStyled } from './DropdownStyled';
import { COMPONENT_NAME } from './constants';
import type { DropdownProps } from './';

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ children, ...rest }, forwardRef) => {
  const { theme } = useTheme();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const possibleKeypressList = [KEYBOARD_KEYS.ARROW_DOWN, KEYBOARD_KEYS.ARROW_UP];

    if (!possibleKeypressList.includes(event.key)) {
      return;
    }

    event.preventDefault();
    const root = event.currentTarget;
    const previous = event.key === KEYBOARD_KEYS.ARROW_UP;
    const focusedElement = root.ownerDocument?.activeElement;

    if (focusedElement && root.contains(focusedElement)) {
      // Create a temporary element to start search from
      const tempElement = root.ownerDocument.createElement('div');
      root.insertBefore(tempElement, previous ? focusedElement : focusedElement.nextSibling);

      const focusable = getClosestFocusable({
        initial: tempElement,
        previous,
        root,
        keyboard: true,
      });

      // Remove temporary element
      root.removeChild(tempElement);

      focusable?.focus();
    }
  };

  return (
    <DropdownStyled ref={forwardRef} theme={theme} data-testid={COMPONENT_NAME} onKeyDown={handleKeyDown} {...rest}>
      {children}
    </DropdownStyled>
  );
});

Dropdown.displayName = COMPONENT_NAME;
