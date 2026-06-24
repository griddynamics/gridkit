'use client';
import { ChangeEvent, useCallback, useState } from 'react';
import type { KeyboardEvent, FocusEvent, MouseEvent } from 'react';

import { KEYBOARD_KEYS } from '@constants';
import { debounce } from '@utils';
import { useLogger } from '@hooks';

import { COMPONENT_NAME } from './constants';

export const useInputHandlers = ({
  onMouseDown,
  onChange,
  onKeyDown,
  onBlur,
  debounceCallbackTime,
}: {
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onMouseDown?: (event: MouseEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  debounceCallbackTime?: number;
}) => {
  // Track if the input field interaction was initiated by mouse vs. keyboard for styling purposes: show focus outline only for keyboard TAB clivk
  const [isMouseInteraction, setIsMouseInteraction] = useState(false);
  const logger = useLogger();

  const handleMouseDown = useCallback(
    (event: MouseEvent<HTMLInputElement>) => {
      setIsMouseInteraction(true);
      logger.debug(`${COMPONENT_NAME}: MouseDown`);
      onMouseDown?.(event);
    },
    [onMouseDown, logger]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === KEYBOARD_KEYS.TAB) {
        setIsMouseInteraction(false);
      }
      logger.debug(`${COMPONENT_NAME}: KeyDown`, {
        key: event.key,
        isTab: event.key === KEYBOARD_KEYS.TAB,
      });
      onKeyDown?.(event);
    },
    [onKeyDown, logger]
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setIsMouseInteraction(false);
      logger.debug(`${COMPONENT_NAME}: Blur`, {
        value: event.target.value,
        valueLength: event.target.value.length,
      });
      onBlur?.(event);
    },
    [onBlur, logger]
  );

  const debouncedKeyDown =
    typeof debounceCallbackTime === 'number' && onKeyDown
      ? debounce(handleKeyDown, debounceCallbackTime)
      : handleKeyDown;

  const debouncedOnChange =
    typeof debounceCallbackTime === 'number' && onChange ? debounce(onChange, debounceCallbackTime) : onChange;

  return {
    handlers: {
      onMouseDown: handleMouseDown,
      onKeyDown: debouncedKeyDown,
      onBlur: handleBlur,
      onChange: debouncedOnChange,
    },
    isMouseInteraction,
  };
};
