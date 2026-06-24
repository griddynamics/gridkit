'use client';
import { forwardRef } from 'react';
import { useTheme } from '@hooks/useTheme';
import { SkeletonVariant } from '@types';

import { COMPONENT_NAME, BASE_ANIMATION } from './constants';

import { SkeletonProps } from './Skeleton.types';
import { SkeletonStyled } from './SkeletonStyled';

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>((props, forwardedRef) => {
  const {
    variant = SkeletonVariant.Rounded,
    children,
    animationName,
    animationProps = BASE_ANIMATION,
    width,
    height,
    backgroundColor,
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <SkeletonStyled
      ref={forwardedRef}
      theme={theme}
      $width={width}
      $height={height}
      $backgroundColor={backgroundColor}
      $variant={variant}
      $animationName={animationName}
      $animationProps={animationProps}
      data-testid={COMPONENT_NAME}
      {...rest}
    >
      {children}
    </SkeletonStyled>
  );
});
