/**
 * gd-design-core's resolvers return `fontFamily` as a **web CSS font stack** — e.g.
 * `'"Fira Sans", sans-serif'` — because every token value in that package is CSS-shaped (the same
 * reason `pxToNumber()` and `toFontWeight()` exist). React Native's `fontFamily` on iOS/Android is
 * not CSS: it is a single lookup key into the native font registry, so a stack string matches
 * nothing and the platform silently falls back to the system face. `react-native-web` hides this
 * because it emits real CSS, which is why it went unnoticed until the iOS render was compared
 * side-by-side (see `react-native/FINDINGS.md`).
 *
 * This helper closes both halves of that gap:
 *   1. Parses the stack down to its first family name.
 *   2. Maps that family + weight + italic flag onto a concrete font face registered by
 *      `src/fonts.ts` — because RN does not synthesize weights from one family the way CSS does;
 *      each weight is its own loaded face.
 *
 * The returned name is only meaningful if `src/fonts.ts`'s faces are actually loaded (see
 * `useGdFonts()`); the two files share the face tables below as their single source of truth.
 */

/** Weight → face-name suffix, matching `@expo-google-fonts/*` TTF filenames exactly. */
export const FIRA_SANS_FACES: Readonly<Record<number, string>> = {
  300: 'FiraSans_300Light',
  400: 'FiraSans_400Regular',
  500: 'FiraSans_500Medium',
  700: 'FiraSans_700Bold',
};

export const FIRA_SANS_ITALIC_FACES: Readonly<Record<number, string>> = {
  400: 'FiraSans_400Regular_Italic',
  700: 'FiraSans_700Bold_Italic',
};

export const FIRA_CODE_FACES: Readonly<Record<number, string>> = {
  400: 'FiraCode_400Regular',
};

/** Normalized first-family name → the face table to select a weight from. */
const FAMILY_TABLES: Readonly<
  Record<string, { regular: Readonly<Record<number, string>>; italic?: Readonly<Record<number, string>> }>
> = {
  firasans: { regular: FIRA_SANS_FACES, italic: FIRA_SANS_ITALIC_FACES },
  firacode: { regular: FIRA_CODE_FACES },
};

const DEFAULT_WEIGHT = 400;

/**
 * `'"Fira Sans", sans-serif'` → `'Fira Sans'`. Handles single quotes, double quotes, and the
 * unquoted-single-family case (`'Monaco'`). Returns `undefined` for an empty/unusable input so
 * callers can omit `fontFamily` entirely rather than pass a meaningless string.
 */
export function parseFirstFontFamily(cssFontFamily: string | number | undefined): string | undefined {
  if (cssFontFamily === undefined) return undefined;
  const first = String(cssFontFamily).split(',')[0]?.trim();
  if (!first) return undefined;
  const unquoted = first.replace(/^['"]/, '').replace(/['"]$/, '').trim();
  return unquoted || undefined;
}

/**
 * Picks the closest registered weight rather than failing outright — an unregistered weight
 * (e.g. 600) should still render in the right *family*, which is far closer to the design than
 * dropping to the system font. Ties round down to the lighter face, matching CSS's own
 * font-matching rule for weights below 400.
 */
function nearestWeight(available: Readonly<Record<number, string>>, target: number): number | undefined {
  const weights = Object.keys(available).map(Number);
  if (weights.length === 0) return undefined;
  return weights.reduce((best, w) =>
    Math.abs(w - target) < Math.abs(best - target) || (Math.abs(w - target) === Math.abs(best - target) && w < best)
      ? w
      : best
  );
}

/**
 * Resolves a gd-design-core `fontFamily` value into a React Native font-face name.
 *
 * Falls back, in order: exact face → nearest registered weight in the same family → the bare
 * parsed family name (correct for any face the host app happens to have registered itself, and
 * still strictly better than handing RN a CSS stack) → `undefined`.
 *
 * `'inherit'` is passed through as `undefined`, matching how every other RN atom drops
 * `'inherit'`-valued resolver fields (RN has no CSS `inherit`; a nested `Text` inherits natively).
 */
export function toFontFamily(
  cssFontFamily: string | number | undefined,
  fontWeight?: string | number,
  fontStyle?: string
): string | undefined {
  const family = parseFirstFontFamily(cssFontFamily);
  if (family === undefined || family === 'inherit') return undefined;

  const table = FAMILY_TABLES[family.replace(/\s+/g, '').toLowerCase()];
  if (!table) return family;

  const italic = fontStyle === 'italic';
  const faces = italic && table.italic ? table.italic : table.regular;

  const parsedWeight = fontWeight === undefined || fontWeight === 'inherit' ? DEFAULT_WEIGHT : Number(fontWeight);
  const weight = Number.isFinite(parsedWeight) ? parsedWeight : DEFAULT_WEIGHT;

  const chosen = nearestWeight(faces, weight);
  return chosen === undefined ? family : faces[chosen];
}
