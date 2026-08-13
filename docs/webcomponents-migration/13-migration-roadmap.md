# 13 — Incremental Migration Roadmap

**Owner:** CTORNDSD-646d · **Answers:** CTORNDSD-646 acceptance criteria 15 and 16 · **Status:** Delivered

A proposal, not a commitment. Each phase becomes its own ticket if the initiative is approved. Work
sizing comes from `12-complexity-matrix.md`: **21 CSS conversions, 35 remaining element ports, 3
dependency decisions.**

## Phase 0 — Resolve the three unknowns that gate everything else

Not in the ticket's 11-phase list, and it belongs first. Each of these changes the plan rather than
executing it, and doing any of them late is expensive.

| #   | Question                                 | Why it gates                                                                                                                                                                                   | Owner input needed                                   |
| --- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 0.1 | **Minimum browser-support matrix**       | Declarative Shadow DOM and `popover` are load-bearing (Chrome/Edge 111+, FF 123+, Safari 16.4+). Below that floor, `gd-select`'s dismissal needs a fallback and the no-JS story is unavailable | **Organizational — cannot be answered in this repo** |
| 0.2 | **`@lit/context` evaluation**            | Gates 5+ compound components (`Dropdown`/`DropdownItem`, `Accordion`, `RadioGroup`, `Tabs`, `Menu`) **and** nested theming. One evaluation answers both                                        | Engineering                                          |
| 0.3 | **`Chart`'s six `@visx/*` dependencies** | Either `Chart` leaves the catalog or it becomes the largest single item in it                                                                                                                  | Product + engineering                                |

**Exit criteria:** all three answered in writing. 0.1 has no in-repo path and should be raised now, not
at rollout.

## Phase 1 — Architecture discovery and proof of concept

**Status: complete**, and this document exists because of it. 5 atoms ported, Shadow DOM isolation
proven against CTORNDSD-286, SSR/DSD proven, bundle size measured, `::part()` and `ElementInternals`
delivered, React 19 verified, Next.js integration characterized, 35 tests, and a bundle-size gate.

**One gap deliberately left open:** no overlay component was ported. `12-complexity-matrix.md` names
this as the largest evidence gap — 9 components with zero focus-management data.

**Recommended addition before Phase 4:** port `Modal`. It closes focus trapping, scroll locking,
`inert`, and the native-`<dialog>`-versus-portal question in a single pass, and it is the highest-leverage
estimate-narrowing action available.

## Phase 2 — Shared token and theme extraction

**Status: largely complete.** `gd-design-core` exists, is dependency-free, and is consumed by both the
Lit and React Native ports. Components resolve the **real** token objects via `resolveThemeTree` with no
hand-mirrored copy — proven by editing a token file and watching a live element change through HMR alone.

Remaining:

- **An RSC-safe token entry point.** `gd-design-library/tokens` cannot be imported in a React Server
  Component — the barrel transitively pulls in `@emotion/react` via `tokens/utils.ts`'s `keyframes`, and
  that calls `React.createContext` (**measured**, `08-react-and-nextjs.md`). This is a prerequisite for
  any server-side rendering, not an optimization, and it benefits React consumers too.
- **Nested theming.** A per-element `theme` property has no equivalent to `ThemeProvider` nesting —
  the largest gap in `06-styling-theming.md`. Resolved by 0.2.

## Phase 3 — Monorepo and build infrastructure

Per `03-monorepo-structure.md`. Three items are prerequisites rather than housekeeping:

1. **Fix registration and tree-shaking.** `@customElement` calls `customElements.define` at module
   evaluation, no `sideEffects` field is declared, so nothing tree-shakes — and the naive fix
   (`"sideEffects": false`) silently breaks registration at runtime. Adopt the split-entry pattern
   (`button/button.js` exports the class, `button/define.js` registers it) **before** the catalog grows,
   because retrofitting it across 39 elements is far worse than starting with it.
2. **Rename `web-components` → `gd-design-web`** while it is still `private: true` with zero external
   consumers. Free now, expensive later.
3. **Decide `gd-design-core`'s publish path.** It is not `private`, has an `nx-release-publish` target,
   but no publish script — and it is a _runtime_ dependency of the Lit package. Recommendation: publish it.

Plus: add Changesets (the one real tooling gap), replace the `"*"` workspace wildcards with real ranges,
and add a `treeshake-check` equivalent so item 1 stays fixed.

