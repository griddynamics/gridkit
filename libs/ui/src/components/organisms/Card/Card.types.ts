import type { ElementType, PropsWithChildren } from 'react';

import type {
  PriceProps,
  ImageProps,
  ImageStyledProps,
  ButtonProps,
  CounterProps,
  CounterStyledProps,
  TypographyProps,
  TypographyStyledProps,
  RatingProps,
  PriceStyledProps,
  BadgeProps,
  CommonCssComponentStyledProps,
} from '@components';
import type { CardSizeVariant, CardVariant, EnumOrPrimitive } from '@types';

export interface CardCommonProps extends PropsWithChildren {
  sizeVariant?: EnumOrPrimitive<CardSizeVariant>;
  cardVariant?: EnumOrPrimitive<CardVariant>;
}

export interface CardCommonStyledProps {
  $sizeVariant: EnumOrPrimitive<CardSizeVariant>;
  $cardVariant: EnumOrPrimitive<CardVariant>;
}

export interface CardTextProps extends CardCommonProps, TypographyProps {}
export interface CardTextStyledProps extends CardCommonStyledProps, TypographyStyledProps {
  as?: keyof HTMLElementTagNameMap | ElementType;
}
export interface CardRatingProps extends CardCommonProps, RatingProps {
  label?: string;
}
export interface CardRatingStyledProps extends CardCommonStyledProps, CommonCssComponentStyledProps {}
export interface CardButtonProps extends CardCommonProps, ButtonProps {}
export interface CardButtonStyledProps extends CardCommonStyledProps, CommonCssComponentStyledProps {}
export interface CardPriceProps extends CardCommonProps, PriceProps {}
export interface CardPriceStyledProps extends CardCommonStyledProps, PriceStyledProps {}
export interface CardImageProps extends CardCommonProps, ImageProps {}
export interface CardImageStyledProps extends CardCommonStyledProps, Exclude<ImageStyledProps, 'isLoading'> {}
export interface CardCounterProps extends CardCommonProps, CounterProps {}
export interface CardCounterStyledProps extends CardCommonStyledProps, CounterStyledProps {}
export interface CardWishlistProps extends CardCommonProps {
  isActive?: boolean;
  onToggle?: () => void;
  ariaLabel?: string;
}
export interface CardWishlistStyledProps extends CardCommonStyledProps, CommonCssComponentStyledProps {
  $isActive: boolean;
}
export interface CardBadgeProps extends CardCommonProps, Omit<BadgeProps, 'children'> {}
export interface CardBadgeStyledProps extends CardCommonStyledProps, CommonCssComponentStyledProps {}
