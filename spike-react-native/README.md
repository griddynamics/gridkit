# spike-react-native

Disposable React Native (Expo) PoC.

`GdButton` (`src/components/GdButton/`) is seeded here as a working smoke test proving the platform
builds and consumes `gd-design-core`'s `resolveButtonVariantStyle` — it is **not** the full spike. The
remaining 4 atoms (`Checkbox`, `Typography`, `Input`, `Select`) and the Select approach evaluation are the
spike's own execution work per its plan.

## Setup

`gd-design-core` is consumed via a `file:` dependency pointing at its **built** output
(`../dist/libs/design-core`), not its source — build it once before installing here:

```bash
npm run build:design-core   # from the repo root
cd spike-react-native
npm install
npm run type-check
```

## Deliberately NOT an npm workspace member

Unlike `libs/spike-web-components`, this package lives at the **repo root**, outside `libs/`, and is
**not** listed in the root `package.json`'s `workspaces` array. This is intentional, for two reasons:

1. **React Native / Expo's own dependency tree (Metro, a pinned `react`/`react-native` version pair) can
   conflict with npm workspace hoisting** in ways a pure-JS package like `spike-web-components` doesn't —
   keeping it fully standalone with its own `node_modules` avoids that class of problem entirely.
2. `spike-web-components` is the one package that touches shared
   root config (`workspaces` array). This package touches **none** — no root `package.json` edit, no
   `tsconfig.base.json` path alias, no `nx.json` change. The two spikes can be executed independently
   (parallel branches/worktrees, or two engineers) without ever editing the same shared file.

`node_modules` here is covered by the repo's existing top-level `.gitignore` pattern (`node_modules`
matches at every depth).
