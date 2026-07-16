import { Text, type TextStyle } from 'react-native';
import {
  resolveTypographyStyle,
  type DesignCoreTheme,
  type TypographyStyleVariantName,
  type TypographyVariantName,
} from 'gd-design-core';
import { pxToNumber } from '../../utils/pxToNumber';
import { toFontWeight } from '../../utils/toFontWeight';

export interface GdTypographyProps {
  variant?: TypographyVariantName;
  styleVariant?: TypographyStyleVariantName | TypographyStyleVariantName[];
  theme?: DesignCoreTheme;
  children?: string;
}

/**
 * CTORNDSD-590 Typography port. Consumes `resolveTypographyStyle`, mapping its flattened style
 * object onto RN `Text`'s `style` prop — `textDecoration` becomes `textDecorationLine` (RN's own
 * name for the same CSS property), and any resolver field literally equal to `'inherit'` (the
 * `span` variant's whole point) is omitted rather than passed through, since RN has no CSS
 * `inherit` keyword: a nested `<Text>` already inherits unset style fields from its parent
 * `<Text>` natively, so omitting is the correct RN-idiomatic equivalent, not a gap.
 *
 * Deliberately no `as`/DOM-tag prop: RN's `Text` has no tag-polymorphism concept at all — a
 * stronger version of the Lit port's own discoverability-gap finding (CTORNDSD-580/-581's
 * Typography finding already forward-references this ticket for the RN-specific writeup; see
 * `react-native/FINDINGS.md`).
 */
export function GdTypography({ variant = 'span', styleVariant, theme = {}, children }: GdTypographyProps) {
  const resolved = resolveTypographyStyle(theme, variant, styleVariant);

  const style: TextStyle = {
    fontFamily: resolved.fontFamily === 'inherit' ? undefined : (resolved.fontFamily as string),
    fontSize: resolved.fontSize === 'inherit' ? undefined : pxToNumber(resolved.fontSize),
    fontWeight: resolved.fontWeight === 'inherit' ? undefined : toFontWeight(resolved.fontWeight),
    lineHeight: resolved.lineHeight === 'inherit' ? undefined : pxToNumber(resolved.lineHeight),
    fontStyle: resolved.fontStyle as TextStyle['fontStyle'],
    textTransform: resolved.textTransform as TextStyle['textTransform'],
    textDecorationLine: resolved.textDecoration as TextStyle['textDecorationLine'],
    marginTop: pxToNumber(resolved.marginTop),
    marginBottom: pxToNumber(resolved.marginBottom),
  };

  return <Text style={style}>{children}</Text>;
}
