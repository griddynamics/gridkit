# CTORNDSD-590 — React Native Integration Spike: Findings

## Overall Verdict: GO (conditional)

All 5 GridKit atoms (Button, Checkbox, Typography, Input, Select) are ported to React Native
(Expo SDK 51) inside `react-native/`, consuming `gd-design-core`'s shared token resolvers
and `zustand/vanilla` stores exactly as `libs/web-components`'s Lit port does for the same atoms
under sibling ticket CTORNDSD-581. The RN track reaches the same "5/5 atoms ported" completion
state, with 137 automated tests passing (114 `gd-design-core` resolver/store tests + 23 RN
interaction tests) and one real, verified screenshot of all 5 atoms rendering correctly on a
booted iOS Simulator (`screenshots/ios-simulator-all-5-atoms.png`).

**Conditional on:** the interaction-level and cross-platform-fidelity claims below that this spike
could NOT verify empirically on-device — see "What Was NOT Verified" — must be confirmed by a
human with working simulator/device automation before this is a production go-ahead. This spike
verifies "does it work and look plausible," not "is every interaction behaviorally identical to
the Lit/React web adapters under real touch input."

## Environment Note (read this before re-running anything below)

The environment this spike was authored in had no simulator or device readily usable at the
start: `xcrun simctl list devices` hung indefinitely on first invocation (turned out to be a
one-time CoreSimulator runtime installation, not a permanent block) and no simulator device had
been created yet. After creating and booting an iOS 26.0 "iPhone 15" simulator:

- `npx expo start --ios` (default LAN mode) opened Expo Go successfully but the app failed to load
  with "Could not connect to the server" — the simulator's LAN-visible host IP was not reachable
  from within this sandbox.
