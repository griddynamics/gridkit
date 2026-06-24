'use client';
import { forwardRef } from 'react';

import useTheme from '@hooks/useTheme';
import { WrapperVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import { WrapperStyled } from './WrapperStyled';
import { WrapperProps } from './Wrapper.types';

const Wrapper = forwardRef<HTMLBaseElement, WrapperProps>((props, forwardedRef) => {
  const { variant = WrapperVariant.Inline, children, as, ...rest } = props;
  const { theme } = useTheme();

  return (
    <WrapperStyled ref={forwardedRef} $variant={variant} $as={as} theme={theme} data-testid={COMPONENT_NAME} {...rest}>
      {children}
    </WrapperStyled>
  );
});

export default Wrapper;
