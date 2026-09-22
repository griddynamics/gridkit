/**
 * Metro resolves `.ttf` imports to a numeric asset handle at bundle time (the same mechanism it
 * uses for images). TypeScript has no knowledge of that resolver, so the font requires in
 * `src/fonts.ts` need this declaration to type-check.
 */
declare module '*.ttf' {
  const asset: number;
  export default asset;
}
