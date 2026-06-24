'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';
import { CardSizeVariant, CardVariant } from '@types';
import { get } from '@utils';

import type { CardWishlistProps } from '../Card.types';
import { COMPONENT_NAME } from './constants';
import { CardWishlistStyled } from './CardWishlistStyled';

export const CardWishlist = forwardRef<HTMLButtonElement, CardWishlistProps>((props, forwardedRef) => {
  const {
    sizeVariant = CardSizeVariant.Default,
    cardVariant = CardVariant.Vertical,
    isActive = false,
    onToggle,
    ariaLabel = 'Add to wishlist',
    ...rest
  } = props;
  const { theme } = useTheme();

  const iconProps = isActive
    ? get(theme, 'card.wishlist.icon.active', { name: 'favorite' })
    : get(theme, 'card.wishlist.icon.inactive', { name: 'favoriteOutlined' });

  return (
    <CardWishlistStyled
      ref={forwardedRef}
      theme={theme}
      $cardVariant={cardVariant}
      $sizeVariant={sizeVariant}
      $isActive={isActive}
      onClick={onToggle}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      <Icon {...iconProps} />
    </CardWishlistStyled>
  );
});

CardWishlist.displayName = COMPONENT_NAME;
