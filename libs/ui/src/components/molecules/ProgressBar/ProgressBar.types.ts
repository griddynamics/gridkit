import { PropsWithChildren } from 'react';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';
import { NullableType } from '@types';

export interface ProgressBarProps extends CommonCssComponentProps {
  /** 0–100 percentage. If omitted (or indeterminate=true), renders the indeterminate animation. */
  value?: number;
  /** Switch to indeterminate (animated) mode */
  indeterminate?: boolean;
  /** Show or not percentage number, false by default */
  showPercentage?: boolean;
  /** Color of the filled portion (defaults to theme.primary.main) */
  fillColor?: string;
  /** Background track color (defaults to theme.background.disabled) */
  backgroundColor?: string;
  /** Role for progress bars, indicating a widget that displays the progress of a task */
  role?: string;
  /** Visually hidden label for screen readers */
  'aria-label'?: string;
  className?: string;
}

export interface ProgressBarStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}
export interface TrackStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $backgroundColor?: string;
}

export interface DeterminateFillStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  fill?: string;
  $width?: number;
}

export interface IndeterminateFillStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  fill?: string;
  $animationName?: NullableType<string>;
  $animationProps?: string;
}

export interface PercentLabelStyledProps extends CommonCssComponentStyledProps<HTMLSpanElement>, PropsWithChildren {}
