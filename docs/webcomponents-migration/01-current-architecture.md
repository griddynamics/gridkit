# 01 — Current Architecture Assessment

**Owner:** CTORNDSD-646a · **Answers:** CTORNDSD-646 acceptance criterion 1 · **Status:** Delivered

Everything below is **measured** — read directly from the repository at `origin/develop` `3d12820`
— unless labelled otherwise. This document describes _what exists today_. Proposed changes live in
`02-architecture-options.md` and later documents.

## 1. Package under migration

`gd-design-library`, at `libs/ui`. One of three publishable packages in an Nx + npm-workspaces
monorepo; the other two (`gd-form-configurator`, `gd-form-configurator-react`) are out of scope for
this spike.

## 2. React-specific dependencies

### Peer dependencies — the consumer contract

| Package           | Range                  | Migration implication                                                                                                       |
| ----------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `react`           | `^18.0.0 \|\| ^19.0.0` | The library already claims React 19 support. Section 7 of `FINDINGS.md` notes the Lit port was only verified against 18.3.1 |
| `react-dom`       | `^18.0.0 \|\| ^19.0.0` | Same                                                                                                                        |
| `@emotion/react`  | `^11.14.0`             | The styling engine being replaced                                                                                           |
| `@emotion/styled` | `^11.14.0`             | Declared, but component code uses the `css` prop, not the `styled` builder                                                  |
| `embla-carousel`  | `^8.0.0`               | Carousel engine; framework-agnostic core with a React binding                                                               |

### Runtime dependencies — and which are actually migration blockers

The published package declares four runtime dependency groups. They are usually treated as one
"hard components" bucket; grepping the source shows they are three different problems and only one
real blocker. Consumer paths below are **measured** — resolved by grepping `libs/ui/src`, not
inferred from the dependency name.

