'use client';
import { forwardRef } from 'react';

import { TabIndex } from '@types';
import { useTheme } from '@hooks';
import { COMPONENT_NAME } from './constants';
import { BoxStyled } from './BoxStyled';
import type { BoxProps } from '.';

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, forwardedRef) => {
  const {
    variant = 'vertical',
    isBordered = false,
    children,
    tabIndex = TabIndex.Default,
    isHighlighted = false,
    withShadowHover = false,
    styles = {},
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <BoxStyled
      ref={forwardedRef}
      tabIndex={tabIndex}
      data-testid={COMPONENT_NAME}
      theme={theme}
      styles={styles}
      $variant={variant}
      $isBordered={isBordered}
      $isHighlighted={isHighlighted}
      $withShadowHover={withShadowHover}
      {...rest}
    >
      {children}
    </BoxStyled>
  );
});

Box.displayName = COMPONENT_NAME;
