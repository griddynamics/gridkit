# Web Components Spike — 3-Minute Demo Script

**Ticket:** CTORNDSD-646 · **Epic:** CTORNDSD-580 · **Branch:** `feature/CTORNDSD-646`

For presenting the Lit spike to a decision-maker. Five beats, ~2:55, ending in a specific ask.
The full 12-step walkthrough is in [`README.md`](./README.md#web-components-spike-ctorndsd-646) —
this is the version that fits in a meeting.

**Every command and page in this script was executed end-to-end on 2026-08-06.** Expected values
below are the real observed values, not estimates. Verifying it surfaced one harness bug (fixed) and
one real architectural limitation (documented, not fixed) — see _Known limitation_ near the end.

**The one-line thesis:** _Shadow DOM fixes a production bug we already shipped, costs 10× less
JavaScript, and is 2–3× slower to mount. Here is all three, measured._

---

## Pre-flight — do this BEFORE the meeting

Not optional. `demo:setup` alone takes 2–3 minutes and will eat the entire slot.

```bash
npm install
npm run demo:setup                # builds dist/ + installs both fixtures (~2-3 min)
```

Terminal 1 — the harness, leave running:

```bash
npm run demo:harness              # :5173
```

Terminal 2 — generate the SSR artifacts, warm the size cache:

```bash
npm run check:web-components-ssr  # writes the two ssr-dsd-*.html pages
npm run check:web-components-size # run once so the build cache is warm
```

Terminal 3 — the Next.js fixture for Beat 4. Takes ~10s to boot, so start it now:

```bash
npm run demo:next                 # :5373
```

Confirm readiness — this must print the green line:

```bash
npm run demo:index
# ✓ All build prerequisites present — every demo above is ready to open.
```

**Open these tabs in advance, in this order:**

| #   | Tab                                                           | Used in |
| --- | ------------------------------------------------------------- | ------- |
| 1   | `http://localhost:5173/harness/fidelity-check.html`           | Beat 0  |
| 2   | `http://localhost:5173/harness/shell-isolation-check.html`    | Beat 1  |
| 3   | `http://localhost:5173/harness/form-participation-check.html` | Beat 3  |

**Keep one terminal visible** with the font size cranked up. Beats 2 and 4 are terminal output.

---

## Beat 0 — What they look like (~15s)

**Tab 1 (`fidelity-check.html`).** Do not skip this. It is 15 seconds and it prevents the
misreading that Beat 1 would otherwise invite.

You should see a **gold "Primary" button**, secondary/outlined/disabled/loading variants, gold
checkboxes, Fira Sans headings, and a select.

> "Five atoms, rebuilt in Lit, running on the real design tokens. This is the fidelity bar. Hold
> that picture — the next page deliberately strips the theme off."

---

## Beat 1 — The bug this exists to fix (~40s)

**Tab 2 (`shell-isolation-check.html`).**

> ⚠️ **Read the JSON, not the buttons.** This harness passes an **empty theme** (`{}`) on purpose —
> it isolates one variable, style leakage. So the native Lit button and the shell button both render
> as plain grey. They look equally broken. They are not. Do not say "and ours still looks right"
> while pointing at a grey button — you will lose the room. The JSON is the evidence.

Verified output:

```json
{
  "Global reset broke the plain Emotion button (control) — expect true": true,
  "Global reset leaked INTO native gd-button Shadow DOM — expect false": false,
  "Global reset leaked INTO gd-button-shell Shadow DOM": false,
  "gd-button-shell's own real Button styling actually rendered": false,
  "shellComputedBackgroundColor": "rgb(239, 239, 239)"
}
```

**Say this:**

> "The red-and-yellow wreck at the top is the control — a host app's global CSS reset, the
> CTORNDSD-286 bug, reproduced. First `true`. The Lit component underneath it: no leak. First
> `false`. This page strips the theme deliberately, so ignore the grey — the question it answers is
> containment, and Shadow DOM contains it."

**Then the last two lines** — this is the part that earns trust:

> "We also built the obvious shortcut: a Lit shell wrapping the real React component. It blocks the
> hostile styles — and its own real styling too. That last `false`, and the grey `rgb(239,239,239)`,
> is a button that should be gold. Same boundary, both directions. We killed that option because we
> built it, not because we guessed."

---

## Beat 2 — What we gain (~30s)

**Terminal:**

```bash
npm run check:web-components-size
```

Verified totals:

```text
Button 1.93 kB / Checkbox 2.11 kB / Typography 1.09 kB / Input 2.53 kB / Select 2.91 kB
5-atom total, Lit (excl. lit runtime):  11.09 kB
5-atom total, Lit (incl. lit runtime):  17.97 kB
5-atom total, React+Emotion:           105.72 kB
✓ no bundle-size regressions
```

> "Seven to sixteen times smaller per component. Five atoms: 11 kB against 106. Including Lit's
> runtime — which most React apps have not already paid — 18 kB. And that last line is a CI gate:
> the number is defended, not just recorded."

---

## Beat 3 — It is a real component, not a demo (~30s)

**Tab 3 (`form-participation-check.html`).** This is the strongest all-green page in the repo —
every assertion true, including a negative control.

You should see: a gold button with a **magenta dashed ring**, a **cyan-filled** input, a **red**
checkbox indicator, and an all-`true` results block.

> "That magenta ring and cyan fill are the app's own CSS reaching **through** the shadow boundary
> via `::part()` — opt-in customization. The control below proves a plain descendant selector still
> cannot get in: 4 pixels, not 99.
>
> And these are real form controls — they appear in `form.elements`, submit into `FormData`,
> block submission when empty, and reset properly. Native validation, not a reimplementation."

---

## Beat 4 — What it costs (~40s)

Lead with the limitation. This is the most credible thing in the demo.

**Terminal** (fixture already running from pre-flight):

```bash
curl -s http://localhost:5373/ | grep -c shadowrootmode  # verified: 0
curl -s http://localhost:5373/ | grep -c '<h2'           # verified: 0
```

> "Inside Next.js these components emit no Declarative Shadow DOM. Both zeros. With JavaScript off
> you get unstyled text and no headings — worse than what React gives us today for SEO and first
> paint. The page also shows our token barrel failing to import in a Server Component:
> `createContext is not a function`. Not RSC-safe."

**Then name the other two costs plainly:**

> "Two more. Mount is 2.3× slower than React at 300 components, 3.4× at one — we cached stylesheets,
> cut it in half, and it did not close. And nested theming has no equivalent yet. That is a genuine
> capability regression, not a bug."

---

## Beat 5 — The ask (~35s)

No terminal. Look up.

> "Sixty-three components, but the job is not sixty-three ports. Twenty-one are styling-only
> conversions with no shadow root. Thirty-five are real rebuilds — five are done. Three are blocked
> on a dependency decision, mainly Chart.
>
> One thing blocks approval and engineering cannot answer it: **what is our minimum browser-support
> floor?** Below Chrome 111 / Firefox 123 / Safari 16.4, Declarative Shadow DOM and `popover` both
> disappear — that removes the SSR story and forces fallbacks across every overlay component.
>
> You can also approve this in stages. Build infrastructure, the 21 CSS conversions, and the 13 form
> controls are the best-evidenced two-thirds. Overlays, tables, and charts are where the evidence is
> thin — 35 of the 63 estimates are extrapolated, and we never ported a dialog."

**Land on:** _"Decision-ready. `docs/webcomponents-migration/README.md` has the full case."_

---

## If you have 60 more seconds

| Demo             | Command                                                  | Verified result                                                                                                                              | The line                                                                                                                                        |
| ---------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| React 19 interop | `npm run demo:react19` (:5273) → `window.__react19Check` | React 19.2.8. Theme reaches the property by reference and renders `rgb(255,184,0)`. `addEventListener` fires **1**, `onGdChange` fires **0** | "Properties work natively. Custom events fire zero times — silently, no warning. That silence is why wrappers get generated, not hand-written." |
| The a11y bug     | `npm run test:web-components`                            | 35 tests, 4 files, ~4s, all pass                                                                                                             | "First run of automated a11y caught a real defect: `gd-input`'s label was never wired to its input. Months of eyeballing Storybook missed it."  |
| Whole CI gate    | `npm run verify:web-components`                          | exit 0                                                                                                                                       | "Type-check, lint, core tests, browser tests, SSR, bundle gate. Green."                                                                         |

---

## Do not do these

- **Do not claim the buttons look right on `shell-isolation-check.html`.** Empty theme by design;
  both render grey. See the warning in Beat 1.
- **Do not say "everything renders fully styled with zero JS" on `ssr-dsd-static.html`.** The
  **heading** does — Fira Sans 48px, theme-resolved, no JavaScript. The **button** does not, and
  cannot: `gd-button` applies its theme CSS through a runtime constructable stylesheet, which cannot
  be serialized into DSD. Say "typography and the inline-styled atoms render fully; the button needs
  JS." The page now explains this itself. See _Known limitation_ below and `FINDINGS.md` §20.
- **Do not say "view source, not one `<script>` tag"** while serving through `demo:harness`. The raw
  file has 0 script tags, but Vite injects `/@vite/client`, so the audience will see one.
- **Do not open `perf-check.html` live.** It auto-runs ~30 seconds. Quote Beat 4's numbers instead.
- **Do not run `demo:setup` during the demo.** 2–3 minutes.
- **Do not promise Storybook for the Lit atoms.** Never attempted — hosting both
  `@storybook/react-vite` and `@storybook/web-components-vite` in one instance is still open.
- **Do not quote bundle numbers from `FINDINGS.md` §3.** Pre-646b and superseded;
  `docs/webcomponents-migration/10-performance-report.md` is authoritative.

## Known limitation — what zero-JS SSR does and does not carry

Found by executing this script end-to-end. The harness bug behind it is **fixed**; the underlying
limitation is real and stays.

**Fixed:** `scripts/ssr-dsd-render.ts` used to render with no `.theme`, so every token resolved to its
own placeholder fallback and the heading came out in Times. It now binds `defaultTheme`, and
`gd-typography` server-renders `"Fira Sans", 48px, 56px` with zero unresolved literals.

**Not fixed, architectural:** `gd-button` is the one atom that applies theme CSS through a runtime
constructable stylesheet (`adoptedStyleSheets`). Only `static styles` and inline `style` attributes
serialize into a `<template shadowrootmode>` — an adopted stylesheet cannot, and with zero JS nothing
runs to adopt one. The other four atoms use `styleMap` and are unaffected.

| Page                    | What it now shows                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `ssr-dsd-static.html`   | Heading fully styled with zero JS ✅ · button unstyled, with the reason printed on the page         |
| `ssr-dsd-hydrated.html` | Same markup + client JS: button goes `rgb(239,239,239)` → `rgb(255,184,0)`, `adoptedStyleSheets: 2` |

**Safe to claim:** DSD markup is emitted, the browser attaches both shadow roots with zero client JS,
hydration reuses the server-rendered node (`domNodeReusedAcrossHydration: true`), and inline-styled
components render fully styled with no JavaScript. **Not safe to claim:** that _every_ component does.

**The tension worth naming if asked:** the constructable-stylesheet cache is exactly what
`FINDINGS.md` §18.1 credits for the 50%/57% render-speed win. The mechanism that closes half the
performance gap is the one that forfeits no-JS styling. Full detail in `FINDINGS.md` §20.

## If something breaks mid-demo

| Symptom                                | Fix                                                                                                                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Harness page blank / elements unstyled | `dist/` is missing. Fall back to `npm run test:web-components` — 35 passing tests make the same points in 4 seconds. |
| `ssr-dsd-*.html` 404s                  | `npm run check:web-components-ssr` — gitignored, generated on demand.                                                |
| Port in use                            | `kill $(lsof -ti:5173)` · `:5273` · `:5373`                                                                          |
| Everything is broken                   | `npm run verify:web-components` — the whole non-interactive gate in one command. Green is the story.                 |

**Teardown:** `kill $(lsof -ti:5173); kill $(lsof -ti:5273); kill $(lsof -ti:5373)`

---

## Numbers cheat-sheet

All verified on this branch on 2026-08-06.

| Claim            | Number                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| Bundle, per atom | 7.3×–16.2× smaller than React+Emotion                                              |
| Bundle, 5 atoms  | 11.09 kB · 17.97 kB with the one-time 6.88 kB `lit` runtime · vs 105.72 kB         |
| Mount speed      | 2.3× slower than React at 300; 3.4× at one                                         |
| Stylesheet cache | mount 50% faster, update 57% faster (update now beats React)                       |
| Catalog          | 63 total → 21 CSS conversions, 39 element ports (5 done, **35 remain**), 3 blocked |
| Tests            | 35 passing, 4 files, ~4s                                                           |
| React 19         | 19.2.8 · properties ✅ · custom events **0 fires**, silent                         |
| Next.js DSD      | `shadowrootmode` count **0** · `<h2` count **0**                                   |
| Evidence gaps    | 35 of 63 estimates extrapolated; 0 overlay components ported                       |
