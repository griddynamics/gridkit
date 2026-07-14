'use client';
import { forwardRef } from 'react';

import useTheme from '@hooks/useTheme';

import { COMPONENT_NAME } from './constants';
import { LabelStyled } from './LabelStyled';
import { LabelProps } from './Label.types';

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, forwardedRef) => {
  const { className = '', htmlFor, onClick, ariaLabel, children, ...restProps } = props;
  const { theme } = useTheme();

  return (
    <LabelStyled
      ref={forwardedRef}
      theme={theme}
      className={className}
      onClick={onClick}
      data-testid={COMPONENT_NAME}
      gap={theme?.spacing?.xs || '4px'}
      {...(htmlFor ? { htmlFor } : {})}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...restProps}
    >
      {children}
    </LabelStyled>
  );
});

Label.displayName = COMPONENT_NAME;
