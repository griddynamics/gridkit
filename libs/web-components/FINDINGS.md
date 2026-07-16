# CTORNDSD-581 Findings — Lit Components as a Wrapper for GridKit

**Status:** Spike complete — 5/5 atoms ported, all named validations executed with real
browser-level reproductions (not assumed). See `plans/ctorndsd-581-lit-webcomponents-spike.md`
for the original scope and Acceptance Criteria this document answers against. A subsequent
visual-fidelity pass (Section 9) found and fixed a systemic root cause in `gd-design-core`'s
resolver defaults, plus per-atom structural CSS gaps — verified against real Storybook stories.

## Overall Verdict: **GO** (conditional — see Conditions below)

Shadow DOM concretely prevents the CTORNDSD-286 style-collision failure mode, bundle size is
dramatically smaller per atom, SSR/Declarative Shadow DOM works including true DOM-reuse
hydration, and the two riskiest small-atom concerns (Input cursor-jump, Select's
native-platform-replacement bet) both resolved favorably under real, adversarial browser
testing. The two structural costs — Typography's discoverability gap and the one-time `lit`
runtime weight for React-only consumers — are real and worth naming as conditions, not
blockers.

---

## 1. CTORNDSD-286 reproduction — **CONFIRMED: Shadow DOM prevents the collision**

Harness: `harness/ctorndsd-286-repro.html` / `.tsx`. Loaded in a real Chromium instance (not a
unit test) via `chrome-devtools-mcp`. Screenshot: `screenshots/ctorndsd-286-repro.png`.

