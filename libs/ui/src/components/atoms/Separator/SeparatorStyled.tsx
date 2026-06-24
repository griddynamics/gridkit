'use client';
import { forwardRef, type Ref } from 'react';
import { get } from '@utils';

import { getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import { type BoxStyles, Orientation, SeparatorVariant, SizeVariant } from '@types';
import { TypographyStyled } from '@components/atoms/Typography/TypographyStyled';
import type {
  SeparatorElement,
  SeparatorLabelStyledProps,
  SeparatorLineStyledProps,
  SeparatorWrapperStyledProps,
} from './';

export const SeparatorWrapperStyled = forwardRef<SeparatorElement, SeparatorWrapperStyledProps>(
  (props, forwardedRef) => {
    const {
      theme: { separator, ...rest } = {},
      styles = {},
      $as: Component = 'div',
      $orientation = Orientation.Horizontal,
      $length,
      ...restProps
    } = props;

    const sizeKey = $orientation === Orientation.Horizontal ? 'width' : 'height';
    const sizeStyles = {
      [sizeKey]: $length,
    };

    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeSeparator = new Proxy(separator || {}, tokensHandler(rest));

    const computedStyles = [
      get(themeSeparator, 'default', {}),
      get(themeSeparator, $orientation, {}),
      $length ? sizeStyles : {},
      boxStyles,
      styles,
    ];

    if (Component === 'hr') {
      return <hr css={computedStyles} {...restNotStyledProps} ref={forwardedRef as Ref<HTMLHRElement>} />;
    }

    if (Component === 'span') {
      return <span css={computedStyles} {...restNotStyledProps} ref={forwardedRef as Ref<HTMLSpanElement>} />;
    }

    return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef as Ref<HTMLDivElement>} />;
  }
);

export const SeparatorLineStyled = (props: SeparatorLineStyledProps) => {
  const {
    theme: { separator, colors, values, ...rest } = {},
    styles = {},
    $as: Component = 'div',
    $orientation = Orientation.Horizontal,
    $color,
    $size = SizeVariant.Sm,
    $variant = SeparatorVariant.Solid,
    ...restProps
  } = props;

  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSeparator = new Proxy(separator || {}, tokensHandler(rest));
  const sizeValue = get(values, `separator.thickness.${$size}`, values?.separator?.thickness?.sm);

  const color = resolveThemeColor(colors, $color ?? 'border.default');
  const border = `${sizeValue} ${$variant} ${color}`;
  const borderSide = $orientation === Orientation.Horizontal ? 'borderTop' : 'borderLeft';
  const borderStyles = { ...get(themeSeparator, `line.${$orientation}`, {}), [borderSide]: border };

  const computedStyles = [get(themeSeparator, 'line.default', {}), borderStyles, boxStyles, styles];

  return <Component css={computedStyles} {...restNotStyledProps} />;
};

export const SeparatorLabelStyled = (props: SeparatorLabelStyledProps) => {
  const { theme: { separator, colors, ...rest } = {}, $labelColor, $size, children, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSeparator = new Proxy(separator || {}, tokensHandler(rest));
  const labelColor = resolveThemeColor(colors, $labelColor ?? 'text.caption');

  const computedStyles = [get(themeSeparator, `label.default`, {}), boxStyles, styles];
  const attributes = get(themeSeparator, `label.attrs.${$size}`, {});

  return (
    <TypographyStyled css={computedStyles} {...attributes} $color={labelColor} {...restNotStyledProps}>
      {children}
    </TypographyStyled>
  );
};
