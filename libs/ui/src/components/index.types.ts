import type { HTMLAttributes, ForwardedRef, InputHTMLAttributes } from 'react';
import type { CSSObject } from '@emotion/react';

import { AlignType, JustifyType } from '@types';
import type { Theme } from '@hooks/useTheme';

export interface FlexElementProps {
  gutter?: number | string;
  flex?: string;
  isReversed?: boolean;
  isWrap?: boolean;
  align?: AlignType;
  justify?: JustifyType;
}

export interface FlexElementStyledProps {
  $gutter: number | string;
  $flex?: string;
  $isReversed: boolean;
  $isWrap: boolean;
  $align: AlignType;
  $justify: JustifyType;
}

export enum FileTypes {
  // Media files
  png = 'image/png',
  gif = 'image/gif',
  jpeg = 'image/jpeg',
  svg = 'image/svg+xml',
  webp = 'image/webp',
  mp4 = 'video/mp4',

  // Documents
  pdf = 'application/pdf',
  doc = 'application/msword',
  docx = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls = 'application/vnd.ms-excel',
  xlsx = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv = 'text/csv',
  text = 'text/plain',

  // Archives
  zip = 'application/zip',
  rar = 'application/x-rar',
  '7z' = 'application/x-7z-compressed',
}
// Emotion-based props type
export interface CommonCssComponentProps<T = HTMLDivElement> extends HTMLAttributes<T> {
  styles?: CSSObject;
}

export interface CommonCssComponentStyledProps<T = HTMLDivElement> extends HTMLAttributes<T> {
  theme?: Theme;
  styles?: CSSObject;
  className?: string;
  ref?: ForwardedRef<T>;
}
export interface CommonCssInputStyledProps extends InputHTMLAttributes<HTMLInputElement> {
  theme?: Theme;
  styles?: CSSObject;
  className?: string;
  ref?: ForwardedRef<HTMLInputElement>;
}

export interface BoxCssComponentProps<T = HTMLDivElement> extends CommonCssComponentProps<T> {
  display?: string;
  overflow?: string;
  minWidth?: string;
  width?: string;
  maxWidth?: string;
  minHeight?: string;
  height?: string;
  maxHeight?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  zIndex?: string | number;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  flexDirection?: string;
  justifyContent?: string;
  justifySelf?: string;
  alignItems?: string;
  alignSelf?: string;
  alignContent?: string;
  flexWrap?: string;
  flex?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  order?: string;
  gap?: string;
}

export interface BoxCssComponentStyledProps<T = HTMLDivElement> extends CommonCssComponentStyledProps<T> {
  $overflow?: string;
  $minWidth?: string;
  $width?: string;
  $maxWidth?: string;
  $minHeight?: string;
  $height?: string;
  $maxHeight?: string;
  $margin?: string;
  $marginTop?: string;
  $marginRight?: string;
  $marginBottom?: string;
  $marginLeft?: string;
  $padding?: string;
  $paddingTop?: string;
  $paddingRight?: string;
  $paddingBottom?: string;
  $paddingLeft?: string;
  $zIndex?: string | number;
  $position?: string;
  $top?: string;
  $right?: string;
  $bottom?: string;
  $left?: string;
  $flexDirection?: string;
  $justifyContent?: string;
  $justifySelf?: string;
  $alignItems?: string;
  $alignSelf?: string;
  $alignContent?: string;
  $flexWrap?: string;
  $flex?: string;
  $flexGrow?: string;
  $flexShrink?: string;
  $flexBasis?: string;
  $order?: string;
  $gap?: string;
}