Setup: a host-app-style global Emotion reset (simulating a Next.js app / a second
Emotion-based library such as Material UI's `CssBaseline`) is injected via `<Global>`,
alongside a **second, independent Emotion instance** (`createCache({ key: 'second-emotion-instance' })`)
rendering a plain React+Emotion button — approximating the original bug's Next.js + MUI
scenario. `gd-button` and `gd-checkbox` render alongside, outside any Emotion provider.

Empirical result (`console.log` verdict object from the running page):

```json
{
  "pass": true,
  "Global reset broke the plain Emotion button (2nd instance) — expect true, reproduces CTORNDSD-286": true,
  "Global reset leaked INTO gd-button Shadow DOM — expect false": false,
  "Global reset leaked INTO gd-checkbox Shadow DOM — expect false": false,
  "Lit's own styles leaked OUT to the page — expect false": false
}
```

The control condition (global reset visibly destroying the plain-Emotion button — red
background, dashed border, oversized text) confirms the reset is real and that a second
Emotion cache provides **zero** isolation, i.e. the bug reproduces exactly as CTORNDSD-286
described. `gd-button` and `gd-checkbox` were completely unaffected in both directions. This
is the primary go/no-go signal from the plan's Acceptance Criteria, and it is unambiguous.

## 2. SSR / Declarative Shadow DOM (DSD) — **PASS, including real hydration reuse**

Tooling: `@lit-labs/ssr` (added as a devDependency of this package only), driven via
`scripts/run-ssr-dsd-check.mjs` (loads `scripts/ssr-dsd-render.ts` through Vite's
`ssrLoadModule` so `gd-design-core` resolves identically to real dev/build).

- **No-JS static check** (`harness/ssr-dsd-static.html`, served via a plain static file
  server with zero `<script>` tags — confirmed 0 scripts on the page): both `gd-button` and
  `gd-typography` arrive with populated, correctly styled shadow roots purely from the
  browser's native Declarative Shadow DOM parsing. No JavaScript executed at all.
- **Hydration check** (`harness/ssr-dsd-hydrated.html` + `ssr-dsd-hydrate-check.ts`, same SSR
  markup but Lit's client JS loads afterward): result —

  ```json
  {
    "buttonHasShadowRoot": true,
    "typographyHasShadowRoot": true,
    "domNodeReusedAcrossHydration": true,
    "dataMarkerSurvived": true,
    "interactivityWorksAfterHydration": true
  }
  ```

  Lit did not discard and re-create the server-rendered shadow content — `domNodeReusedAcrossHydration: true`
  means the exact same `<button>` DOM node survived hydration (verified via a `data-`
  attribute marker written pre-hydration), and it remained fully interactive afterward.

This directly answers the plan's Acceptance Criteria SSR/DSD condition: it passes on this
environment's evergreen Chromium, consistent with DSD's Baseline "Newly available" status
(Chrome/Edge 111+, Firefox 123+, Safari 16.4+, confirmed August 2024). **Open question
carried forward** (see below): this repo's actual minimum browser-support matrix for GridKit's
real consuming apps is still not confirmed — see Open Questions.

## 3. Bundle size — **PASS, dramatically smaller per atom, with one honest caveat**

Script: `scripts/measure-bundle-size.mjs` (`npm run measure:web-components-size`).
Both sides measured the same way: gzip, per-export/per-chunk, shared runtime externalized.

| Atom       | Lit (gzip) | React+Emotion (gzip) | Ratio |
| ---------- | ---------: | -------------------: | ----: |
| Button     |    1.87 kB |             19.07 kB | 10.4x |
| Checkbox   |    1.63 kB |             24.99 kB | 15.4x |
| Typography |    0.88 kB |             18.09 kB | 20.6x |
| Input      |    1.83 kB |             18.99 kB | 10.4x |
| Select     |    2.44 kB |             30.09 kB | 12.0x |

- Shared Lit chunk helpers (barrel + decorator metadata, paid once): **0.51 kB**
- 5-atom total, Lit (excl. `lit` runtime): **9.11 kB**
- 5-atom total, React+Emotion (per-export, not de-duplicated): **113.18 kB**

(Figures above are post visual-fidelity-fix — see the new section below — the extra
markup/CSS for label/helperText, focus rings, the spinner, and the SVG chevron added
roughly 1 kB total across the 5 atoms versus the first pass; still dramatically smaller. Button
grew again in Section 13 (+0.65 kB, ratio 16.0x → 10.4x) when it switched to importing the real
`button.ts` directly instead of a hand-mirrored copy — see Section 13 for why this isn't an
`@emotion/react` bundle-size regression despite the transitive import risk that was flagged and
then measured; Checkbox/Input/Select's small shifts are Rollup shared-chunk redistribution, not
real changes to those components.)

**Honest caveat, not hidden:** the React figures above already include `libs/ui`'s shared
Emotion/theme baseline (~17–19 kB per export) that an existing React+Emotion consumer app has
already paid once, amortized across every component it uses. The Lit side's equivalent
one-time cost is the `lit` runtime itself — measured directly against this repo's installed
`lit@^3.2.1` via a minified+gzipped esbuild bundle of `LitElement`/`html`/`css`/decorators/`styleMap`:
**6.88 kB**, which most React-only consumer apps have **not** already paid. Even counting that
cost once: 5-atom total with `lit` runtime included is **16.38 kB**, still ~6.9x smaller than
the React+Emotion total (113.18 kB, itself not de-duplicated across atoms either). Net: bundle
size is not a blocker under any reasonable framing of the comparison, but the `lit` runtime
line item is the honest "cost of entry" a React-only app pays that this table alone doesn't
show unless read alongside it.

## 4. Named sub-finding: Input cursor-jump — **MITIGATED, verified adversarially**

Repro: `harness/remaining-findings-repro.tsx`, probe B, driven via `evaluate_script` (real DOM
`InputEvent` dispatch at ~60ms/keystroke cadence, not `fill()`, so the actual `_onInput`/
`updated()` guard code path in `gd-input.ts` is exercised) alongside a React state round-trip
with an artificial **300ms async lag** on every keystroke (simulating a server-echo/validation
response landing late — the realistic trigger for this class of bug).

Typed `"Hello World"` (11 keystrokes, 11 external round-trip writes confirmed via the
on-page counter) while the input stayed focused throughout:

```json
{
  "valueRightAfterTyping": "Hello World",
  "cursorRightAfterTyping": 11,
  "valueAfterRoundTripsSettled": "Hello World",
  "cursorAfterRoundTripsSettled": 11,
  "stillFocused": true
}
```

The cursor never moved from position 11 despite 11 stale external writes landing mid-typing —
the activeElement guard in `gd-input.ts` (`updated()` skips writing `this.value` into the live
DOM input while it has focus) correctly dropped every one of them. **Trade-off to record
explicitly:** an external `value` update that arrives while the user is actively typing is
silently dropped until blur, rather than applied. That is the deliberate, documented choice
this port makes instead of letting the cursor jump — call this out to consumers, don't leave
it implicit.

## 5. Named sub-finding: Typography discoverability gap — **CONFIRMED, structural**

Repro: `harness/remaining-findings-repro.tsx`, probe A. The page was constructed to contain
**no real light-DOM `<h1>` anywhere** except the one Lit renders internally
(`<gd-typography as="h1" variant="h1">...`), so `document.querySelector('h1')` can only
succeed by piercing Shadow DOM (it cannot).

```json
{ "queryHFound": false }
```

Confirmed empirically, not just theorized: `document.querySelector('h1')` returns nothing.
Any code that looks for a real `<h1>` by light-DOM tag name — a host app, a browser extension,
older assistive tech, or a testing-library selector shortcut — will not find GridKit's heading
the way it would find a real one. Evergreen browsers do correctly flatten shadow content into
the **accessibility tree** (screen readers see a real heading), so this is specifically a
DOM-query-by-tag-name gap, not an a11y regression — but it is real and structural, not
cosmetic, matching CTORNDSD-590's independent React Native finding for the same component
(RN's `Text` has no tag concept at all either).

## 6. Named sub-finding: Select `popover` viability — **CONFIRMED, with a mode nuance discovered mid-spike**

Repro: `harness/remaining-findings-repro.tsx`, probe C, driven with **real, CDP-dispatched
trusted clicks/keypresses** via `chrome-devtools-mcp` (not `evaluate_script`'s synthetic
`.click()` — see below for why that distinction mattered).

- Open / list / select / auto-close-on-select: confirmed working (`gd-select` opens, lists 3
  items, selecting "Beta" updates the trigger label, fires `gd-change` with the correct
  payload, and closes) — this worked in both `popover="manual"` and `popover="auto"` modes,
  since selection closes via an explicit `hidePopover()` call, not dismiss.
- **First attempt used `popover="manual"`, matching the plan's Migration Example** — and it
  does **not** get native light-dismiss at all; a real, trusted outside click left the dropdown
  open indefinitely. This is a real gap in the plan's original code sample, caught by actually
  running it rather than trusting the sample.
- **Fix, empirically re-verified: switching to `popover="auto"`** (with the existing `toggle`
  event listener syncing the native dismiss back into `createSelectStore`'s `close()`) gives
  correct native light-dismiss for both a real outside click and a real `Escape` key press,
  confirmed via CDP-dispatched (trusted) events:

  ```json
  { "isOpenAfterRealOutsideClick": false, "ariaExpanded": "false" }
  { "isOpenAfterEscape": false, "ariaExpanded": "false" }
  ```

- **Testing-methodology finding, worth recording for future spikes:** a JS-dispatched
  `element.click()` (untrusted, `isTrusted: false`) does **not** trigger the browser's native
  popover light-dismiss algorithm at all — only genuinely trusted user input does. The first
  round of this exact test, run via `evaluate_script`'s synthetic click, falsely suggested
  light-dismiss was broken even after switching to `auto`; only re-running with
  `chrome-devtools-mcp`'s real CDP click surfaced the correct result. Any future browser-level
  spike testing popover/light-dismiss behavior must drive it with trusted input, not synthetic
  DOM events.

Net: the `popover` attribute genuinely replaces the React original's hand-rolled Portal +
`document.addEventListener` outside-click logic, **provided it's declared `popover="auto"`**,
which is now the corrected implementation in `gd-select.ts`.

## 7. React 19 vs. `@lit/react` event-mapping scope — **documented, not independently re-tested under React 19**

This repository's installed React version is `18.3.1` (root `package.json`); this spike did
not stand up a separate React 19 environment to independently re-verify the
customelements-everywhere.com property/attribute-assignment claim. The distinction from the
plan's Migration Example stands as **documented guidance, not an empirically re-confirmed
result in this environment**: React 19's native heuristic is scoped to
property/attribute _assignment_ (passing objects/arrays/primitives into a custom element),
and does **not** extend to custom **event** dispatch — every custom event this spike emits
(`gd-change`, `gd-input`) is wired through `@lit/react`'s `createComponent({ events: {...} })`
in every harness file (`GdCheckboxReact.tsx`, `GdInputReact.tsx`, `GdSelectReact.tsx`),
confirmed working end-to-end against React 18 throughout every repro above. Flag re-verifying
directly against React 19 as explicit follow-on work if a "go" decision proceeds.

## 8. Incidental findings (not named in the original plan, surfaced during porting)

- **Boolean-attribute controlled/uncontrolled constraint (`gd-checkbox.ts`):** `checked` must
  be declared `attribute: false` to preserve the store's `checked !== undefined` controlled
  check — a real HTML boolean attribute can only be present/absent (true/false), never
  "unset." Consequence: the controlled/uncontrolled distinction is only reachable via the JS
  property (`el.checked = true`), never via markup (`<gd-checkbox checked>`). Worth
  generalizing: any atom with a nullable/optional boolean prop hits this same constraint.
- **`createCheckboxStore` collapses React's controlled/uncontrolled branch into one path** —
  confirmed while porting, matching the plan's prediction: there is no `isControlled` branch
  to write in the Lit version; a "controlled" consumer just listens for `gd-change` and writes
  `.checked` back. Record this as a real simplification gd-design-core's shared-core
  architecture buys, not just a migration cost.
- **`gd-design-core`'s resolver default fallback values were placeholder guesses, not real
  GridKit tokens — since fixed, see the Visual Fidelity Verification section below.** What
  started as one reported black-on-black Button bug (both `colors.text.black` and
  `colors.bg.fill.primary` defaulting to `#000000`) turned out to be systemic across every
  resolver in `gd-design-core`, affecting every adapter (this spike and the RN sibling) that
  renders without an explicit theme.

## 9. Visual Fidelity Verification — root cause found and fixed across all 5 atoms

Triggered by user report: a themeless `gd-input` looked visibly different from Storybook's
`atoms-input--primary-default-with-label-and-helper-text` story. Investigation (direct reads
of `libs/ui/src/tokens/{colors,font,radius,spacing,values,shadow,input,checkbox,button,select,typography}.ts`)
found the gap was not Input-specific — it was systemic across `gd-design-core`.

**Root cause:** every resolver in `libs/design-core/src/tokenResolvers/*.ts` had `get(theme,
path, DEFAULT)` fallback values that were placeholder guesses, not real transcriptions of
GridKit's tokens. Concretely: `resolveButtonVariantStyle`'s primary background defaulted to
`#000000` instead of the real brand color `#FFB800`; several border-width/radius defaults were
bare numbers (`1`) instead of the real unit-bearing strings (`'1px'`) the Lit templates then
double-suffixed to `"1pxpx"` the moment a real theme was supplied; `resolveTypographyStyle`'s
`fontSize`/`lineHeight` had **no** fallback at all (`undefined`), so a themeless `gd-typography`
rendered with almost no explicit typography; and Input/Select's per-variant border-color
fallback collapsed to one flat gray regardless of the selected `color` prop, instead of the
real per-variant color.

**Fix, two layers:**

1. **`gd-design-core` resolver defaults corrected** (`libs/design-core/src/tokenResolvers/{button,checkbox,input,select,typography}.ts`)
   to exact, unit-consistent values read directly from the real token files — colors, font
   sizes/weights, radius, spacing, border widths, and (new) Select's `boxShadow` and
   Typography's `marginTop`/`marginBottom` fields. Also fixed a monospace-font path bug
   (`get(theme, 'font.family.code', ...)` dot-split into a broken 3-level path; the real key
   is a flat `'family.code'` property — fixed via array-form path segments) and a
   `styleVariant` fallback bug (`semibold`/`light`/`bold` fell back to whatever weight was
   already resolved, not the real hardcoded weight). Existing resolver spec tests that
   asserted the old wrong defaults as expected behavior were updated to the corrected values;
   9 new test cases added covering the themeless-default path specifically (71 tests total,
   all passing).
2. **Lit component structural/CSS fixes** for gaps no resolver value alone could fix:
   - `gd-input.ts` (the reported gap): added `label`/`helperText` rendering (matching the
     real component's structure/typography), moved the visible border onto an
     absolutely-positioned sibling span with **square corners** (was incorrectly rounded),
     added a `:focus-visible` outline-ring sibling, set input height to `40px`.
   - `gd-button.ts`: removed a hardcoded `border-radius: 4px` (the real default is square,
     `rounded="none"`), added a real `:focus-visible` ring (the original had no keyboard-focus
     treatment at all, only JS-driven mouse hover), added a spinner for `isLoading` (previously
     no visual change at all beyond `aria-busy`), wired the `outlined` variant's border (was
     computed by the resolver but never actually rendered).
   - `gd-checkbox.ts`: added `opacity: 0.5` dimming on the disabled wrapper (previously only
     changed cursor).
   - `gd-typography.ts`: applied the newly-resolved heading margins for h1–h6.
   - `gd-select.ts`: replaced the unicode ▲/▼ glyph-swap with a rotating inline SVG chevron,
     removed rounded corners on the trigger/dropdown (real default is square), added the real
     dropdown `box-shadow`, added explicit option padding, removed a built-in "No options"
     fallback text (the real component treats `emptyItemsResult` as 100% consumer content).

**Verification:** ran Storybook and the Lit dev server side by side, screenshotted the real
stories (`atoms-input--primary-default-with-label-and-helper-text`, `atoms-button--default`,
`atoms-checkbox--default`, `atoms-typography--heading`, `atoms-select--default`) against a new
harness (`harness/fidelity-check.tsx`) rendering the same 5 atoms with **no explicit theme**
(relying entirely on the corrected resolver defaults), via `chrome-devtools-mcp`. Confirmed
visually: Button renders the correct golden `#FFB800` background with black bold text and a
visible focus ring; Checkbox's checked state renders the same gold fill with a white check
icon; Input shows the label above / helper text below with a thin square-cornered border,
matching the reported story almost exactly; Typography renders the correct descending
h1–h6 scale; Select's trigger and open dropdown both show square corners, the rotating
chevron, the real drop shadow, and the pale-amber (`#FFF7E5`) hover/selected highlight matching
the real dropdown pixel-for-pixel. Screenshots: `screenshots/fidelity-check-after-fix.png`.

**Vocabulary mismatch — since fixed:** `gd-design-core`'s `InputColorVariantName` originally
read `default | success | primary | error`, which did not line up 1:1 with the real
`InputColorVariant` (`primary | success | warning | error`, confirmed in
`libs/ui/src/types/input.ts`) — the old `default` corresponded to the real `primary` (both
resolve to `colors.border.default`), and the old `primary` corresponded to the real `warning`
(both resolve to `colors.border.primary`, the golden brand color). Values were always correct;
only the enum member names were offset from the real component's vocabulary. Fixed by renaming
`InputColorVariantName`'s members to exactly match `InputColorVariant` (`libs/design-core/src/tokenResolvers/{input,select}.ts`,
consuming `gd-input.ts`/`gd-select.ts`, and the `fidelity-check.tsx` harness, which now passes
`color="primary"` directly instead of a translated `color="default"`). A follow-up
cross-component audit (below) found further, different-shaped gaps in the other 4 atoms —
not naming drift, but values that bypassed the shared theme entirely.

## 10. Cross-component shared-token audit — hardcoded values that bypassed the theme

Prompted by a direct question ("why checkbox not used shared tokens") and then generalized
into a full pass over all 5 Lit components, checking every render-time style value against
whether it flows through `gd-design-core`'s resolver + the live `theme` property, or is a
local literal that silently ignores a consumer's theme override. Found 4 real instances, all
fixed; Typography had none (every style value already flowed through `resolveTypographyStyle`).

- **Checkbox — label typography "fix" below was itself wrong, and has been reverted.** Originally
  recorded here: `resolveCheckboxStyle` didn't resolve `font.family`/`font.size.small`/
  `font.line.height.small` for the label, so `labelFontFamily`/`labelFontSize`/`labelLineHeight`
  were added, sourced from `libs/ui/src/tokens/checkbox.ts`'s `label` block. **That block is
  never actually consumed by the real component** — `Checkbox.tsx`'s label is a bare
  `{children && <span data-testid="...">{children}</span>}` with no `css`/`style` prop at all;
  the token file defines a shape nothing reads. Caught by measuring the real Storybook
  Checkbox's label directly: `fontSize: 16px, lineHeight: 24px` (the ambient body/`p`-scale
  context it inherits from) — not `14px`/`20px` (the `small` scale the reverted fix assumed).
  Reverted: removed `labelColor`/`labelFontFamily`/`labelFontSize`/`labelLineHeight` from
  `ResolvedCheckboxStyle` entirely, and `gd-checkbox.ts`'s label span is now bare
  (`<span><slot></slot></span>`, no style at all) — matching the real component's actual
  reliance on pure ambient CSS inheritance, which crosses the Shadow DOM boundary the same way
  as any other DOM inheritance for inherited properties like `color`/`font-family`/`font-size`.
  **Lesson recorded directly in the resolver's doc comment:** verify a token is actually
  consumed by the component's `.tsx`/`Styled.tsx` before mirroring it — a token FILE defining a
  shape doesn't mean any component reads it.
- **Button — `rounded` radius resolved from a local hardcoded map, never the theme.**
  `gd-button.ts` had its own `RADIUS` lookup table, read only by `this.rounded` — `this.theme`
  was never consulted, unlike the real `ButtonStyled.tsx`'s
  `get(rest, ['radius', $rounded], '0px')`. A consumer's theme override of `radius.lg` (etc.)
  would be silently ignored, and the map lived only in the Lit adapter (React Native's port
  would have had to re-hardcode its own copy). Fixed: added a shared `resolveButtonRadius(theme,
rounded)` to `libs/design-core/src/tokenResolvers/button.ts` that reads `theme.radius` first
  and falls back to the real per-scale values (an improvement over the real component's
  scale-unaware `'0px'`-only fallback); `gd-button.ts` now calls it instead of a local map.
- **Input — label color hardcoded to `'#000000'`, helper-text color map never read the theme.**
  `gd-input.ts`'s `labelStyle` was a literal `{ color: '#000000' }`, and its module-level
  `HELPER_TEXT_COLOR` map (correct values, confirmed against `colors.text.*`) was a static
  object, never a function of `this.theme`. Both happened to match the default theme's output
  but would ignore any `colors.text.*` override. Fixed: added `labelColor` and
  `helperTextColor` to `ResolvedInputStyle` (`libs/design-core/src/tokenResolvers/input.ts`,
  reading `colors.text.default` / the real per-variant `colors.text.*` path respectively),
  removed the local map and literal from `gd-input.ts`.
- **Select — trigger/dropdown padding hardcoded (`'8px'`/`'0'`), ignoring `spacing.sm`/`spacing.none`.**
  Unlike Select's border-radius (legitimately always `0px` — the real `select.ts` token file
  has no radius reference at all, so there's nothing to bypass), padding IS theme-driven in the
  real component (`button.default.padding`/`dropdown.padding` both call `get(theme, 'spacing.*', ...)`).
  Fixed: added `triggerPadding`/`dropdownPadding` to `ResolvedSelectStyle`
  (`libs/design-core/src/tokenResolvers/select.ts`), wired into `gd-select.ts`.
- **Select — no `width`/`minWidth`/`maxWidth` props at all, so an empty trigger collapsed to
  icon-only width and clipped dropdown option text.** Reported directly (a screenshot showed
  "Alph"/"Gam" cut off mid-word). The real `Select.tsx` defaults `width: '100%'` and applies it
  to its single outermost styled element; `gd-select.ts` had no equivalent, so with no selected
  value and no `placeholder` slot content, `:host` (unset width, `inline-block`) shrank to its
  intrinsic content (just the chevron), and `_positionDropdown()` copies the trigger's rendered
  width onto the dropdown 1:1, clipping option text that didn't fit. Fixed: added `width`
  (default `'100%'`) / `minWidth` / `maxWidth` properties, applied directly to the host's own
  inline style in `willUpdate` (needed because a percentage width on a shadow-DOM child only
  resolves against a _definite_ containing-block width, and `:host` itself was `auto`), and
  threaded `maxWidth`/`minWidth` into `_positionDropdown()` too. Verified live via
  `chrome-devtools-mcp`: dropdown width went from a collapsed ~90px to the full container width,
  and `scrollWidth === clientWidth` for every option (no clipping).
- **Button — a variant's hover/active/disabled color change, computed correctly by the shared
  resolver, never reached the visible text.** The real `ButtonStyled.tsx` sets `color` once on
  the `<button>` itself; its content span sets no `color` of its own, so it inherits — a single
  cascade point. `gd-button.ts`'s content `<span>` sets its own explicit `color` from a separate,
  base-variant-only `resolved.label` object instead of inheriting, so `resolved.container`'s
  correctly-computed `containerHover`/`containerActive`/`containerDisabled` color overrides
  (e.g. Secondary's hover text turning black) updated the invisible `<button>` element but never
  the span actually rendering the text. Separately, `containerDisabled` had no `color` override
  at all for any variant, missing `button.default`'s universal `'&:disabled, &:disabled *'` rule
  that mutes text to `colors.text.disabled` on top of each variant's own background/border
  change. Fixed: added `color: textDisabled` to every variant's `containerDisabled`
  (`libs/design-core/src/tokenResolvers/button.ts`); `gd-button.ts`'s label span now reuses the
  same merged `containerStyle.color` instead of the stale `resolved.label.color`. Verified live:
  a disabled Primary button's text now measures `rgb(163, 163, 163)` (`#A3A3A3`, real
  `colors.text.disabled`) instead of staying black.
- **Select — dropdown rendered with a heavy black border, from the native `popover` UA
  stylesheet, not a token.** Reported directly (a screenshot showed a thick black rectangle
  around "Alpha/Beta/Gamma"). Not a `gd-design-core` value mismatch — Chromium's default
  `[popover]` UA stylesheet applies its own `border: solid` (resolves to black via
  `currentColor`) to any popover element, and `.dropdown`'s CSS never reset it, so the browser
  default won over the real component's actual look (`boxShadow` only, no border at all, per
  `select.ts`'s `dropdown` token block). Fixed: added `border: none;` to `.dropdown` in
  `gd-select.ts`. Verified live: computed `border` is now `0px none`, leaving only the correct
  `boxShadow`.
- **Button — content font-weight/font-family/font-size didn't match the real component at all,
  outside a context that happened to already provide Fira Sans.** Reported directly. Root
  cause: `resolveButtonVariantStyle` never resolved `font.family`/`font.size.p` at all (only
  `label.fontWeight`), and `gd-button.ts`'s `<button>` only had a static `font-family: inherit`
  — no font-size reset. In the harness's plain-`sans-serif`-body context, a native `<button>`'s
  own Chromium UA-default form-control font (`13.3333px`) leaked straight through, since
  `font-family: inherit` resets family but not size. Measured directly against Storybook's real
  Button: real span `{fontWeight:500, fontFamily:'"Fira Sans", sans-serif', fontSize:'16px'}` vs
  the unfixed Lit span `{fontWeight:500 (already OK), fontFamily:'sans-serif', fontSize:'13.3333px'}`
  — every OTHER component (Input/Select/Typography/Checkbox) already resolves `font.family`
  explicitly from theme; Button was the only one relying on ambient CSS inheritance instead.
  Also found while comparing DOM structure: the real `ContentStyled` span is
  `display:flex; justify-content:center; align-items:center; width:100%` (`button.content.default`),
  while the Lit span was a bare, unstyled `block` span. Fixed: added `fontFamily`/`fontSize` to
  `ResolvedButtonStyle` (`libs/design-core/src/tokenResolvers/button.ts`, sourced from the SAME
  `font.family`/`font.size.p` tokens Input/Select/Typography already share), applied them plus
  `fontWeight` directly to the `<button>` (removing the now-redundant static
  `font-family: inherit`), and gave the label span `button.content.default`'s layout. Verified
  live: all 5 button instances now measure `fontWeight:500, fontFamily:'"Fira Sans", sans-serif',
fontSize:'16px'`, matching Storybook's real Button exactly.
- **Input — label/helperText spans had no explicit `fontFamily`, unlike the `<input>` element
  right next to them.** Same root cause as Button's, found while re-checking for the same
  pattern: `.label`/`.helper` relied on a static `font-family: inherit` CSS rule, while
  `resolveInputStyle`'s `fontFamily` was already applied inline to the `<input>` itself — an
  internal inconsistency where the label/helper text could silently render in a different font
  than the input box beside it, in any context without an ambient Fira Sans reset. Fixed:
  reused the SAME already-computed `resolved.fontFamily` for both `labelStyle`/`helperStyle` in
  `gd-input.ts` (no `gd-design-core` change needed — the value already existed), removed the
  now-redundant `.label, .helper { font-family: inherit }` rule. Verified live: label, helper,
  and input all measure `"Fira Sans", sans-serif`.

**Follow-up: the Button fix above was reported as "still not corresponding" after landing —
root cause was the test harness, not the code.** `harness/fidelity-check.html` never loaded the
actual Fira Sans font file (no `@font-face`/Google Fonts import at all), unlike Storybook (which
imports `gd-design-library/styles.css`, confirmed via `document.fonts` showing `Fira Sans 500
loaded` there vs. zero registered fonts in the harness). So `font-family: "Fira Sans", sans-serif`
silently fell back to the OS's generic sans-serif substitute — CSS values were byte-for-byte
identical to Storybook's (verified via `getComputedStyle` both before and after), but the
_glyphs_ rendered differently since the actual font file was never fetched. Fixed: added the same
Fira Sans/Fira Code Google Fonts `<link>` tags from `styles.css` to `fidelity-check.html`.
Re-verified via `document.fonts` (now shows `Fira Sans 400`/`500 loaded`) and a fresh screenshot —
Button text now visibly renders at true medium weight.

**Prompted by the same report, re-audited Select and Typography against their real component
`.tsx` source (not just their token files) — both confirmed already correct, no changes needed:**

- **Select's trigger** measured directly against Storybook: `fontWeight: 400, fontSize: 16px,
padding: 8px, border: 1px solid #E5E5E5` — matches `resolveSelectStyle`'s existing
  `font.weight.normal`/`font.size.p`/`spacing.sm`/default-variant-border resolution exactly. (The
  real `DropdownButtonStyled` renders through GridKit's own `<Button>` internally, which raised a
  concern that Button's `font.weight.medium` might bleed through — it doesn't, because
  `DropdownButtonStyled` never forwards a `theme` prop to that inner `<Button>`, so its own
  variant/weight styling never activates; only `select.ts`'s own `button.default`/`button.<color>`
  CSS — which has no fontWeight of its own — actually applies.)
- **Typography**'s `TypographyStyled.tsx` confirmed to genuinely consume `typography.base`/
  `typography.<variant>`/`typography.<variant>.<size>`/`typography.styleVariant.<name>` exactly as
  `resolveTypographyStyle` mirrors, and to leave `color` unresolved when no `color` prop is
  passed (same as `gd-typography.ts`) — no drift found.

## 11. Full audit — every remaining static-CSS value that corresponds to a real shared token

Prompted directly: "make sure for all components ... use only shared common tokens from
`libs/ui/src/tokens` ... any static styles should be present only [if] shared + it should be
able to support theme switching." Went through every `static styles = css\`...\``block in all
5 components line by line, cross-referencing each hardcoded value against the real component's`.tsx`/`Styled.tsx`(not just its token file — see Section 10's Checkbox-label lesson) to
classify it as either genuinely non-token structural CSS (`display`,`position`,`cursor`mechanics with no theme analog) or a real token value that was baked into the shared adopted
stylesheet instead of resolved per-render from`theme`. Fixed every instance of the latter,
verified live via`chrome-devtools-mcp` including a direct theme-swap test (see below).

- **Button** — `gap: 8px` (`button.default.gap`, `spacing.sm`) and `padding: 8px 16px`
  (`` `${spacing.sm} ${spacing.md}` ``) were static. Added `gap`/`padding` to
  `ResolvedButtonStyle`, applied inline; removed both from `static styles`.
- **Checkbox** — `label { gap: 8px }` (`wrapper.default.gap`, `spacing.sm`) was static. Added
  `wrapperGap` to `ResolvedCheckboxStyle`, applied inline via a new `wrapperStyle`. Also found
  and fixed a plain value bug while in the same block: `label[data-disabled]` used
  `cursor: not-allowed`; the real `wrapper.disabled.cursor` is `'default'`.
- **Input** — five static values corresponded to real tokens: `.outer { gap: 4px }`
  (`wrapper.withGap.gap`, `spacing.xs`), `.label`/`.helper`'s `font-size`/`line-height` (real
  `InputHelper` `md`/`sm` size blocks — `font.size.small`/`font.line.height.small` and
  `font.size.caption`/`font.line.height.caption`), `input { z-index: 1 }`
  (`input.default['&:not(...)'].zIndex`, `zIndex.first`), `input { padding: 0 8px }`'s
  horizontal value (`input.default.padding`, `spacing.sm`), and `.border`/`.outline`'s
  `border-radius: 0` (`defaultInteraction['& + .Input__border'].borderRadius`, `radius.none`).
  Added `wrapperGap`/`labelFontSize`/`labelLineHeight`/`helperFontSize`/`helperLineHeight`/
  `zIndex`/`horizontalPadding`/`borderRadius` to `ResolvedInputStyle`; all now applied inline.
