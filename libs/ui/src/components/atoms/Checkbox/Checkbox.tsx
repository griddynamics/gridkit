'use client';
import { forwardRef, useCallback, useEffect, useRef, useState, type ChangeEventHandler } from 'react';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';

import { COMPONENT_NAME } from './constants';
import { CheckboxWrapperStyled, CheckboxInputStyled, CheckboxIndicatorStyled } from './CheckboxStyled';
import type { CheckboxProps } from './Checkbox.types';

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>((props, forwardedRef) => {
  const {
    checked,
    indeterminate = false,
    disabled = false,
    name,
    value,
    size = 'md',
    onValueChange,
    children,
    ...rest
  } = props;

  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = checked !== undefined;
  const [checkedInternal, setCheckedInternal] = useState(checked ?? false);

  const currentChecked = isControlled ? checked! : checkedInternal;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  useEffect(() => {
    if (isControlled) {
      setCheckedInternal(checked!);
    }
  }, [checked, isControlled]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      if (disabled) return;
      const newChecked = event.target.checked;
      if (!isControlled) {
        setCheckedInternal(newChecked);
      }
      onValueChange?.(newChecked);
    },
    [disabled, isControlled, onValueChange]
  );

  const sizeValues = get(theme, ['checkbox', 'size', size], { iconSize: 12 });

  return (
    <CheckboxWrapperStyled
      ref={forwardedRef}
      theme={theme}
      $disabled={disabled}
      data-testid={`${COMPONENT_NAME}-wrapper`}
      {...rest}
    >
      <CheckboxInputStyled
        ref={inputRef}
        theme={theme}
        name={name}
        value={value}
        checked={currentChecked}
        disabled={disabled}
        onChange={onChange}
        aria-checked={indeterminate ? 'mixed' : currentChecked}
        data-testid={COMPONENT_NAME}
      />
      <CheckboxIndicatorStyled
        theme={theme}
        $checked={currentChecked}
        $indeterminate={indeterminate}
        $disabled={disabled}
        $size={size}
        data-testid={`${COMPONENT_NAME}-indicator`}
      >
        {currentChecked && !indeterminate && (
          <Icon name="check" width={sizeValues.iconSize} height={sizeValues.iconSize} fill="neutral.white" />
        )}
        {indeterminate && (
          <Icon name="minus" width={sizeValues.iconSize} height={sizeValues.iconSize} fill="neutral.white" />
        )}
      </CheckboxIndicatorStyled>
      {children && <span data-testid={`${COMPONENT_NAME}-label`}>{children}</span>}
    </CheckboxWrapperStyled>
  );
});

Checkbox.displayName = COMPONENT_NAME;