| Package                                                                                         | Consumed by                                                                                            | Notes                                                                                                                                                                                                         |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@visx/curve`, `@visx/gradient`, `@visx/group`, `@visx/shape`, `@visx/tooltip`, `@visx/xychart` | `components/organisms/Chart/ChartCartesian.tsx`, `ChartPie.tsx` (and `ai/schemas/components/Chart.ts`) | Six packages, one component. visx is React-first by design; there is no Lit port                                                                                                                              |
| `embla-carousel-react`                                                                          | `hooks/useCarousel/useCarousel.tsx` → consumed by `organisms/Carousel` and `organisms/ContentCarousel` | The React binding is isolated behind **one hook**, and the underlying `embla-carousel` is framework-agnostic. This is the tractable case — replace one hook with direct core usage and both components follow |
| `uuid`                                                                                          | `components/molecules/Snackbar/SnackbarManager.tsx`                                                    | Framework-agnostic; no migration cost                                                                                                                                                                         |
| `@react-spring/web`                                                                             | **nothing**                                                                                            | Declared as a runtime dependency in `libs/ui/package.json` but **zero usages anywhere in `libs/`**. See below                                                                                                 |

**Assessment.** Three distinct shapes hide behind four dependency entries, and only one is a real
migration blocker:

- **`embla-carousel-react` is a binding swap, and cheaper than it looks.** The React binding is
  confined to a single hook (`hooks/useCarousel/useCarousel.tsx`), so `Carousel` and
  `ContentCarousel` do not each carry their own coupling. Replacing that one hook with direct
  `embla-carousel` core usage unblocks both.
- **The six `@visx/*` packages are a genuine architectural decision**, and the only true blocker in
  this list. Either `Chart` stays React-only indefinitely, or a different charting approach is
  selected. This must be an explicit roadmap decision in `13-migration-roadmap.md`, not discovered
  during implementation.
- **`@react-spring/web` appears to be an unused dependency.** `grep -rl "@react-spring" libs`
  returns nothing. It is declared at `libs/ui/package.json:59` and ships as a runtime dependency of
  the published package, so consumers resolve and install it for no benefit. It is **not** in
  `libs/ui/knip.json`'s `ignoreDependencies` list (which covers `@emotion/react`,
  `@emotion/styled`, `embla-carousel`, `@testing-library/react`, `storybook`), so `verify:ui`'s
  `knip-check` phase should already be flagging it — worth running that phase to confirm, then
  removing it if genuinely dead. A small, independent cleanup that is **not** part of this
  migration but was surfaced by it. Recorded here so it is not lost.

### React API surface in use

| Pattern                    | Count   | Migration implication                                                                                                                                                                                                                |
| -------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Files with `'use client'`  | **224** | Marks the client-only boundary for RSC. Custom elements are inherently client-side, so this boundary must be re-established differently — see `08-react-and-nextjs.md`                                                               |
| Files using `forwardRef`   | **151** | Nearly every component forwards a ref. Custom elements expose the element itself, so this is mostly a simplification — but any component whose ref exposes an _imperative method_ needs that method re-declared on the element class |
| `createContext` call sites | **6**   | `hooks/useTheme`, `hooks/useLogger`, `atoms/Select/hooks/useSelectContext`, `molecules/Dropdown/hooks/useDropdown`, `molecules/Accordion/hooks/useAccordion`, `utils/a2ui/contexts`                                                  |

**The 6 context sites are the structurally interesting ones**, because Web Components have no
context primitive. Three distinct problems hide behind that single count:

1. `useTheme` — cross-cutting, every component reads it. The Lit port solves this with a `theme`
   **property** per element (**measured**; see §5 below and `06-styling-theming.md` for why that is
   not a like-for-like replacement).
2. `useSelectContext`, `useDropdown`, `useAccordion` — parent-to-descendant communication within one
   component's subtree. Slots plus element properties can cover this, but the compound-component
   pattern (`<Dropdown><DropdownItem/></Dropdown>`) relies on implicit context that has no direct
   custom-element analogue. **Not yet investigated** — no compound component has been ported.
3. `useLogger`, `a2ui/contexts` — infrastructure, not component rendering.

## 3. Styling model being replaced

Emotion, used through the `css` prop rather than `styled` components:

- Token files live in `libs/ui/src/tokens/`, one per component (`button.ts`, `input.ts`,
  `typography.ts`, …), composing into `defaultTheme`.
- Each token file is an object whose leaves are frequently `(theme) => value` **functions**, resolved
  through a `get(theme, path, default)` helper.
- Nested keys carry raw CSS pseudo-selector strings — `'&:hover, &.hover'`,
  `'&:disabled, &:disabled *'` — which Emotion compiles.
- A component composes an array of token blocks (`componentStyles`) which Emotion merges in order.
- **The fallback values in the real token files are debug placeholder strings**, not real values —
  e.g. `get(theme, 'colors.bg.fill.primary', 'theme.colors.bg.fill.primary')`. They were never meant
  to render, because `ThemeProvider` always supplies a full theme. This is a genuine trap for any
  port that resolves the real objects: a themeless render produces invalid CSS rather than a sane
  default (**measured**, `FINDINGS.md` Sections 13 and 16).

`ThemeProvider` wraps Emotion's provider and exposes the theme via `useTheme()`. Consumers override
styling by passing a custom theme object.

## 4. Public API surface — the contract a port must not break

`libs/ui/package.json` declares **7** export subpaths:

| Subpath                             | Contents                                                                                                         |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `.`                                 | Components, hooks, tokens, assets                                                                                |
| `./styles.css`                      | Global CSS reset + Fira Sans/Fira Code Google Fonts. **Not auto-imported** — consumers must import it explicitly |
| `./tokens`                          | Raw token modules and `defaultTheme` without the component tree                                                  |
| `./renderer`                        | `renderA2UISpec`, `A2UI_RENDERER_COMPONENT_TYPES`, `A2UICustomComponentDefinition`                               |
| `./ai`                              | Prompt builders, schemas, discovery, A2UI spec tools                                                             |
| `./ai/ui-specification-schema.json` | A2UI spec JSON Schema                                                                                            |
| `./llms.txt`                        | Canonical component API reference for LLMs, auto-generated                                                       |

Wildcard subpaths were deliberately removed to prevent internal path coupling.

> **Note for maintainers:** the root `CLAUDE.md` describes "four explicit subpaths". The package
> actually declares seven. `CLAUDE.md` is out of date on this point.

Two obligations here are easy to overlook and both constrain the migration:

1. **`./styles.css` is the font and reset delivery mechanism.** A Shadow-DOM-encapsulated component
   does not inherit a global reset — that is the entire point of the isolation win — but it _does_
   inherit inheritable properties like `font-family`. `FINDINGS.md` documents a real instance of
   this biting: a harness that omitted the Fira Sans `@font-face` produced byte-identical computed
   CSS to Storybook while rendering visibly different glyphs (**measured**, Section 10 follow-up).
2. **`./llms.txt` and `./ai` are a generated contract.** `llms.txt` is the canonical component API
   reference and is regenerated by `npm run generate-ai-docs`. The A2UI renderer maps component type
   strings to real components. Any Lit port that changes prop names, enum values, or event names
   must regenerate these, or the AI-facing surface silently drifts from the runtime.

## 5. How the existing Lit port handles the above

Recorded here because it is the current state of the repo, not a proposal.

- **Theme:** each element takes a `theme` **property**. It is a normal Lit reactive property compared
  by reference, so consumers must assign a _new_ object to trigger a re-render; mutating in place
  does nothing (**measured**, Section 13).
- **Token source of truth:** components import the **real** token object from
  `gd-design-library/tokens` and resolve it with `resolveThemeTree` from `gd-design-core`. There is
  no hand-mirrored copy. Verified by editing `libs/ui/src/tokens/button.ts` and observing the change
  reach a live element through Vite HMR alone (**measured**, Sections 13 and 16).
- **Boundary rule:** `gd-design-core` takes **no** `gd-design-library` dependency, keeping it usable
  by React Native and any future adapter. `libs/web-components` does take it, scoped to token
  imports. This is the load-bearing architectural boundary of the current design.
- **CSS generation:** `gd-button` uses a per-instance Constructable StyleSheet with real CSS
  pseudo-class selectors, no inline styles. Interaction state is matched by the browser's style
  engine rather than JS-tracked flags (**measured**, Section 12).

## 6. Test and release gates a port must satisfy

### Vitest projects (4), at `libs/ui/vitest.config.ts`

| Project            | Environment                           | Matches                                                        |
| ------------------ | ------------------------------------- | -------------------------------------------------------------- |
| `unit`             | jsdom                                 | `**/*.{test,spec}.{ts,tsx}`                                    |
| `visual`           | Playwright/Chromium                   | `**/*.test.visual.{ts,tsx}`                                    |
| `storybook`        | Playwright/Chromium against Storybook | `**/*.stories.*`                                               |
| `a2ui-integration` | Playwright/Chromium                   | `**/*.a2ui.integration.{ts,tsx}`, requires `ANTHROPIC_API_KEY` |

**None covers `libs/web-components`.** A fifth project is required, and it cannot be jsdom-based:
jsdom does not reliably implement Declarative Shadow DOM, the `popover` attribute, or Constructable
StyleSheets — the three mechanisms the Lit port depends on. See `11-testing-documentation.md`.

### `verify:ui` — 10 parallel gates

Run against built `dist` via `npm run verify:ui:full` (`libs/ui/scripts/*.mjs`):

`audit-api` · `knip-check` · `treeshake-check` · `agadoo-check` · `build-lint` · `ssr-check` ·
`cjs-check` · `attw-check` · `size-check` · `rsc-render-check`

Four of these bear directly on the migration:

- **`ssr-check` and `rsc-render-check`** are the existing SSR contract. Components must render
  without error in Node, and client-only hooks must carry `'use client'`. A Lit port must not
  regress this, and RSC compatibility for custom elements is materially harder — see
  `09-ssr-hydration.md`.
- **`treeshake-check` and `agadoo-check`** enforce side-effect-free exports. This is a live risk for
  the Lit port: `libs/web-components/src/index.ts` is a side-effect barrel that registers every
  custom element on import, which defeats per-component tree-shaking. Registration strategy is an
  open design question, flagged in `03-monorepo-structure.md`.

Build output is dual ESM (`preserveModules`) + CJS to `dist/libs/ui`, with `scripts/postbuild-types.mjs`
patching `.d.ts` exports. React and `@emotion/*` are externalized.

### Pre-existing gate failure on this branch

`npm run storybook:test` currently fails: **2 failed / 468 passed** across 62 story files, all in
`libs/ui/src/components/layout/ChatContainer/ChatContainer.stories.play.ts` —
`shouldAssertButtonAccessible` at `:228:21`, reached via `:61:10` and via
`shouldVerifySidebarInteractions` at `:215:2`.

**Confirmed pre-existing, not a regression** (**measured**): reverting the only change this ticket
made to that file — an appended `parameters.docs.description.component` block — and re-running the
full suite reproduces the identical 2 failures at identical line numbers with identical counts. The
`ChatContainer` story is the one whose assertion breaks; the story-description edits are inert with
respect to interaction tests.

Recorded so a future run does not attribute it to the Web Components work. It should be fixed or
triaged under its own ticket.

## 7. Component catalog — 63 components, grouped by migration category

**63** component directories across **5** tiers: 23 atoms (excluding `types/`), 20 molecules,
13 organisms, 6 layout, 1 widget.

> The `layout` tier is easy to miss — it sits outside the atoms/molecules/organisms naming and is
> absent from the root `CLAUDE.md`'s description of the component structure. Earlier drafts of
> `FINDINGS.md` omitted it and reported the catalog as "~63 remaining" or "~68". The correct figures
> are **63 total, 58 remaining** after the 5 ported atoms.

Grouped into the 7 categories CTORNDSD-646 names. Category boundaries are judgment calls at the
margin; each component appears exactly once, and the groups sum to 63.

| #   | Category                | Count | Components                                                                                                                                                                                                      |
| --- | ----------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Presentational          | 18    | `Box`, `Wrapper`, `Truncate`, `Skeleton`, `Separator`, `Label`, `Image`, `Typography`, `Icon`, `Badge`, `Avatar`, `Loader`, `ProgressBar`, `SliderDots`, `InlineNotification`, `Column`, `Row`, `FlexContainer` |
| 2   | Native-control wrappers | 10    | `Button`, `Link`, `Input`, `Textarea`, `Checkbox`, `Switch`, `Toggle`, `Select`, `Slider`, `InputFile`                                                                                                          |
| 3   | Form                    | 4     | `Form`, `RadioGroup`, `Counter`, `InputArea`                                                                                                                                                                    |
| 4   | Interactive             | 10    | `Accordion`, `Tabs`, `Stepper`, `Breadcrumbs`, `Rating`, `Scroll`, `Carousel`, `ContentCarousel`, `DragAndDropFiles`, `DragAndDrop`                                                                             |
| 5   | Overlay                 | 9     | `Portal`, `Dropdown`, `DropdownItem`, `Menu`, `Tooltip`, `Snackbar`, `Modal`, `SearchModal`, `ImagePreview`                                                                                                     |
| 6   | Data-heavy              | 3     | `Table`, `Chart`, `List`                                                                                                                                                                                        |
| 7   | Domain-specific         | 9     | `Price`, `Card`, `ChatBubble`, `ChatContainer`, `AttachmentFile`, `AvatarUser`, `Header`, `Sidebar`, `Search`                                                                                                   |

### Measured coverage against these categories

The 5 ported atoms fall into just **2** of the 7 categories:

| Category                | Ported                                            | Evidence quality for this category                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native-control wrappers | `Button`, `Checkbox`, `Input`, `Select` (4 of 10) | **Strong, with one caveat** — includes the two hardest small-atom bets, Input's cursor stability and Select's `popover` replacement of hand-rolled outside-click logic. But **`Select` is a reduced-scope rebuild**, not feature-equivalent to `atoms/Select` (per the [Confluence spike page](https://griddynamics.atlassian.net/wiki/spaces/RNDM/pages/4737106015)). Since `Select` is the most complex of the 5, it carries the most weight in any per-component extrapolation and must not be treated as a full-fidelity data point |
| Presentational          | `Typography` (1 of 18)                            | **Adequate** — cheapest category, and its one real cost (DOM discoverability) is measured                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Form                    | none                                              | **None**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Interactive             | none                                              | **None**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Overlay                 | none                                              | **None**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Data-heavy              | none                                              | **None**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Domain-specific         | none                                              | **None**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

**44 of 63 components sit in categories with no measured data point.** This is the dominant
uncertainty in any effort estimate built on this spike, and it is a direct consequence of the
decision not to extend the proof of concept. `12-complexity-matrix.md` must label every rating in
those five categories as extrapolated.

The gap is not uniform in risk. Overlay is the sharpest: `Select` exercised the native `popover`
attribute successfully (**measured**, Section 6), which is genuine evidence for the category, but
nothing exercised focus trapping, scroll locking, `inert`, or the native-`<dialog>`-versus-portal
decision. Data-heavy is the next sharpest, because `Chart`'s six visx dependencies make it a
dependency decision rather than a porting exercise.
