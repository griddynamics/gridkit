'use client';
import { forwardRef, PropsWithChildren } from 'react';

import { useTheme } from '@hooks/useTheme';

import { Counter } from '@components';
import { CardSizeVariant, CardVariant } from '@types';

import { CardCounterProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardCounterStyled } from './CardCounterStyled';

export const CardCounter = forwardRef<HTMLDivElement, PropsWithChildren<CardCounterProps>>((props, forwardedRef) => {
  const { sizeVariant = CardSizeVariant.Default, children, cardVariant = CardVariant.Vertical, ...rest } = props;
  const { theme } = useTheme();

  return (
    <CardCounterStyled
      ref={forwardedRef}
      theme={theme}
      $cardVariant={cardVariant}
      $sizeVariant={sizeVariant}
      data-testid={COMPONENT_NAME}
    >
      <Counter {...rest} />
      {children}
    </CardCounterStyled>
  );
});

CardCounter.displayName = COMPONENT_NAME;
