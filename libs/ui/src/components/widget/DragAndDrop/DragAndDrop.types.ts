import type { PropsWithChildren, ReactNode } from 'react';
import type {
  CommonCssComponentStyledProps,
  DragAndDropFilesProps,
  FileTypes,
  IconProps,
  TypographyProps,
} from '@components';
import { defaultTheme } from '@tokens';

export interface DragAndDropProps extends Omit<DragAndDropFilesProps, 'onError'> {
  files?: File[];
  errors?: string[];
  description?: string;
  title?: string;
  inputFileButtonLabel?: string;
  acceptedFileTypes?: FileTypes[];
  maxFileSize?: number;
  maxFiles?: number;
  onFilesChanged: (files: File[]) => void;
  onError: (errors: string[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  loadingOverlay?: ReactNode;
  children?: ReactNode;
}

export interface DragAndDropStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}
export interface DragOverContentStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}

export interface DragAndDropAreaStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $disabled?: boolean;
  $isError?: boolean;
  $isLoading?: boolean;
}

export interface UploadIconStyledProps extends CommonCssComponentStyledProps<SVGElement>, Partial<IconProps> {
  $disabled?: boolean;
}

export interface ContentTypographyStyledProps extends TypographyProps, PropsWithChildren {
  theme?: typeof defaultTheme;
  $disabled?: boolean;
}
