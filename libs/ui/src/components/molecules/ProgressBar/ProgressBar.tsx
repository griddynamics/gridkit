'use client';
import { forwardRef, PropsWithChildren } from 'react';

import { useTheme } from '@hooks/useTheme';

import {
  COMPONENT_NAME,
  COMPONENT_ROLE_DEFAULT,
  PROGRESS_MAX_VALUE_DEFAULT,
  PROGRESS_MIN_VALUE_DEFAULT,
} from './constants';

import type { ProgressBarProps } from './ProgressBar.types';
import {
  DeterminateFillStyled,
  IndeterminateFillStyled,
  PercentLabelStyled,
  ProgressBarStyled,
  TrackStyled,
} from './ProgressBarStyled';

export const ProgressBar = forwardRef<HTMLDivElement, PropsWithChildren<ProgressBarProps>>((props, forwardedRef) => {
  const {
    value = PROGRESS_MIN_VALUE_DEFAULT,
    indeterminate = false,
    showPercentage = false,
    fillColor,
    role = COMPONENT_ROLE_DEFAULT,
    backgroundColor,
    children,
    'aria-label': ariaLabel,
    ...rest
  } = props;

  const { theme } = useTheme();

  const safeValue = Math.min(PROGRESS_MAX_VALUE_DEFAULT, Math.max(PROGRESS_MIN_VALUE_DEFAULT, value));

  return (
    <ProgressBarStyled
      ref={forwardedRef}
      theme={theme}
      role={role}
      aria-label={ariaLabel}
      aria-valuemin={PROGRESS_MIN_VALUE_DEFAULT}
      aria-valuemax={PROGRESS_MAX_VALUE_DEFAULT}
      aria-valuenow={indeterminate ? undefined : safeValue}
      {...rest}
      data-testid={COMPONENT_NAME}
    >
      <TrackStyled theme={theme} $backgroundColor={backgroundColor} data-testid={`${COMPONENT_NAME}-track`}>
        {indeterminate ? (
          <IndeterminateFillStyled theme={theme} fill={fillColor} data-testid={`${COMPONENT_NAME}-fill`} />
        ) : (
          <DeterminateFillStyled
            theme={theme}
            fill={fillColor}
            $width={safeValue}
            data-testid={`${COMPONENT_NAME}-fill`}
          >
            {showPercentage && safeValue > PROGRESS_MIN_VALUE_DEFAULT && (
              <PercentLabelStyled theme={theme}>{safeValue}%</PercentLabelStyled>
            )}
          </DeterminateFillStyled>
        )}
      </TrackStyled>
    </ProgressBarStyled>
  );
});

ProgressBar.displayName = COMPONENT_NAME;
