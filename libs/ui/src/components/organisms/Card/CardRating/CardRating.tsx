'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Rating } from '@components';
import { CardSizeVariant, CardVariant } from '@types';

import { CardRatingProps } from '../Card.types';
import { CARD_RATING_DEFAULT_SIZE, CARD_RATING_DEFAULT_VAL, COMPONENT_NAME } from './constants';
import { CardRatingStyled } from './CardRatingStyled';

export const CardRating = forwardRef<HTMLDivElement, CardRatingProps>((props, forwardedRef) => {
  const {
    sizeVariant = CardSizeVariant.Default,
    cardVariant = CardVariant.Vertical,
    readOnly = true,
    size = CARD_RATING_DEFAULT_SIZE,
    value = CARD_RATING_DEFAULT_VAL,
    label,
    styles = {},
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <CardRatingStyled
      ref={forwardedRef}
      theme={theme}
      $cardVariant={cardVariant}
      $sizeVariant={sizeVariant}
      data-testid={COMPONENT_NAME}
      styles={styles}
    >
      <Rating size={size} readOnly={readOnly} value={value} {...rest} />
      {label}
    </CardRatingStyled>
  );
});

CardRating.displayName = COMPONENT_NAME;
