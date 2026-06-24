'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { convertToInlineBoxStyles } from '@tokens/utils';
import type { InlineBoxStyles } from '@types';

import { COMPONENT_NAME } from './constants';
import { BadgeStyled, BadgeContentStyled, BadgeStartIconStyled, BadgeEndIconStyled } from './BadgeStyled';
import type { BadgeProps } from './';

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'primary',
      appearance = 'filled',
      size = 'md',
      children,
      disabled,
      iconStart = null,
      iconEnd = null,
      ...rest
    },
    forwardedRef
  ) => {
    const { theme } = useTheme();

    return (
      <BadgeStyled
        ref={forwardedRef}
        $variant={variant}
        $appearance={appearance}
        $size={size}
        theme={theme}
        $disabled={disabled}
        data-testid={COMPONENT_NAME}
        {...convertToInlineBoxStyles(rest as InlineBoxStyles)}
      >
        {iconStart ? (
          <BadgeStartIconStyled theme={theme} data-testid={`${COMPONENT_NAME}-icon-start`}>
            {iconStart}
          </BadgeStartIconStyled>
        ) : null}
        <BadgeContentStyled theme={theme} data-testid={`${COMPONENT_NAME}-content`}>
          {children}
        </BadgeContentStyled>
        {iconEnd ? (
          <BadgeEndIconStyled theme={theme} data-testid={`${COMPONENT_NAME}-icon-end`}>
            {iconEnd}
          </BadgeEndIconStyled>
        ) : null}
      </BadgeStyled>
    );
  }
);

Badge.displayName = COMPONENT_NAME;
