# GridKit Demo — Run Card

Hi there!

Three weeks of work in short:

we rebuilt five GridKit components twice — as Web Components in Lit, and as a React Native app on iOS — and pulled their shared token and state logic into `gd-design-core`, now covered by 121 tests.

Alongside, two new Dynamic Builder checklists document

- what runtime AI-generated UI costs and
- how to pick a model.

## Pre-flight — Stops 3–8 only

```bash
npm install && npm run demo:setup                                      # ~3 min, do it before the meeting
npm run demo:harness                                                   # :5173 — Stops 3–5
npm run check:web-components-ssr && npm run check:web-components-size   # SSR pages + warm size cache
npm run demo:next                                                      # :5373 — Stop 5 insert
```

**Tabs to open in advance:** [1 · fidelity](http://localhost:5173/harness/fidelity-check.html) · [2 · shell-isolation](http://localhost:5173/harness/shell-isolation-check.html) · [3 · form-participation](http://localhost:5173/harness/form-participation-check.html) · [Next.js fixture](http://localhost:5373/) — plus the Simulator window and the two screenshots (Tabs 4–6).

## Stop 1 — Dynamic Builder: performance

- **Open** — [Performance Improvement Checklist](https://griddynamics.atlassian.net/wiki/spaces/RNDM/pages/4685791299/Dynamic+Builder+Performance+Improvement+Checklist)
- **Why** — one A2UI page load: ~74.6k tokens, ~21s, ~$0.09
- **Shows** — nine levers:
  - send only the schema a screen needs
  - merge repeated component groups
  - cap nesting
  - patch in the browser instead of regenerating
  - cache stable inputs
  - feature-flag new surfaces
  - ask whether the screen needs generated UI
- **Plus** — a proposed SLA: ≤8s, ≤8k tokens, ≤$0.02 per call. Not ratified — that is the decision to ask for

## Stop 2 — Dynamic Builder: model choice

- **Open** — [Model Benchmark & Selection Checklist](https://griddynamics.atlassian.net/wiki/spaces/RNDM/pages/4685955158/Dynamic+Builder+Model+Benchmark+Selection+Checklist)
- **Why** — we pick models by inheritance, not evidence
- **Shows** — which model for which job:
  - classification and extraction — Haiku-class or o3-mini
  - hard reasoning — Gemini 2.5 Pro or Sonnet-class
  - A2UI — Flash Lite with a scoped schema
  - preview models — not yet
- **Behind it** — timings from 38.65s to 204.57s, plus public pricing. No controlled study exists, and Haiku 3.5 is already retired

## Stop 3 — Fidelity check

- **Open** — Tab 1 · [localhost:5173/harness/fidelity-check.html](http://localhost:5173/harness/fidelity-check.html)
- **Why** — sets the visual bar before Stop 4 strips the theme. Keep it to 15 seconds
- **Shows**
  - five components rebuilt in Lit — button, checkbox, typography, input, select
  - running on the real GridKit theme, not lookalikes
- **Look for** — gold primary button, secondary/outlined/disabled/loading, gold checkboxes, Fira Sans headings, a working select
- **Note** — skip this and Stop 4 looks like a broken port

## Stop 4 — Shell isolation

- **Open** — Tab 2 · [localhost:5173/harness/shell-isolation-check.html](http://localhost:5173/harness/shell-isolation-check.html)
- **Why** — CTORNDSD-286: a host app's global CSS leaked into our components
- **Shows**
  - at the top, a global reset wrecks the plain Emotion button — the old bug, reproduced
  - the Lit component beside it is untouched
- **Read the JSON, not the buttons** — the theme is empty on purpose, so both render grey
- **Last two lines** — the Lit-shell shortcut blocked its own styling too. Why we dropped it

### ↳ `npm run check:web-components-size`

- **Why** — bundle cost is the main upside
- **Shows** — 7–16× smaller per component:
  - Button 2.05 vs 18.66 kB
  - Checkbox 2.11 vs 23.22 kB
  - Typography 1.09 vs 17.64 kB
  - Input 2.53 vs 18.51 kB
  - Select 2.91 vs 27.69 kB
- **Headline** — all five together, **11.20 kB against 105.72 kB**. 18.08 kB counting Lit's runtime, which most React apps have not already paid. The last line is a CI gate

## Stop 5 — Form participation

- **Open** — Tab 3 · [localhost:5173/harness/form-participation-check.html](http://localhost:5173/harness/form-participation-check.html)
- **Why** — proves these are real form controls, not a mock-up
- **Shows**
  - the app's own CSS reaches in where we allow it — `::part()` gives the magenta ring, cyan fill, red checkbox
  - a plain descendant selector still cannot — 4 pixels changed, not 99
- **Also** — they behave like inputs: listed in `form.elements`, submitted into `FormData`, block empty submit, reset cleanly

### ↳ `curl -s http://localhost:5373/ | grep -c shadowrootmode`

- **Against** — the Next.js fixture at [localhost:5373](http://localhost:5373/)
- **Why** — the honest cost. Lead with it
- **Shows**
  - both counts come back `0` — no Declarative Shadow DOM, no server-rendered heading
  - with JavaScript off, unstyled text and no headings — worse than React today for SEO and first paint
- **Two more** — our token barrel breaks inside a Server Component; mount is 2.3–3.4× slower; nested theming has no equivalent yet

## Stop 6 — iOS Simulator, live

```
xcrun simctl boot "iPhone 16" && open -a Simulator                     # ~30s
npm run dev:react-native -- --ios --localhost
```

- **Turn to** — Tab 4 · the Simulator window, and scroll it. Live, not a screenshot
- **Why** — can we leave the DOM, not just React?
- **Shows** — the same five components off the same `gd-design-core`:
  - gold button, GridKit type scale
  - input with label and helper text
  - select with chevron
- **The point** — one source, two outputs: 1.68 MB of native bytecode for the device, 392 kB of JavaScript for a browser. No DOM-specific code

## If it breaks

- Stops 3–5: `npm run verify:web-components` · Stops 6–8: `npm test --workspace=libs/react-native` + `npm run test:design-core`
- Ports: `kill $(lsof -ti:5173)` · `:5273` · `:5373` · `:8081` — teardown: `pkill -f "expo start"; xcrun simctl shutdown all`

Full detail: `docs/webcomponents-migration/README.md` · `libs/react-native/FINDINGS.md` · the two Confluence pages above.
