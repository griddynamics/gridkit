import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';

/** Mirrors gd-design-library's `ButtonVariant` enum values (libs/ui/src/components/atoms/types). */
export type ButtonVariantName = 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'text' | 'inherit';

/** Mirrors gd-design-library's `ButtonStyledProps['$rounded']` (libs/ui/src/components/atoms/Button/Button.types.ts). */
export type ButtonRoundedName = 'none' | 'default' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'round';

export interface ButtonVariantStateStyle {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
}

export interface ResolvedButtonStyle {
  container: ButtonVariantStateStyle & { borderWidth?: string };
  containerHover: ButtonVariantStateStyle;
  containerActive: ButtonVariantStateStyle;
  containerDisabled: ButtonVariantStateStyle;
  textColor: string;
  label: { color: string; fontWeight: string | number };
  /** Real `button.ts` has no explicit `fontFamily`/`fontSize` of its own — the real
   *  `<button>` inherits both from the host app's global reset (`gd-design-library/styles.css`
   *  sets the base font on `body`/form elements). Resolved explicitly here from the SAME
   *  `font.family`/`font.size.p` tokens Input/Select/Typography already share, so a themed
   *  `gd-button` renders correctly on its own — standalone, Shadow-DOM-isolated — instead of
   *  silently depending on whatever ambient font (or none) the host page happens to provide,
   *  which a native `<button>`'s own UA-default form-control font (Chromium: 13.3333px) would
   *  otherwise leak through as. */
  fontFamily: string | number;
  fontSize: string | number;
  /** `button.default.gap` — `get(theme, 'spacing.sm', ...)`. */
  gap: string | number;
  /** `button.default.padding` — `` `${spacing.sm} ${spacing.md}` ``. */
  padding: string;
}

/** Real libs/ui/src/tokens/radius.ts values — used as the `get()` fallback so a themeless
 *  render still shows the correct radius per `rounded` value, not one flat `0px`
 *  (`ButtonStyled.tsx`'s own `get(rest, ['radius', $rounded], '0px')` fallback is scale-unaware;
 *  this is intentionally more correct while still deferring to a real theme's `radius` object
 *  first, exactly like the real component does). */
const RADIUS_DEFAULT: Record<ButtonRoundedName, string> = {
  none: '0px',
  default: '6px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '32px',
  round: '9999px',
};

/**
 * Resolves `ButtonStyled.tsx`'s `borderRadius = get(rest, ['radius', $rounded], '0px')` —
 * kept separate from `resolveButtonVariantStyle` since `rounded` is an orthogonal axis to
 * `variant`. Reads the theme's `radius` object dynamically (so a consumer's theme override
 * is honored, not just this resolver's own hardcoded scale), the same as the real component.
 */
export function resolveButtonRadius(theme: DesignCoreTheme, rounded: ButtonRoundedName = 'none'): string {
  return get(theme, ['radius', rounded], RADIUS_DEFAULT[rounded] ?? RADIUS_DEFAULT.none);
}

const TRANSPARENT = 'transparent';

/**
 * Pure, platform-neutral resolution of gd-design-library's `button.ts` token file
 * (libs/ui/src/tokens/button.ts) into plain state-keyed style objects — no CSS strings,
 * no Emotion pseudo-selector keys (`&:hover`), since neither Lit's `css` bridge nor React
 * Native's `Pressable`/`StyleSheet` model can consume a pseudo-selector directly. Each
 * adapter maps `containerHover`/`containerActive`/`containerDisabled` to its own state
 * mechanism (CSS `:hover`/`:active`/`[disabled]` for Lit, `pressed`/`disabled` state
 * functions for RN's `Pressable`).
 */
