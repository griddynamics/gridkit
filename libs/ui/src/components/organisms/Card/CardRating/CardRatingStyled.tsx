'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { CardRatingStyledProps } from '../Card.types';

export const CardRatingStyled = forwardRef<HTMLDivElement, CardRatingStyledProps>((props, forwardedRef) => {
  const { theme: { card, ...rest } = {}, $cardVariant, $sizeVariant, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCard = new Proxy(card || {}, tokensHandler(rest));
  const componentStyles = get(themeCard, 'rating', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$cardVariant, $sizeVariant], {}),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
