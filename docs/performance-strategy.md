# Performance Strategy

## Executive Summary

This document inventories the current performance-relevant state of `gd-design-library` (`libs/ui`) and lays out a prioritized roadmap for closing the gaps found. It covers general component usage and the library's role powering Dynamic Builder (the internal name for the AI-driven UI Builder built on `gd-design-library`, exposed in this repo as **A2UI mode**).

Top-line verdict: build and bundle tooling is mature and requires no near-term action. Four gaps exist, in priority order: the A2UI render path has no memoization anywhere in its core render function; general component runtime optimization (`useMemo`/`useCallback`/`React.memo`) is adopted in a small minority of components; LLM prompt construction and component discovery in the A2UI/AI layer do redundant work on every call; and there is no runtime performance observability (no Lighthouse CI, no Core Web Vitals tracking) anywhere in the repo.

## Scope and Audience

This document covers `gd-design-library` (`libs/ui`) only — not `gd-form-configurator` or `gd-form-configurator-react`. It addresses two audiences: engineers building components and pages with GridKit directly (Code mode), and engineers building or maintaining Dynamic Builder / A2UI surfaces (A2UI mode). See root `CLAUDE.md`'s "AI integration — two modes" section for the Code-mode-vs-A2UI-mode split this document builds on.

## Current State: Build and Bundle Tooling (Mature)

This tier is already solved. No changes are proposed to it in this document.

- `libs/ui/.size-limit.budgets.json` defines per-export size budgets: `single: 40 kB`, `ai: 120 kB`, `wholeLibrary: 350 kB`, `wholeAI: 250 kB`, with overrides for `Chart: 150 kB`, `AreaChart`/`BarChart`/`LineChart: 120 kB` each, `PieChart: 60 kB`, `Modal: 32 kB`, `Tooltip: 24 kB`, `ai/buildA2UISystemPrompt: 100 kB`, `ai/A2UI_SPEC_SCHEMA: 95 kB`, and `ai/aiComponentsSchema: 180 kB`.
- `libs/ui/scripts/size-check.mjs`, `libs/ui/scripts/treeshake-check.mjs`, and `libs/ui/scripts/agadoo-check.mjs` are wired into the 10-phase `verify:ui:full` / `verify:ui:ci` pipeline (root `package.json`) and into CI (`.github/workflows/pr-head.yaml`, job `verify-ui`), producing an aggregated HTML dashboard and history snapshots.
- `libs/ui/vite.config.ts` externalizes React, React DOM, and `@emotion/*`; sets `treeshake: { preset: 'recommended' }`; sets `cssCodeSplit: true`; and builds dual ESM/CJS output with `preserveModules: true` for both formats.

## Current State: Runtime React Optimization (Gap)

Across 377 component source files in `libs/ui/src/components/` (excluding `.test.`, `.stories.`, and `.types.` files):

- `useCallback` appears in 36 files (9.5%).
- `useMemo` appears in 9 files (2.4%).
- `React.memo` appears in 0 files (0%).
- `React.lazy`/`Suspense` appear in 0 files (0%).

`Table.tsx` (`libs/ui/src/components/organisms/Table/Table.tsx`) is the one component that implements virtualization for large datasets — it exposes a `virtualized` prop, computes a visible row range instead of rendering the full dataset, and handles scroll-to-row against the virtualized subset. It is the model pattern to point to for future virtualization work elsewhere in the library.

For component-level guidance already in the repo, see `.claude/skills/ui-development/references/design-quality.md`'s "Performance" section (prefer WebP/AVIF, lazy-load below the fold, virtualize long lists). This document does not restate that guidance.

## Current State: A2UI Render Path (Gap, epic-critical)

This is the sharpest gap and the one most directly tied to Epic CTORNDSD-571 (Dynamic Builder).