export function resolveButtonVariantStyle(
  theme: DesignCoreTheme,
  variant: ButtonVariantName = 'primary'
): ResolvedButtonStyle {
  const textDefault = get(theme, 'colors.text.default', '#000000');
  const textBlack = get(theme, 'colors.text.black', '#000000');
  const textPrimary = get(theme, 'colors.text.primary', '#FFB800');
  const textSecondary = get(theme, 'colors.text.secondary', '#F29100');
  const fillPrimary = get(theme, 'colors.bg.fill.primary', '#FFB800');
  const fillSecondary = get(theme, 'colors.bg.fill.secondary', '#F29100');
  const fillHover = get(theme, 'colors.bg.fill.hover', '#FFF7E5');
  const fillDisabled = get(theme, 'colors.bg.fill.disabled', '#E5E5E5');
  const fillWarningPrimary = get(theme, 'colors.bg.fill.warning.primary.default', '#FF8700');
  const borderBlack = get(theme, 'colors.border.black', '#000000');
  const borderDisabled = get(theme, 'colors.border.disabled', '#E5E5E5');
  const borderThin = get(theme, 'values.borderThin', '1px');
  const fontWeightMedium = get(theme, 'font.weight.medium', 500);
  // `button.default`'s `'&:disabled, &:disabled *'` rule (libs/ui/src/tokens/button.ts) sets
  // this color universally, on top of whatever each variant's own `'&:disabled, &.disabled'`
  // background/border override is — Emotion merges both since they're different selector
  // keys, so every variant's text mutes to this color when disabled, not just its background.
  const textDisabled = get(theme, 'colors.text.disabled', '#A3A3A3');
  const fontFamily = get(theme, 'font.family', '"Fira Sans", sans-serif');
  const fontSize = get(theme, 'font.size.p', '16px');
  const spacingSm = get(theme, 'spacing.sm', '8px');
  const spacingMd = get(theme, 'spacing.md', '16px');

  const variants: Record<
    ButtonVariantName,
    Omit<ResolvedButtonStyle, 'fontFamily' | 'fontSize' | 'gap' | 'padding'>
  > = {
    primary: {
      container: { backgroundColor: fillPrimary, color: textBlack },
      containerHover: { backgroundColor: fillSecondary },
      containerActive: { backgroundColor: fillWarningPrimary },
      containerDisabled: { backgroundColor: fillDisabled, color: textDisabled },
      textColor: textBlack,
      label: { color: textBlack, fontWeight: fontWeightMedium },
    },
    secondary: {
      container: { backgroundColor: fillHover, color: textDefault },
      containerHover: { backgroundColor: fillPrimary, color: textBlack },
      containerActive: { backgroundColor: fillSecondary, color: textBlack },
      containerDisabled: { backgroundColor: fillDisabled, color: textDisabled },
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    tertiary: {
      container: { backgroundColor: TRANSPARENT, color: textDefault },
      containerHover: { backgroundColor: fillHover },
      containerActive: { backgroundColor: fillPrimary },
      containerDisabled: { backgroundColor: TRANSPARENT, color: textDisabled },
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    outlined: {
      container: {
        backgroundColor: TRANSPARENT,
        color: textDefault,
        borderColor: borderBlack,
        borderWidth: borderThin,
      },
      containerHover: { backgroundColor: fillHover },
      containerActive: { backgroundColor: fillPrimary, color: textBlack },
      containerDisabled: { backgroundColor: TRANSPARENT, borderColor: borderDisabled, color: textDisabled },
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    text: {
      container: { backgroundColor: TRANSPARENT, color: textDefault },
      containerHover: { color: textPrimary },
      containerActive: { color: textSecondary },
      containerDisabled: { color: textDisabled },
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    inherit: {
      container: { backgroundColor: TRANSPARENT, color: 'inherit' },
      containerHover: {},
      containerActive: {},
      // `button.default`'s disabled color rule applies unconditionally in the real CSS
      // cascade — `inherit`'s own block never overrides `&:disabled` — so even this variant
      // mutes to the real disabled gray rather than keeping `color: 'inherit'` when disabled.
      containerDisabled: { color: textDisabled },
      textColor: 'inherit',
      label: { color: 'inherit', fontWeight: 'inherit' },
    },
  };

  return {
    ...(variants[variant] ?? variants.primary),
    fontFamily,
    fontSize,
    gap: spacingSm,
    padding: `${spacingSm} ${spacingMd}`,
  };
}
