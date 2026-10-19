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
  /** The real trigger renders as a `Button variant="inherit"` under the hood, so its
   *  `:focus-visible` ring is `button.ts`'s own `getFocusStyles({ inset: '-4px', border: '2px
   *  solid colors.border.focus' })` — not anything defined in `select.ts` itself. Shared with
   *  `button.ts`'s/`input.ts`'s own `focusColor` field for the same token/fallback. */
  focusColor: string;
}

/**
 * CTORNDSD-590: new file — unlike `checkbox.ts`/`input.ts`/`typography.ts` (gutted to a
 * doc-comment-only stub when CTORNDSD-581 switched to real-token resolution), this resolver was
 * deleted outright since Select had no other RN-blocking reason to keep a stub around. Recreated
 * from commit `74c1ea6`'s pre-deletion content (deleted in `7e47cec`) because `react-native`
 * has no DOM/CSS runtime to resolve `gd-design-library/tokens` + `resolveThemeTree` the way
 * `gd-select.ts` (Lit) does. Any edit to `libs/ui/src/tokens/select.ts` will NOT automatically
 * propagate here; re-sync by hand if the real token file changes.
 *
 * Select reuses the same `primary`/`success`/`warning`/`error` color-variant scale as Input
 * (imported from `./input`, not re-declared). The open/close/selection/search behavior that
 * makes Select the highest shared-core-feasibility atom lives in `stores/createSelectStore.ts`
 * — dropdown viewport positioning, portal/overlay rendering, and keyboard-arrow focus traversal
 * stay in each platform's own adapter, since those are genuinely rendering-specific (see
 * `react-native/FINDINGS.md`'s Select-approach-evaluation section for the RN adapter's
 * dropdown-presentation decision).
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
    focusColor: get(theme, 'colors.border.focus', '#0069B4'),
  };
}