- **Select** — `.dropdown { margin: 0 }` (`dropdown.margin`, `spacing.none` — same token as the
  already-shared `dropdownPadding`, so reused that field for both) was static. Also found two
  plain value bugs in the same pass: `.trigger:disabled` used `cursor: not-allowed` (the real
  trigger, built on the real `<Button>`, gets `cursor: 'default'` from `button.default`'s
  universal disabled rule); `.option[aria-selected='true']` used an invented `font-weight: 600`
  with **no real token backing it at all** — the real `item.default`'s `'&:hover, &.active'`
  rule gives the selected option the _same background_ as hover (`bg.fill.hover`), not bold
  text. Replaced the bold with a shared selector reusing the already-theme-reactive
  `--gd-select-hover-bg` custom property.
- **Typography** — no static token values found; already fully inline/theme-reactive.

**Confirmed genuinely non-token (left as static CSS, correctly):** `display`/`position`/
`cursor`/`box-sizing` mechanics throughout; Button's/Checkbox's/Input's `:focus-visible` ring
`outline-width`/`outline-offset` literals (the real component's own `getFocusStyles` helper
hardcodes these same literals — not resolved from a token in the real component either);
Select's `.option { padding: 8px }` (the real `item.default.padding` is `getSpacing(2)`, a
module-load-time computation from the static `spacing` import, not `theme.spacing` — the real
component's own dropdown-item padding does **not** support theme switching, so a hardcoded
static value here is faithful, not a gap); Select's `.trigger { gap: 8px }` (no real
`select.button` token has a `gap` at all — the real spacing comes from `justify-content:
space-between`, already present, which makes any `gap` value inert with exactly 2 flex
children; harmless, not a bug).

