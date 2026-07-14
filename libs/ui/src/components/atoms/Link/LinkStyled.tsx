import { forwardRef } from 'react';
import type { CSSObject } from '@emotion/react';

import { get } from '@utils';
import { getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';
import type { DefaultTheme } from '@hooks';

import type { LinkStyledProps } from './Link.types';

const resolveStylesColors = (
  styles: CSSObject | undefined,
  colors: DefaultTheme['colors'] | undefined
): CSSObject | undefined => {
  if (!styles || !colors) return styles;
  return Object.fromEntries(
    Object.entries(styles).map(([key, value]) => {
      if (key === 'color' && typeof value === 'string') {
        return [key, resolveThemeColor(colors, value)];
      }
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return [key, resolveStylesColors(value as CSSObject, colors)];
      }
      return [key, value];
    })
  ) as CSSObject;
};

export const LinkStyled = forwardRef<HTMLAnchorElement, LinkStyledProps>((props, forwardedRef) => {
  const {
    theme: { link, ...rest } = {},
    $variant = 'primary',
    $size,
    $underline,
    $color,
    $cursor,
    styles = {},
    ...restProps
  } = props;
  const colors = (rest as { colors?: DefaultTheme['colors'] }).colors;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeLink = new Proxy(link || {}, tokensHandler(rest));

  const sizeMap = get(themeLink, 'sizeMap', {}) as Record<string, { fontSize: string; lineHeight: string }>;
  const sizeStyles =
    $size && sizeMap[$size]
      ? {
          fontSize: sizeMap[$size].fontSize || 'inherit',
          lineHeight: sizeMap[$size].lineHeight || 'inherit',
        }
      : {};

  const underlineStyles = $underline && $underline !== 'default' ? get(themeLink, `underline.${$underline}`, {}) : {};
  const resolvedColor = resolveThemeColor(colors, $color);
  const resolvedStyles = resolveStylesColors(styles, colors);

  const componentStyles = [
    { cursor: $cursor },
    get(themeLink, 'default', {}),
    get(themeLink, $variant, {}),
    sizeStyles,
    underlineStyles,
    boxStyles,
    resolvedStyles,
    ...(resolvedColor ? [{ color: resolvedColor }] : []),
  ];

  return <a css={componentStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
