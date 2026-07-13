import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';
import { COLOR_VARIANT_BORDER_PATH, COLOR_VARIANT_BORDER_DEFAULT, type InputColorVariantName } from './input';

export interface ResolvedSelectStyle {
  fontFamily: string | number;
  fontSize: string | number;
  fontWeight: string | number;
  color: string;
  surfaceColor: string;
  borderWidth: string | number;
  borderColor: string;
  hoverBackgroundColor: string;
  boxShadow: string;
  /** `select.ts`'s `button.default.padding` — `get(theme, 'spacing.sm', ...)`. */
  triggerPadding: string | number;
  /** `select.ts`'s `dropdown.padding`/`margin` — both `get(theme, 'spacing.none', ...)`. */
  dropdownPadding: string | number;
}

/**
 * Resolves libs/ui/src/tokens/select.ts's color-variant border + surface/typography
 * values (Select reuses the same `primary`/`success`/`warning`/`error` color-variant
 * scale as Input). The open/close/selection/search behavior that makes Select the
 * highest shared-core-feasibility atom lives in `stores/createSelectStore.ts` — dropdown
 * viewport positioning, portal rendering, and keyboard-arrow DOM focus traversal stay in
 * each platform's own adapter, since those are genuinely rendering-specific.
 */
export function resolveSelectStyle(
  theme: DesignCoreTheme,
  color: InputColorVariantName = 'primary'
): ResolvedSelectStyle {
  return {
    fontFamily: get(theme, 'font.family', '"Fira Sans", sans-serif'),
    fontSize: get(theme, 'font.size.p', '16px'),
    fontWeight: get(theme, 'font.weight.normal', 400),
    color: get(theme, 'colors.text.default', '#000000'),
    surfaceColor: get(theme, 'colors.bg.surface', '#FFFFFF'),
    borderWidth: get(theme, 'values.borderThin', '1px'),
    borderColor: get(
      theme,
      COLOR_VARIANT_BORDER_PATH[color] ?? COLOR_VARIANT_BORDER_PATH.primary,
      COLOR_VARIANT_BORDER_DEFAULT[color] ?? COLOR_VARIANT_BORDER_DEFAULT.primary
    ),
    hoverBackgroundColor: get(theme, 'colors.bg.fill.hover', '#FFF7E5'),
    boxShadow: get(theme, 'shadows.box["3"]', '0px 8px 15px 1px rgba(0, 0, 0, 0.20)'),
    triggerPadding: get(theme, 'spacing.sm', '8px'),
    dropdownPadding: get(theme, 'spacing.none', 0),
  };
}