**Verified theme-switching works end-to-end, not just that the resolver takes a theme
argument:** live in a running `gd-button`, set `el.theme = { spacing: { sm: '30px', md: '16px' } }`
after initial render — computed `gap` changed from `8px` to `30px` on the next render with no
other code path involved, confirming the full chain (property → `resolveButtonVariantStyle` →
inline `styleMap`) was genuinely reactive, not just correctly defaulted once. (`gd-button.ts`
no longer uses `styleMap`/inline styles at all as of Section 12 — the same reactivity claim now
applies to its per-instance Constructable StyleSheet instead; re-verified there.)

## 12. `gd-button.ts` rewrite — zero inline styles, real CSS pseudo-classes, per-instance Constructable StyleSheet

Requested directly, framed as a staff-architect rework with explicit acceptance criteria: no
inline styles, only tokens traceable to `libs/ui/src/tokens/button.ts`, and the same prop
surface as the real `Button.tsx`. "No inline styles" has more than one valid mechanism for a
Shadow DOM component (CSS custom properties set via `element.style`, a per-instance
Constructable Stylesheet, or fully static baked CSS with no runtime theme override) — asked and
confirmed **per-instance Constructable StyleSheet** as the mechanism, since it's the only option
that satisfies "no use of the `style` property at all" literally while still supporting live
theme-switching.

**Architecture:**

- `gd-button.ts` no longer uses Lit's `styleMap` directive or the `style="..."` attribute
  anywhere. A dedicated `CSSStyleSheet` instance is appended to `shadowRoot.adoptedStyleSheets`
  once in `connectedCallback`; `render()` builds a real CSS text string from
  `resolveButtonVariantStyle`/`resolveButtonRadius`'s output (concrete values interpolated
  directly into CSS rules, no `var(--...)` indirection) and swaps it in via
  `this._dynamicSheet.replaceSync(cssText)` — guarded by a string-equality check against the
  last-applied text so an unrelated re-render doesn't force a stylesheet reparse.
- The previous JS-tracked `@state private _hovered`/`_pressed` flags and their
  `mouseenter`/`mouseleave`/`mousedown`/`mouseup` listeners are gone entirely, replaced by real
  `button:hover`/`button:active`/`button:disabled` CSS pseudo-class selectors in the generated
  text — the browser's own style engine now owns interaction-state matching, the same way the
  real `ButtonStyled.tsx`'s Emotion-authored `&:hover`/`&:active`/`&:disabled` rules do, instead
  of a hand-rolled JS approximation of what native CSS already does.
- **Fixed the focus-ring approximation as part of the rewrite:** the previous port used
  `outline: 2px solid; outline-offset: 4px` as a stand-in. The real mechanism
  (`getFocusStyles` in `libs/ui/src/tokens/utils.ts`) is a `::after` pseudo-element positioned
  with `inset: -4px` and a real `border` — now matched exactly, including reusing the button's
  own resolved `border-radius` on the ring.
- Truly static, non-token structural CSS (`:host { display }`, `button { cursor, display }`,
  the loading-spinner keyframes) stays in Lit's ordinary shared `static styles`, since none of
  it varies per instance or by theme — only token-driven, per-instance-varying rules go through
  the dynamic sheet.
- **Prop surface matched to `Button.tsx`:** added `isIcon`, `fullWidth`, `type`, `role`,
  `tabIndex`, `ariaLabel`, `ariaPressed`, `justifyContent` (previously only `variant`/
  `rounded`/`disabled`/`isLoading` existed). `iconStart`/`iconEnd` remain named slots
  (`icon-start`/`icon-end`, unchanged) rather than props, since Lit has no `ReactNode` analog.
  `onClick` has no property equivalent — consumers use the native `click` event, which already
  bubbles out of the shadow root unmodified. `Button.tsx`'s generic `BoxCssComponentProps` layout
  escape hatches (`margin`/`width`/`flex*`/etc.) are deliberately not reproduced as properties:
  that whole mechanism is inline-style-based in the real component
  (`convertToInlineBoxStyles`), which would violate the no-inline-style constraint here — a
  consumer can still size/position `<gd-button>` from the host page's own CSS, since Shadow DOM
  never encapsulates a host element's box-model properties.
- `ariaPressed` is typed `string | null` (ARIAMixin's real platform type — `'true' | 'false' |
'mixed' | null`), not `boolean` like the real component's React-convenience prop (JSX coerces
  booleans to attribute strings automatically; a raw DOM property can't) — declaring it as
  `boolean` collided with `HTMLElement`'s own native `ariaPressed` accessor and broke the custom
  element's type entirely (cascading into `@lit/react`'s `createComponent()` losing all prop
  types).
- Added two token fields the previous version resolved inline/ad hoc instead of sharing:
  `focusColor` (`colors.border.focus`) and `transition` (`values.transitions.button.default`) —
  both added to `resolveButtonVariantStyle` in `libs/design-core/src/tokenResolvers/button.ts`,
  same pattern as every other shared field.

**Verified live via `chrome-devtools-mcp`:**

- Zero `style` attribute on the host, the `<button>`, or the content `<span>` — confirmed via
  `hasAttribute('style')` returning `false` on all three; `shadowRoot.adoptedStyleSheets.length`
  is `2` (Lit's static sheet + the one dynamic sheet).
- Real `:hover` (trusted `hover()`): background changes to `#F29100` (primary's
  `containerHover.backgroundColor`), `button.matches(':hover')` is `true`.
- Real `:disabled`: background `#E5E5E5`, text `#A3A3A3`, `button.matches(':disabled')` is
  `true`.
- Real `:focus-visible` via trusted Tab-key keyboard navigation (not a programmatic `.focus()`
  or synthetic click, neither of which reliably triggers `:focus-visible` in Chromium): the
  `::after` ring computed to `2px solid rgb(0, 105, 180)` (`#0069B4`, real `colors.border.focus`),
  positioned correctly.