- `renderA2UISpec()` and its recursive render function in `libs/ui/src/utils/a2ui/render.tsx` (187 lines) contain zero uses of `useMemo`, `useCallback`, or `React.memo`. Every call performs a full recursive re-render of the spec tree.
- `A2UI_COMPONENT_MAP` (`libs/ui/src/ai/a2ui/component-map.ts`) is a module-level `const` built once via `buildA2UIComponentMap()` at module load — lookups against it are O(1) after that one-time build. This is already efficient and is not a gap.
- Reconciliation uses stable `key={component.id}` / `key={child.id}` throughout `render.tsx`. This is already correct and is not a gap.
- Of 3,619 total lines across the renderer files in `libs/ui/src/utils/a2ui/renderers/`, only `drag-and-drop.tsx` and `modal.tsx` use `useMemo`/`useCallback`. The remaining renderer files (`chart.tsx`, `table.tsx`, `form.tsx`, and the rest) recreate handlers and style objects on every render.
- `getMergedComponentStyles()` (`libs/ui/src/utils/a2ui/helpers/styling.tsx`) is called from `render.tsx` and from most renderer files on every render; it rebuilds its merged style object from inline props, legacy `styles`, `component.styling`, and any extra styles on every call, with no memoization.
- AJV schema validation for generated specs runs on the LLM/generation side, not inside the renderer — this is already correct and is not a render-time cost.
- `A2UI_PROTOCOL.md` (`libs/ui/src/ai/a2ui/A2UI_PROTOCOL.md`) defines a full spec-replace message format today (`type: "a2ui"` carrying a complete `A2UISpec`). No patch, delta, or streaming update concept exists in the protocol as documented. This fact is revisited as deferred future work below.

## Current State: LLM Prompt / Discovery Cost (Gap, distinct from render-time)

This gap is about token/compute cost when constructing prompts and searching the component catalog — distinct from the render-time cost described above.

- `buildA2UISystemPrompt()` (`libs/ui/src/ai/a2ui/system-prompt.ts`, 1,252 lines) reconstructs its full component catalog, schema, and icon list from scratch on every call. No caching of the static portion of the prompt exists in the file.
- `discovery.ts` (`libs/ui/src/ai/discovery.ts`, 145 lines) performs unindexed linear scans over the component catalog on every call: `discovery.getComponent()` does an O(n) `Array.find`, `discovery.searchComponents()` does an O(n) `Array.filter`, and `discovery.getRelatedComponents()` nests a scan over the catalog inside a scan over each component's composition tips, which is effectively O(n²) in the number of catalogued components. The catalog currently has 64 component schema files under `libs/ui/src/ai/schemas/components/`.

## Current State: Observability and Monitoring (Absent)

No Lighthouse CI configuration and no `web-vitals` usage exist anywhere in the repo — confirmed across `.github/workflows/*.yaml` and the Storybook configuration. This is distinct from the bundle-size dashboard described above, which measures build-time output size, not runtime performance. There is currently no way to detect a runtime performance regression except manual observation.

## Goals

- This roadmap must not regress the mature build tier described above.
- Each phase below must have a falsifiable success metric.
- Recommendations should prefer reusing existing patterns already proven in this codebase — `Table.tsx`'s virtualization, `drag-and-drop.tsx`'s and `modal.tsx`'s memoization — over introducing new dependencies.

## Non-Goals (This Document)

- This document must not modify any `.ts`/`.tsx` source file under `libs/ui/src/`. All recommendations are prose only.
- This document must not add any new script under `libs/ui/scripts/`, any `package.json`/lockfile change, or any new dependency (Lighthouse, `web-vitals`, profiling libraries).
- This document must not modify `libs/ui/.size-limit.budgets.json`, any `verify:ui:*` script, `libs/ui/src/ai/a2ui/A2UI_PROTOCOL.md`, or `libs/ui/src/ai/a2ui/spec-schema.ts`.
- This document must not modify `.claude/skills/ui-development/references/design-quality.md` — it is referenced by link only.
- This document must not perform any Jira/Confluence write action.
- This document must not restate or re-scope work owned by sibling epic tickets: CTORNDSD-631's Confluence latency checklist, CTORNDSD-632's model benchmark, CTORNDSD-573's modularity work, CTORNDSD-574's general docs, or CTORNDSD-634's native-props work. See "Related Tickets" below for the precise boundary.

## Prioritized Roadmap (Overview Table)

| Phase | Focus                                      | Status                |
| ----- | ------------------------------------------ | --------------------- |
| 1     | A2UI render-path memoization               | Proposed              |
| 2     | LLM prompt + discovery caching             | Proposed              |
| 3     | Runtime instrumentation for consuming apps | Proposed              |
| 4     | A2UI streaming/incremental-update protocol | Deferred — undesigned |

## Phase 1 Detail — A2UI Render-Path Memoization

Recommendation: apply `useMemo`, `useCallback`, and `React.memo` to `libs/ui/src/utils/a2ui/render.tsx` and to the renderer files in `libs/ui/src/utils/a2ui/renderers/`, following the pattern already established in `drag-and-drop.tsx` and `modal.tsx`. `getMergedComponentStyles()` (`libs/ui/src/utils/a2ui/helpers/styling.tsx`) should be memoized per component so it does not rebuild its merged style object on every render. Renderers to prioritize first: `chart.tsx`, `table.tsx`, `form.tsx` — these compose the most nested subtrees.

