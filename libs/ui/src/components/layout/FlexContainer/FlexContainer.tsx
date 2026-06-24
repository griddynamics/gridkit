'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks';
import { convertToInlineBoxStyles } from '@tokens/utils';
import { InlineBoxStyles } from '@types';

import { COMPONENT_NAME } from './constants';
import { FlexContainerStyled } from './FlexContainerStyled';
import type { FlexContainerProps } from './';

export const FlexContainer = forwardRef<HTMLDivElement, FlexContainerProps>((props, forwardedRef) => {
  const { className = '', styles, children, ...restProps } = props;
  const { theme } = useTheme();

  return (
    <FlexContainerStyled
      ref={forwardedRef}
      theme={theme}
      className={className}
      styles={styles}
      data-testid={COMPONENT_NAME}
      {...convertToInlineBoxStyles(restProps as InlineBoxStyles)}
    >
      {children}
    </FlexContainerStyled>
  );
});

FlexContainer.displayName = COMPONENT_NAME;