- Theme-switching still fully live: `el.theme = { spacing: { sm: '25px', md: '16px' } }` after
  initial render changed computed `gap` from `8px` to `25px` on the next paint — confirming
  `replaceSync` genuinely re-renders per theme change, not just on first mount.

**Follow-up refinement, same rework:** the initial pass above still rendered `iconStart`/
`iconEnd`/content as always-present bare `<slot>`s directly inside `<button>`, not matching
`ButtonStyled.tsx`'s actual composition (`StartIconStyled`/`ContentStyled`/`EndIconStyled`, each
a real styled `<span>`, each conditionally rendered — `{iconStart ? <StartIconStyled>... :
null}`). Asked directly to mirror the real structure/classes and the `componentStyles` array's
token-layering pattern exactly. Rewrote to match:

- Each slot is now wrapped in its own `<span class="gd-button__icon-start">` /
  `class="gd-button__content"` / `class="gd-button__icon-end">` — `gd-button__content` reuses
  the real component's own class name (confirmed used externally, e.g. `select.ts`'s
  `'.gd-button__content'` selector); the icon classes follow the same naming convention.
- Each wrapper span is only rendered when its slot actually has assigned content, tracked via
  `slotchange` (`_hasIconStart`/`_hasContent`/`_hasIconEnd`), exactly matching the real
  conditional — a `<slot>` always exists in the template (so `slotchange` keeps firing whichever
  branch is currently rendered), only the wrapping `<span>` is conditional. This closes a real,
  visible gap the previous pass had: an always-rendered empty icon slot still occupied a `gap`
  track between flex children, which the real component (which doesn't render that child at
  all when absent) never does. Verified live: appending a real element to the `icon-start` slot
  flips `_hasIconStart` to `true` and wraps it in the expected span on the very next render.
- `_buildCssText` restructured into explicitly labeled blocks matching
  `componentStyles`'s array order 1:1 — `default`+variant, then `icon` (only when `isIcon`),
  then `fullWidth` (only when set), then `{ borderRadius, focus-visible }` last — with a comment
  above each block naming which array entry it corresponds to.
- `resolved.transition` is now applied to `.gd-button__content`/`.gd-button__icon-start`/
  `.gd-button__icon-end` in addition to `button` itself — a CSS `transition` only animates an
  element's own computed-style changes, so a child span whose `color` merely inherits the
  button's animated color change needs the same `transition` declaration to animate in step.
  Verified live: `.gd-button__content`'s computed `transition` matches the button's exactly.

**Second follow-up bug, reported directly with a screenshot:** two rings appeared on keyboard
focus — the intended custom `::after` ring (`getFocusStyles`'s real mechanism) _and_ the
browser's own default `:focus-visible` outline underneath it, since nothing had ever reset it.
Fixed: added `button:focus-visible { outline: none; }` to the static, non-token CSS. Verified
live via trusted Tab-key navigation: computed `outlineStyle` is now `none`, only the `::after`
ring (`2px solid #0069B4`) remains.

**Third follow-up, requested directly:** replace the hand-flattened, ternary-heavy CSS text
builder with a direct port of `ButtonStyled.tsx`'s own `get(themeButton, path, {})` +
Emotion-compile pattern, instead of manually enumerating every property with `!== undefined`
checks. Added two new shared exports to `libs/design-core/src/tokenResolvers/button.ts`:

- **`resolveButtonTokens(theme)`** — a literal, theme-bound port of `button.ts`'s own object:
  same keys (`default`, `primary`/`secondary`/etc., `icon`, `content.default`,
  `startIcon.default`, `endIcon.default`, `fullWidth`), same nested pseudo-selector strings
  (`'&:hover, &.hover'`, `'&:disabled, &:disabled *'`, `'&:focus-visible'` nested two levels
  into `'&::after'`) — only the `(theme) => value` functions are evaluated eagerly via `get()`.
  Deliberately separate from the existing flattened `resolveButtonVariantStyle` (which stays,
  unchanged, for RN's `Pressable`/`StyleSheet` model — neither RN nor a pseudo-selector-free
  consumer can use this nested shape at all); this new shape is for CSS-text-capable web
  adapters only. `borderRadius` is deliberately absent, matching the real component's own
  choice to compose it as a separate, later, `rounded`-prop-dependent entry, not part of
  `button.ts` itself.
- **`buttonCssBlockToText(selector, block)`** — a small general-purpose serializer that compiles
  one block (or any nested slice) into real CSS text: flat keys become kebab-case declarations,
  keys containing `&` recurse as a nested rule with `&` replaced by `selector` (so
  `'&:hover, &.hover'` under `selector='button'` becomes `'button:hover, button.hover'`), and an
  empty block emits nothing rather than a pointless empty rule. This is hand-rolled only because
  Lit has no Emotion-equivalent object-to-CSS compiler — the compilation step itself is the same
  one Emotion's `css` prop already does for the real component.

`gd-button.ts`'s `_buildCssText` now reads `tokens.default`, `tokens[this.variant]`,
`tokens.icon` (only when `isIcon`), `tokens.fullWidth` (only when set), a same-shaped
`{ borderRadius, '&:focus-visible::after': { borderRadius } }` object, and
`tokens.content.default`/`tokens.startIcon.default`/`tokens.endIcon.default` — the exact same
paths and order `ButtonStyled.tsx`'s own `componentStyles` array reads — and concatenates their
compiled text, instead of a single hand-written template with a `!isDisabled &&
resolved.containerHover.backgroundColor !== undefined ? ... : ''` ternary per property. A real,
free side effect: `button.ts`'s `'&:disabled, &:disabled *'` selector (note the trailing `*`)
now mutes the content/icon spans' color via genuine CSS selector matching, not the JS
`containerStyle.color` reuse trick Section 10's Button fix needed under the old flattened
model. Added 10 unit tests covering `resolveButtonTokens`'s shape/fallbacks and
`buttonCssBlockToText`'s flat/nested/empty-block/multi-level-nesting behavior (114 total, all
passing). Verified live: computed styles for all 5 variants × hover/disabled/focus states are
byte-identical to before the refactor; content span's color correctly mutes on disabled purely
via CSS, with no JS color-passing involved.

## 13. True single source of truth — `gd-button.ts` imports the real `button.ts` directly

Requested directly: edits to `libs/ui/src/tokens/button.ts` must instantly reflect in
`gd-button.ts`, not just be accurately hand-mirrored (Section 12's `resolveButtonTokens` was a
faithful but manually-kept-in-sync **copy** of `button.ts`'s object — an edit to the real file
did nothing to `gd-button.ts` until someone re-copied it by hand). "Instant" requires an actual
runtime import of the real object somewhere, which is in direct tension with
`gd-design-core/README.md`'s own documented promise: "This package does not import
`gd-design-library` at runtime, so it stays buildable and testable independently of `libs/ui`."
Surfaced this tension and got two explicit decisions:

1. **Where the real import lives:** in `libs/web-components` only, not `gd-design-core`. This
   keeps `gd-design-core` genuinely dependency-free (RN and any future zero-React-dep adapter
   stay unaffected) while `libs/web-components` — the one adapter that both needs this
   nested-selector CSS shape and is allowed to take the dependency — declares a real
   `"gd-design-library": "*"` dependency in its `package.json` and imports `button` from
   `gd-design-library/tokens` directly in `gd-button.ts`.
