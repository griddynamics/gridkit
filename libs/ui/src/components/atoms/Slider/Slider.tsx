'use client';
import { forwardRef, useEffect, useState, ChangeEvent } from 'react';

import { useTheme } from '@hooks/useTheme';
import { setInRange } from '@utils';

import { COMPONENT_NAME, SLIDER_MIN_VALUE_DEFAULT, SLIDER_MAX_VALUE_DEFAULT } from './constants';
import { StyledSlider } from './SliderStyled';
import type { SliderProps } from './Slider.types';

/**
 * Slider component allows users to select a numeric value from a specified range by dragging a thumb.
 *
 * Supports both controlled and uncontrolled usage.
 * The background visually indicates the current value as a percentage of the range.
 * Can be disabled and accepts custom styles.
 *
 * @component
 * @param {number} [min=0] - Minimum value of the slider.
 * @param {number} [max=100] - Maximum value of the slider.
 * @param {number} [value] - Current value (for controlled usage).
 * @param {(value: number) => void} [onChange] - Callback fired when the value changes.
 * @param {boolean} [disabled] - If true, the slider is disabled.
 * @param {object} [styles] - Additional custom styles for the slider.
 *
 * @example
 * <Slider min={0} max={10} value={5} onChange={val => console.log(val)} />
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>((props, forwarderRef) => {
  const { min = SLIDER_MIN_VALUE_DEFAULT, max = SLIDER_MAX_VALUE_DEFAULT, value, onChange, disabled, ...rest } = props;
  const { theme } = useTheme();
  const [currentValue, setCurrentValue] = useState(value || min);

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = setInRange({ min, max, value: Number(event.target.value) });

    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const fillRatio = max > min ? (currentValue - min) / (max - min) : min;

  return (
    <StyledSlider
      data-testid={COMPONENT_NAME}
      type="range"
      role="slider"
      min={min}
      max={max}
      value={currentValue}
      disabled={disabled}
      theme={theme}
      fillRatio={fillRatio}
      onChange={handleChange}
      aria-valuenow={currentValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={disabled}
      ref={forwarderRef}
      {...rest}
    />
  );
});

Slider.displayName = COMPONENT_NAME;
