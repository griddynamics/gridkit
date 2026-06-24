'use client';
import { forwardRef } from 'react';
import { CSSObject } from '@emotion/react';

import { getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import {
  get,
  calculateAlign,
  calculateJustify,
  calculateGutter,
  calculateGridColumns,
  calculateGridRows,
} from '@utils';

import { BoxStyles, TabIndex } from '@types';
import {
  RadioGroupVariant,
  HiddenInputStyledProps,
  RadioGroupStyledProps,
  RadioItemStyledProps,
  RadioLabelStyledProps,
  RadioLayoutStyledProps,
} from './RadioGroup.types';

export const HiddenInputStyled = (props: HiddenInputStyledProps) => {
  const { theme: { radiogroup, ...rest } = {}, ...restProps } = props;
  const themeRadioGroup = new Proxy(radiogroup || {}, tokensHandler(rest));
  const computedStyles = {
    ...get(themeRadioGroup, 'input', {}),
  };
  return <input type="radio" css={computedStyles} {...restProps} />;
};

export const RadioGroupStyled = forwardRef<HTMLFieldSetElement, RadioGroupStyledProps>((props, forwardedRef) => {
  const { theme: { radiogroup, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeRadioGroup = new Proxy(radiogroup || {}, tokensHandler(rest));
  const computedStyles = {
    ...get(themeRadioGroup, 'default', {}),
    ...styles,
  };

  return <fieldset ref={forwardedRef} css={computedStyles} {...restProps} />;
});

export const RadioItemStyled = (props: RadioItemStyledProps<HTMLDivElement>) => {
  const {
    theme: { radiogroup, colors, ...rest } = {},
    disabled,
    selected,
    $hex,
    $width,
    $height,
    $image,
    styles = {},
    ...restProps
  } = props;
  const themeRadioGroup = new Proxy(radiogroup || {}, tokensHandler(rest));
  const selectedStyles = get(themeRadioGroup, 'item.selected', {});
  const disabledStyles = get(themeRadioGroup, 'item.disabled', {});
  const hoverStyles = get(themeRadioGroup, 'item.hover', {});
  const backgroundColor = resolveThemeColor(colors, $hex);
  const background = backgroundColor ? { backgroundColor } : {};
  const backgroundImage = $image
    ? { backgroundImage: `url(${$image})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
    : {};
  const computedStyles = {
    ...get(themeRadioGroup, 'item.default', {}),
    ...(disabled ? disabledStyles : {}),
    ...(selected ? selectedStyles : {}),
    ...background,
    ...backgroundImage,
    ...($width ? { width: $width } : {}),
    ...($height ? { height: $height } : {}),
    ...(!disabled && !selected ? hoverStyles : {}),
    ...styles,
  };
  return <div css={computedStyles} {...restProps} />;
};

export const RadioLabelStyled = (props: RadioLabelStyledProps) => {
  const { theme: { radiogroup, ...rest } = {}, selected, disabled, styles = {}, ...restProps } = props;
  const themeRadioGroup = new Proxy(radiogroup || {}, tokensHandler(rest));
  const selectedStyles = get(themeRadioGroup, 'label.selected', {});
  const disabledStyles = get(themeRadioGroup, 'label.disabled', {});
  const hoverStyles = get(themeRadioGroup, 'label.hover', {});

  const computedStyles = {
    ...get(themeRadioGroup, 'label.default', {}),
    ...(disabled ? disabledStyles : {}),
    ...(selected ? selectedStyles : {}),
    ...(!disabled && !selected ? hoverStyles : {}),
    ...styles,
  };
  return <label css={computedStyles} {...restProps} />;
};

export const RadioLayoutStyled = (props: RadioLayoutStyledProps) => {
  const {
    theme: { radiogroup, ...rest } = {},
    $isWrap,
    $align = 'start',
    $justify = 'start',
    $variant,
    $gutter,
    $gridColumns,
    $gridRows,
    $gridColumnGutter,
    $gridRowGutter,
    styles,
    ...restProps
  } = props;
  const themeRadioGroup = new Proxy(radiogroup || {}, tokensHandler(rest));
  const commonStyles = {
    ...get(themeRadioGroup, `layouts.${$variant}`, {}),
    ...getBoxStyles(restProps as BoxStyles<TabIndex>).boxStyles,
    gap: calculateGutter($gutter),
    ...styles,
  };
  const isGridLayout = $variant === RadioGroupVariant.Grid;
  if (isGridLayout) {
    const computedStyles = {
      ...commonStyles,
      gridTemplateColumns: calculateGridColumns($gridColumns),
      gridTemplateRows: calculateGridRows($gridRows),
      ...($gridColumnGutter && { columnGap: calculateGutter($gridColumnGutter) }),
      ...($gridRowGutter && { rowGap: calculateGutter($gridRowGutter) }),
    };
    return <div css={computedStyles} {...restProps} />;
  }

  const computedStyles = {
    ...commonStyles,
    flexWrap: $isWrap ? 'wrap' : 'nowrap',
    alignItems: calculateAlign($align),
    justifyContent: calculateJustify($justify),
  } as CSSObject;

  return <div css={computedStyles} {...restProps} />;
};