- `npx expo start --ios --localhost` fixed the connection (iOS Simulators share the host's network
  stack directly, unlike physical devices, so `localhost` works where the LAN IP doesn't).
- Metro then failed to bundle: `Unable to resolve "gd-design-core"`. Fixed by adding
  `react-native/metro.config.js` with `unstable_enableSymlinks` and
  `unstable_enablePackageExports` (Metro's SDK 51 defaults follow neither, and `gd-design-core` is
  consumed via a `file:../dist/libs/design-core` symlink + `exports`-map package.json).
- Bundling then failed again: Metro also refuses to _read_ files outside `projectRoot` unless
  they're under an explicit `watchFolders` entry, even once the resolver is willing to point
  there. Fixed by adding `dist/libs/design-core` (narrowly, not the whole monorepo root — see the
  config file's own comment for why) to `config.watchFolders`.
- Bundling then failed a third time: `Unable to resolve "@babel/runtime/helpers/interopRequireDefault"`
  from inside `dist/libs/design-core`'s transformed output. Fixed by adding the project's own
  `node_modules` to `config.resolver.nodeModulesPaths` explicitly — Metro's hierarchical
  node_modules lookup doesn't reliably climb back into `projectRoot/node_modules` from a file
  under a `watchFolders` entry outside `projectRoot`.
- After all three fixes, `iOS Bundled` succeeded and the app loaded on the simulator, all 5 atoms
  visible and interactive-looking (see the screenshot).

**This is a real, concrete instance of the "Cascading tooling gap" the Lit spike's own
`FINDINGS.md` (Section 13) predicted for Metro specifically** — a monorepo `file:` dependency with
an `exports` map needs three separate, non-default Metro config options before it bundles at all.
The fixed `metro.config.js` is committed; a future contributor should not need to rediscover this.

## Per-Atom Findings

### 1. Button (pre-existing, from the seed commit — fixed here)

The seeded `GdButton.tsx` had a live type error: its `toViewStyle` helper typed `borderWidth` as
a plain `number`, but `resolveButtonVariantStyle`'s `container.borderWidth` is actually a CSS
px-string (`'1px'`) — `DesignCoreTheme`-driven resolvers return `string | number` for every
size-shaped field, by design, so a themed override can supply either shape. Fixed by adding a
shared `pxToNumber()` utility (`src/utils/pxToNumber.ts`) that strips a trailing `px` and parses
the remainder; every atom below routes size-shaped resolver output through it before assigning to
an RN `style` prop. A second shared utility, `toFontWeight()` (`src/utils/toFontWeight.ts`), was
extracted from `GdButton.tsx`'s own local copy for the same reason — `fontWeight` is
`string | number` from the resolver, but RN's `TextStyle['fontWeight']` only accepts a fixed
string union.

### 2. Checkbox

Straightforward resolver+store port. `resolveCheckboxStyle` was recreated in `gd-design-core`
(see "Design-Core Resolver Recreation" below) and consumed as-is. `createCheckboxStore` needed
zero changes — it was already RN-ready (pure `zustand/vanilla`, no DOM assumptions).

RN has no `indeterminate` DOM property to write to directly, unlike the Lit port's
`this._input.indeterminate = ...` direct-DOM-API write — there is no native checkbox element at
all in the RN port (`Pressable` + a drawn `View` indicator), so `indeterminate` only ever needs to
affect which icon renders and `accessibilityState.checked`'s `'mixed'` value. The check/
indeterminate icon path data (`react-native-svg`, Decision 3) is copied verbatim from
`gd-checkbox.ts` for visual parity between the two spikes.

**Verified**: unchecked/checked/indeterminate/disabled rendering and press-to-toggle behavior, via
5 automated interaction tests (`GdCheckbox.test.tsx`) and the simulator screenshot.
**Not verified**: real touch-target sizing/hit-slop feel on an actual finger-sized tap — no
device, only a simulator screenshot.

### 3. Typography

`resolveTypographyStyle` was recreated in `gd-design-core` unchanged in signature/behavior.
Mapped its flattened style object onto RN `Text`'s `style` prop; `textDecoration` becomes RN's own
`textDecorationLine` property name for the same CSS concept.

**`'inherit'`-valued fields are omitted, not passed through** — RN has no CSS `inherit` keyword.
A nested `<Text>` already inherits unset style fields from its parent `<Text>` natively, which is
the correct RN-idiomatic equivalent for the `span` variant's whole point, not a gap needing a
workaround. Verified via `GdTypography.test.tsx`'s "omits inherit-valued style fields" test.

**DOM-tag-polymorphism gap — confirmed, and stronger on RN than on Lit.** No `as` prop was
ported. `libs/web-components/FINDINGS.md` (Section 5, and its line-167 forward-reference) already
flagged this as unportable to Lit's fixed outer custom-element tag; RN's `Text` has no tag concept
at all — there is no DOM, no semantic-element vocabulary, nothing to swap. This is the RN-specific
writeup that ticket forward-referenced. Not a bug, a platform-structural fact: any consumer relying
on `as="h2"` semantics for accessibility/SEO on web has no RN equivalent to reach for; RN's own
accessibility model uses `accessibilityRole` instead, which `GdTypography` does not currently set
(a real gap worth a follow-on ticket if RN Typography moves beyond spike status).

### 4. Input

`resolveInputStyle` (plus its 4 exported color-variant constant maps) was recreated in
`gd-design-core` unchanged. `createInputStore` was consumed for `debounceCallbackTime`/`debounce`
only — see the two documented scope cuts below, both deliberate, both because the underlying
platform concept genuinely doesn't exist on RN, not because the port is incomplete:

- **`isMouseInteraction` tracking (`registerMouseDown`/`registerKeyDown`) was NOT ported.** That
  store state exists solely to pick a focus-ring style for mouse-vs-keyboard-Tab interaction — RN
  has no mouse pointer or Tab-key focus-traversal convention on a touch target, so there is no RN
  consumer for this value.
- **Cursor-jump mitigation was ported, using React's controlled-component model instead of the
  Lit port's direct-DOM `activeElement` guard.** `GdInput` keeps its own `localValue` state as the
  single rendered source of truth, gated by an `isFocusedRef`: an external `value` prop change is
  only applied while NOT focused; a change arriving while focused is dropped and reconciled on
  blur. This is architecturally the same guard as the Lit port's, translated to RN's state model
  rather than a raw DOM write, since RN's `TextInput` has no `activeElement`/direct-value-write
  escape hatch the way a native `<input>` does.

**Verified (automated, not on-device)**: typing updates the displayed value; `onValueChange` fires
immediately with no `debounceCallbackTime` set and is correctly debounced when one is set (fake
timers, exact call count/timing asserted); the cursor-jump guard's _logic_ — an external
`rerender()` with a new `value` prop while focused is dropped, then applied on blur — passes under
`@testing-library/react-native`'s `fireEvent`/`rerender` harness (`GdInput.test.tsx`).

**NOT verified on-device, and this matters**: `@testing-library/react-native`'s `fireEvent.focus`/
`fireEvent.blur`/`rerender` are synchronous JS-level simulations. They prove the guard's _code
path_ is exercised correctly under a scripted sequence, but they cannot reproduce the actual
adversarial scenario the Lit port's own FINDINGS.md (Section 4) empirically tested: real
asynchronous lag between a keystroke and a state-driving re-render, on a real `TextInput` with a
real native text-editing cursor and IME/autocorrect interactions (visible in the simulator
screenshot: the sample "Do" text shows iOS's native autocorrect underline, which is exactly the
kind of native-input behavior a JS-level test can't reach). **This is an open risk, not a closed
one** — a human with a real device or working simulator-automation harness must still type under
artificial lag on an actual `TextInput` before this can be called verified, matching the rigor bar
the Lit spike set for itself.

### 5. Select

Reduced-scope PoC (single-select, no search, fixed-below positioning) — mirroring the Lit port's
own reduced scope (`gd-select.ts`'s doc comment), for the same reason: this is a spike, not a
production parity claim. `createSelectStore` needed zero changes (already RN-ready). A brand-new
`resolveSelectStyle` was added to `gd-design-core` (the Lit port deleted the old one outright
rather than gutting it to a stub, so there was nothing to "recreate" — this is new code, sourced
from the pre-deletion commit `74c1ea6`). The chevron icon path data is copied verbatim from
`gd-select.ts` for the same visual-parity reason as Checkbox's icons.

`boxShadow` (a CSS shadow string from the resolver, e.g.
`'0px 8px 15px 1px rgba(0, 0, 0, 0.20)'`) is **approximated with a static RN shadow/elevation
pair, not parsed** — writing a CSS box-shadow string parser into per-platform shadow props
(`shadowColor`/`shadowOffset`/`shadowOpacity`/`shadowRadius` on iOS, `elevation` on Android) is
deferred as a documented gap, out of scope for a spike.

## Select Approach Evaluation (Decision 2)

RN has no `popover`/CSS-anchor-positioning equivalent, so the Lit port's `popover="auto"` +
manual `getBoundingClientRect()` approach doesn't translate directly. Two candidate approaches
were built for comparison, per the implementation plan's explicit instruction to evaluate rather
than assume an answer (mirroring the Lit spike's own Section 6 methodology):

**Option A — RN `Modal` (shipped as the default, in `GdSelect.tsx`):** `Modal`'s own chrome
gives Android hardware-back-button dismiss (`onRequestClose`) and correct full-screen overlay
stacking through the native window layer, independent of where in the component tree it's
mounted. Cost: one `measureInWindow()` call on open to anchor the dropdown under the trigger,
since `Modal` has no "anchor to element" concept built in.

**Option B — custom absolutely-positioned `View`, no `Modal` (prototype only, in
`GdSelectAnchoredPrototype.tsx`, NOT shipped):** A load-bearing limitation was found while
building this, not hypothesized in advance: **RN's `position: 'absolute'` resolves against the
nearest positioned ancestor, not the device viewport** — there is no `fixed`-to-window equivalent
outside `Modal`'s native window layer. This means Option B's backdrop/dropdown only visually
covers the true screen when the component (or an ancestor) is mounted with `flex: 1` at or near
the app root; nested inside any scrollable list, padded card, or `overflow: 'hidden'` container,
the backdrop clips to that container instead of the screen. Option B also has no Android
hardware-back-button dismiss without adding a native `BackHandler` listener by hand, and no
guaranteed paint-order elevation above sibling content beyond JSX ordering.

**Verdict: Option A (Modal) wins on engineering merit** — it has no mounting-position
requirement and gets back-button dismiss for free. This was a **reasoned engineering judgment
based on building both prototypes and reading RN's own layout model, not an empirical on-device
comparison** — neither approach's actual dismiss-on-outside-tap, dismiss-on-back-button,
rotation-repositioning, or paint-flicker behavior was exercised on a real simulator/device (no
touch-automation tool was available in this environment; see "What Was NOT Verified"). A human
should still tap through both on-device before fully retiring Option B's code, in case some
device-specific `Modal` quirk (there are known historical Android `Modal` transparency/keyboard-
avoidance issues in RN) tips the balance back.

A secondary, accepted trade-off in the shipped `GdSelect.tsx`: `isOpen` (the store's own state)
and `triggerLayout` (this component's own position state) are deliberately decoupled — the store
opens immediately on press, and `measureInWindow`'s async result only ever refines the dropdown's
position once it resolves, defaulting to `{x:0, y:0, ...}` until then. An earlier revision gated
`store.getState().open()` itself inside the `measureInWindow` callback; that coupling turned out
to have no guaranteed timing (and, discovered while writing this component's own tests, no
guaranteed firing at all inside a JS-only test renderer — RN's jest preset mocks
`measureInWindow` as a no-op `jest.fn()` per host-component instance). The decoupled version is
both more testable and more robust on a real device against a stalled/slow native bridge call.
Accepted cost: the dropdown may render one frame at `(0,0)` before repositioning — a minor,
documented flicker risk, not verified on-device.

## Design-Core Resolver Recreation (Decision 1)

`gd-design-core/src/tokenResolvers/{checkbox,input,typography}.ts` had their `resolveXStyle`
functions deleted by CTORNDSD-581 in favor of the Lit adapter importing `gd-design-library/tokens`
directly + `resolveThemeTree` ("true single source of truth" — see those files' git history,
commit `7e47cec`). `select.ts` didn't exist at all post-deletion. `resolveButtonVariantStyle` was
the one resolver spared from that deletion, explicitly because it's "still shared with
`react-native`'s `GdButton`" (that ticket's own commit message/doc comments).

This spike recreates the other 4 resolvers (`checkbox`, `input`, `typography` restored;
`select` newly added) from their last-known-good, already-token-corrected pre-deletion source
(commit `74c1ea6`), because `react-native` has no DOM/CSS runtime to resolve
`gd-design-library/tokens` + `resolveThemeTree` the way the Lit adapter does, and Metro's
tooling gap (see "Environment Note") makes taking on `gd-design-library`'s own dependency tree
(Emotion, DOM-oriented asset imports) a materially bigger lift than recreating ~150 lines of
already-correct resolver code.

**Accepted, documented trade-off — this is a real duplication, not resolved, only recorded**: an
edit to `libs/ui/src/tokens/{checkbox,input,select,typography}.ts` will **not** automatically
propagate to these RN resolvers, unlike the Lit adapter's direct-import approach. Every recreated
resolver file carries a doc comment stating this explicitly and pointing back to this file. Do
not delete these resolvers again under the "single source of truth" reasoning that removed them
the first time without checking whether `react-native` still consumes them.

## Not Applicable to RN (recorded, not silently omitted)

The Lit spike's `FINDINGS.md` covers several verification categories that have no RN equivalent
at all:

- **Shadow-DOM isolation (CTORNDSD-286)** — RN has no Shadow DOM or CSS-scoping concept; there is
  no analogous isolation boundary to test.
- **SSR/Declarative Shadow DOM hydration** — RN apps don't server-render into a DOM; there is no
  hydration step to compare.
- **Gzip bundle-size ratio vs. the original React component** — Metro's bundle output model
  (single JS bundle, Hermes bytecode compilation, no per-component gzip granularity the way a
  web bundler's code-splitting does) doesn't produce a directly comparable number without a
  dedicated RN bundle-analysis setup, which is out of scope for this spike.
- **React 19 event-mapping / native-property-assignment heuristics** — this is a web-specific
  React-DOM reconciler concern (custom-element boolean-attribute vs. JS-property heuristics);
  RN's reconciler talks to native views through its own bridge, not this mechanism.

## What Was NOT Verified (read before treating this as a closed spike)

1. **On-device/simulator interactive behavior** for all 5 atoms — actual finger-tap feel, real
   focus/blur timing, real IME/autocorrect interaction (partially visible by accident in the
   screenshot), IS running (see the screenshot), but no touch/type automation tool was available
   in this environment to script interactions against it, so only a static initial-render
   screenshot was captured, not an interaction recording.
2. **The cursor-jump adversarial scenario** (Input, Section under "Per-Atom Findings" above) —
   implemented and covered by a scripted JS-level approximation, not an on-device test with real
   async lag.
3. **The Select approach comparison's actual dismiss/rotation/flicker behavior** — both options
   were built and reasoned about, neither was tapped through on a real device.
4. **Cross-platform visual-parity comparison** — the screenshot proves the RN atoms render
   plausibly and match the intended tokens' values (verified: yellow primary button fill,
   correct checkbox border color, correct heading/body/caption type scale, bordered input with
   label/helper text, bordered select trigger with chevron), but no pixel-level or side-by-side
   comparison against the real Storybook components or the Lit atoms was performed.
5. **Android** — only an iOS Simulator was exercised; nothing here has been checked on the Android
   emulator, despite one being present in this environment (`~/Library/Android/sdk/tools/emulator`)
   — booting and provisioning an AVD, then repeating the above, was out of time budget for this
   pass.

## Conditions on the Verdict

- A human must complete items 1-5 above (or a follow-on ticket must scope proper RN
  device-automation tooling — see Follow-on Tickets) before this spike's "GO" is unconditional.
- The Decision-1 resolver-duplication trade-off must be re-confirmed as acceptable whenever
  `libs/ui/src/tokens/{checkbox,input,select,typography}.ts` changes — there is no automated
  drift detector between the two copies.
- `boxShadow` string parsing remains unimplemented; any visual QA pass should expect Select's
  dropdown shadow to be an approximation, not a match.

## Scope Confirmation

**Touched**: `libs/design-core/src/tokenResolvers/{checkbox,input,typography}.ts` (resolver
bodies restored), `libs/design-core/src/tokenResolvers/select.ts` (new),
`libs/design-core/src/tokenResolvers/{checkbox,input,select,typography}.spec.ts` (restored/new),
`libs/design-core/src/tokenResolvers/index.ts` (barrel exports), `libs/design-core/README.md`
(status), `react-native/**` (all 5 atom components, tests, `App.tsx`, `metro.config.js`,
`package.json`, `README.md`).

**Explicitly NOT touched**: `libs/ui` (`gd-design-library`) source, build config, or shipped
output; `libs/web-components/*` (any file — that spike is already complete and this ticket does
not reopen it); `libs/design-core/src/stores/*` (all 3 stores consumed unmodified); root
`package.json`'s `workspaces` array; `tsconfig.base.json`; `nx.json`.

## Follow-on Tickets (not this ticket's scope)

- Stand up a real RN device-automation harness (Detox, Maestro, or an Appium/WebDriverIO RN
  driver) so future spikes/PRs on this track get the same "verified live" rigor the Lit spike had
  via `chrome-devtools-mcp` — this is the single biggest gap this spike's own verification hit.
- Implement a CSS `boxShadow`-string → per-platform shadow-prop parser (shared utility, would also
  benefit any future RN atom with a shadow token).
- Full `GdSelect` parity (multi-select, search filtering, full keyboard/focus-traversal) — the
  underlying `createSelectStore` already supports multi-select and search; only the two adapters'
  own reduced implementation scope is the limiter.
- Android emulator pass — repeat the simulator verification on `~/Library/Android/sdk`'s emulator;
  RN `Modal`'s Android-specific quirks (historical transparency/keyboard-avoidance issues) make
  this a real risk area for the Select approach decision above, not a formality.
- Extrapolated full-catalog migration-cost estimate for RN (mirroring the Lit spike's own
  "rough order-of-magnitude, not a committed plan" framing) — needs its own scoping pass, same as
  that ticket's equivalent section states for itself.
- `GdTypography`'s missing `accessibilityRole`/semantic-heading equivalent — RN has no `as` prop
  to port, but `accessibilityRole="header"` (or similar) for heading variants is a real,
  addressable a11y gap this spike didn't close.
