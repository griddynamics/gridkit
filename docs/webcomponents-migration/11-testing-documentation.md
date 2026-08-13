# 11 — Testing and Documentation Strategy

**Owner:** CTORNDSD-646c · **Answers:** CTORNDSD-646 acceptance criterion 12 and the testing half of 13 · **Status:** Partially delivered

## Starting point

`libs/web-components` had **zero tests and zero stories**. Everything the spike validated was
validated by hand, in a browser, once. That is fine for a spike and unacceptable for a shipping
package: `FINDINGS.md` records at least four behaviors that are subtle enough to regress silently —
the Input cursor guard, Select's `popover="auto"` dismissal, the Checkbox `attribute: false`
constraint, and theme-switching reactivity.

## Delivered: a real-browser test project

`libs/web-components/vitest.config.ts`, run as `npm run test:web-components`. **35 tests, all
passing**, across 4 files.

**jsdom is not viable, and that is a technical constraint rather than a preference.** These components
depend on three things jsdom does not implement reliably: Constructable StyleSheets
(`adoptedStyleSheets` + `replaceSync`), the `popover` attribute and its native light-dismiss
algorithm, and Declarative Shadow DOM. The repo's existing `unit` project is jsdom-based and cannot
host these tests at all — hence a fifth project rather than an extension of the fourth.

Browser mode with the Playwright provider also supplies **trusted** input. This is load-bearing:
`FINDINGS.md` §6 documents a concrete false negative from synthetic `element.click()`, because the
browser's popover light-dismiss algorithm ignores untrusted events entirely. A suite built on
synthetic events would have encoded that wrong answer permanently.

