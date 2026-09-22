# GD Design System

Nx monorepo containing the GridKit design system packages.

## Packages

| Package                      | Version                                                         | Description                                     |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| `gd-design-library`          | ![npm](https://img.shields.io/npm/v/gd-design-library)          | GridKit React component library + design tokens |
| `gd-form-configurator`       | ![npm](https://img.shields.io/npm/v/gd-form-configurator)       | JSON-Schema form engine (AJV + Zustand)         |
| `gd-form-configurator-react` | ![npm](https://img.shields.io/npm/v/gd-form-configurator-react) | React bindings for gd-form-configurator         |

Not published, and under active investigation:

| Package                                  | Description                                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `gd-design-core` (`libs/design-core`)    | Framework-agnostic state stores + token resolution. No React, no Lit, no `gd-design-library` dependency                      |
| `web-components` (`libs/web-components`) | Lit custom-element port of 5 GridKit atoms. `private: true` — see [Web Components spike](#web-components-spike-ctorndsd-646) |

## Quick start

Install the primary package:

```bash
npm install gd-design-library
```

Import components and styles:

```tsx
import { Button, ThemeProvider } from 'gd-design-library';
import 'gd-design-library/styles.css';

export default function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}
```

See the [Storybook](https://github.com/griddynamics/gd-design-system#storybook) for interactive component examples and full API documentation.

## Setup

```bash
# Node >= 22.17.0 required
npm install
```

## Development

```bash
npm run storybook          # Storybook at http://localhost:6006
npm test                   # gd-design-library unit tests
npm run test:form-configurator   # form-configurator tests
npm run type-check         # TypeScript check
npm run lint               # ESLint
```

## Build

```bash
npm run build:ui                # Build gd-design-library (ESM + CJS + types)
npm run build:form-configurator # Build both form-configurator packages
npm run build-storybook         # Build static Storybook
```

## Verification (gd-design-library)

```bash
npm run verify:ui:full     # Full 10-phase dist verification + Verdaccio smoke test
npm run verify:ui:ci       # CI gate (non-zero exit on failure)
```

## Publishing

```bash
# gd-design-library
npm run build:ui && npm run publish:ui

# form-configurator — via GitHub Actions (publish-form-configurator.yaml) or:
npm run build:form-configurator && npm run publish:form-configurator
```

## Scaffold a new component

```bash
npm run crc ComponentName
```

## Web Components spike (CTORNDSD-646)

An investigation into porting GridKit from React to Lit custom elements. **Every demo below runs from
the repo root — you never need to `cd` into a package or fixture.**

### One-time setup

```bash
npm install          # if you haven't already
npm run demo:setup   # builds dist/ + installs the two fixtures (~2-3 min)
```

`demo:setup` builds `gd-design-library`, `gd-design-core`, and `web-components`, then installs
`fixtures/react19-check` and `fixtures/next-ssr-check`. Some demos need those build artifacts; the
demo index tells you which.

### Test it step by step

Twelve steps, in order, all from the repo root. Each one lists the command, what you should see, and
which finding it proves. **Steps 1–6 are non-interactive** — run them and read the terminal. **Steps
7–11 open a browser.** Step 12 runs the whole automated set at once.

If you only have five minutes, run **step 12**.

#### 1. Type-check

```bash
npm run type-check:web-components
echo $?   # 0
```

**Success is silent** — `tsc` prints nothing and exits `0`. Any output at all means a failure. This
checks two projects: the shipped library and the harness. The harness one was broken for a while and is
now covered.

#### 2. Lint

```bash
npx nx lint web-components
npx nx lint design-core
```

Expect `Successfully ran target lint` from both, with no rule violations listed above it. `nx` prints a
problem count only when there are problems.

#### 3. Framework-agnostic core tests

```bash
npm run test:design-core
```

Expect **73 passed (6 files)**. Includes the `resetTo` action added because form reset was silently
keeping a checkbox checked — see `FINDINGS.md` §17.1.

#### 4. Component tests in a real browser

```bash
npm run test:web-components
```

Expect **35 passed (4 files)**, running in real Chromium. This is the suite that found the `gd-input`
accessibility bug on its first run (§18.2). It covers the Input cursor guard, the checkbox
`attribute: false` constraint, form participation, the shared-stylesheet cache, and axe.

> Real Chromium is a constraint, not a preference — jsdom does not reliably implement Constructable
> StyleSheets, the `popover` attribute, or Declarative Shadow DOM.

#### 5. Bundle size and the regression gate

```bash
npm run check:web-components-size
```

Prints a per-atom Lit-vs-React table, then expect `✓ no bundle-size regressions`. Ballpark: 5 atoms at
**~11 kB** gzip (**~18 kB** including the `lit` runtime) against **~106 kB** for React+Emotion —
§3, §18.5.

Exact totals drift by a few dozen bytes between builds because Rollup redistributes shared-helper bytes
between chunks whenever any one chunk changes. That is why the gate's tolerance is 10% rather than 0 —
see [`10-performance-report.md`](./docs/webcomponents-migration/10-performance-report.md).

To prove the gate actually fails, edit a number down in
`libs/web-components/bundle-size-baseline.json` and re-run: it should exit `1`.

#### 6. Server rendering with zero client JavaScript

```bash
npm run check:web-components-ssr
```

Generates `libs/web-components/harness/ssr-dsd-static.html` (**0** `<script>` tags) and
`ssr-dsd-hydrated.html` (1). Expect `DSD present for gd-button: true` and the same for
`gd-typography`. Both pages are opened in step 10. Proves §2.

This step is worth running on its own after any change to a component's `render()`: it is the only check
that exercises the components in **Node**, where there is no shadow root and no Constructable
StyleSheets. It caught a real regression that the browser tests could not — §18.7.

#### 7. Start the harness and Storybook

```bash
npm run demo:harness   # prints the demo map, serves harness pages on :5173
npm run storybook      # SECOND terminal — the React baseline on :6006
```

`demo:harness` prints every page with its URL, what it proves, and any missing prerequisite. Run
`npm run demo:index` on its own any time for the same map.

#### 8. Style isolation — the core justification

Open **`/harness/shell-isolation-check.html`**. Read the JSON block on the page:

```json
{
  "Global reset broke the plain Emotion button (control) — expect true": true,
  "Global reset leaked INTO native gd-button Shadow DOM — expect false": false,
  "Global reset leaked INTO gd-button-shell Shadow DOM — the question this test answers": false,
  "gd-button-shell's own real Button styling actually rendered — separate question": false
}
```

The **control** matters: the first `true` proves the CTORNDSD-286 collision is real and reproduced. The
last `false` is the Lit-wraps-React shell failing — it blocks the bad styles _and_ its own good ones.
§1, §15.

#### 9. Forms, CSS Parts, and the remaining findings

Open **`/harness/form-participation-check.html`**. You should see the button ringed in magenta dashes
and the input filled cyan — that is light-DOM CSS reaching **through** the shadow boundary via
`::part()`. The control rule proves a plain descendant selector cannot. Then submit the empty form: the
browser blocks it with a native validation bubble. Results also on `window.__formCheck`. §17.1, §17.2.

Open **`/harness/remaining-findings-repro.html`** for three more: Input cursor stability under late
external writes, `document.querySelector('h1')` returning nothing for a shadow-rendered heading, and
Select's native `popover` dismissal. §4, §5, §6.

#### 10. Visual fidelity, SSR, and speed

| Open                             | What to look for                                                                                      |
| -------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `/harness/fidelity-check.html`   | All 5 atoms with the real theme. Compare side by side against Storybook on :6006                      |
| `/harness/ssr-dsd-static.html`   | Fully styled with **zero** JavaScript. View source — no `<script>` tags                               |
| `/harness/ssr-dsd-hydrated.html` | Same markup, now hydrated without discarding the server-rendered node                                 |
| `/harness/perf-check.html`       | **Auto-runs, ~30s.** React vs native Lit vs shell. Raw per-trial numbers on `window.__PERF_RESULTS__` |

Speed figures are machine-specific — the _percentages_ in
[`10-performance-report.md`](./docs/webcomponents-migration/10-performance-report.md) are the portable
result, not the absolute milliseconds.

#### 11. The two framework fixtures

```bash
npm run demo:react19   # :5273
```

Read `window.__react19Check`. Expect object props to reach the property natively (`theme` by
reference, no stringified attribute) but `onGdChange` to fire **zero** times — silently, with no
warning. That silence is why the React wrapper layer should be generated. §17.3.

```bash
npm run demo:next      # :5373
```

Then, in another terminal:

```bash
curl -s http://localhost:5373/ | grep -c shadowrootmode   # expect 0
curl -s http://localhost:5373/ | grep -c '<h2'            # expect 0
```

Both zeros are the finding: **Next.js emits no Declarative Shadow DOM**, so with JavaScript off the
page has unstyled text and no headings. The page also shows a server-side import probe failing with
`createContext is not a function` — the token barrel is not RSC-safe. §17.4.

#### 12. Everything automated, in one command

```bash
npm run verify:web-components
```

Runs steps 1–6 in sequence: type-check, lint, both test suites, the SSR check, and the size gate. Exit
code `0` means the whole non-interactive set passed. This is the CI gate.

### Read the results

| Where                                                                  | What                                                                          |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`docs/webcomponents-migration/`](./docs/webcomponents-migration/)     | The decision document set — 15 files. **Start with its `README.md`**          |
| [`libs/web-components/FINDINGS.md`](./libs/web-components/FINDINGS.md) | The chronological engineering log; every measurement quoted in the docs       |
| [`libs/web-components/README.md`](./libs/web-components/README.md)     | Component API reference — props, events, slots, CSS parts, form participation |

Every claim in the docs is labelled **measured**, **reasoned**, or **not attempted**, so it is always
clear which conclusions rest on evidence.
