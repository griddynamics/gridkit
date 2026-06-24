'use client';
import { forwardRef, PropsWithChildren } from 'react';

import useTheme from '@hooks/useTheme';

import { COMPONENT_NAME } from './constants';
import { CurrentPriceStyled, OldPriceStyled, PriceStyled } from './PriceStyled';
import type { PriceProps } from './';

export const Price = forwardRef<HTMLDivElement, PropsWithChildren<PriceProps>>((props, forwardedRef) => {
  const {
    className = '',
    oldValue,
    currentValue,
    size = 'md',
    currencySymbol,
    currencySymbolPosition = 'before',
    ...rest
  } = props;
  const { theme } = useTheme();

  const formatValue = (value: string) => {
    if (!currencySymbol) return value;
    return currencySymbolPosition === 'after' ? `${value} ${currencySymbol}` : `${currencySymbol}${value}`;
  };

  return (
    <PriceStyled ref={forwardedRef} className={className} theme={theme} data-testid={COMPONENT_NAME} {...rest}>
      <CurrentPriceStyled data-testid={`${COMPONENT_NAME}-current`} theme={theme} $size={size}>
        {formatValue(currentValue)}
      </CurrentPriceStyled>
      {oldValue ? (
        <OldPriceStyled data-testid={`${COMPONENT_NAME}-old`} theme={theme} $size={size}>
          {formatValue(oldValue)}
        </OldPriceStyled>
      ) : null}
    </PriceStyled>
  );
});
