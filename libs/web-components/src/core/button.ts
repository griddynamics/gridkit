import { radius } from 'gd-design-library/tokens';
import { get } from './get';
import type { ButtonCssBlock } from './css';
import type { ThemeLike } from './theme';

/** Mirrors gd-design-library's `ButtonVariant` enum values (libs/ui/src/components/atoms/types). */
export type ButtonVariantName = 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'text' | 'inherit';

/** Mirrors gd-design-library's `ButtonStyledProps['$rounded']` (libs/ui/src/components/atoms/Button/Button.types.ts). */
export type ButtonRoundedName = keyof typeof radius;

export interface ButtonTokenTree {
  default: ButtonCssBlock;
  icon: ButtonCssBlock;
  content: { default: ButtonCssBlock };
  fullWidth: ButtonCssBlock;
  startIcon: { default: ButtonCssBlock };
  endIcon: { default: ButtonCssBlock };
  primary: ButtonCssBlock;
  secondary: ButtonCssBlock;
  tertiary: ButtonCssBlock;
  outlined: ButtonCssBlock;
  text: ButtonCssBlock;
  inherit: ButtonCssBlock;
}

/**
 * Resolves `ButtonStyled.tsx`'s `borderRadius = get(rest, ['radius', $rounded], '0px')`.
 * Reads the theme's `radius` object first (so a consumer's theme override is honored), then the
 * real `radius` token from `gd-design-library/tokens` — no hand-copied scale.
 */
export function resolveButtonRadius(theme: ThemeLike, rounded: ButtonRoundedName = 'none'): string {
  return get(theme, ['radius', rounded], radius[rounded] ?? radius.none);
}
