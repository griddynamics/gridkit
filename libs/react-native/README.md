# react-native (CTORNDSD-590)

Disposable React Native (Expo) PoC. See `FINDINGS.md` for the spike's verdict, per-atom findings,
the Select dropdown-presentation approach evaluation, and what was and wasn't verified on-device.

All 5 GridKit atoms are ported: `GdButton`, `GdCheckbox`, `GdTypography`, `GdInput`, `GdSelect`
(each under `src/components/<Name>/`), all consuming `gd-design-core`'s shared token resolvers and
`zustand/vanilla` stores — the same shared core `libs/web-components`'s Lit port (CTORNDSD-581)
consumes for the same 5 atoms.

## Per-component quick reference

| Component      | Key props (all also take `theme`)                                                                                                     | Callback                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `GdButton`     | `variant` (`primary`\|`secondary`\|`tertiary`\|`outlined`\|`text`\|`inherit`), `disabled`, `isLoading`                                | `onPress`                        |
| `GdCheckbox`   | `checked`, `indeterminate`, `disabled`, `size` (`sm`\|`md`)                                                                           | `onValueChange(checked)`         |
| `GdTypography` | `variant` (`span`\|`h1`–`h6`\|`p`\|`small`\|`caption`\|`header`\|`code`\|`kbd`), `styleVariant` (single/array)                        | — (renders `children` as `Text`) |
| `GdInput`      | `value`, `placeholder`, `label`, `helperText`, `disabled`, `color` (`primary`\|`success`\|`warning`\|`error`), `debounceCallbackTime` | `onValueChange(value)`           |
| `GdSelect`     | `items` (array), `value`, `disabled`, `color`, `placeholder`, `emptyLabel`                                                            | `onValueChange(value)`           |

No `as` prop on `GdTypography` (RN's `Text` has no DOM-tag concept to swap — see `FINDINGS.md`).
`GdSelect` is reduced-scope: single-select, no search, fixed-below positioning only.

## Setup

`gd-design-core` is resolved straight to its TS source (`libs/design-core/src`) via a workspace
dependency (`"gd-design-core": "*"`) plus a `resolver.extraNodeModules` alias in
`metro.config.js` — the same single-source-of-truth approach `libs/web-components`'s vite config
uses for `gd-design-library`. No build step in between; editing a token resolver is reflected
immediately.

```bash
npm install                 # from the repo root (npm workspaces) — REQUIRED, see note below
cd libs/react-native
npm run type-check
npm test                    # 54 tests across all 5 atoms + token adapters (jest-expo + RNTL)
```

`npm install` at the **repo root** is not optional. On a stale `node_modules`, `tsc` emits hundreds
of errors (`Cannot use JSX unless the '--jsx' flag is provided`, `Cannot find module
'react-native'`) that all cascade from one cause: `expo/tsconfig.base` is unresolvable because
`expo` is not installed.

Workspace hoisting gives `react-test-renderer` and `@testing-library/react-native` (no version
conflict, so npm hoists them to the repo root) a _different_ `react` module instance than this
package's own pinned `react@18.2.0` (kept local because it conflicts with the root's
`react@^18.3.1`) — two React copies means two hooks dispatchers, so `useState` reads `null`
inside `act()`. Fixed with a Jest `moduleNameMapper` forcing every `react` import back to this
package's own `node_modules/react` (see `package.json`'s `jest` config).

This package also depends on `zustand` (required by `gd-design-core` at runtime),
`react-native-svg` (Checkbox's check/indeterminate icons, Select's chevron — see `FINDINGS.md`
Decision 3), and `@expo-google-fonts/fira-sans` + `@expo-google-fonts/fira-code` (the actual
typeface files — see _Fonts_ below).

### Fonts

`gd-design-core` returns `fontFamily` as a **web CSS stack** (`'"Fira Sans", sans-serif'`). RN's
`fontFamily` on iOS/Android is a single native-registry lookup key, not CSS, so that string matches
nothing and the platform silently falls back to the system face. Two pieces close this:

- `src/utils/toFontFamily.ts` — parses the stack and resolves family + weight + italic to a
  concrete face name (`FiraSans_500Medium`), snapping unregistered weights to the nearest
  registered one. Pure and unit-tested.
- `src/fonts.ts` — registers those faces with `expo-font`. `useGdFonts()` returns
  `[loaded, error]`; **hold first paint until `loaded`**, as `App.tsx` does, because RN does not
  re-measure text that already laid out in the fallback face.

The two files share their face tables, and `toFontFamily.test.ts` asserts they never drift — a face
that can be _selected_ but is never _loaded_ reproduces the original bug exactly.

Weight coverage is deliberately partial (300/400/500/700 plus 400/700 italic, and Fira Code 400):
gd-design-core emits only those weights, and each TTF is ~430 kB. Adding a weight means adding it to
both files.

### Metro config is required, not optional

`metro.config.js` aliases `gd-design-core` to `../design-core/src` via `resolver.extraNodeModules`
and adds that path to `watchFolders` (Metro refuses to read files outside `projectRoot`
otherwise). Do not remove this file. `FINDINGS.md`'s "Environment Note" documents the earlier
`file:../dist/libs/design-core` + symlink/exports-map setup this replaced, and the failure
sequence it was debugged from.

### Running on a simulator

From the repo root (same pattern as `npm run dev:web-components`):

```bash
npm run dev:react-native   # Expo dev server
# then press `i` for iOS or `a` for Android, or scan the QR code with Expo Go on a physical device
```

Or from this package directly: `cd libs/react-native && npm run start`.

If the simulator reports "Could not connect to the server" using the default LAN URL, restart with
`npm run dev:react-native -- --ios --localhost` — iOS Simulators share the host's network stack
directly, so `localhost` works in environments where the LAN-visible IP doesn't (see
`FINDINGS.md`).

Flag forwarding through the root script only works because `dev:react-native` ends in `--`. Without
it, npm parses `--ios`/`--localhost` as its own config, warns `Unknown cli config "--ios"`, and
starts Expo in default LAN mode — i.e. the documented workaround silently did nothing. If you see
that warning, your checkout predates the fix; use
`cd libs/react-native && npx expo start --ios --localhost`.

## Workspace membership

This package lives at `libs/react-native`, alongside `libs/design-core` and
`libs/web-components`, and is listed in the root `package.json`'s `workspaces` array — the same
setup `libs/web-components` uses. Its `package.json` name is `gd-react-native` (not `react-native`)
so npm's workspace symlinking doesn't collide with the real `react-native` npm dependency.

This package is the sibling React Native track under epic CTORNDSD-580 ("Add webcomponents
support"), alongside `libs/web-components`'s Lit/Web-Components track (CTORNDSD-581). Both consume
the same `gd-design-core` shared resolvers/stores for the same 5 atoms.
