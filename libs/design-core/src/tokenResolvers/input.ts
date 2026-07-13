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
  /** `libs/ui/src/components/atoms/Input/Input.tsx` renders its `label` prop through
   *  `<InputHelper>` with no explicit `color`/`size`, i.e. `InputHelper`'s own defaults
   *  (`color: 'primary'`, `size: 'md'`) — which always resolves to `colors.text.default`
   *  regardless of Input's own `color` variant. */
  labelColor: string;
  /** `Input.tsx` renders `helperText` through `<InputHelper color={color} size="sm">` —
   *  unlike the label, this IS color-variant-dependent (`helper.<variant>.sm.color`). */
  helperTextColor: string;
  /** `input.wrapper.withGap.gap` — `get(theme, 'spacing.xs', ...)`. Applied only when label or
   *  helperText is present (real `hasHelpers` condition), same as `InputWrapper`'s `$withGap`. */
  wrapperGap: string | number;
  /** `input.helper.default.md.{fontSize,lineHeight}` — the real `label`'s font metrics
   *  (`InputHelper`'s own default `size: 'md'`). */
  labelFontSize: string | number;
  labelLineHeight: string | number;
  /** `input.helper.default.sm.{fontSize,lineHeight}` — the real `helperText`'s font metrics
   *  (`Input.tsx` passes `size="sm"` explicitly). */
  helperFontSize: string | number;
  helperLineHeight: string | number;
  /** `input.input.default['&:not(...)'].zIndex` — `get(theme, 'zIndex.first', ...)`. */
  zIndex: string | number;
  /** `input.input.default.padding` — `get(theme, 'spacing.sm', ...)`. */
  horizontalPadding: string | number;
  /** `input.input.defaultInteraction['& + .Input__border'].borderRadius` — `radius.none`. */
  borderRadius: string | number;
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

/** Real libs/ui/src/tokens/input.ts `helper.<variant>.sm.color` path per variant. */
export const HELPER_TEXT_COLOR_PATH: Record<InputColorVariantName, string> = {
  primary: 'colors.text.default',
  success: 'colors.text.success',
  warning: 'colors.text.primary',
  error: 'colors.text.error',
};

/** Real libs/ui/src/tokens/colors.ts text values per variant — used as the `get()` fallback. */
export const HELPER_TEXT_COLOR_DEFAULT: Record<InputColorVariantName, string> = {
  primary: '#000000',
  success: '#1F843A',
  warning: '#FFB800',
  error: '#BD1919',
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
    labelColor: get(theme, 'colors.text.default', '#000000'),
    helperTextColor: get(
      theme,
      HELPER_TEXT_COLOR_PATH[color] ?? HELPER_TEXT_COLOR_PATH.primary,
      HELPER_TEXT_COLOR_DEFAULT[color] ?? HELPER_TEXT_COLOR_DEFAULT.primary
    ),
    wrapperGap: get(theme, 'spacing.xs', '4px'),
    labelFontSize: get(theme, 'font.size.small', '14px'),
    labelLineHeight: get(theme, 'font.line.height.small', '20px'),
    helperFontSize: get(theme, 'font.size.caption', '12px'),
    helperLineHeight: get(theme, 'font.line.height.caption', '16px'),
    zIndex: get(theme, 'zIndex.first', 1),
    horizontalPadding: get(theme, 'spacing.sm', '8px'),
    borderRadius: get(theme, 'radius.none', '0px'),
  };
}
