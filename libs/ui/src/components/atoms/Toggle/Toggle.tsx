'use client';
import { forwardRef, useCallback } from 'react';

import { useTheme } from '@hooks/useTheme';
import { ButtonVariant } from '@types';

import { Button } from '../Button';
import { ToggleProps, ToggleItem } from './Toggle.types';
import { COMPONENT_NAME } from './constants';
import { ToggleStyled } from './ToggleStyled';

const extractItemProps = (item: string | ToggleItem): ToggleItem => {
  return typeof item === 'object' ? item : { label: item, value: item };
};

export const Toggle = forwardRef<HTMLDivElement, ToggleProps<unknown>>((props, forwardedRef) => {
  const { items = [], onValueChange, value, renderItemContent, disabled = false, ...rest } = props;
  const { theme } = useTheme();

  const selectItem = useCallback(
    (value: unknown) => {
      if (onValueChange) {
        onValueChange(value);
      }
    },
    [onValueChange]
  );

  return (
    <ToggleStyled ref={forwardedRef} data-testid={COMPONENT_NAME} theme={theme} disabled={disabled} {...rest}>
      {items.map((item: ToggleItem | string, index: number) => {
        const toggleItem: ToggleItem = extractItemProps(item);
        const buttonProps = {
          variant: toggleItem.value === value ? ButtonVariant.Primary : ButtonVariant.Text,
          onClick: () => selectItem(toggleItem.value),
          disabled,
        };

        return (
          <Button key={`toggle-${index}`} {...buttonProps}>
            {renderItemContent ? renderItemContent(item, index) : toggleItem.label}
          </Button>
        );
      })}
    </ToggleStyled>
  );
});

Toggle.displayName = COMPONENT_NAME;
