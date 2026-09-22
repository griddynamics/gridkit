/**
 * gd-design-core's token resolvers return CSS unit strings (e.g. `'1px'`) for size-shaped
 * fields even in their RN-consumable branch — a themed override can supply either a raw
 * number or a CSS string, and the resolver's own type (`string | number`) reflects that. RN's
 * `StyleSheet`/`ViewStyle`/`TextStyle` numeric fields (`borderWidth`, `borderRadius`, `gap`,
 * `padding`, `fontSize`, `lineHeight`, margins) require a plain `number`, so every RN atom
 * adapter routes size-shaped resolver output through this helper before assigning it to a
 * `style` prop, the same way `toViewStyle`/`toFontWeight` bridge other field-shape mismatches.
 */
export function pxToNumber(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}