2. **How "instant" during development:** live source, hot-reloaded. `libs/web-components/vite.config.ts`
   adds a `command === 'serve'`-gated `resolve.alias` mapping `gd-design-library/tokens` (plus
   the `@utils`/`@types`/`@constants`/`@hooks`/`@tokens`/`@components`/`@assets` aliases
   `libs/ui`'s own token files use internally) straight to `libs/ui/src/...` source — so the dev
   server hot-reloads on every `button.ts` edit with no `build:ui` step in between. Gated to
   `serve` specifically so the production build still resolves `gd-design-library` through the
   real package export map (`external: [/^gd-design-library(\/.*)?$/]`, unchanged) rather than
   inlining the whole `libs/ui` source tree into the shipped bundle.

**New shared utility, not a new dependency:** `gd-design-core/src/utils/resolveThemeTree.ts` — a
generic, dependency-free tree-walker that evaluates every `(theme) => value` function leaf in
any token tree against a given theme, recursing into nested objects (including a resolved
function's own object return value) and leaving concrete values untouched. It has no opinion
about _which_ token tree it walks — `gd-design-library`-specific knowledge (the real `button`
import) stays in `gd-button.ts`, keeping `resolveThemeTree` itself reusable and honoring
`gd-design-core`'s zero-dependency promise. 5 unit tests added (function-leaf evaluation,
concrete-value passthrough, one- and two-level nested-selector recursion matching the real
`&:focus-visible` → `&::after` shape, empty-object preservation).

**Removed, not deprecated:** the old `resolveButtonTokens(theme)` hand-mirror in
`libs/design-core/src/tokenResolvers/button.ts` is deleted outright (along with its 5 tests in
`button.spec.ts`) — keeping both would have left two competing "sources of truth" side by side,
exactly the problem this change exists to solve. `gd-button.ts`'s `render()` now does:

```ts
const resolvedTree = resolveThemeTree(button, this.theme) as unknown as ButtonTokenTree;
const tokens: ButtonTokenTree = {
  ...resolvedTree,
  default: {
    ...resolvedTree.default,
    fontFamily: get(this.theme, 'font.family', '"Fira Sans", sans-serif'),
    fontSize: get(this.theme, 'font.size.p', '16px'),
  },
};
```

`fontFamily`/`fontSize` are merged in separately because the real `button.ts` object has
neither — the real `<button>` inherits both from the app's global CSS reset, which a
Shadow-DOM-isolated custom element doesn't get for free; resolved from the same shared
`font.family`/`font.size.p` theme tokens Input/Select/Typography already use. `radius` still
comes from `gd-design-core`'s `resolveButtonRadius` (shared with RN), unchanged, since
`borderRadius` is likewise absent from the real object — it's a separate, `rounded`-prop-driven
array entry in the real component too.

**Cascading tooling gap found and fixed:** this is the first cross-project consumption of the
`gd-design-library` package specifier anywhere outside `libs/ui` itself. `gd-design-library/*` →
`libs/ui/src/*` is already a repo-wide `tsconfig.base.json` path mapping (there is no built
`libs/ui/tokens/` in source — only `dist/libs/ui/tokens` after `build:ui` — so this mapping,
not `node_modules`, is what makes the package specifier resolve at all pre-build). But the
tokens barrel (`libs/ui/src/tokens/index.ts`) re-exports every token file in the directory, and
those files resolve their own internal imports (`@utils`, `@types`, `@assets/*.svg?raw`, etc.)
through path aliases that only existed in `libs/ui`'s own tsconfig/vite config — nothing else in
the monorepo had ever needed them. Fixed by restating the same aliases (repo-root-relative,
since child `paths` fully replace rather than merge with the extended config's `paths`) in
`libs/web-components/tsconfig.json`, adding `"vite/client"` to `tsconfig.lib.json`/
`tsconfig.harness.json`'s `types` (for the `?raw` SVG imports' ambient types), and mirroring the
same aliases as literal `resolve.alias` entries in `vite.config.ts` (`nxViteTsPaths()` only
reliably resolves a project's _own_ tsconfig paths, not a foreign project's paths pulled in
transitively — confirmed empirically: without the `vite.config.ts` aliases, the dev server 500'd
on `@assets/svg/checkbox_border.svg?raw` inside `input.ts`, pulled in transitively by the tokens
barrel even though `gd-button.ts` only needs `button`).

**Verified live via `chrome-devtools-mcp`:** loaded `harness/fidelity-check.html` after the
change — all 160 network requests (including the entire `libs/ui/src/tokens/*` barrel, `get.ts`,
`resolveThemeTree.ts`) returned `200`, no `500`s. Computed styles for all 5 button
variants/states matched the real defaultTheme values exactly (`primary` background
`rgb(255, 184, 0)` = `#FFB800`, `secondary` `rgb(255, 247, 229)`, `outlined` transparent +
1px black border, `disabled` `rgb(229, 229, 229)` background / `rgb(163, 163, 163)` text).
**Proved the actual "instant reflection" claim**, not just inferred it: temporarily edited
`libs/ui/src/tokens/button.ts`'s `primary.background` to a hardcoded `'#ff00ff'`, and — with
zero changes to `gd-design-core` or `gd-button.ts` — the harness's rendered `<gd-button>`
background updated to `rgb(255, 0, 255)` via Vite HMR alone; reverted immediately after
confirming, `git diff` on `button.ts` is clean.

**Runtime theme switching re-verified end-to-end against the real object** (asked directly,
since routing through `resolveThemeTree(button, this.theme)` instead of the old
`resolveButtonTokens(theme)` changes _how_ theme resolution happens, not just where the tokens
come from — needed independent proof it still works, not an inference from Section 12's
pre-refactor test). Assigned a full custom theme object (new reference — `colors.bg.fill.primary:
'#0044ff'`, `spacing.sm: '30px'`, `font.family: 'Test Theme Font'`, `colors.border.focus:
'#00ff00'`) to a live `<gd-button>`'s `.theme` property and confirmed, on the very next paint
with zero manual re-render call: resting background → `rgb(0, 68, 255)`, `gap`/`padding` → `30px`
/ `30px 40px`, `font-family` → `"Test Theme Font"`. Verified the **nested pseudo-selector**
paths too, not just flat `default` properties: trusted `hover()` on the same element showed
background `rgb(0, 51, 153)` (the custom theme's `colors.bg.fill.secondary`), and trusted
Tab-key focus showed the `::after` ring's `border-color` as `rgb(0, 255, 0)` (the custom theme's
`colors.border.focus`) while `:focus-visible` still matched — confirming the re-render doesn't
steal focus. Switched back to the real `defaultTheme` (imported the same way `gd-button.ts`
itself does) on the same element afterward and got the real values back exactly (`rgb(255, 184,
0)` resting, `rgb(242, 145, 0)` hover, `rgb(0, 105, 180)` focus ring, `8px` gap, `"Fira Sans",
sans-serif`) — so switching isn't one-directional or sticky. Standard Lit caveat applies and is
unchanged by this refactor: `theme` is a normal reactive property compared by reference, so a
consumer must assign a **new** theme object (`el.theme = {...}`) to trigger re-render — mutating
the existing object in place (`el.theme.colors.bg.fill.primary = '...'`) will not, same as any
other Lit property.

**Found and fixed a real harness regression as a direct consequence of this change:**
`fidelity-check.tsx`'s comment claimed a themeless Lit render should visually match Storybook's
defaults, which was true under the old `resolveButtonTokens` (its `get(theme, path, REAL_HEX)`
fallbacks were the actual default color values, hardcoded in `gd-design-core`). The real
`button.ts`'s own fallbacks are debug placeholder strings (e.g.
`get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary')` — literally the string
`'theme.colors.bg.fill.primary'`, never meant to render anything since the real component always
gets a full theme from `ThemeProvider`). Once `gd-button.ts` started resolving the real object,
a themeless render broke (buttons fell back to bare UA `<button>` styling — confirmed via
computed styles showing Chrome's default `rgb(239, 239, 239)` background before the fix). This
is not a `gd-button` bug — it's the real component's own actual themeless behavior, now
faithfully reproduced instead of papered over by a resolver-level fallback that never matched
production. Fixed by passing `theme={defaultTheme}` (imported from `gd-design-library/tokens`,
the same object `ThemeProvider` supplies by default) explicitly to `<GdButton>` in
`fidelity-check.tsx` — restoring a meaningful visual comparison. `gd-checkbox`/`gd-input`/
`gd-select`/`gd-typography` are unaffected (still resolved via `gd-design-core`'s resolvers,
which retain real hardcoded fallback defaults).

**Bundle size, measured (not assumed):** flagged a real risk before measuring —
`libs/ui/src/tokens/utils.ts` (needed transitively via `button.ts`'s `getFocusStyles` import)
has a real, invoked `@emotion/react` `keyframes` import at module scope, which could have bloated
`gd-button.ts`'s bundle against this spike's own "dramatically smaller" claim (Section 3). Ran
`npm run measure:web-components-size` for a real number: Button's Lit gzip size grew from
1217 B → **1872 B** (+655 B), and its size-vs-React ratio dropped from 16.0x to **10.4x** smaller
— a real, non-trivial regression, but not the emotion-driven blowup that was feared, and Button
is still an order of magnitude smaller than its React+Emotion equivalent (19.5 kB). The reason
`@emotion/react` doesn't get inlined: production builds externalize `gd-design-library`
(`rollupOptions.external`, unchanged), and the dev-only alias above is gated to `command ===
'serve'` — so `import { button } from 'gd-design-library/tokens'` stays a bare external
specifier in the shipped chunk in both cases, same as the pre-existing `gd-design-core` import.
The +655 B growth is `gd-button.ts`'s own added glue code (the `resolveThemeTree`/`get`
tree-merge in `render()`), not emotion. Checkbox/Input/Select's reported gzip sizes also shifted
by small amounts (all untouched by this change) — an artifact of Rollup's shared-chunk
code-splitting redistributing shared-helper bytes differently once Button's own chunk changed
size, not a real behavioral change in those components.

**Scope note (updates Section "Scope confirmation" below):** `libs/web-components/package.json`
now declares `"gd-design-library": "*"` as a real (non-dev) `dependency`, not just a
`devDependency` — the first time this project takes a production dependency on the real GridKit
package rather than only `gd-design-core`.

## Extrapolated full-catalog migration cost

Porting 5 atoms (chosen to stress 5 distinct risk axes) took the equivalent of the plan's
~8.5 day budget (Setup through Select) plus the reproductions above. The remaining ~63
components in the catalog skew toward molecules/organisms with materially more internal
composition (nested components, more complex slotting, more state) than any of these 5 atoms
except Select. A reasonable extrapolation: atoms remaining in the catalog are likely
comparable-or-cheaper per component than this spike's median; molecules/organisms should be
budgeted at 1.5–3x Select's effort each, given deeper composition and (per CTORNDSD-590's
independent finding) accumulating polymorphism/discoverability-gap costs. This is a rough
order-of-magnitude estimate, not a committed plan — a real full-catalog estimate needs a
follow-on scoping pass across the actual component list, not an extrapolation from 5 samples.

## Follow-on tickets / open questions (carried forward regardless of outcome)

- Fix or scope around the `tsconfig.harness.json` JSX pollution documented in Section 14 —
  `perf-check.tsx`'s relative import of the real `Button.tsx` pulls `libs/ui` component files
  into the same TS program as this package's `HTMLElementTagNameMap` augmentations, breaking
  type-check for `ImageStyled.tsx`/`WrapperStyled.tsx`/`TypographyStyled.tsx`/`ColumnStyled.tsx`/
  `RowStyled.tsx`/`TooltipStyled.tsx`/`InputWrapperStyled.tsx`. Confirmed pre-existing (predates
  Sections 13–14), not a regression from this work, and does not affect `tsconfig.lib.json`.
- Should a design-token-export-to-CSS-custom-properties utility become its own shared
  prerequisite ticket? (No such infrastructure exists in this repo today; this spike's theming
  bridge is hand-rolled and scoped to only the 5 ported atoms' token needs.)
- If the org proceeds with "go," should `@lit/react` wrapper generation be automated? Five
  hand-authored wrappers (`harness/Gd*React.tsx`) is enough evidence to make that call, not
  enough to justify building the generator inside this spike.
- Does the org have a concrete minimum browser-support matrix for GridKit's real consuming
  applications? This still governs both the DSD Baseline argument (Section 2) and the
  `popover`/CSS-anchor-positioning bet (Section 6) — this spike confirmed both work on this
  environment's evergreen Chromium, but did not (and could not, from this environment alone)
  confirm the org's actual minimum-supported-browser floor.
- Should CTORNDSD-634 ("make native props more generic") adopt this spike's controlled-value
  findings (Input's `value`/`onGdInput`, Checkbox's `checked`/`onGdChange`, and the new
  boolean-attribute `attribute: false` constraint from Section 8) as concrete generalization
  targets? They are the exact prop shapes that broke across the property/attribute/event
  boundary tested here.
- Should the CTORNDSD-286 reproduction (Section 1) later be validated against the actual
  consuming app/environment, rather than only this spike's synthetic harness?
- Re-verify the React 19 property/attribute-assignment claim (Section 7) directly, rather than
  relying on documented guidance — this spike's environment only had React 18 installed.
- A full-catalog migration cost estimate (see above) needs a dedicated scoping pass across the
  real ~68-component list, not an extrapolation from 5 atoms.
- ~~`gd-design-core`'s `InputColorVariantName`/Select color-variant vocabulary mismatch with the
  real `InputColorVariant`~~ — fixed (Section 9); member names now match exactly.
- A design system-wide audit of `gd-design-core`'s remaining resolvers (beyond the 5 covered
  here) for the same class of placeholder-default bug, if more atoms are ported later.

