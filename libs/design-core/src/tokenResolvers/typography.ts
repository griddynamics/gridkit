import { get } from '../utils/get';
import type { DesignCoreTheme } from '../types';

/** Mirrors gd-design-library's `TypographyVariant` values that resolve to a real scale entry. */
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

export type TypographyStyleVariantName =
  | 'light'
  | 'normal'
  | 'semibold'
  | 'bold'
  | 'italic'
  | 'small'
  | 'uppercase'
  | 'lowercase'
  | 'underline'
  | 'strike';

export interface ResolvedTypographyStyle {
  fontFamily: string | number;
  fontSize?: string | number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  fontStyle?: string;
  textTransform?: string;
  textDecoration?: string;
  /** Only set for h1-h6 (libs/ui/src/tokens/typography.ts sets explicit margins for headings
   *  only) — every other variant (p, span, small, etc.) intentionally has no margin override,
   *  so the browser's own UA default stays, matching the real component's behavior. */
  marginTop?: string;
  marginBottom?: string;
}

const MONOSPACE_VARIANTS: ReadonlySet<TypographyVariantName> = new Set(['code', 'kbd']);

/** Real libs/ui/src/tokens/font.ts size/line-height per variant — used as `get()` fallbacks
 *  so a themeless render still shows correct metrics instead of `undefined` (no styling). */
const VARIANT_FONT_SIZE: Partial<Record<TypographyVariantName, string>> = {
  h1: '48px',
  h2: '34px',
  h3: '28px',
  h4: '24px',
  h5: '20px',
  h6: '18px',
  p: '16px',
  small: '14px',
  caption: '12px',
  header: '8px',
  code: '16px',
  kbd: '14px',
};

const VARIANT_LINE_HEIGHT: Partial<Record<TypographyVariantName, string>> = {
  h1: '56px',
  h2: '36px',
  h3: '32px',
  h4: '28px',
  h5: '26px',
  h6: '24px',
  p: '24px',
  small: '20px',
  caption: '16px',
  header: '16px',
  code: '24px',
  kbd: '20px',
};

/** Real libs/ui/src/tokens/typography.ts heading margins (top === bottom); only h1-h6 set
 *  an explicit margin — every other variant is intentionally absent from this map. */
const VARIANT_MARGIN: Partial<Record<TypographyVariantName, string>> = {
  h1: '32px',
  h2: '24px',
  h3: '16px',
  h4: '16px',
  h5: '8px',
  h6: '8px',
};

/**
 * CTORNDSD-590: recreated from this file's own pre-CTORNDSD-581-deletion shape (commit
 * `74c1ea6`, deleted in `7e47cec`) because `react-native` has no DOM/CSS runtime to
 * resolve `gd-design-library/tokens` + `resolveThemeTree` the way `gd-typography.ts` (Lit) does
 * — see this package's README "Status"/"Theme parameter" sections for the accepted duplication
 * trade-off. Any edit to `libs/ui/src/tokens/typography.ts` will NOT automatically propagate
 * here; re-sync by hand if the real token file changes. Do not delete this again under the
 * "single source of truth" reasoning that removed it the first time without checking whether
 * `react-native` still consumes it.
 *
 * A variant resolves the base font metrics, an optional styleVariant (or list of them) overlays
 * weight/transform/decoration on top — mirroring `Typography.tsx`'s `variant`/`styleVariant`
 * props, minus the DOM-tag polymorphism (`as`), which per CTORNDSD-580's Typography finding has
 * no portable equivalent across Lit (fixed outer custom-element tag) or React Native (`Text`
 * only — RN has no tag concept at all, a stronger version of the same gap).
 */
export function resolveTypographyStyle(
  theme: DesignCoreTheme,
  variant: TypographyVariantName = 'span',
  styleVariant?: TypographyStyleVariantName | TypographyStyleVariantName[]
): ResolvedTypographyStyle {
  const fontFamily = get(theme, 'font.family', '"Fira Sans", sans-serif');
  const style: ResolvedTypographyStyle = { fontFamily };

  if (variant === 'span') {
    style.fontSize = 'inherit';
    style.fontWeight = 'inherit';
    style.lineHeight = 'inherit';
  } else {
    style.fontSize = get(theme, `font.size.${variant}`, VARIANT_FONT_SIZE[variant]);
    style.lineHeight = get(theme, `font.line.height.${variant}`, VARIANT_LINE_HEIGHT[variant]);
    style.fontWeight = get(theme, 'font.weight.normal', 400);
    if (VARIANT_MARGIN[variant]) {
      style.marginTop = VARIANT_MARGIN[variant];
      style.marginBottom = VARIANT_MARGIN[variant];
    }
  }

  if (MONOSPACE_VARIANTS.has(variant)) {
    // Real token key is the flat property `'family.code'` under `font` (a literal dot in the
    // key, not a nested `font.family.code` path — `font.family` is itself a string, so a
    // dot-split path would silently always miss and fall back). Array-form path segments are
    // used as-is by `get()`, so `['font', 'family.code']` reaches the real flat key correctly.
    style.fontFamily = get(theme, ['font', 'family.code'], '"Fira Code", Monaco');
  }

  const styleVariants = Array.isArray(styleVariant) ? styleVariant : styleVariant ? [styleVariant] : [];

  for (const sv of styleVariants) {
    switch (sv) {
      case 'light':
        style.fontWeight = get(theme, 'font.weight.light', 300);
        break;
      case 'normal':
        style.fontWeight = get(theme, 'font.weight.normal', 400);
        break;
      case 'semibold':
        style.fontWeight = get(theme, 'font.weight.medium', 500);
        break;
      case 'bold':
        style.fontWeight = get(theme, 'font.weight.bold', 700);
        break;
      case 'italic':
        style.fontStyle = 'italic';
        break;
      case 'small':
        style.fontSize = get(theme, 'font.size.small', '14px');
        break;
      case 'uppercase':
        style.textTransform = 'uppercase';
        break;
      case 'lowercase':
        style.textTransform = 'lowercase';
        break;
      case 'underline':
        style.textDecoration = 'underline';
        break;
      case 'strike':
        style.textDecoration = 'line-through';
        break;
    }
  }

  return style;
}
