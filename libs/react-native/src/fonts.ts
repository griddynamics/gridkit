import { useFonts } from 'expo-font';
import { FIRA_CODE_FACES, FIRA_SANS_FACES, FIRA_SANS_ITALIC_FACES } from './utils/toFontFamily';

/**
 * The native half of the CSS-font-stack fix (see `utils/toFontFamily.ts` for the other half and
 * the full explanation).
 *
 * On iOS/Android a font family only exists once its face has been registered with the native font
 * registry — there is no equivalent of the browser fetching a Google Fonts stylesheet. Before this
 * module existed, every atom asked RN for `'"Fira Sans", sans-serif'`, nothing was loaded under
 * any name, and all five silently rendered in San Francisco / Roboto.
 *
 * Keys here MUST match the face names in `toFontFamily`'s tables exactly — that is the contract
 * between the two files, and `toFontFamily.test.ts` asserts it holds.
 *
 * Weight coverage is deliberately partial. gd-design-core only emits 300/400/500/700, and each
 * TTF is ~430 kB, so registering all nine weights (plus italics) would add several megabytes to a
 * spike harness for faces nothing requests. `toFontFamily` snaps any unregistered weight to the
 * nearest registered one, so the family is always right even when the weight is approximated.
 */
export const GD_FONT_FACES: Record<string, number> = {
  [FIRA_SANS_FACES[300]]: require('@expo-google-fonts/fira-sans/FiraSans_300Light.ttf'),
  [FIRA_SANS_FACES[400]]: require('@expo-google-fonts/fira-sans/FiraSans_400Regular.ttf'),
  [FIRA_SANS_FACES[500]]: require('@expo-google-fonts/fira-sans/FiraSans_500Medium.ttf'),
  [FIRA_SANS_FACES[700]]: require('@expo-google-fonts/fira-sans/FiraSans_700Bold.ttf'),
  [FIRA_SANS_ITALIC_FACES[400]]: require('@expo-google-fonts/fira-sans/FiraSans_400Regular_Italic.ttf'),
  [FIRA_SANS_ITALIC_FACES[700]]: require('@expo-google-fonts/fira-sans/FiraSans_700Bold_Italic.ttf'),
  [FIRA_CODE_FACES[400]]: require('@expo-google-fonts/fira-code/FiraCode_400Regular.ttf'),
};

/**
 * Loads every GridKit face. Returns `[loaded, error]` straight from `expo-font`.
 *
 * Callers should hold the first paint until `loaded` is true — RN does not re-layout text that
 * was already measured with the fallback face, so rendering early produces a visible reflow (and,
 * on iOS, occasionally text that stays in the fallback face for the session).
 */
export function useGdFonts(): [boolean, Error | null] {
  const [loaded, error] = useFonts(GD_FONT_FACES);
  return [loaded, error ?? null];
}
