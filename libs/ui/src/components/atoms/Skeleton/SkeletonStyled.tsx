'use client';
import { forwardRef } from 'react';

import { get } from '@utils';
import { convertJsonToCssKeyframeCss, getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import { SkeletonVariant, type BoxStyles } from '@types';

import type { SkeletonPropsStyled } from './';

export const SkeletonStyled = forwardRef<HTMLSpanElement, SkeletonPropsStyled>((props, forwardedRef) => {
  const {
    theme: { skeleton, animations, colors, ...rest } = {},
    $variant = SkeletonVariant.Rounded,
    styles = {},
    $animationName = 'blinkKeyframes',
    $animationProps,
    $backgroundColor,
    ...restProps
  } = props;

  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSkeleton = new Proxy(skeleton || {}, tokensHandler(rest));
  const animationKeyframeName = get(animations, $animationName ?? '', null);
  const animationName = animationKeyframeName ? convertJsonToCssKeyframeCss(animationKeyframeName) : $animationName;

  const animation = {
    animation: `${animationName} ${$animationProps}`,
  };
  const backgroundColor = $backgroundColor ? { backgroundColor: resolveThemeColor(colors, $backgroundColor) } : {};

  const computedStyles = [
    get(themeSkeleton, 'default', {}),
    get(themeSkeleton, $variant, {}),
    backgroundColor,
    boxStyles,
    animationName ? animation : {},
    styles,
  ];
  return <span css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
