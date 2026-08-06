# 03 — Monorepo Structure and Release Strategy

**Owner:** CTORNDSD-646a · **Answers:** CTORNDSD-646 acceptance criterion 4 · **Status:** Delivered

## Current state

**measured** — read from `package.json`, `nx.json`, and each project's config.

npm workspaces plus Nx. Five workspace members:

| Path                                   | Package name                 | Private | Published via                             |
| -------------------------------------- | ---------------------------- | ------- | ----------------------------------------- |
| `libs/ui`                              | `gd-design-library`          | no      | `npm run publish:ui`                      |
| `libs/design-core`                     | `gd-design-core`             | **no**  | **nothing** — see §4                      |
| `libs/web-components`                  | `web-components`             | **yes** | n/a                                       |
| `libs/form-configurator/core`          | `gd-form-configurator`       | no      | `npm run publish:form-configurator-core`  |
| `libs/form-configurator/adapter-react` | `gd-form-configurator-react` | no      | `npm run publish:form-configurator-react` |

Nx runs with 4 inferred-target plugins — `@nx/vite`, `@nx/eslint`, `@nx/storybook`, `@nx/jest` — and
**no `targetDefaults`**. There is no `packageManager` field. Releases are four hand-written
`npm publish dist/...` scripts with no changelog, version coordination, or dependency-range rewriting.

`libs/web-components` builds ESM-only (`formats: ['es']`) from a single entry `src/index.ts`, with
`preserveModules: true` and `lit`, `gd-design-core`, and `gd-design-library` all externalized. Output
goes to `dist/libs/web-components`, types via the `dts` plugin.

## 1. Proposed packages

The ticket lists 15 candidate areas. Splitting into 15 packages would be a mistake — `gd-design-library`
already delivers tokens, themes, icons, and styles as **export subpaths** of one package
(`./tokens`, `./styles.css`, `./ai`, `./renderer`), and that works. Subpaths give consumers the same
import granularity as separate packages without the version-coordination cost of publishing them
separately.

So: split on **dependency boundaries that must be enforced**, not on topic.

| Package                                              | Public | Responsibility                                                                                                       | Must not depend on                                                   |
| ---------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `gd-design-core`                                     | yes    | Framework-agnostic state stores and token-tree resolution. The portability boundary                                  | `gd-design-library`, `lit`, `react` — **anything renderer-specific** |
| `gd-design-library`                                  | yes    | React components, tokens, themes, icons, styles, A2UI renderer, AI schemas. Unchanged                                | —                                                                    |
| `gd-design-web`                                      | yes    | Lit custom elements. Renamed from today's `web-components` (§5)                                                      | `react`, `react-dom`                                                 |
| `gd-design-web-react`                                | yes    | Generated `@lit/react` wrappers. Separate package so React is a dependency of the wrapper layer, not of the elements | —                                                                    |
| `gd-form-configurator`, `gd-form-configurator-react` | yes    | Unchanged, out of scope                                                                                              | —                                                                    |

Internal, not published:

| Path                  | Purpose                                                   |
| --------------------- | --------------------------------------------------------- |
| `apps/examples-html`  | Plain-HTML consumption fixture                            |
| `apps/examples-react` | React consumption fixture                                 |
| `apps/examples-next`  | Next.js SSR/RSC fixture (646b builds this)                |
| `tools/codemods`      | Migration codemods (646d specifies; post-approval builds) |

**Not separate packages, deliberately:** tokens, themes, shared styles, icons, utilities, testing
utilities, Storybook, documentation, build tooling. Tokens/themes/icons/styles stay subpaths of
`gd-design-library`; testing utilities stay `gd-design-library/test-utils` (a `knip.json` entry
already treats it as an entry point); Storybook and docs are Nx targets, not artifacts.

## 2. Dependency diagram

```text
                    ┌──────────────────┐
                    │  gd-design-core  │   zustand only. No renderer, no gd-design-library.
                    └────────┬─────────┘
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
   ┌──────────────────┐  ┌──────────┐  ┌──────────────────┐
   │ gd-design-library│  │gd-design-│  │ (future adapters:│
   │     (React)      │  │   web    │  │  React Native …) │
   └────────┬─────────┘  │  (Lit)   │  └──────────────────┘
            │            └────┬─────┘
            │  tokens only    │
            └────────────────►│
                              ▼
                    ┌──────────────────────┐
                    │ gd-design-web-react  │  @lit/react wrappers
                    └──────────────────────┘
```

### The one rule that must be enforced, not merely documented

**`gd-design-core` must never depend on `gd-design-library`, `lit`, or `react`.**

This is load-bearing rather than stylistic. `gd-design-core` is what makes a non-web renderer
possible at all, and `spike-react-native` already proves it works — `resolveButtonVariantStyle` and
`resolveButtonRadius` are consumed by both the Lit and React Native ports today (**measured**,
`FINDINGS.md` §16).

