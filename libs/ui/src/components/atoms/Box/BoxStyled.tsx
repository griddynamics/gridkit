'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { BoxStyledProps } from '.';

export const BoxStyled = forwardRef<HTMLDivElement, BoxStyledProps>((props, forwardedRef) => {
  const {
    theme: { box, ...rest } = {},
    $variant,
    $isBordered,
    $isHighlighted,
    $withShadowHover,
    styles = {},
    ...restProps
  } = props;

  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeBox = new Proxy(box || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeBox, 'default', {}),
    get(themeBox, [$variant, 'default'], {}),
    $withShadowHover ? get(themeBox, 'shadowHover', {}) : {},
    $isBordered ? get(themeBox, [$variant, 'bordered'], {}) : {},
    $isHighlighted ? get(themeBox, [$variant, 'highlighted'], {}) : {},
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
