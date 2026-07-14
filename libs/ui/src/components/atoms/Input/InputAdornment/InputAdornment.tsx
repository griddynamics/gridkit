'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';

import type { InputAdornmentProps } from '../Input.types';

import { COMPONENT_NAME } from './constants';
import { InputAdornmentStyled } from './InputAdornmentStyled';

export const InputAdornment = forwardRef<HTMLDivElement, InputAdornmentProps>((props, forwardedRef) => {
  const { theme } = useTheme();
  const { children } = props;

  return (
    <InputAdornmentStyled ref={forwardedRef} theme={theme} data-testid={COMPONENT_NAME}>
      {children}
    </InputAdornmentStyled>
  );
});

InputAdornment.displayName = COMPONENT_NAME;
