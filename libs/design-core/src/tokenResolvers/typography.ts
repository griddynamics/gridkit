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
}

const MONOSPACE_VARIANTS: ReadonlySet<TypographyVariantName> = new Set(['code', 'kbd']);

/**
 * Pure resolution of gd-design-library's `typography.ts` token file
 * (libs/ui/src/tokens/typography.ts): a variant resolves the base font metrics, an
 * optional styleVariant (or list of them) overlays weight/transform/decoration on top —
 * mirroring `Typography.tsx`'s `variant`/`styleVariant` props, minus the DOM-tag
 * polymorphism (`as`), which per CTORNDSD-580's Typography finding has no portable
 * equivalent across Lit (fixed outer custom-element tag) or React Native (`Text` only).
 */
export function resolveTypographyStyle(
  theme: DesignCoreTheme,
  variant: TypographyVariantName = 'span',
  styleVariant?: TypographyStyleVariantName | TypographyStyleVariantName[]
): ResolvedTypographyStyle {
  const fontFamily = get(theme, 'font.family', 'inherit');
  const style: ResolvedTypographyStyle = { fontFamily };

  if (variant === 'span') {
    style.fontSize = 'inherit';
    style.fontWeight = 'inherit';
    style.lineHeight = 'inherit';
  } else {
    style.fontSize = get(theme, `font.size.${variant}`, undefined);
    style.lineHeight = get(theme, `font.line.height.${variant}`, undefined);
    style.fontWeight = get(theme, 'font.weight.normal', 400);
  }

  if (MONOSPACE_VARIANTS.has(variant)) {
    style.fontFamily = get(theme, 'font.family.code', fontFamily);
  }

  const styleVariants = Array.isArray(styleVariant) ? styleVariant : styleVariant ? [styleVariant] : [];

  for (const sv of styleVariants) {
    switch (sv) {
      case 'light':
        style.fontWeight = get(theme, 'font.weight.light', style.fontWeight);
        break;
      case 'normal':
        style.fontWeight = get(theme, 'font.weight.normal', style.fontWeight);
        break;
      case 'semibold':
        style.fontWeight = get(theme, 'font.weight.medium', style.fontWeight);
        break;
      case 'bold':
        style.fontWeight = get(theme, 'font.weight.bold', style.fontWeight);
        break;
      case 'italic':
        style.fontStyle = 'italic';
        break;
      case 'small':
        style.fontSize = get(theme, 'font.size.small', style.fontSize);
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
