'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Price } from '@components';
import { CardSizeVariant, CardVariant } from '@types';

import { CardPriceProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardPriceStyled } from './CardPriceStyled';

export const CardPrice = forwardRef<HTMLDivElement, CardPriceProps>((props, forwardedRef) => {
  const { sizeVariant = CardSizeVariant.Default, cardVariant = CardVariant.Vertical, ...rest } = props;
  const { theme } = useTheme();

  return (
    <CardPriceStyled
      ref={forwardedRef}
      theme={theme}
      $cardVariant={cardVariant}
      $sizeVariant={sizeVariant}
      data-testid={COMPONENT_NAME}
    >
      <Price {...rest} />
    </CardPriceStyled>
  );
});

CardPrice.displayName = COMPONENT_NAME;
