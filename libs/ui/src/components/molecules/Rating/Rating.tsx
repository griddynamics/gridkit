'use client';
import { useState, forwardRef, KeyboardEvent } from 'react';

import { get, generateUniqueId, convertToFormattedPercents } from '@utils';
import { KEYBOARD_KEYS } from '@constants';
import { TabIndex } from '@types';
import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components';
import {
  COMPONENT_NAME,
  DEFAULT_MAX_RATE,
  DEFAULT_SIZE,
  DEFAULT_VALUE,
  DEFAULT_READ_ONLY,
  DEFAULT_SIZE_VALUE,
} from './constants';
import { RadioInputStyled, RadioLabelStyled, RatingProgressWrapperStyled, RatingStyled } from './RatingStyled';
import type { RatingProps } from './';

export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value = DEFAULT_VALUE,
      groupName = COMPONENT_NAME,
      onChange,
      readOnly = DEFAULT_READ_ONLY,
      max = DEFAULT_MAX_RATE,
      size = DEFAULT_SIZE,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();
    const [controlledValue, setControlledValue] = useState(value);
    const [hoveredValue, setHoveredValue] = useState(0);

    const currentRateValue = onChange ? value : controlledValue;
    const ratingStyles = get(theme, 'rating', {});
    const sizeValues = get(ratingStyles, ['size', size], { width: DEFAULT_SIZE_VALUE, height: DEFAULT_SIZE_VALUE });
    const icons = get(ratingStyles, 'icons', {});
    const ratingItems = Array.from({ length: max });
    const valueInPercents = convertToFormattedPercents({ max, target: value, formatChar: '%' }) as string;

    const handleChange = (newRateValue: number) => {
      if (readOnly) return;
      const changeHandler = onChange || setControlledValue;
      changeHandler(newRateValue);
    };

    const handleEnterPress = (event: KeyboardEvent<HTMLLabelElement>, newRateValue: number) => {
      if (readOnly || event.key !== KEYBOARD_KEYS.ENTER) return;
      handleChange(newRateValue);
    };

    const handleMouseEnter = (hoverValue: number) => {
      if (readOnly) return;
      setHoveredValue(hoverValue);
    };

    const handleMouseLeave = () => {
      setHoveredValue(0);
    };

    return (
      <RatingStyled $readOnly={readOnly} ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME} {...rest}>
        {readOnly && (
          <RatingProgressWrapperStyled
            theme={theme}
            $width={valueInPercents}
            data-testid={`${COMPONENT_NAME}-progress`}
          >
            {ratingItems.map((_, idx) => (
              <Icon
                key={generateUniqueId(`${COMPONENT_NAME}-${idx}`, 'rate-progress')}
                {...get(icons, 'rateActive', { name: 'star' })}
                {...sizeValues}
              />
            ))}
          </RatingProgressWrapperStyled>
        )}
        {ratingItems.map((_, idx) => {
          const ratingValue = idx + 1;
          const isChecked = ratingValue === currentRateValue;
          const actualValue = hoveredValue !== 0 ? hoveredValue : currentRateValue;
          const isHighlighted = ratingValue <= actualValue;
          const icon = isHighlighted
            ? get(icons, 'rateActive', { name: 'star' })
            : get(icons, 'rateInactive', { name: 'starOutlined' });

          return (
            <RadioLabelStyled
              $isActive={isHighlighted}
              $readOnly={readOnly}
              theme={theme}
              onKeyDown={(event) => handleEnterPress(event, ratingValue)}
              tabIndex={TabIndex.Default}
              onMouseEnter={() => handleMouseEnter(ratingValue)}
              onMouseLeave={handleMouseLeave}
              key={generateUniqueId(`${COMPONENT_NAME}-${idx}`, 'rate')}
              data-testid={`${COMPONENT_NAME}-label`}
            >
              <RadioInputStyled
                name={groupName}
                theme={theme}
                value={ratingValue}
                onChange={() => handleChange(ratingValue)}
                defaultChecked={isChecked}
                aria-checked={isChecked}
                readOnly={readOnly}
                data-testid={`${COMPONENT_NAME}-input`}
              />
              <Icon {...sizeValues} {...icon} />
            </RadioLabelStyled>
          );
        })}
      </RatingStyled>
    );
  }
);

Rating.displayName = COMPONENT_NAME;
