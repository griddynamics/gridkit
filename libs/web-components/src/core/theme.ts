import type { checkbox, typography } from 'gd-design-library/tokens';

/**
 * Structural subset of gd-design-library's theme shape, covering only the token groups the
 * web components read (colors.*, font.*, spacing.*, radius.*, values.*). Intentionally loose
 * rather than a nominal import of the React `Theme` type, which would pull the component tree
 * into every element. Any object shaped like `defaultTheme` satisfies it.
 */
export interface ThemeLike {
  colors?: Record<string, unknown>;
  font?: Record<string, unknown>;
  spacing?: Record<string, unknown>;
  radius?: Record<string, unknown>;
  values?: Record<string, unknown>;
  [key: string]: unknown;
}

/** `checkbox.size` keys in `libs/ui/src/tokens/checkbox.ts` (mirrors React's `CheckboxSize`). */
export type CheckboxSizeName = keyof typeof checkbox.size;

/** Colour scale shared by Input and Select (`primary` is the default border; see `input.ts` tokens). */
export type InputColorVariantName = 'primary' | 'success' | 'warning' | 'error';

/** Mirrors React's `TypographyVariant` values that resolve to a real scale entry. */
export type TypographyVariantName =
  | 'span'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'small'
  | 'caption'
  | 'header'
  | 'code'
  | 'kbd';

/** `typography.styleVariant` keys in `libs/ui/src/tokens/typography.ts`. */
export type TypographyStyleVariantName = keyof typeof typography.styleVariant;
