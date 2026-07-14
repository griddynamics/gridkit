'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';

import type { InputWrapperProps } from '../Input.types';
import { COMPONENT_NAME } from './constants';
import { InputWrapperStyled } from './InputWrapperStyled';

export const InputWrapper = forwardRef<HTMLBaseElement, InputWrapperProps>((props, forwardedRef) => {
  const { theme } = useTheme();
  const { children, as, withGap, ...rest } = props;

  return (
    <InputWrapperStyled
      $as={as}
      $withGap={withGap}
      ref={forwardedRef}
      theme={theme}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      {children}
    </InputWrapperStyled>
  );
});

InputWrapper.displayName = COMPONENT_NAME;
