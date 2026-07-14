'use client';
import React, { forwardRef } from 'react';

import { useTheme } from '@hooks';
import { convertToInlineBoxStyles } from '@tokens/utils';

import type { InlineBoxStyles } from '@types';
import { RowStyled } from './RowStyled';
import { COMPONENT_NAME } from './constants';
import type { RowProps } from './';

export const Row = forwardRef<HTMLDivElement, RowProps>(
  (
    { children, gutter = 0, align = 'stretch', justify = 'start', isWrap = true, isReversed = false, flex, ...rest },
    forwardedRef
  ) => {
    const { theme } = useTheme();

    return (
      <RowStyled
        ref={forwardedRef}
        theme={theme}
        $isReversed={isReversed}
        $gutter={gutter}
        $align={align}
        $justify={justify}
        $isWrap={isWrap}
        $flex={flex}
        data-testid={COMPONENT_NAME}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {children}
      </RowStyled>
    );
  }
);

Row.displayName = COMPONENT_NAME;
