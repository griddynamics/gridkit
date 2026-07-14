import type { PropsWithChildren } from 'react';

import type { BoxCssComponentProps, BoxCssComponentStyledProps } from '@components';

export interface ImagePreviewItem {
  src: string;
  alt?: string;
  caption?: string;
}

export interface ImagePreviewProps extends PropsWithChildren<BoxCssComponentProps<HTMLDivElement>> {
  images: ImagePreviewItem[];
  initialIndex?: number;
  showThumbnails?: boolean;
  showCounter?: boolean;
  showArrows?: boolean;
  thumbnailPosition?: 'bottom' | 'left';
  onImageChange?: (index: number) => void;
}

export type ImagePreviewStyledProps = BoxCssComponentStyledProps<HTMLDivElement>;

export interface ImagePreviewLightboxProps extends PropsWithChildren {
  isOpen: boolean;
  images: ImagePreviewItem[];
  initialIndex?: number;
  onClose: () => void;
}
