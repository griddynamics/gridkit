'use client';
import { forwardRef, PropsWithChildren } from 'react';

import { useTheme } from '@hooks/useTheme';

import { CardVariant, TypographyVariant, CardSizeVariant, TypographyStyleVariant } from '@types';

import { CardTextProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardTitleStyled } from './CardTitleStyled';

export const CardTitle = forwardRef<HTMLBaseElement, PropsWithChildren<CardTextProps>>((props, forwardedRef) => {
  const {
    sizeVariant = CardSizeVariant.Default,
    cardVariant = CardVariant.Vertical,
    children,
    as = TypographyVariant.H3,
    styleVariant = TypographyStyleVariant.Semibold,
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <CardTitleStyled
      ref={forwardedRef}
      as={as}
      theme={theme}
      $styleVariant={styleVariant}
      $sizeVariant={sizeVariant}
      $cardVariant={cardVariant}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      {children}
    </CardTitleStyled>
  );
});

CardTitle.displayName = COMPONENT_NAME;
