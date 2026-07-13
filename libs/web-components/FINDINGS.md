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
| Button     |    1.19 kB |             19.07 kB | 16.0x |
| Checkbox   |    1.48 kB |             24.99 kB | 16.9x |
| Typography |    0.88 kB |             18.09 kB | 20.5x |
| Input      |    1.88 kB |             18.99 kB | 10.1x |
| Select     |    2.00 kB |             29.39 kB | 14.7x |

- Shared Lit chunk helpers (barrel + decorator metadata, paid once): **0.51 kB**
- 5-atom total, Lit (excl. `lit` runtime): **7.95 kB**
- 5-atom total, React+Emotion (per-export, not de-duplicated): **110.53 kB**

(Figures above are post visual-fidelity-fix — see the new section below — the extra
markup/CSS for label/helperText, focus rings, the spinner, and the SVG chevron added
roughly 1 kB total across the 5 atoms versus the first pass; still dramatically smaller.)

**Honest caveat, not hidden:** the React figures above already include `libs/ui`'s shared
Emotion/theme baseline (~17–19 kB per export) that an existing React+Emotion consumer app has
already paid once, amortized across every component it uses. The Lit side's equivalent
one-time cost is the `lit` runtime itself — measured directly against this repo's installed
`lit@^3.2.1` via a minified+gzipped esbuild bundle of `LitElement`/`html`/`css`/decorators/`styleMap`:
**6.88 kB**, which most React-only consumer apps have **not** already paid. Even counting that
cost once: 5-atom total with `lit` runtime included is **14.83 kB**, still ~7.5x smaller than
the React+Emotion total (110.53 kB, itself not de-duplicated across atoms either). Net: bundle
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
`color="primary"` directly instead of a translated `color="default"`) — a cross-platform audit
confirmed no other resolver (Button, Checkbox, Typography) had an equivalent naming or value
drift from `libs/ui`'s real tokens/types.

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
  — confirmed via `git status`/`git diff` before writing this document.
- `gd-design-core`'s token resolvers (`libs/design-core/src/tokenResolvers/*.ts`) **were
  modified** — their default fallback values were corrected to match the real GridKit tokens
  (Section 9); this is shared infrastructure scaffolded specifically for this pair of spikes
  (CTORNDSD-581 + CTORNDSD-590), not `libs/ui`, and the fix benefits both adapters. The stores
  (`libs/design-core/src/stores/*.ts`) were not touched.
- No CTORNDSD-590 (React Native), CTORNDSD-636, or CTORNDSD-635 files were touched.
- New dependencies (`@lit-labs/ssr`, `@emotion/react`, `@emotion/cache`, `react-dom`) were
  added only to `libs/web-components/package.json`'s own `devDependencies`.
