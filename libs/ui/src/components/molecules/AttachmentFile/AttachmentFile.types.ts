import type { ReactNode, PropsWithChildren } from 'react';

import {
  BoxCssComponentProps,
  BoxCssComponentStyledProps,
  CommonCssComponentStyledProps,
} from '@components/index.types';

export interface AttachmentFileProps extends BoxCssComponentProps {
  fileName: string;
  fileType?: string;
  fileSize?: string;
  fileIcon?: ReactNode;
  separator?: string;
  onRemove?: () => void;
  removeButtonLabel?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export type AttachmentFileStyledProps = BoxCssComponentStyledProps;

export interface AttachmentFileThemedProps extends CommonCssComponentStyledProps, PropsWithChildren {}
