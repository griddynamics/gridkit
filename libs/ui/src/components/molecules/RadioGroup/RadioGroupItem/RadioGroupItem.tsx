'use client';
import { useTheme } from '@hooks/useTheme';
import { tokensHandler } from '@tokens/utils';
import { get } from '@utils';
import { Tooltip } from '@components/molecules/Tooltip';

import { RadioGroupItemProps } from '../RadioGroup.types';
import { ITEM_COMPONENT_NAME } from '../constants';
import { HiddenInputStyled, RadioItemStyled, RadioLabelStyled } from '../RadioGroupStyled';

export const RadioGroupItem = ({
  item,
  selected,
  disabled,
  size = 'md',
  width,
  height,
  name,
  onClick,
  children,
  styles,
}: RadioGroupItemProps) => {
  const { theme } = useTheme();
  const { radiogroup, ...rest } = theme;
  const themeRadioGroup = new Proxy(radiogroup || {}, tokensHandler(rest));
  const sizeStyles = get(themeRadioGroup, ['size', size, 'label'], {});

  const handleOnChange = () => {
    if (!disabled) {
      onClick(item.value);
    }
  };

  if (item.tooltip) {
    return (
      <Tooltip content={item.tooltip} position="top" styles={{}}>
        <RadioItemStyled
          selected={selected}
          disabled={disabled}
          theme={theme}
          $hex={item.hex}
          $image={item.image}
          $height={height}
          $width={width}
          data-testid={`${ITEM_COMPONENT_NAME}-${item.value}`}
          onClick={handleOnChange}
          styles={styles}
        >
          <HiddenInputStyled
            name={name}
            theme={theme}
            data-testid={`${ITEM_COMPONENT_NAME}-input-${item.value}`}
            aria-checked={selected}
            aria-disabled={disabled}
            value={item.value}
            checked={selected}
            disabled={disabled}
            onChange={handleOnChange}
          />
          {children && children}
          {!children && (
            <RadioLabelStyled theme={theme} selected={selected} disabled={disabled} styles={sizeStyles}>
              {item.label}
            </RadioLabelStyled>
          )}
        </RadioItemStyled>
      </Tooltip>
    );
  }

  return (
    <RadioItemStyled
      selected={selected}
      disabled={disabled}
      theme={theme}
      $hex={item.hex}
      $image={item.image}
      $height={height}
      $width={width}
      data-testid={`${ITEM_COMPONENT_NAME}-${item.value}`}
      onClick={handleOnChange}
      styles={styles}
    >
      <HiddenInputStyled
        name={name}
        theme={theme}
        value={item.value}
        checked={selected}
        disabled={disabled}
        data-testid={`${ITEM_COMPONENT_NAME}-input-${item.value}`}
        onChange={handleOnChange}
        aria-checked={selected}
        aria-disabled={disabled}
      />
      {children && children}
      {!children && (
        <RadioLabelStyled theme={theme} selected={selected} disabled={disabled} styles={sizeStyles}>
          {item.label}
        </RadioLabelStyled>
      )}
    </RadioItemStyled>
  );
};

RadioGroupItem.displayName = ITEM_COMPONENT_NAME;