Success metric: the re-render count of an unchanged A2UI subtree drops to zero on an unrelated state update, verified via the React DevTools Profiler or existing Vitest/Testing Library infrastructure.

## Phase 2 Detail — LLM Prompt and Discovery Caching

Recommendation: cache the static portions of `buildA2UISystemPrompt()`'s output (`libs/ui/src/ai/a2ui/system-prompt.ts`) so the full ~8–15 KB catalog/schema/icon list is not rebuilt from scratch on every call. Index `discovery.ts` (`libs/ui/src/ai/discovery.ts`) with a `Map` built once at module load, replacing the current linear and nested-linear scans in `getComponent`, `searchComponents`, and `getRelatedComponents`.

Success metric: a build/compute-time proxy measuring prompt-construction and discovery-query time, kept distinct from Phase 1's render-count metric.

## Phase 3 Detail — Runtime Instrumentation for Consuming Apps

Recommendation: applications consuming `gd-design-library` (not `libs/ui` itself) should prefer Lighthouse CI or the `web-vitals` package for ongoing Core Web Vitals tracking. As a zero-dependency manual option, the `chrome-devtools-mcp` MCP tools already available in this environment (`performance_start_trace`, `lighthouse_audit`) can produce an ad hoc baseline without adding any dependency to this repo.

Success metric: a baseline Core Web Vitals report exists for at least one representative A2UI-rendering page in a consuming application.

## Phase 4 Detail (Deferred) — A2UI Streaming / Incremental Updates

Streaming-friendly UI updates were a stated non-functional performance goal in the Dynamic Builder architecture, but no implementation exists anywhere in this codebase today: `A2UI_PROTOCOL.md` (`libs/ui/src/ai/a2ui/A2UI_PROTOCOL.md`) defines a spec-replace-only message format, with no patch, delta, or streaming concept.

This document names streaming/incremental-update protocol support as a future phase only. It does not specify a wire format, a versioning scheme, or a reconciliation approach. Future readers must not begin implementation from this document alone — this phase requires a dedicated design ticket before any code is written.

## Traceability / Source References

- `libs/ui/.size-limit.budgets.json`
- `libs/ui/scripts/size-check.mjs`
- `libs/ui/scripts/treeshake-check.mjs`
- `libs/ui/scripts/agadoo-check.mjs`
- `libs/ui/vite.config.ts`
- `libs/ui/src/components/organisms/Table/Table.tsx`
- `libs/ui/src/utils/a2ui/render.tsx`
- `libs/ui/src/ai/a2ui/component-map.ts`
- `libs/ui/src/utils/a2ui/renderers/drag-and-drop.tsx`
- `libs/ui/src/utils/a2ui/renderers/modal.tsx`
- `libs/ui/src/utils/a2ui/renderers/chart.tsx`
- `libs/ui/src/utils/a2ui/renderers/table.tsx`
- `libs/ui/src/utils/a2ui/renderers/form.tsx`
- `libs/ui/src/utils/a2ui/helpers/styling.tsx`
- `libs/ui/src/ai/a2ui/A2UI_PROTOCOL.md`
- `libs/ui/src/ai/a2ui/system-prompt.ts`
- `libs/ui/src/ai/discovery.ts`
- `libs/ui/src/ai/schemas/components/`
- `.github/workflows/pr-head.yaml`
- `.claude/skills/ui-development/references/design-quality.md`

## Related Tickets (Cross-Reference Only)

- **CTORNDSD-573** (package subpath refactor) — covers publishing/subpath structure of `gd-design-library`. This document does not re-scope subpath or export structure.
- **CTORNDSD-574** (general docs) — covers general-purpose documentation for the library. This document is scoped narrowly to performance and does not duplicate general docs work.
- **CTORNDSD-575** — reserved for other epic-scoped work; not addressed here.
- **CTORNDSD-631** (Dynamic Builder Performance Improvement Checklist, Confluence) — owns the detailed operational checklist and proposed numeric SLA for Dynamic Builder latency/cost. This document cites its findings but does not restate or replace the checklist.
- **CTORNDSD-632** (Dynamic Builder Model Benchmark & Selection Checklist, Confluence) — owns LLM model selection and benchmarking guidance. This document does not make model-choice recommendations.
- **CTORNDSD-634** (native-props work) — covers component prop/native-HTML-attribute pass-through. Out of scope here.
