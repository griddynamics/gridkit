'use client';
import { forwardRef, useCallback, useMemo, type KeyboardEvent, type MouseEvent, type Ref } from 'react';

import { KEYBOARD_KEYS } from '@constants/keyboard';
import { useTheme } from '@hooks/useTheme';
import { TabIndex } from '@types';
import { useSelectContext } from '@components/atoms/Select/hooks';
import type { Option } from '@components';

import { COMPONENT_NAME } from './constants';
import { DropdownItemStyled } from './DropdownItemStyled';
import type { DropdownItemProps } from '.';

export const DropdownItem = forwardRef(
  <T = HTMLDivElement,>(props: DropdownItemProps<T>, forwardRef: Ref<HTMLDivElement>) => {
    const { children, value, onSelect, className, disabled, name, ...rest } = props;
    const { theme } = useTheme();

    const { onSelect: onDropdownSelect, value: selectedValue, itemIdentifier, multiple } = useSelectContext();
    const data = { name, value } as Option;
    const dataStr = JSON.stringify(data);
    const isActive = (() => {
      if (selectedValue === undefined) {
        return className?.includes('active');
      }
      if (multiple && Array.isArray(selectedValue)) {
        return selectedValue.some((item) => itemIdentifier?.(item, data) ?? item.value === data.value);
      }
      if (!multiple && !Array.isArray(selectedValue)) {
        return itemIdentifier ? itemIdentifier(selectedValue, data) : className?.includes('active');
      }
      return className?.includes('active');
    })();
    const computedClassName = useMemo(() => `${className || ''} ${isActive ? 'active' : ''}`, [className, isActive]);

    const onChooseHandler = useCallback(
      (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        if (onSelect) {
          onSelect({ event, data });
        } else if (onDropdownSelect) {
          onDropdownSelect({ event, data });
        }

        return value;
      },
      [onSelect, onDropdownSelect, dataStr, JSON.stringify(value), disabled]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) return;

        if (event.key === KEYBOARD_KEYS.ENTER) {
          event.preventDefault();
          onChooseHandler(event);
        }
      },
      [onChooseHandler, disabled, dataStr]
    );

    return (
      <DropdownItemStyled
        ref={forwardRef}
        theme={theme}
        $disabled={disabled}
        tabIndex={disabled ? TabIndex.Disabled : TabIndex.Default}
        data-testid={COMPONENT_NAME}
        className={computedClassName}
        onClick={onChooseHandler}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children || name}
      </DropdownItemStyled>
    );
  }
);

DropdownItem.displayName = COMPONENT_NAME;