**Consumption rule to enforce here:** consumers get **built output only**. Turbopack compiling the Lit
source silently breaks all reactivity (**measured**, `08-react-and-nextjs.md`).

## Phase 4 — CSS conversions (21 components)

Deliberately promoted ahead of the element ports. `12-complexity-matrix.md` shows 21 components are
stylesheet work — no element, no shadow root, no browser-mechanism tests.

Why first: cheapest, lowest-risk, no dependency on Phase 0, and it delivers the token-driven styling
layer that the element ports also consume. It also front-loads the components where the native-versus-element
rule matters most (`Typography`, `Link`, `Image`, layout primitives), so consumers see real semantics and
crawler-visible markup early.

**Exit criteria:** utility CSS / native-element guidance published, all 21 documented, `Typography` and
`Link` guidance in place.

## Phase 5 — Form components and remaining native-control wrappers (13 components)

The best-evidenced category. 6 remaining native-control wrappers (`Toggle`, `Slider`, `InputFile`,
`Switch`, `Textarea`) plus the 4 form components, plus `Truncate` and `List`.

Every one is a form control or close to it, and all depend on the `ElementInternals` work **already
proven** in 646b. Two constraints carry forward from `04-component-api-guidelines.md`:

- Match native submission semantics exactly — an unchecked control submits nothing, not an empty string.
- Any nullable boolean prop hits the `attribute: false` constraint, so document the two divergences
  (`.checked` reading `undefined`; reset restoring the connect-time default).

`RadioGroup` is the risk here — a radio group is inherently a coordinated set, so it depends on 0.2.

## Phase 6 — Overlay components (9 components)

**Highest risk, and it must not start before Phase 1's `Modal` addition.** Nothing in the spike
exercised focus trapping, scroll locking, `inert`, or `<dialog>`-versus-portal.

The one real asset: `gd-select` proved the native `popover` attribute replaces hand-rolled portal +
outside-click logic, with trusted-input verification. That covers dismissal and none of focus
management.

Order: `Portal` → `Modal` → `Tooltip` → `Snackbar` → `Dropdown` + `DropdownItem` → `Menu` →
`ImagePreview` → `SearchModal`. `Dropdown`/`DropdownItem` and `Menu` depend on 0.2.

## Phase 7 — Complex interactive components (7 components)

`Tabs`, `Rating`, `Stepper`, `Accordion`, `Scroll`, `DragAndDrop`, `DragAndDropFiles`. `Accordion` and
`Tabs` depend on 0.2.

## Phase 8 — Domain-specific components (7 components)

`Price`, `Search`, `AttachmentFile`, `Header`, `Sidebar`, `ChatContainer`, `Card`.

**`Card` first**, despite being the largest: it has zero state but 40 files, so its cost is composition
and slotting rather than logic — the cost class `Table` also belongs to. Porting it early makes `Table`
estimable.

**Localization and directionality get resolved here.** `04-component-api-guidelines.md` marks both **not
attempted** because no ported component carries formatted values or direction-sensitive layout. `Price`
is the first that does.

## Phase 9 — Data-heavy components (2–3 components)

`List` (moved earlier), then `Table` (XL, 1164 impl LOC — 1.4× `Select`, which was itself only completed
at reduced scope), then `Chart` **only if 0.3 unblocked it**.

Do not start `Table` before `Card` ships.

## Phase 10 — React wrapper delivery

**Generate, do not hand-maintain.** Each wrapper is ~5 lines whose only per-component input is the event
map, and a missing entry produces a prop that **silently never fires** — no attribute, no warning, no
error, on either React 18 or 19 (**measured**, `08-react-and-nextjs.md`). Hand-maintaining 39 of these
guarantees drift with an invisible failure mode.

Ship as `gd-design-web-react` so React is a dependency of the wrapper layer, not of the elements.

## Phase 11 — SSR and hydration

Decide whether Next.js must emit Declarative Shadow DOM. Today it does not: `<template shadowrootmode>`
count is 0, and a no-JS page has unstyled text and **no headings at all** (**measured**,
`09-ssr-hydration.md`).

If yes: wire `@lit-labs/ssr-react` — blocked on Phase 2's RSC-safe token entry point. If no: state
plainly that these are client-rendered islands and content needing no-JS availability stays in native
elements. Either is defensible; drifting into one by accident is not.