## Conditions on the "GO" verdict

1. Typography's discoverability gap (Section 5) must be an accepted, documented trade-off for
   any component relying on DOM-tag-based polymorphism — not silently absorbed.
2. The org's real minimum browser-support matrix must be confirmed before leaning on
   `popover`/DSD as load-bearing (Sections 2, 6) in production.
3. React 19's event-mapping scope (Section 7) should be independently re-verified, not
   inherited from this spike's React-18-only environment.
4. Any full-catalog rollout needs its own scoping pass, not a direct extrapolation from this
   spike's 5 samples.
5. ~~`gd-design-core`'s `InputColorVariantName` vocabulary should be renamed to match the real
   `InputColorVariant`~~ — done (Section 9).

## Scope confirmation

- `libs/ui` (`gd-design-library`) source, build config, and shipped output are **unmodified**
  — confirmed via `git status`/`git diff` before writing this document. (Section 13's live-HMR
  verification temporarily edited `libs/ui/src/tokens/button.ts` to prove the single-source-of-
  truth claim empirically, then reverted it in the same turn — `git diff` on that file is
  clean.)
- `gd-design-core`'s token resolvers (`libs/design-core/src/tokenResolvers/*.ts`) **were
  modified** — their default fallback values were corrected to match the real GridKit tokens
  (Section 9); this is shared infrastructure scaffolded specifically for this pair of spikes
  (CTORNDSD-581 + CTORNDSD-590), not `libs/ui`, and the fix benefits both adapters. The stores
  (`libs/design-core/src/stores/*.ts`) were not touched. Section 13 later **removed**
  `resolveButtonTokens` from this same file (superseded by a real import + `resolveThemeTree`,
  not a second hand-mirrored copy) and added the new, `gd-design-library`-agnostic
  `resolveThemeTree` utility.
- No CTORNDSD-590 (React Native), CTORNDSD-636, or CTORNDSD-635 files were touched.
- New dev-only dependencies (`@lit-labs/ssr`, `@emotion/react`, `@emotion/cache`, `react-dom`)
  were added to `libs/web-components/package.json`'s `devDependencies`. Section 13 additionally
  added `"gd-design-library": "*"` as a real (non-dev) `dependency` — the first production
  dependency this project takes on the real GridKit package, scoped to `gd-button.ts`'s single
  `gd-design-library/tokens` import.

## 14. Addendum — raw render-speed check (measured after the original spike, requested directly)

Section 3's bundle-size table was explicitly caveated as "bundle weight, not runtime speed" — no
render-speed measurement was in the original plan's Acceptance Criteria. Requested directly as a
follow-up: a raw, honest browser measurement of mount/update speed, real `<gd-button>` against the
real React+Emotion `Button`, not a synthetic microbenchmark.

**Harness:** `harness/perf-check.tsx` / `.html`, driven headlessly via Playwright/Chromium (not
`evaluate_script` against a shared devtools browser instance, which was locked by another running
session at measurement time). Both sides render the same 300 buttons, same variant, same
`defaultTheme`, in one batch:

- **Lit side:** `document.createElement('gd-button')` × 300, `variant`/`theme` set, appended via a
  single `DocumentFragment`, timed from before creation to `await Promise.all(els.map(el =>
el.updateComplete))` resolving (every element's first render actually committed, not just
  scheduled).
- **React side:** the real `Button` from `libs/ui/src/components/atoms/Button/Button.tsx`
  (imported directly from source — the only way to get the real component pre-build, same
  convention as this file's existing CSS relative-import escape hatch), 300 instances inside the
  real `ThemeProvider`, mounted via `ReactDOM.flushSync` so the commit is synchronous and
  comparably timed.
- Same structure repeated for an **update** measurement: toggle every instance's `variant` from
  `primary` → `secondary` after initial mount, time until settled.
- 5 trials each, **median** reported (raw per-trial numbers kept in the harness's console/`window`
  output for anyone re-running it).

**Results (300 buttons, one batch, median of 5 trials, this machine, headless Chromium). Every
number below is the total wall-clock time for all 300 instances in that one batch, not a
per-instance figure** — e.g. React's ~13 ms mount is ~13 ms for all 300 together (≈0.04 ms/button
on average), not 13 ms each:

| Measurement                        | Lit (`gd-button`) | React + Emotion (`Button`) |
| ---------------------------------- | ----------------: | -------------------------: |
| Mount (cold, 300 instances)        |            ~28 ms |                     ~13 ms |
| Update (toggle variant on all 300) |            ~13 ms |                     ~11 ms |

**Honest result: React mounted roughly 2x faster than Lit at this batch size; update cost was
close to even.** This is the opposite direction from the bundle-size and Shadow-DOM-isolation
findings above, and it is reported as measured, not smoothed over.

**Working hypothesis for the mount gap (not independently re-verified — flag as follow-on if
runtime speed becomes a decision factor):** `gd-button.ts`'s per-instance Constructable StyleSheet
mechanism (Section 12) computes and `replaceSync`s its own CSS text on **every instance**,
independently — 300 identical buttons (same variant, same theme) still pay 300 separate
`_buildCssText` + `replaceSync` calls. Emotion's runtime, by contrast, caches a generated class per
unique style combination; 300 identical buttons pay that serialization cost roughly once and then
just reuse a cached className. If true, this is a real, fixable inefficiency in the current
`gd-button.ts` implementation (a per-content-hash stylesheet cache keyed off the resolved CSS text
would likely close most of the gap), not an inherent Lit-vs-React ceiling — but this addendum did
not implement or test that fix, so it stays a hypothesis, not a confirmed root cause.

**Caveats, stated plainly:**

- 300 simultaneous instances is a bulk-list scenario. Most real pages mount a handful of buttons
  at a time, where fixed per-call overhead (custom element upgrade, Shadow DOM attachment)
  dominates rather than per-instance CSS work — this addendum did not separately measure a
  single-instance mount, so it cannot say whether the gap holds, shrinks, or reverses at low count.