| File                                             | Covers                                                                                                                       |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/components/gd-button/gd-button.spec.ts`     | Real token resolution, CSS parts, `:disabled` via genuine CSS matching, and 4 tests guarding the new shared-stylesheet cache |
| `src/components/gd-checkbox/gd-checkbox.spec.ts` | The `attribute: false` constraint, form participation, and a regression test for the reset bug                               |
| `src/components/gd-input/gd-input.spec.ts`       | The cursor-stability guard (both halves), `gd-input` event payload, form participation                                       |
| `test/a11y.spec.ts`                              | axe across all five, accessible names, and the Section 5 discoverability distinction                                         |

### Behaviors promoted from manual harness probes to assertions

- **The Input cursor guard (§4)**, both directions: an external `value` write while focused is
  dropped and the caret does not move, **and** the dropped value is reconciled on blur. Asserting only
  the first half would let a change silently strand the value forever.
- **The `attribute: false` controlled constraint (§8)**: `<gd-checkbox checked>` in markup does _not_
  check the box, and `.checked` reads `undefined` even when the control is checked. Both are documented
  divergences from native, now locked down.
- **The form-reset bug found in 646b**, asserted on the `FormData` outcome rather than the `.checked`
  property — because the property was the _misleading_ signal that made the bug look fixed when it
  was not.
- **Theme reactivity**: a new object re-renders; in-place mutation does not.
- **Shared-sheet isolation**: rethemeing one button leaves same-variant siblings untouched.

### Two of my own test assertions were wrong, and both were instructive

Worth recording because they are traps the next person will hit:

1. `structuredClone(defaultTheme)` throws `DataCloneError`. The theme's leaves are frequently
   `(theme) => value` **functions**, which are not structured-cloneable. Use a spread chain.
2. Asserting on a shadow node's `textContent` returns **empty** for slotted content. The text is
   light-DOM content assigned to a `<slot>`, so read it via `assignedNodes({ flatten: true })`. This is
   the same mistake made once during 646b (§17.4) — twice now, which is why it is written down.

## Accessibility — and the bug the suite found on its first run

Automated a11y coverage via `axe-core`. On its **first execution** it reported two violations, one of
which was real:

> **`label: Form elements must have labels` — a genuine bug.** `gd-input` rendered its label as a bare
> `<span>` with nothing associating it to the `<input>`. The accessible name silently fell back to the
> **placeholder**. Section 9 added the label for visual fidelity and never wired it up. Fixed with a
> real `<label for>` inside the shadow root's ID scope, plus an `aria-label` fallback from the
> placeholder when no visible label exists. Regression-tested.

This is the clearest justification for the whole test layer in this document: one run of automated a11y
found a real defect that months of visual comparison against Storybook did not.

**`button-name` is a false positive, verified not assumed.** `gd-button` renders
`<button><slot></slot></button>`, so its label is slotted. The browser's accessible-name computation
walks the flattened tree and gets it right — confirmed against Chromium's own accessibility tree, which
reports `button "Primary"` and `button "Styled via ::part()"` for exactly these elements. axe does not
follow slot assignment. The rule is disabled with that reasoning inline, **and** a separate test asserts
the flattened text directly so a genuinely unnamed button would still be caught.

**Generalizable finding: automated a11y tooling has incomplete Shadow DOM support.** That is a real
limitation of this test layer, not of the components, and any a11y budget for this migration should
assume some manual screen-reader verification remains necessary.

`color-contrast` is also disabled — it needs a painted layout with final fonts and is flaky headless.
It belongs in the visual-regression pass, which is not built.

## Bundle-size regression gate — delivered

`scripts/check-bundle-size.mjs` + committed baseline, as `npm run check:web-components-size`. Verified
green against the baseline **and** failing with exit 1 on an artificial regression. Details and the
10% tolerance rationale in `10-performance-report.md`.

## Test category coverage

| Category               | Status                                                                                             |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| Unit                   | **Delivered** — 35 tests                                                                           |
| Component behavior     | **Delivered**                                                                                      |
| Accessibility          | **Delivered** (axe + accessible-name assertions), with the Shadow DOM tooling caveat               |
| Bundle-size regression | **Delivered**                                                                                      |
| Browser integration    | **Delivered** by construction — every test runs in real Chromium                                   |
| Visual regression      | **Not attempted**                                                                                  |
| SSR                    | **Not attempted** — `scripts/run-ssr-dsd-check.mjs` remains a manual script, not an asserting test |
| Hydration              | **Not attempted**                                                                                  |
| React wrapper          | **Not attempted** — the wrappers live in `harness/`, and generation is still a proposal            |
| Cross-framework        | **Not attempted** — Vue/Angular examples are reasoned, not verified                                |
| Performance regression | **Not attempted** — perf is measured but not gated                                                 |

### The three worth doing next, in order

1. **Promote `run-ssr-dsd-check.mjs` to an asserting test.** It already produces the two most valuable
   SSR facts (zero-script static render, `domNodeReusedAcrossHydration`); they are simply not asserted,
   so a regression would be invisible.
2. **`gd-select` keyboard-navigation and light-dismiss tests.** Select is the most complex ported
   component and the only one whose correctness depends on a native browser algorithm. It currently has
   **no** test file, which is the largest single hole in this suite.
3. **Visual regression**, mirroring `libs/ui`'s `*.test.visual.tsx` pattern — the natural home for
   colour-contrast too.

## Storybook — not attempted, with a blocking question

CTORNDSD-646's PoC section requires Storybook documentation, and none exists for the Lit atoms.

**The blocking question was not resolved: can one Storybook instance host both the React and the Lit
renderer?** `libs/ui` uses `@storybook/react-vite`; Lit needs `@storybook/web-components-vite`. The
plan flagged deciding this _before_ building either path, and it remains undecided — so building
stories now risked doing the work twice.

What the documentation must cover once that is settled: attributes, properties, events, slots, CSS
custom properties, and **CSS parts** (now a real API surface, see `07-shadow-dom.md`). In the interim,
`libs/web-components/README.md` carries a per-component reference table and has been updated with the
form-participation and CSS-parts APIs.

## Screenshot evidence

646b began tracking evidence properly: two screenshots under
`docs/webcomponents-migration/assets/`. The two older ones §1 and §9 cite are **still untracked** —
`/libs/web-components/screenshots/` remains gitignored, and recapturing them requires a browser session
against Storybook. Still outstanding; it is the last remaining item from 646a's W1.
