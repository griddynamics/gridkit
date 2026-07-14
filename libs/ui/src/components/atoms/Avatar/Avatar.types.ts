import { PropsWithChildren, ReactNode, MouseEvent } from 'react';

import type {
  CommonCssComponentProps,
  CommonCssComponentStyledProps,
  ImageProps,
  TypographyStyledProps,
  RowProps,
} from '@components';
import type { EnumOrPrimitive, SizeVariant } from '@types';

export interface AvatarProps
  extends
    Omit<ImageProps, keyof CommonCssComponentProps | 'width' | 'height' | 'caption' | 'styles'>,
    CommonCssComponentProps {
  sizeVariant?: EnumOrPrimitive<SizeVariant>;
  withBadge?: boolean;
  badgeColor?: string;
  backgroundColor?: string;
  fallbackComponent?: ReactNode;
  onClick?: () => void;
}

export interface AvatarStyledProps extends CommonCssComponentStyledProps, Pick<ImageProps, 'width' | 'height' | 'id'> {
  $sizeVariant?: EnumOrPrimitive<SizeVariant>;
  $withBadge?: boolean;
}

export interface StyledAvatarBadgeProps extends CommonCssComponentStyledProps {
  $color?: string;
  $sizeVariant?: EnumOrPrimitive<SizeVariant>;
}
export interface StyledFallbackComponentWrapperProps extends RowProps, PropsWithChildren {}
export interface StyledAvatarImageWrapperProps extends CommonCssComponentStyledProps {
  $color?: string;
}

export interface StyledFallbackTextProps extends TypographyStyledProps, PropsWithChildren {
  $sizeVariant?: EnumOrPrimitive<SizeVariant>;
}

export type AvatarUserVariant = 'card' | 'profile';

export interface AvatarUserProps extends CommonCssComponentProps {
  variant?: AvatarUserVariant;
  name: string;
  subtitle?: string;
  src?: string;
  alt?: string;
  fallbackComponent?: ReactNode;
  sizeVariant?: EnumOrPrimitive<SizeVariant>;
  withBadge?: boolean;
  badgeColor?: string;
  backgroundColor?: string;
  action?: ReactNode;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export type AvatarUserStyledProps = CommonCssComponentStyledProps & {
  $variant?: AvatarUserVariant;
};
