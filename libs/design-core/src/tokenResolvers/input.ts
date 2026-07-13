import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';

/** Matches gd-design-library's real `InputColorVariant` (libs/ui/src/types/input.ts) exactly —
 *  member names and values both, not just the resolved colors. `warning` is the real
 *  component's semantic role name for the `colors.border.primary` (brand-gold) token, and
 *  `primary` is its role name for `colors.border.default` — that inversion is the real
 *  vocabulary, not a naming choice made here. */
export type InputColorVariantName = 'primary' | 'success' | 'warning' | 'error';

export interface ResolvedInputStyle {
  fontFamily: string | number;
  fontSize: string | number;
  color: string;
  disabledColor: string;
  borderWidth: string | number;
  borderColor: string;
}

export const COLOR_VARIANT_BORDER_PATH: Record<InputColorVariantName, string> = {
  primary: 'colors.border.default',
  success: 'colors.border.success',
  warning: 'colors.border.primary',
  error: 'colors.border.error',
};

/** Real libs/ui/src/tokens/colors.ts border values per variant — used as the `get()` fallback
 *  so a themeless render still shows the correct color-variant border, not one flat gray. */
export const COLOR_VARIANT_BORDER_DEFAULT: Record<InputColorVariantName, string> = {
  primary: '#E5E5E5',
  success: '#34A853',
  warning: '#FFB800',
  error: '#D21C1C',
};

/**
 * Resolves libs/ui/src/tokens/input.ts's color-variant border + base typography values.
 * The debounce/interaction-tracking behavior that gives Input its real portability value
 * lives in `stores/createInputStore.ts`, not here — this resolver only covers the static
 * style values every adapter needs regardless of interaction state.
 */
export function resolveInputStyle(
  theme: DesignCoreTheme,
  color: InputColorVariantName = 'primary'
): ResolvedInputStyle {
  return {
    fontFamily: get(theme, 'font.family', '"Fira Sans", sans-serif'),
    fontSize: get(theme, 'font.size.p', '16px'),
    color: get(theme, 'colors.text.default', '#000000'),
    disabledColor: get(theme, 'colors.text.disabled', '#A3A3A3'),
    borderWidth: get(theme, 'values.borderThin', '1px'),
    borderColor: get(
      theme,
      COLOR_VARIANT_BORDER_PATH[color] ?? COLOR_VARIANT_BORDER_PATH.primary,
      COLOR_VARIANT_BORDER_DEFAULT[color] ?? COLOR_VARIANT_BORDER_DEFAULT.primary
    ),
  };
}
