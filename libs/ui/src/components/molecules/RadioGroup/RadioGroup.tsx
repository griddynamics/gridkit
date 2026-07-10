'use client';
import { forwardRef, PropsWithChildren, useState, useCallback, useId } from 'react';

import { useTheme } from '@hooks/useTheme';
import { InputRole } from '@types';
import { Column } from '@components/layout';
import { get } from '@utils';

import { COMPONENT_NAME } from './constants';
import { RadioGroupVariant, RadioOption, type RadioGroupProps } from './RadioGroup.types';
import { RadioGroupItem } from './RadioGroupItem';
import { RadioGroupStyled, RadioLayoutStyled } from './RadioGroupStyled';

export const RadioGroup = forwardRef<HTMLFieldSetElement, PropsWithChildren<RadioGroupProps>>((props, forwardedRef) => {
  const {
    styles,
    options,
    variant = RadioGroupVariant.Row,
    value,
    defaultValue,
    size = 'md',
    onChange,
    name: nameProp,
    itemHeight,
    itemWidth,
    gutter = '8px',
    gridColumns,
    gridRows,
    gridColumnGutter,
    gridRowGutter,
    renderOption,
    className,
    align,
    justify,
    wrapItems,
    'aria-label': ariaLabel,
  } = props;
  const { theme } = useTheme();
  const generatedId = useId();
  const name = nameProp ?? `radio-group-${generatedId}`;
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleChange = useCallback(
    (newValue: string) => {
      const handleValueChange = isControlled ? onChange : setInternalValue;
      handleValueChange?.(newValue);
    },
    [isControlled, onChange]
  );

  const handleItemClick = (option: RadioOption) => {
    if (!option.disabled) {
      handleChange(option.value);
    }
  };

  return (
    <RadioGroupStyled
      ref={forwardedRef}
      role={InputRole.Radiogroup}
      theme={theme}
      styles={styles}
      data-testid={COMPONENT_NAME}
      className={className}
      aria-label={ariaLabel}
    >
      <Column gutter={get(theme, 'spacing.sm', 'theme.spacing.sm')}>
        <RadioLayoutStyled
          theme={theme}
          $variant={variant}
          $isWrap={wrapItems}
          $align={align}
          $justify={justify}
          $gutter={gutter}
          $gridColumns={gridColumns}
          $gridRows={gridRows}
          $gridColumnGutter={gridColumnGutter}
          $gridRowGutter={gridRowGutter}
        >
          {options.map((option) => {
            const isSelected = selectedValue === option.value;
            const isDisabled = option.disabled;
            if (renderOption) {
              return (
                <RadioGroupItem
                  key={`${name}-${option.value}`}
                  name={name}
                  selected={isSelected}
                  disabled={isDisabled}
                  size={size}
                  item={option}
                  width={itemWidth}
                  height={itemHeight}
                  onClick={() => handleItemClick(option)}
                >
                  {renderOption({ option, isSelected, isDisabled, selectedValue })}
                </RadioGroupItem>
              );
            }
            return (
              <RadioGroupItem
                key={`${name}-${option.value}`}
                name={name}
                selected={isSelected}
                disabled={isDisabled}
                size={size}
                item={option}
                width={itemWidth}
                height={itemHeight}
                onClick={() => handleItemClick(option)}
              />
            );
          })}
        </RadioLayoutStyled>
      </Column>
    </RadioGroupStyled>
  );
});

RadioGroup.displayName = COMPONENT_NAME;
