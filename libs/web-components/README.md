# web-components

Lit implementation of `gd-design-library`'s atoms as native custom elements (`gd-button`,
`gd-checkbox`, `gd-typography`, `gd-input`, `gd-select`), built on `gd-design-core`'s shared
token resolvers and `zustand/vanilla` state stores. Originated as an investigation into
Lit/web-components as a wrapper strategy for GridKit — see `FINDINGS.md` for the full go/no-go
writeup, including the Shadow DOM style-isolation reproduction, the SSR/Declarative Shadow DOM
check, the bundle-size comparison against the React+Emotion originals, and a visual-fidelity
verification pass against real Storybook stories.

Never published — `private: true`, and deliberately absent from `publish:*`. It **does** have root
scripts for building, testing, and demoing (see [Running locally](#running-locally)); start with
`npm run demo:index`.

## What's here

- `src/components/gd-*/` — the 5 ported atoms, one Lit `LitElement` class per component, each with a
  `*.spec.ts` beside it.
- `src/index.ts` — barrel export. Note this registers **all** elements on import; per-component
  registration is an open design item (`docs/webcomponents-migration/03-monorepo-structure.md` §3).
- `test/a11y.spec.ts` — axe coverage plus the Shadow DOM discoverability assertions.
- `vitest.config.ts` — browser-mode test project. **Real Chromium, not jsdom** — see the note at the
  end of this file for why that is a constraint rather than a preference.
- `harness/` — plain HTML + TSX pages for manual and browser-driven verification: React consumption
  wrappers (`Gd*React.tsx`), the Shadow DOM style-isolation reproduction, the SSR/DSD reproductions,
  the visual-fidelity page, the render-speed check (`perf-check`), the form-participation and CSS-Parts
  check, and the "Lit wraps React" shell (`gd-button-shell.ts`) with its own speed/isolation checks.
- `scripts/` — `demo-index.mjs` (the demo map), `measure-bundle-size.mjs`, `check-bundle-size.mjs`
  (the regression gate), and `run-ssr-dsd-check.mjs`.
- `bundle-size-baseline.json` — committed baseline for the size gate.
- `FINDINGS.md` — the chronological investigation log. The decision-oriented write-up is in
  `docs/webcomponents-migration/`.

## How to use

Every component resolves the **real** `gd-design-library/tokens` files directly at runtime (no
hand-copied mirror — see `FINDINGS.md` Sections 13 and 16), so a **real theme object is required**
for correct rendering. Without one, each component falls back to its real token file's own
placeholder-string defaults, which are not meant to render anything visually correct on their own
— this is the real React component's own actual themeless behavior, faithfully reproduced here,
not a Lit-specific limitation.

```ts
// Side-effect import registers every custom element (<gd-button>, <gd-checkbox>, etc.)
import 'web-components'; // or import each class individually, see src/index.ts
import { defaultTheme } from 'gd-design-library/tokens';

const button = document.querySelector('gd-button');
button.theme = defaultTheme; // must be a NEW object reference to trigger a re-render
```

### Plain HTML / vanilla JS

```html
<gd-button variant="primary">Save</gd-button>
<gd-checkbox>Accept terms</gd-checkbox>
<gd-input label="Email" color="primary"></gd-input>
<gd-select></gd-select>
<gd-typography variant="h1" as="h1">Heading</gd-typography>

<script type="module">
  import 'web-components';
  import { defaultTheme } from 'gd-design-library/tokens';

  document
    .querySelectorAll('gd-button, gd-checkbox, gd-input, gd-select, gd-typography')
    .forEach((el) => (el.theme = defaultTheme));
</script>
```

### React

Custom events (`gd-change`, `gd-input`) never auto-wire to an `onFoo` JSX callback prop, on
either React 18 or 19 (`FINDINGS.md` Section 7) — wrap each element with `@lit/react`'s
`createComponent()`, mirroring `harness/Gd*React.tsx`:

```tsx
import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdCheckbox as GdCheckboxElement } from 'web-components';

export const GdCheckbox = createComponent({
  tagName: 'gd-checkbox',
  elementClass: GdCheckboxElement,
  react: React,
});

// Consumption:
<GdCheckbox theme={defaultTheme} checked={checked} onGdChange={(e) => setChecked(e.detail.checked)}>
  Accept terms
</GdCheckbox>;
```

React 19 also assigns primitive/object/array properties natively without a wrapper — **now measured,
not inherited guidance** (`FINDINGS.md` Section 17, verified against React 19.2.8 in
`fixtures/react19-check`). An object prop reaches the property by reference and is not stringified
into an attribute.

Custom-event-to-callback translation still needs the wrapper (or a manual `addEventListener`) on
React 19: an `onGdChange` JSX prop fires **zero** times and is silently dropped — not stringified
into an attribute, and no warning. That silence is the reason to generate wrappers rather than
hand-maintain them.

### Per-component quick reference

| Component       | Key props (all also take `theme`, required)                                                                                                                                                              | Events                                                      | Slots                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `gd-button`     | `variant` (`primary`\|`secondary`\|`tertiary`\|`outlined`\|`text`\|`inherit`), `rounded`, `disabled`, `isLoading`, `isIcon`, `fullWidth`, `type`, `role`, `ariaLabel`, `ariaPressed`, `justifyContent`   | native `click` (bubbles through the shadow root unmodified) | default (content), `icon-start`, `icon-end` |
| `gd-checkbox`   | `checked` (JS property only — `attribute: false`, since an HTML attribute can't express "unset" the way the controlled/uncontrolled distinction needs), `indeterminate`, `disabled`, `size` (`sm`\|`md`) | `gd-change` — `detail: { checked }`                         | default (label)                             |
| `gd-input`      | `value`, `placeholder`, `label`, `helper-text`, `disabled`, `color` (`primary`\|`success`\|`warning`\|`error`), `debounce-callback-time`                                                                 | `gd-input` — `detail: { value }`                            | `adornment-start`, `adornment-end`          |
| `gd-select`     | `items` (array), `value`, `disabled`, `color`, `width`, `min-width`, `max-width`                                                                                                                         | `gd-change` — `detail: { value }`                           | `placeholder`, `empty`                      |
| `gd-typography` | `variant` (`span`\|`h1`–`h6`\|`p`\|`small`\|`caption`\|`header`\|`code`\|`kbd`), `as` (DOM tag), `style-variant` (single value or array)                                                                 | —                                                           | default (content)                           |

### Form participation (`gd-input`, `gd-checkbox`)

Both are **form-associated custom elements** (`static formAssociated = true`, CTORNDSD-646b). They
appear in `form.elements`, contribute to `FormData` under `name`, participate in constraint
validation, and match `:valid` / `:invalid`. Verified in a real browser — see `FINDINGS.md`
Section 17.

| Prop / member                                           | Notes                                                                                               |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `name`                                                  | Submission key. Absent `name` means no submission, same as native                                   |
| `required`                                              | Sets `valueMissing`; blocks submit with a native validation bubble                                  |
| `value`                                                 | On `gd-checkbox` this is the value submitted **when checked** (defaults to `'on'`, matching native) |
| `form`, `validity`, `validationMessage`, `willValidate` | Read-only, mirroring `HTMLInputElement`                                                             |
| `checkValidity()`, `reportValidity()`                   | Standard methods                                                                                    |

An unchecked `gd-checkbox` submits **nothing** (the key is absent from `FormData`), matching native
rather than submitting an empty string.

**Two divergences from native to know about:**

- `gd-checkbox.checked` reads `undefined` for an uncontrolled checkbox **even when it is checked** —
  a consequence of the `attribute: false` design above. Read `FormData`, listen for `gd-change`, or
  assign `.checked` to control it; do not treat `.checked` as a native boolean mirror.
- `form.reset()` restores the `checked` value captured at first connect, not a `checked` attribute
  (there isn't one). Assigning `.checked` after mount changes the current state but **not** what
  reset restores.

### Submit and reset buttons (`gd-button`)

`<gd-button type="submit">` and `type="reset"` drive the surrounding `<form>`, so this works with no
consumer wiring:

```html
<form>
  <gd-input name="email" label="Email" required></gd-input>
  <gd-button type="submit" variant="primary">Submit</gd-button>
  <gd-button type="reset" variant="tertiary">Reset</gd-button>
</form>
```

Unlike `gd-input` / `gd-checkbox`, `gd-button` is **not** a form-associated custom element and does
not appear in `form.elements` — it has no value to submit. It also cannot rely on the platform: a
submit button's form owner is the nearest ancestor `form` **in its own tree**, and the real
`<button>` lives in a shadow root that contains no form, so `innerButton.form` is `null` and a click
would otherwise do nothing at all. `gd-button` therefore resolves the form itself via
`closest('form')` and calls `requestSubmit()` / `reset()`.

What follows from that:

- **`closest('form')` does not pierce shadow boundaries**, deliberately — that is the same scoping
  the platform's form-owner algorithm uses. A `gd-button` slotted into a component whose shadow root
  holds the `<form>` will not submit it, exactly as a native `<button>` would not.
- **`requestSubmit()`, not `submit()`** — interactive validation still runs, `required` still blocks
  submission with a native validation bubble, and the `submit` event stays cancelable.
- **`preventDefault()` on the click cancels the submission**, from the host or any light-DOM
  ancestor, matching the React `Button`. The form action is deferred one task to make that possible;
  see the `_onClick` doc comment for why a microtask is not sufficient.
- **`event.submitter` is `null`** — the one deviation. `requestSubmit(submitter)` requires a submit
  button already associated with the form, which by the above this one is not. No `FormData` entry is
  lost: `ButtonProps` exposes no `name` / `value`, so the React `Button` contributes none either.
- A `disabled` (or `isLoading`) `gd-button` submits nothing.

### CSS Parts

Consumer CSS can style internals from outside the shadow root:

| Component     | Parts                                                           |
| ------------- | --------------------------------------------------------------- |
| `gd-button`   | `button`, `content`, `icon-start`, `icon-end`, `spinner`        |
| `gd-input`    | `outer`, `label`, `row`, `input`, `border`, `outline`, `helper` |
| `gd-checkbox` | `label`, `input`, `indicator`                                   |

```css
gd-button::part(button) {
  border-radius: 12px;
}
gd-input::part(label) {
  text-transform: uppercase;
}
```

Part names are the short semantic role, not the internal class names — `::part(content)`, not
`.gd-button__content`. The classes are an implementation detail; part names are public API.

**Not yet supported by any component** (named gaps, not silently assumed): imperative public methods
beyond the form-validation ones listed above (e.g. `.focus()`), and `::part()` on `gd-select` /
`gd-typography`.

## Running locally

**Everything runs from the repo root.** You never need to `cd` into this package.

```bash
npm run demo:setup    # once: builds dist/ + installs the fixtures (~2-3 min)
npm run demo:index    # lists every demo, its URL, what it proves, and what it needs
npm run demo:harness  # prints the demo map, then serves the harness pages on :5173
```

`demo:index` is the authoritative list — it reads the actual harness directory and checks build
prerequisites, so it cannot drift out of date the way a hand-written list would. Run it rather than
trusting the summary below.

### Demo pages

| Page                                     | Proves                                                                     | Findings     |
| ---------------------------------------- | -------------------------------------------------------------------------- | ------------ |
| `form-participation-check.html`          | Native `<form>` participation + `::part()` crossing the shadow boundary    | §17.1, §17.2 |
| `shell-isolation-check.html`             | The CTORNDSD-286 collision, and that Shadow DOM blocks it both directions  | §1, §15      |
| `remaining-findings-repro.html`          | Input cursor stability · Typography discoverability gap · Select `popover` | §4, §5, §6   |
| `fidelity-check.html`                    | All 5 atoms with the real theme, for comparison with Storybook             | §9, §16      |
| `perf-check.html`                        | Mount/update speed: React vs native Lit vs shell (auto-runs, ~30s)         | §14, §18.1   |
| `ssr-dsd-static.html` / `-hydrated.html` | Server-rendered DSD with zero client JS, then hydration                    | §2           |

`fidelity-check` and `perf-check` need `dist/libs/ui/styles.css` (`npm run build:ui`). The two
`ssr-dsd-*` pages are **generated** by `npm run check:web-components-ssr` — they do not exist until you
run it.

Start Storybook in a second terminal (`npm run storybook`, port 6006) to compare against the real React
components.

### Checks

```bash
npm run test:web-components        # 35 browser tests, real Chromium (jsdom cannot host these)
npm run check:web-components-ssr   # server-render + write the DSD reproduction pages
npm run check:web-components-size  # bundle size + regression gate vs the committed baseline
npm run verify:web-components      # type-check + lint + both test suites + size gate — the CI gate
```

Individually: `npm run type-check:web-components`, `npx nx lint web-components`,
`npm run build:web-components`.

### Framework fixtures

```bash
npm run demo:react19   # :5273 — React 19 interop
npm run demo:next      # :5373 — Next.js SSR
```

Both live outside npm workspaces because they need React 19 while this repo is pinned to 18.3.1. See
[`fixtures/README.md`](../../fixtures/README.md).

### Tests must use a real browser

`vitest.config.ts` defines a browser-mode project with the Playwright provider. This is a technical
constraint, not a preference: jsdom does not reliably implement Constructable StyleSheets, the `popover`
attribute, or Declarative Shadow DOM — the three mechanisms these components depend on. Browser mode
also supplies **trusted** input, which matters because §6 documents a concrete false negative from
synthetic `element.click()`.

## Parallel-safety

This package is the only one of the two investigation tracks that touches shared root config
(one line in `package.json`'s `workspaces` array). The sibling React Native track
(`spike-react-native`) is deliberately kept fully standalone, outside npm workspaces — see its
own README — so the two tracks never edit the same shared file and can be worked on
independently (parallel branches/worktrees, or two engineers) with no merge conflicts between
them.
