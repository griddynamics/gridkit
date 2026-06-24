'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Badge } from '@components/atoms/Badge';
import { CardSizeVariant, CardVariant } from '@types';

import type { CardBadgeProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardBadgeStyled } from './CardBadgeStyled';

export const CardBadge = forwardRef<HTMLDivElement, CardBadgeProps>((props, forwardedRef) => {
  const {
    sizeVariant = CardSizeVariant.Default,
    cardVariant = CardVariant.Vertical,
    children,
    variant = 'primary',
    appearance = 'filled',
    size = 'sm',
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <CardBadgeStyled
      ref={forwardedRef}
      theme={theme}
      $cardVariant={cardVariant}
      $sizeVariant={sizeVariant}
      data-testid={COMPONENT_NAME}
    >
      <Badge variant={variant} appearance={appearance} size={size} {...rest}>
        {children}
      </Badge>
    </CardBadgeStyled>
  );
});

CardBadge.displayName = COMPONENT_NAME;