The boundary was under real pressure during the spike and held for a documented reason. When
`gd-button` needed the _live_ token object rather than a hand-mirrored copy, the import of
`gd-design-library/tokens` was deliberately placed in `libs/web-components`, **not** in
`gd-design-core` — and the generic tree-walker that made it work (`resolveThemeTree`) was written with
no knowledge of which token tree it walks (**measured**, §13). That is the pattern to preserve: put
generic mechanism in the core, put `gd-design-library`-specific knowledge in the adapter.

Enforce it with an Nx module-boundary lint rule (`@nx/enforce-module-boundaries` with project tags),
not a README paragraph. A README cannot fail CI.

`gd-design-web` depending on `gd-design-library` is **allowed and intended** — scoped to token
imports, which is what gives it a single source of truth.

## 3. Component registration and tree-shaking — a real defect

This is the most consequential finding in this document.

**Mechanism (measured).** Each of the 5 components is declared with `@customElement('gd-button')`
etc., which calls `customElements.define` at module evaluation. That is a **side effect**.
`src/index.ts` is a pure re-export barrel of the 5 classes, so `import { GdButton } from 'web-components'`
evaluates all 5 modules and registers all 5 elements.

**Neither `libs/web-components/package.json` nor `libs/design-core/package.json` declares a
`sideEffects` field** (`libs/ui` declares `["**/*.css","**/*.scss"]`). Consequences:

- Bundlers conservatively assume every module has side effects, so **nothing tree-shakes**. A consumer
  who wants one element ships all five. Small today (9.11 kB for 5 atoms); linear in catalog size.
- **The naive fix breaks it silently.** Adding `"sideEffects": false` lets a bundler drop the
  `customElements.define` calls as unused. The classes still export, the build still succeeds, and the
  elements never register at runtime — `<gd-button>` renders as an unknown element. This is the exact
  class of bug that ships to production.
- **No gate would catch either.** `libs/ui` has `treeshake-check` and `agadoo-check` in its 10-phase
  `verify:ui`. `libs/web-components` has **no equivalent**, so both the current non-tree-shaking and a
  future broken `sideEffects: false` would go unnoticed.

**Recommendation — separate the class from its registration**, the pattern Shoelace and Material Web
converged on:

| Import                           | Effect                                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| `gd-design-web/button/button.js` | Exports `GdButton`. **No** `customElements.define`. Side-effect-free                         |
| `gd-design-web/button/define.js` | Imports the class and registers it. Side-effectful, declared as such                         |
| `gd-design-web` (barrel)         | Registers everything. Convenience for prototyping, documented as the non-tree-shakeable path |

Then per-component entry points in the Vite `lib.entry` map (not a single `src/index.ts`), and a
`sideEffects` array listing exactly the `define.js` modules — accurate rather than blanket-true or
blanket-false. Add a `treeshake-check` equivalent to `libs/web-components` so the guarantee is tested.

This also resolves the RSC question in `08-react-and-nextjs.md`: a side-effect barrel is far harder to
place correctly relative to a client boundary than an explicit per-component `define` import.

## 4. `gd-design-core` has no publish path — decide before it becomes a problem

**measured, and currently inconsistent:**

- `gd-design-core` is **not** `private`, is at version `0.0.1`, and has an `nx-release-publish` target.
- There is **no** root `publish:design-core` script, and it is absent from the three publishable
  packages named in `CLAUDE.md`.
- `libs/web-components` **is** `private: true`.

So today nothing publishes, and that is consistent — a private consumer needs no published dependency.
But `gd-design-core` is a **runtime** dependency of `gd-design-web`, so the moment the Lit package
ships, the core must ship first or consumers get an unresolvable import. Decide now, not at release:

1. **Publish `gd-design-core`** as a real public package. Correct if third parties may write their own
   adapters. Costs a public API surface to maintain.
2. **Bundle it into `gd-design-web`** — remove it from `external` in `vite.config.ts` and inline it.
   Simpler for consumers; duplicates the core if `gd-design-library` ever consumes it too.

Recommendation: **option 1**. The core's entire justification is being consumable by adapters that do
not exist yet, and inlining it contradicts that. Its API is small — 3 stores, 2 button resolvers,
`resolveThemeTree`, `get` — and already has ~100 unit tests.

## 5. Naming and conventions

**Rename `web-components` → `gd-design-web` before anything ships.** The current name is unscoped and
generic; it would collide on npm and breaks the `gd-*` convention every other package follows. It is
free to change now (`private: true`, zero external consumers) and expensive later.

| Convention           | Rule                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------- |
| Package names        | `gd-` prefix, kebab-case                                                              |
| Custom element tags  | `gd-` prefix, matching the React component name lowercased (`Button` → `gd-button`)   |
| Element class names  | `Gd` + PascalCase (`GdButton`)                                                        |
| Folder per component | `src/components/gd-button/gd-button.ts` — matches the current layout                  |
| Events               | `gd-` prefixed, kebab-case, payload in `detail` (`gd-change` → `detail: { checked }`) |
| React wrapper props  | `on` + PascalCase event (`gd-change` → `onGdChange`)                                  |

**Replace the workspace wildcards before publishing.** `gd-design-web` declares
`"gd-design-core": "*"` and `"gd-design-library": "*"`. Those resolve inside the workspace and are
meaningless on npm — a release tool must rewrite them to real ranges. This is a concrete argument for
Changesets (§7).

