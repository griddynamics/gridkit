import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';
import { COLOR_VARIANT_BORDER_PATH, type InputColorVariantName } from './input';

export interface ResolvedSelectStyle {
  fontFamily: string | number;
  fontSize: string | number;
  fontWeight: string | number;
  color: string;
  surfaceColor: string;
  borderWidth: string | number;
  borderColor: string;
  hoverBackgroundColor: string;
}

/**
 * Resolves libs/ui/src/tokens/select.ts's color-variant border + surface/typography
 * values (Select reuses the same `default`/`success`/`primary`/`error` color-variant
 * scale as Input). The open/close/selection/search behavior that makes Select the
 * highest shared-core-feasibility atom lives in `stores/createSelectStore.ts` — dropdown
 * viewport positioning, portal rendering, and keyboard-arrow DOM focus traversal stay in
 * each platform's own adapter, since those are genuinely rendering-specific.
 */
export function resolveSelectStyle(
  theme: DesignCoreTheme,
  color: InputColorVariantName = 'default'
): ResolvedSelectStyle {
  return {
    fontFamily: get(theme, 'font.family', 'inherit'),
    fontSize: get(theme, 'font.size.p', 'inherit'),
    fontWeight: get(theme, 'font.weight.normal', 400),
    color: get(theme, 'colors.text.default', '#171717'),
    surfaceColor: get(theme, 'colors.bg.surface', '#ffffff'),
    borderWidth: get(theme, 'values.borderThin', 1),
    borderColor: get(theme, COLOR_VARIANT_BORDER_PATH[color] ?? COLOR_VARIANT_BORDER_PATH.default, '#cccccc'),
    hoverBackgroundColor: get(theme, 'colors.bg.fill.hover', '#f5f5f5'),
  };
}
