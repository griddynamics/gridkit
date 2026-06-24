'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens/utils';

import { COMPONENT_NAME } from './constants';
import { ColumnStyled } from './ColumnStyled';
import type { ColumnProps } from './Column.types';

export const Column = forwardRef<HTMLDivElement, ColumnProps>((props, forwardedRef) => {
  const { theme } = useTheme();
  const {
    children,
    gutter = 0,
    isReversed = false,
    align = 'stretch',
    justify = 'start',
    isWrap = true,
    flex,
    ...rest
  } = props;
  return (
    <ColumnStyled
      data-testid={COMPONENT_NAME}
      ref={forwardedRef}
      theme={theme}
      $isReversed={isReversed}
      $gutter={gutter}
      $align={align}
      $justify={justify}
      $isWrap={isWrap}
      $flex={flex}
      {...convertToInlineBoxStyles(rest as Record<string, string | number | undefined>)}
    >
      {children}
    </ColumnStyled>
  );
});

Column.displayName = COMPONENT_NAME;
