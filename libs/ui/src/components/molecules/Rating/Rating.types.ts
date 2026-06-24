import { PropsWithChildren } from 'react';
import type {
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  CommonCssInputStyledProps,
} from '@components/index.types';

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps extends Omit<CommonCssComponentProps, 'onChange'> {
  max?: number;
  value?: number;
  groupName?: string;
  defaultValue?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: RatingSize;
}

export interface RatingProgressStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {
  $width: string;
}

export interface RatingStyledProps<T = HTMLDivElement> extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $readOnly?: boolean;
  $isActive?: boolean;
}

export type RatingCommonStyledProps = CommonCssInputStyledProps;
