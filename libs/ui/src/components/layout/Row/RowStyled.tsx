import { forwardRef } from 'react';

import { get, calculateAlign, calculateJustify, calculateGutter } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { RowStyledProps } from './Row.types';

export const RowStyled = forwardRef<HTMLDivElement, RowStyledProps>((props, forwardedRef) => {
  const {
    theme: { row, ...rest } = {},
    $flex,
    $isWrap,
    $align,
    $justify,
    $gutter,
    $isReversed,
    styles,
    as: Component = 'div',
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeRow = new Proxy(row || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeRow, 'default', {}),
    {
      flexDirection: $isReversed ? 'row-reverse' : 'row',
      flexWrap: $isWrap ? 'wrap' : 'nowrap',
      alignItems: calculateAlign($align),
      justifyContent: calculateJustify($justify),
      gap: calculateGutter($gutter),
    },
    boxStyles,
    $flex ? { flex: $flex } : {},
    styles,
  ];

  return <Component css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
