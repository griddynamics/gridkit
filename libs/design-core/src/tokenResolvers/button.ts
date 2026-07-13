import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';

/** Mirrors gd-design-library's `ButtonVariant` enum values (libs/ui/src/components/atoms/types). */
export type ButtonVariantName = 'primary' | 'secondary' | 'tertiary' | 'outlined' | 'text' | 'inherit';

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

  const variants: Record<ButtonVariantName, ResolvedButtonStyle> = {
    primary: {
      container: { backgroundColor: fillPrimary, color: textBlack },
      containerHover: { backgroundColor: fillSecondary },
      containerActive: { backgroundColor: fillWarningPrimary },
      containerDisabled: { backgroundColor: fillDisabled },
      textColor: textBlack,
      label: { color: textBlack, fontWeight: fontWeightMedium },
    },
    secondary: {
      container: { backgroundColor: fillHover, color: textDefault },
      containerHover: { backgroundColor: fillPrimary, color: textBlack },
      containerActive: { backgroundColor: fillSecondary, color: textBlack },
      containerDisabled: { backgroundColor: fillDisabled },
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    tertiary: {
      container: { backgroundColor: TRANSPARENT, color: textDefault },
      containerHover: { backgroundColor: fillHover },
      containerActive: { backgroundColor: fillPrimary },
      containerDisabled: { backgroundColor: TRANSPARENT },
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
      containerDisabled: { backgroundColor: TRANSPARENT, borderColor: borderDisabled },
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    text: {
      container: { backgroundColor: TRANSPARENT, color: textDefault },
      containerHover: { color: textPrimary },
      containerActive: { color: textSecondary },
      containerDisabled: {},
      textColor: textDefault,
      label: { color: textDefault, fontWeight: fontWeightMedium },
    },
    inherit: {
      container: { backgroundColor: TRANSPARENT, color: 'inherit' },
      containerHover: {},
      containerActive: {},
      containerDisabled: {},
      textColor: 'inherit',
      label: { color: 'inherit', fontWeight: 'inherit' },
    },
  };

  return variants[variant] ?? variants.primary;
}
