'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { Wrapper } from '@components/atoms/Wrapper';
import { Portal } from '@components/layout/Portal';
import { SizeVariant, WrapperVariant } from '@types';

import { get } from '@utils';
import { COMPONENT_NAME, BASE_ANIMATION } from './constants';
import { LoaderStyled } from './LoaderStyled';
import type { LoaderProps } from './Loader.types';

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>((props, forwardedRef) => {
  const { theme } = useTheme();
  const {
    name = 'circle',
    variant = WrapperVariant.Inline,
    rounded = get(theme, 'loader.attrs.rounded', 'none'),
    children,
    size = SizeVariant.Md,
    animationProps = BASE_ANIMATION,
    withWrapper = true,
    WrapperView = 'span',
    ...restProps
  } = props;

  const getChild = () => {
    return children ? (
      children
    ) : (
      <LoaderStyled
        ref={forwardedRef}
        theme={theme}
        $name={name}
        $variant={variant}
        $size={size}
        $animationProps={animationProps}
        $rounded={rounded}
        data-testid={COMPONENT_NAME}
        {...restProps}
      />
    );
  };

  if (variant === WrapperVariant.FullPage) {
    return (
      <Portal wrapperVariant={variant} withWrapper={withWrapper} WrapperView={WrapperView}>
        {getChild()}
      </Portal>
    );
  }

  return withWrapper ? (
    <Wrapper variant={variant} as={WrapperView}>
      {getChild()}
    </Wrapper>
  ) : (
    getChild()
  );
});

Loader.displayName = COMPONENT_NAME;
