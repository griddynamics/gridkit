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

/**
 * There is deliberately no `resolveTypographyStyle` hand-mirroring `typography.ts`'s object
 * here — that would be a second, manually-kept-in-sync copy of the same data. `gd-typography.ts`
 * instead imports the REAL `typography` object from `gd-design-library/tokens` and resolves it
 * directly with `resolveThemeTree` (from this package's `utils/resolveThemeTree`), so any edit
 * to `libs/ui/src/tokens/typography.ts` is picked up automatically. See `gd-typography.ts` for
 * the variant/styleVariant merge logic (mirroring `Typography.tsx`'s own prop behavior, minus
 * the DOM-tag polymorphism, which per CTORNDSD-580's finding has no portable equivalent across
 * Lit or React Native).
 */
