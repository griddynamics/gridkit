import type { AnchorHTMLAttributes, PropsWithChildren, ReactNode, MouseEvent } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export type ChatBubbleVariant = 'answer' | 'question';
export type ChatBubbleStatus = 'pending' | 'fulfilled' | 'rejected';
export type ChatBubbleSize = 'sm' | 'md' | 'lg';

export interface ChatBubbleProps<T = HTMLDivElement> extends CommonCssComponentProps<T>, PropsWithChildren {
  variant?: ChatBubbleVariant;
  actions?: ReactNode[];
  status?: ChatBubbleStatus;
  size?: ChatBubbleSize;
}

export interface ChatBubbleStyledProps<T = HTMLDivElement> extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $variant?: ChatBubbleVariant;
  $status?: ChatBubbleStatus;
  $size?: ChatBubbleSize;
}

export interface ChatBubbleCommonStyledProps<T = HTMLDivElement>
  extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $status?: ChatBubbleStatus;
}

export interface ChatImageGalleryImage {
  src: string;
  alt?: string;
}

export interface ChatImageGalleryProps extends CommonCssComponentProps {
  images: ChatImageGalleryImage[];
  onImageClick?: (index: number, event: MouseEvent<HTMLButtonElement>) => void;
  maxVisible?: number;
}

export type ChatImageGalleryStyledProps = CommonCssComponentStyledProps;

export interface ChatLinkPreviewProps extends Omit<CommonCssComponentProps<HTMLAnchorElement>, 'onClick'> {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  domain?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export type ChatLinkPreviewStyledProps = CommonCssComponentStyledProps<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;
