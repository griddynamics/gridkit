import { type ElementType, ReactNode } from 'react';
import { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface ImageProps extends CommonCssComponentProps {
  id?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  onClick?: () => void;
  onError?: () => void;
  onLoad?: () => void;
  placeholder?: ReactNode;
  fallbackComponent?: ReactNode;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  as?: keyof HTMLElementTagNameMap | ElementType;
  captionAs?: keyof HTMLElementTagNameMap | ElementType;
}

export interface ImageWrapperStyledProps
  extends Pick<ImageProps, 'width' | 'height' | 'id' | 'className'>, CommonCssComponentStyledProps {
  $as?: keyof HTMLElementTagNameMap | ElementType;
}

export interface ImageStyledProps
  extends Pick<ImageProps, 'objectFit'>, CommonCssComponentStyledProps<HTMLImageElement> {
  $isLoading?: boolean;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ImagePlaceholderStyledProps extends CommonCssComponentStyledProps {
  $as?: keyof HTMLElementTagNameMap | ElementType;
}

export interface ImageCaptionStyledProps extends CommonCssComponentStyledProps {
  $as?: keyof HTMLElementTagNameMap | ElementType;
}