## Phase 12 — Consumer migration

See the migration path below.

## Phase 13 — Legacy React package deprecation

Only after consumers have migrated. `gd-design-library` remains published throughout; deprecation is the
last step, not a parallel track.

---

## Coexistence: side-by-side, never nested

React and Lit components must coexist on one page for the whole migration. **The spike constrains how.**

**Side-by-side works.** Both render into the same document; Lit components take a `theme` property while
React components use `ThemeProvider`. Both resolve the same real token objects, so a token change reaches
both simultaneously (**measured**, `FINDINGS.md` §§13, 16).

**Nesting a React component inside a Lit element does not work.** Built and measured, not assumed: the
naive Lit-wraps-React shell is the _slowest_ of the three options to mount (~44 ms/300) and renders with
**no styling at all** — the Shadow DOM boundary that keeps the page's hostile reset out also keeps the
component's own `document.head`-injected Emotion styles out (**measured**, `FINDINGS.md` §15).

So the coexistence rule is: **a page may contain both; a component tree may not straddle the boundary.**
Migrate at page or region granularity, leaf-first.

**Theme consistency during transition** needs the helper every harness in this spike wrote by hand — walk
a container and assign `theme` to every GridKit element within it. Ship it (`06-styling-theming.md`)
rather than making each consumer reinvent it.

## Consumer migration path

| Topic                        | Plan                                                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Compatibility layer**      | `gd-design-web-react` (Phase 10) gives React consumers idiomatic `onGdChange` props, so most migration is an import swap plus a rename                                                   |
| **Import migration**         | `import { Button } from 'gd-design-library'` → `import { GdButton } from 'gd-design-web-react'`. Mechanical; codemod-able                                                                |
| **Event API migration**      | `onChange` → `onGdChange` (`detail.checked`), `onInput` → `onGdInput` (`detail.value`). Payloads move into `detail` — the one non-mechanical part                                        |
| **Theme migration**          | `<ThemeProvider theme={t}>` → `theme` property per element, **or** the container helper above. Must assign a **new object**; in-place mutation does nothing                              |
| **CSS override migration**   | Emotion class targeting → `::part()`. The part inventory is in `07-shadow-dom.md`; `gd-select` still needs parts before this is complete                                                 |
| **Controlled-value changes** | Document the two divergences: `.checked` reads `undefined` for an uncontrolled checkbox even when checked, and `form.reset()` restores the connect-time default rather than an attribute |
| **Codemod scope**            | Specified, **not built** (post-approval). Covers imports and event-prop renames. Theme migration and CSS overrides need human judgment and should not be codemodded                      |
| **Deprecation period**       | `gd-design-library` stays published and supported through Phase 13. Minimum two minor releases with both available before any deprecation warning                                        |
| **Versioning**               | Independent per package; strict (`~`) ranges on `gd-design-core` since it is the shared substrate                                                                                        |
| **Communication**            | Announce at Phase 4 (CSS conversions land first and are visible), publish the migration guide with Phase 10, warn at Phase 13                                                            |

## Cross-cutting cost that is easy to forget

`11-testing-documentation.md` established the test infrastructure but covers 4 components. **Every ported
component needs its own real-browser tests**, and jsdom cannot host them — so per-component test cost is
a real line item, not overhead absorbed by the first port.

Still outstanding from that document and needed before broad rollout: `gd-select` has **no test file at
all**, Storybook for Lit atoms is unbuilt (blocked on whether one instance can host both renderers),
and there is no visual-regression, SSR, or hydration test coverage.

## What would make this roadmap wrong

- **0.1 resolving below the DSD/`popover` floor** — invalidates Phase 11 and forces fallbacks in Phase 6.
- **0.2 concluding `@lit/context` is unsuitable** — 5+ components across Phases 5–7 need a different
  answer, and nested theming stays unsolved.
- **`Modal` proving that focus management inside Shadow DOM is materially harder than expected** — Phase 6
  is 9 components, and every rating in it is extrapolated.
- **Runtime mount cost mattering more than assumed.** The stylesheet cache made mount 50% faster but Lit
  is still 2.3× slower than React at 300 instances and 3.4× at one (**measured**,
  `10-performance-report.md`). If a target application is mount-bound, that reopens the recommendation.