## 6. Build outputs

Keep what `libs/web-components` already does, with two changes:

| Aspect             | Current                                      | Proposed                                                                                                                                     |
| ------------------ | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Format             | ESM only                                     | **Keep.** Custom elements are a modern-browser feature; a CJS build would be dead weight                                                     |
| Entry              | single `src/index.ts`                        | **Per-component entries** plus the barrel (§3)                                                                                               |
| Module granularity | `preserveModules: true`                      | **Keep**                                                                                                                                     |
| Externals          | `lit`, `gd-design-core`, `gd-design-library` | **Keep** — this is why importing the real tokens did not inline `@emotion/react` into the bundle (**measured**, `FINDINGS.md` §13)           |
| Types              | `dts` plugin from `src`                      | **Keep**, and add the `HTMLElementTagNameMap` and `JSX.IntrinsicElements` augmentations as a shipped declaration so consumers get typed tags |
| `sideEffects`      | absent                                       | **Declare an array** listing the `define` modules (§3)                                                                                       |

The type augmentation matters: `harness/gd-form-elements-jsx.d.ts` exists locally to make the harness
type-check pass. Consumers will need the same declarations, so they must ship rather than stay a
harness-local file.

## 7. Tooling comparison

| Tool                | Verdict for this repo                                                                                                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **npm workspaces**  | **Keep.** Already in use across 5 members. No dependency-resolution problem is driving a change                                                                                                                                                                                                                          |
| **Nx**              | **Keep and use more.** Already provides task graph, caching, and 4 inferred-target plugins. Currently has no `targetDefaults` and no module-boundary rules — §2's boundary should become an `@nx/enforce-module-boundaries` rule                                                                                         |
| **pnpm workspaces** | **No.** Faster installs and stricter peer resolution, but migrating a working 5-package setup buys nothing this spike identified. `spike-react-native` was deliberately kept outside npm workspaces because Expo/Metro conflicts with hoisting — pnpm's stricter layout would likely make that worse, not better         |
| **Turborepo**       | **No.** Overlaps Nx almost entirely. Running both is strictly worse than either                                                                                                                                                                                                                                          |
| **Changesets**      | **Yes — the one real gap.** Releases are 4 hand-written `npm publish dist/...` scripts: no changelog, no coordinated versioning, no dependency-range rewriting for the `"*"` wildcards (§5). Adding a fifth and sixth publishable package makes this actively risky. Changesets solves exactly this and composes with Nx |

Net: **npm workspaces + Nx + Changesets.** One addition, no migration.

## 8. Versioning and release

- **Independent versions per package**, not lockstep. `gd-design-library` and `gd-design-web` will move
  at very different speeds during migration.
- **`gd-design-core` uses strict ranges** (`~`) from its consumers. It is the shared substrate; a minor
  break there breaks every adapter at once.
- **`gd-design-web` depends on `gd-design-library` with a caret range**, and its CI must run against
  the published package, not the dev-time source alias. The `resolve.alias` in `vite.config.ts` is
  gated to `command === 'serve'` precisely so production builds resolve through the real export map
  (**measured**, `FINDINGS.md` §13) — that gate must not be relaxed.
- **Release order is fixed by the graph:** `gd-design-core` → `gd-design-library` → `gd-design-web` →
  `gd-design-web-react`. Changesets derives this; do not hand-order it.
- **`gd-design-web` stays `private: true` until 646b closes the `ElementInternals` and `::part()` gaps.**
  Publishing a component library whose form controls cannot participate in a form invites consumers to
  adopt an API that must then break.

## 9. React wrapper generation — generate, do not hand-maintain

Five wrappers were hand-authored (`harness/Gd*React.tsx`) and each is roughly 5 lines of
`createComponent({ tagName, elementClass, react, events })`. That is enough evidence to call it:
the layer is mechanical, and the only per-component input is the event map.

Generate `gd-design-web-react` at build time from each element's declared events. Hand-maintaining 63
of these guarantees drift, and the failure mode is silent — a missing event entry produces a prop that
simply never fires.

`@lit/react` is already the mechanism and is verified working end-to-end against React 18
(**measured**, `FINDINGS.md` §7). The React 19 event-mapping question (646b) affects whether the
wrapper stays _necessary_, not whether it works.

## 10. Token-to-CSS-custom-property export — not yet, and say why

`FINDINGS.md` carries this as an open question: should a token-to-CSS-custom-property utility become a
prerequisite ticket? No such infrastructure exists in the repo today.

**Recommendation: no, not as a prerequisite.** The current mechanism — resolving the real token object
per render via `resolveThemeTree` into a per-instance Constructable StyleSheet — is verified working,
including live theme switching through nested pseudo-selector paths (**measured**, §§13, 16). A CSS
custom-property layer would be a second theming mechanism alongside it, and two theming mechanisms is
the problem Sections 13 and 16 spent their effort eliminating for token sources.

It becomes worth revisiting if `::part()` adoption (646b) shows consumers need to theme internals from
outside the shadow root without a JS theme object — that is the case custom properties genuinely serve
better. Decide after 646b, not before.
