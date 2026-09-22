import type { TextStyle } from 'react-native';

/** gd-design-core's fontWeight is a loose `string | number` (theme-driven, e.g. `500` or
 *  `'inherit'`); RN's `TextStyle['fontWeight']` only accepts a fixed string union. Shared by
 *  every atom that renders a resolver's `fontWeight` field onto RN `Text`/`Pressable` styles. */
export function toFontWeight(fontWeight: string | number | undefined): TextStyle['fontWeight'] {
  if (fontWeight === undefined) return undefined;
  const asString = String(fontWeight);
  const allowed: ReadonlyArray<TextStyle['fontWeight']> = [
    'normal',
    'bold',
    '100',
    '200',
    '300',
    '400',
    '500',
    '600',
    '700',
    '800',
    '900',
  ];
  return (allowed as readonly string[]).includes(asString) ? (asString as TextStyle['fontWeight']) : undefined;
}