- One machine, one headless Chromium run, 5 trials — real JIT/GC noise is visible in the raw
  per-trial numbers (see the harness's own recorded arrays), not eliminated by a proper
  benchmarking harness (e.g. `tachometer`, warm-up-then-measure isolation). Treat this as an
  order-of-magnitude signal, not a citable benchmark result.
- Does **not** change the Section 9's "GO" verdict, which was driven by the CTORNDSD-286
  Shadow DOM fix and bundle size, not runtime speed — but it is a real, previously-unmeasured axis
  and should be named explicitly rather than left as an unstated assumption that "smaller bundle"
  implies "faster render."

## 15. Addendum — "Lit wraps React (shell only)" actually built and measured, not left as "not tested"

The doc's own comparison table named a third option — "Lit wraps React": a Lit-authored custom
element whose only job is to mount the real React `Button` (via `ReactDOM.createRoot`) inside
itself, no template rewrite — and marked its isolation/speed rows "not attempted"/"not tested"
since the original spike never built it. Requested directly as a follow-up: build it for real and
measure it, not leave it as a hypothesis.

**Harness:** `harness/gd-button-shell.ts` (`<gd-button-shell>`, a `LitElement` subclass — plain
`static properties` API, not TS decorators, since this harness's `tsconfig.harness.json` doesn't
run the same legacy-decorator transform `src/**` gets, and decorator syntax reached the browser
un-transformed and failed to parse the first time this was tried) mounts the real
`Button`/`ThemeProvider` from `libs/ui/src/components/atoms/Button/Button.tsx` into its own Shadow
Root via `createRoot(...).render(...)`, deliberately with **no shadow-scoped Emotion cache** —
testing the naive/default version of the option, since that extra plumbing was named "untested"
rather than assumed to work.

**Mount/update speed** (`harness/perf-check.tsx`, extended with a third scenario; same
methodology as Section 14 — 300 instances, median of 5 trials, headless Chromium). Same rule as
Section 14: each number is the total for all 300 instances in one batch, not a per-instance
figure — the shell's ~44 ms is ~44 ms combined for 300 buttons (≈0.15 ms/button on average), not
44 ms for one button:

|                    |  React | Native Lit |         Lit-wraps-React shell |
| ------------------ | -----: | ---------: | ----------------------------: |
| Mount 300 at once  | ~11 ms |     ~27 ms | ~44 ms — slowest of the three |
| Update 300 at once | ~11 ms |     ~13 ms |                        ~13 ms |

The shell is the slowest to mount, not a middle ground — it pays **both** costs at once: the
custom-element/Shadow-DOM attachment overhead native Lit pays, plus a full nested
`ReactDOM.createRoot` + render for every instance, which neither pure option has to do. Update
cost, once each instance's React root already exists, lands close to native Lit's.

**Isolation** (`harness/shell-isolation-check.tsx` — the CTORNDSD-286 repro from Section 1,
re-run with `gd-button-shell` added as a third probe alongside the plain-Emotion control and
native `gd-button` as a known-good reference):

```json
{
  "Global reset broke the plain Emotion button (control) — expect true": true,
  "Global reset leaked INTO native gd-button Shadow DOM — expect false (known-good reference)": false,
  "Global reset leaked INTO gd-button-shell Shadow DOM — the question this test answers": false,
  "gd-button-shell's own real Button styling actually rendered (background matches #FFB800) — separate question": false,
  "shellComputedBackgroundColor": "rgb(239, 239, 239)"
}
```

**The honest result is more interesting than a plain pass/fail:** the malicious global reset did
**not** leak into the shell's shadow root — so far, that looks like a pass. But the shell's own
real Button styling never rendered either: its computed background is `rgb(239, 239, 239)`,
Chromium's default unstyled `<button>` background, not the real gold `#FFB800`
(`colors.bg.fill.primary`). The Shadow DOM boundary that keeps the page's malicious reset out
keeps the button's **own** Emotion-generated `<style>` tag out too — Emotion's default cache
injects that tag into `document.head` (light DOM), which a real Shadow Root cannot see, same
mechanism, both directions. So "the collision bug doesn't happen" is true here only because the
component is rendering with **no real styling at all**, not because it correctly renders its own
appearance while excluding the page's. That is not a usable fix — it would need a
shadow-root-scoped Emotion cache (`createCache({ container: shadowRoot })` plus a matching
`CacheProvider`, wired per instance) to render its own styles correctly at all, and that plumbing
was not built or tested here.

**Bundle size** (`esbuild` + gzip, same accounting style as Section 3 — `lit`, `react`,
`react-dom/client`, `react-dom`, and the real `Button`/`ThemeProvider` externalized to isolate just
the wrapper's own code, mirroring how Section 3 isolates the `lit` runtime cost):

- Marginal "glue" cost of the wrapper class itself, everything else externalized: **643 B gzip** —
  smaller than any native-Lit atom's own chunk (0.9–2.4 kB), because the shell doesn't reimplement
  any UI logic, it only wires a mount point.
- Full bundle, nothing externalized (worst case — a brand-new app with zero React/Lit already
  loaded): **~80.6 kB gzip** for this one component.
- **Why the marginal number is misleading at scale:** for a single component, glue (0.6 kB) + the
  `lit` runtime (~7 kB, Section 3) ≈ 7.7 kB is comparable to native Lit's own first-component cost
  (~8.9 kB). But that glue cost does not replace the real `Button`'s own React+Emotion weight the
  way a native Lit rewrite does — an existing React app already pays that per-component weight
  today, and the shell doesn't remove it, it just adds Lit's runtime on top. Across the 5 ported
  atoms, the shell path would still carry the same ~113 kB of React+Emotion code the "React
  (today)" column already pays (Section 3), plus ~7 kB Lit runtime, plus ~5×0.6 kB glue — while
  native Lit's 5-atom total is ~16.4 kB including its own runtime. The shell's small marginal glue
  cost does not scale into a bundle-size win once more than one component is involved.

**Conclusion:** building and measuring this option, rather than reasoning about it, confirms the
doc's existing skepticism and adds a concrete, previously-unknown failure mode — the naive version
doesn't just fail to help, it fails to render its own correct appearance at all. It does not change
the "GO" verdict for native Lit.

## 16. True single source of truth, extended to Checkbox/Input/Select/Typography

Requested directly, following on from Section 13: "do the same for rest web-components." All
four remaining ports (`gd-checkbox.ts`, `gd-input.ts`, `gd-select.ts`, `gd-typography.ts`) now
import their REAL token object (`checkbox`/`input`/`select`/`typography`, all from
`gd-design-library/tokens`) and resolve it with `resolveThemeTree`, exactly like `gd-button.ts`.
The four corresponding hand-mirrored `gd-design-core` resolvers (`resolveCheckboxStyle`,
`resolveInputStyle`, `resolveSelectStyle`, `resolveTypographyStyle` — each a flattened,
hardcoded-fallback copy of its real token file, same category of problem `resolveButtonTokens`
was) are deleted outright, along with their spec suites and (for Input/Select) the
`COLOR_VARIANT_BORDER_PATH`/`HELPER_TEXT_COLOR_PATH`/etc. constant tables that hand-duplicated
real per-variant paths. `resolveButtonVariantStyle`/`resolveButtonRadius` are untouched — they're
still shared with `react-native`'s `GdButton`; confirmed via grep that none of the four
deleted resolvers had any consumer outside `web-components` (RN has ported Button only so far).

**Per-component extraction, not a hand-mirror:** each component gets a small, local
`resolveXTokens(theme, ...)` function (not in `gd-design-core` — same reasoning as Button's:
keeps `gd-design-core` free of the `gd-design-library` dependency) that resolves the real object
via `resolveThemeTree` and reads the exact same nested paths the deleted resolver used to
hand-duplicate:

- **Checkbox** — `checkbox.size.<sm|md>` for `indicatorSize`/`iconSize` (replacing a hand-copied
  `SIZE_PX` table), `checkbox.indicator.{default,checked,indeterminate}`, `checkbox.wrapper.default.gap`.
  `indicator.default.border` is a combined shorthand string (`borders.generic()`'s output) —
  simplified the styleMap from three properties (`borderWidth`/`borderStyle`/`borderColor`) to
  one (`border`), matching the real object's own shape instead of an artificially-split one.
- **Input** — `input.wrapper.withGap.gap`, `input.helper.default.{sm,md}`,
  `input.helper.<variant>.sm.color`, `input.input.default.padding`,
  `input.input.default['&:not(...)]'].zIndex`, `input.input.defaultInteraction['& +
.Input__border'].borderRadius`, `input.input.<variant>['& + .Input__border'].border` (again a
  combined shorthand, same simplification as Checkbox). `fontFamily`/`fontSize` are the one
  exception, same as Button — the real `input.ts` has neither field; both still resolve from the
  shared `font.family`/`font.size.p` theme tokens directly via `get()`.
- **Select** — `select.dropdown.*` for surface/typography, `select.button.<variant>.border`
  (falling back to `select.button.default`, itself the `primary`-equivalent border — same
  fallback pattern `gd-button.ts` uses for `tokens[this.variant] ?? tokens.primary`),
  `select.item.default['&:hover, &.active'].backgroundColor` for hover/selected background. Same
  border-shorthand simplification as Checkbox/Input.
- **Typography** — the cleanest case: real `typography.ts` is already flat and variant-keyed
  (`typography[variant]` gives `fontSize`/`fontWeight`/`lineHeight`/`marginTop`/`marginBottom`
  directly; `typography.styleVariant[name]` gives the exact override blocks the old resolver's
  `switch` statement re-implemented by hand). The local extraction function is a straight
  `base.fontFamily` → `[variant]` merge → monospace-family override for `code`/`kbd` → each
  `styleVariant` overlaid in array order — no hardcoded `VARIANT_FONT_SIZE`/`VARIANT_LINE_HEIGHT`/
  `VARIANT_MARGIN` tables needed at all, since every value now comes from the real object.

**Same harness regression, same fix, for all four:** exactly like Button (Section 13), a
themeless render broke once each component started resolving the real token file's own
placeholder-string fallbacks instead of `gd-design-core`'s real-hex hardcoded ones — confirmed
live via `chrome-devtools-mcp` (Checkbox's indicator boxes disappeared entirely, resolving to
invalid CSS from literal strings like `'theme.colors.border.default'`). Fixed the same way:
`fidelity-check.tsx` now passes `theme={defaultTheme}` to every one of the 5 components, not
just `GdButton`.

**Verified live:** reloaded the harness after the fix — all 5 sections render correctly,
computed styles match real `defaultTheme` values exactly (checkbox checked `#FFB800` fill,
input border `1px solid #E5E5E5` + `Fira Sans`, typography h1 `48px`/`400`/`32px` margin, select
trigger `1px solid #E5E5E5` border + white surface). Proved instant reflection again, this time
for Checkbox: temporarily edited `checkbox.ts`'s `indicator.checked.backgroundColor` to a
hardcoded `'#00ff00'`, confirmed the live `<gd-checkbox>` picked it up via HMR alone with zero
`gd-design-core`/`gd-checkbox.ts` changes, then reverted (`git diff` clean).

**Theme switching re-verified for all four**, with one real debugging detour worth recording:
an early Select test appeared to show `border` "stuck" on the old color after a theme swap while
`fontFamily`/`background` updated correctly in the same render — looked like a genuine bug.
Root-caused instead to an **incomplete test theme**: `values.borderThin` was missing, so the
resolved `border` shorthand was `"theme.values.borderThin solid #654321"` — a value with an
invalid CSS length (`border-width`), which the browser's CSSOM silently rejects via
`style.setProperty()`, leaving the previous valid border in place while every other (valid)
property on the same style object still applied. Re-tested with a complete theme (including
`values.borderThin`) and the border updated correctly. Lesson for future theme-switching tests
here: a partial custom theme can produce genuinely invalid CSS for any field the real token file
doesn't have a placeholder-safe fallback for — that's expected behavior (matching the real
component's own themeless/partial-theme behavior), not a resolution bug, and it isn't specific
to Select; the same trap would apply to any shorthand-producing field in Checkbox/Input/Button
under an incomplete test theme.

**Pre-existing, unrelated gap confirmed (not introduced by this change):** `tsconfig.harness.json`
currently fails type-check with 45 errors (`Property 'gd-<name>' does not exist on type
'JSX.IntrinsicElements'` / `JSX element type 'Component' does not have any construct or call
signatures`) across several real `libs/ui` component files (`ImageStyled.tsx`,
`InputWrapperStyled.tsx`, `TypographyStyled.tsx`, `WrapperStyled.tsx`, `ColumnStyled.tsx`,
`RowStyled.tsx`, `TooltipStyled.tsx`). Root cause: `harness/perf-check.tsx` (a pre-existing,
uncommitted file from earlier performance work, unrelated to this ticket's scope) imports the
real `Button.tsx`/`ThemeProvider` via a **relative** path
(`../../ui/src/components/atoms/Button/Button`), pulling those `libs/ui` component files into
the SAME TypeScript program as this package's `gd-*.ts` files. Each `gd-*.ts` declares `declare
global { interface HTMLElementTagNameMap { 'gd-button': GdButton } }` (etc.) — a legitimate,
necessary augmentation for consumers — but merged into the SAME global scope as `libs/ui`'s own
polymorphic `as`-prop components (which type their `Component` variable as `keyof
HTMLElementTagNameMap`, then use it as a JSX tag), it makes TypeScript require a
`JSX.IntrinsicElements['gd-button']` entry that doesn't exist (React has no built-in knowledge of
these custom elements). **Confirmed via `git stash` that this predates today's change** — reverting
every file touched in Sections 13 and 16 and re-running `tsconfig.harness.json` reproduces the
exact same 45 errors, so this is a latent, already-existing gap surfaced by `perf-check.tsx`'s presence,
not a regression from the single-source-of-truth work. Left unfixed as out of scope for this
change (`tsconfig.lib.json` — the actual shipped output — remains clean); worth a follow-up
ticket to either scope `perf-check.tsx`'s Button import differently (e.g. dynamic import, or an
isolated tsconfig) or to move the `HTMLElementTagNameMap` augmentations somewhere that doesn't
merge into `libs/ui`'s own compilation unit.
