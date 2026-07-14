import { forwardRef } from 'react';
import { get, calculateAlign, calculateJustify, calculateGutter } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { ColumnStyledProps } from './Column.types';

export const ColumnStyled = forwardRef<HTMLDivElement, ColumnStyledProps>((props, forwardedRef) => {
  const {
    theme: { column, ...rest } = {},
    $isWrap,
    $align,
    $justify,
    $gutter,
    $flex,
    $isReversed,
    styles,
    as: Component = 'div',
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeColumn = new Proxy(column || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeColumn, 'default', {}),
    {
      flexDirection: $isReversed ? 'column-reverse' : 'column',
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
