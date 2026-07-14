'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';

import { CardSizeVariant, CardVariant, TypographyVariant } from '@types';

import { CardTextProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardDescriptionStyled } from './CardDescriptionStyled';

export const CardDescription = forwardRef<HTMLBaseElement, CardTextProps>((props, forwardedRef) => {
  const {
    sizeVariant = CardSizeVariant.Default,
    cardVariant = CardVariant.Vertical,
    children,
    as = TypographyVariant.Body1,
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <CardDescriptionStyled
      ref={forwardedRef}
      theme={theme}
      as={as}
      $sizeVariant={sizeVariant}
      $cardVariant={cardVariant}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      {children}
    </CardDescriptionStyled>
  );
});

CardDescription.displayName = COMPONENT_NAME;
