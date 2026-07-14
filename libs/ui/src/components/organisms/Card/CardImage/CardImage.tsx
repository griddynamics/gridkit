'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';

import { Image } from '@components';
import { CardSizeVariant, CardVariant } from '@types';

import { CardImageProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardImageStyled } from './CardImageStyled';

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>((props, forwardedRef) => {
  const { sizeVariant = CardSizeVariant.Default, cardVariant = CardVariant.Vertical, children, ...rest } = props;
  const { theme } = useTheme();

  return (
    <CardImageStyled
      ref={forwardedRef}
      theme={theme}
      $sizeVariant={sizeVariant}
      $cardVariant={cardVariant}
      data-testid={COMPONENT_NAME}
    >
      <Image {...rest} />
      {children}
    </CardImageStyled>
  );
});

CardImage.displayName = COMPONENT_NAME;
