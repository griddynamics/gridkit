'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { CardWishlistStyledProps } from '../Card.types';

export const CardWishlistStyled = forwardRef<HTMLButtonElement, CardWishlistStyledProps>((props, forwardedRef) => {
  const { theme: { card, ...rest } = {}, $cardVariant, $sizeVariant, $isActive, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCard = new Proxy(card || {}, tokensHandler(rest));
  const componentStyles = get(themeCard, 'wishlist', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    $isActive ? get(componentStyles, 'active', {}) : {},
    get(componentStyles, [$cardVariant, $sizeVariant], {}),
    boxStyles,
    styles,
  ];
  return <button type="button" css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
