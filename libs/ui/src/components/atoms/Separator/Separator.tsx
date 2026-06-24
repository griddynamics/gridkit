'use client';
import { forwardRef } from 'react';

import { useTheme } from '@hooks/useTheme';
import { SeparatorLabelPosition } from '@types';

import { COMPONENT_NAME } from './constants';
import { SeparatorLabelStyled, SeparatorLineStyled, SeparatorWrapperStyled } from './SeparatorStyled';
import type { SeparatorElement, SeparatorProps } from './Separator.types';

export const Separator = forwardRef<SeparatorElement, SeparatorProps>((props, forwardedRef) => {
  const {
    as = 'div',
    styles = {},
    label,
    labelPosition = SeparatorLabelPosition.Center,
    size,
    variant,
    orientation,
    length,
    color,
    labelColor,
    ...restProps
  } = props;
  const { theme } = useTheme();

  const withLabel = !!label;
  const hasStartLabel = withLabel && labelPosition === SeparatorLabelPosition.Start;
  const hasCenterLabel = withLabel && labelPosition === SeparatorLabelPosition.Center;
  const hasEndLabel = withLabel && labelPosition === SeparatorLabelPosition.End;
  const wrapperAs = as === 'hr' && withLabel ? 'div' : as;
  const lineAs = as === 'hr' ? 'hr' : as;

  return (
    <SeparatorWrapperStyled
      theme={theme}
      styles={styles}
      ref={forwardedRef}
      data-testid={COMPONENT_NAME}
      $as={wrapperAs}
      $orientation={orientation}
      $length={length}
      {...restProps}
    >
      {hasStartLabel && (
        <SeparatorLabelStyled theme={theme} $size={size} $labelColor={labelColor}>
          {label}
        </SeparatorLabelStyled>
      )}
      <SeparatorLineStyled
        theme={theme}
        $as={lineAs}
        $color={color}
        $size={size}
        $variant={variant}
        $orientation={orientation}
      />
      {hasCenterLabel && (
        <>
          <SeparatorLabelStyled theme={theme} $size={size} $labelColor={labelColor}>
            {label}
          </SeparatorLabelStyled>
          <SeparatorLineStyled
            theme={theme}
            $as={lineAs}
            $color={color}
            $size={size}
            $variant={variant}
            $orientation={orientation}
          />
        </>
      )}
      {hasEndLabel && (
        <SeparatorLabelStyled theme={theme} $size={size} $labelColor={labelColor}>
          {label}
        </SeparatorLabelStyled>
      )}
    </SeparatorWrapperStyled>
  );
});

Separator.displayName = COMPONENT_NAME;
