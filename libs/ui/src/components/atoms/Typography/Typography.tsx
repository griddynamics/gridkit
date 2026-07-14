'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { TextAlign, TypographyVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import { TypographyStyled } from './TypographyStyled';
import type { TypographyProps } from './';

export const Typography = forwardRef<HTMLBaseElement, TypographyProps>(
  (
    {
      variant = TypographyVariant.Inherit,
      as,
      size,
      children,
      align = TextAlign.Start,
      color = 'text.default',
      styleVariant,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();

    return (
      <TypographyStyled
        ref={forwardedRef}
        theme={theme}
        $as={as || variant}
        $variant={variant}
        $align={align}
        $size={size}
        $color={color}
        $styleVariant={styleVariant}
        data-testid={COMPONENT_NAME}
        {...rest}
      >
        {children}
      </TypographyStyled>
    );
  }
);

Typography.displayName = COMPONENT_NAME;
