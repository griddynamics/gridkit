import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';

/** Mirrors gd-design-library's `InputColorVariant` (colors.border.{default,success,primary,error}). */
export type InputColorVariantName = 'default' | 'success' | 'primary' | 'error';

export interface ResolvedInputStyle {
  fontFamily: string | number;
  fontSize: string | number;
  color: string;
  disabledColor: string;
  borderWidth: string | number;
  borderColor: string;
}

export const COLOR_VARIANT_BORDER_PATH: Record<InputColorVariantName, string> = {
  default: 'colors.border.default',
  success: 'colors.border.success',
  primary: 'colors.border.primary',
  error: 'colors.border.error',
};

/**
 * Resolves libs/ui/src/tokens/input.ts's color-variant border + base typography values.
 * The debounce/interaction-tracking behavior that gives Input its real portability value
 * lives in `stores/createInputStore.ts`, not here — this resolver only covers the static
 * style values every adapter needs regardless of interaction state.
 */
export function resolveInputStyle(
  theme: DesignCoreTheme,
  color: InputColorVariantName = 'default'
): ResolvedInputStyle {
  return {
    fontFamily: get(theme, 'font.family', 'inherit'),
    fontSize: get(theme, 'font.size.p', 'inherit'),
    color: get(theme, 'colors.text.default', '#171717'),
    disabledColor: get(theme, 'colors.text.disabled', '#a3a3a3'),
    borderWidth: get(theme, 'values.borderThin', 1),
    borderColor: get(theme, COLOR_VARIANT_BORDER_PATH[color] ?? COLOR_VARIANT_BORDER_PATH.default, '#cccccc'),
  };
}
