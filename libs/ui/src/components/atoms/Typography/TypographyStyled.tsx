import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import { type BoxStyles, SizeVariant, TextAlign, TypographyVariant } from '@types';

import type { TypographyStyledProps } from './';

export const TypographyStyled = forwardRef<HTMLBaseElement, TypographyStyledProps>(
  (
    {
      theme: { typography, colors, ...rest } = {},
      $as: Component = 'span',
      $color,
      $align = TextAlign.Start,
      $variant = TypographyVariant.Inherit,
      $size = SizeVariant.Md,
      $styleVariant,
      styles,
      ...restProps
    },
    forwardedRef
  ) => {
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeTypography = new Proxy(typography || {}, tokensHandler(rest));
    const baseStyles = get(themeTypography, 'base', {});
    const variantStyles = get(themeTypography, $variant, {});
    const variantBySizeStyles = get(themeTypography, [$variant, $size], {});
    const color = resolveThemeColor(colors, $color);
    const formattedStyleVariant = typeof $styleVariant === 'string' ? [$styleVariant] : $styleVariant;
    const computedTypographyStyles = formattedStyleVariant?.reduce((computedTextStyles, textStyle) => {
      return {
        ...computedTextStyles,
        ...get(themeTypography, ['styleVariant', textStyle], {}),
      };
    }, {});

    const computedStyles = [
      {
        ':where(&)': Object.assign(
          {},
          baseStyles,
          variantStyles,
          variantBySizeStyles,
          computedTypographyStyles,
          { textAlign: $align, color },
          boxStyles
        ),
      },
      styles,
    ];

    return <Component css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
  }
);
