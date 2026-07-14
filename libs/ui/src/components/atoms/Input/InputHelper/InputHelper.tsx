'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { InputColorVariant, SizeVariant } from '@types';

import { InputHelperProps } from '../Input.types';
import { COMPONENT_NAME } from './constants';
import { InputHelperStyled } from './InputHelperStyled';

export const InputHelper = forwardRef<HTMLDivElement, InputHelperProps>((props, forwardedRef) => {
  const { theme } = useTheme();
  const { children, size = SizeVariant.Md, color = 'primary' as InputColorVariant } = props;

  return (
    <InputHelperStyled $size={size} $color={color} ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME}>
      {children}
    </InputHelperStyled>
  );
});

InputHelper.displayName = COMPONENT_NAME;
