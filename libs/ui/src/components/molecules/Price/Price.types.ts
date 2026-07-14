import { PropsWithChildren } from 'react';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export type PriceSize = 'sm' | 'md' | 'lg';

export interface PriceProps extends CommonCssComponentProps {
  currentValue: string;
  oldValue?: string;
  size?: PriceSize;
  currencySymbol?: string;
  /**
   * Controls where the currency symbol is placed relative to the value.
   * - `'before'` (default): symbol precedes the value — e.g. `$99.99`, `€99,99`
   * - `'after'`: symbol follows the value with a space — e.g. `99,99 €`, `99 zł`
   *
   * Use `'after'` for European locales where the convention places the symbol after the amount.
   */
  currencySymbolPosition?: 'before' | 'after';
}

export interface PriceStyledProps extends CommonCssComponentStyledProps, PropsWithChildren {}
export interface PriceValueStyledProps<T> extends CommonCssComponentStyledProps<T>, PropsWithChildren {
  $size?: PriceSize;
}
