/**
 * Generic, dependency-free "resolve every theme-getter function in a token tree" walker —
 * the runtime counterpart to `libs/ui/src/tokens/*.ts`'s own shape: each token file is a plain
 * object whose leaf values are either concrete CSS values, nested objects (Emotion pseudo-
 * selector keys like `'&:hover, &.hover'`), or `(theme) => value` functions. This walks any such
 * tree and evaluates every function against `theme`, recursing into nested objects, leaving
 * concrete values untouched — the same resolution `ButtonStyled.tsx` gets for free via
 * `new Proxy(button, tokensHandler(theme))` + `get(themeButton, path, {})`, done as a plain
 * synchronous function since there's no reason to carry the Proxy machinery over here.
 *
 * Kept local (not imported from gd-design-library) so this package's own promise — zero
 * runtime dependency on gd-design-library — stays intact; this utility has no opinion about
 * *which* token tree it walks. A caller that DOES want to resolve a real `libs/ui/src/tokens/*`
 * object directly (for true single-source-of-truth, not a hand-mirrored copy) imports that
 * object itself from wherever it's allowed to (see `gd-button.ts` for the Button case) and
 * passes it here.
 */
export function resolveThemeTree<T extends Record<string, unknown>>(tree: T, theme: unknown): T {
  const result: Record<string, unknown> = {};

  const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    v !== null && typeof v === 'object' && !Array.isArray(v);

  for (const [key, value] of Object.entries(tree)) {
    if (typeof value === 'function') {
      // A resolved function's return value could itself be an unresolved sub-tree (defensive —
      // real button.ts's own `(theme) => getFocusStyles(...)` never needs this, since its
      // return value is already fully resolved, but a future token file's getter might).
      const resolved = (value as (t: unknown) => unknown)(theme);
      result[key] = isPlainObject(resolved) ? resolveThemeTree(resolved, theme) : resolved;
    } else if (isPlainObject(value)) {
      result[key] = resolveThemeTree(value, theme);
    } else {
      result[key] = value;
    }
  }

  return result as T;
}
