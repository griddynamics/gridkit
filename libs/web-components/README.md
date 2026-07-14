# web-components

Lit implementation of `gd-design-library`'s atoms as native custom elements (`gd-button`,
`gd-checkbox`, `gd-typography`, `gd-input`, `gd-select`), built on `gd-design-core`'s shared
token resolvers and `zustand/vanilla` state stores. Originated as the CTORNDSD-581 investigation
into Lit/web-components as a wrapper strategy for GridKit — see `FINDINGS.md` for the full
go/no-go writeup, including the CTORNDSD-286 Shadow DOM reproduction, the SSR/Declarative
Shadow DOM check, the bundle-size comparison against the React+Emotion originals, and a
visual-fidelity verification pass against real Storybook stories.

Never published — `private: true`. Not part of any `build:*`/`publish:*` root script; run its
own Nx targets and npm scripts directly (all documented below).

## What's here

- `src/components/gd-*/` — the 5 ported atoms, one Lit `LitElement` class per component.
- `src/index.ts` — barrel export.
- `harness/` — plain HTML + TSX pages for manual/browser-driven verification (no test
  runner): React consumption wrappers (`Gd*React.tsx`), the CTORNDSD-286 reproduction, the
  SSR/DSD reproductions, the visual-fidelity check page, the raw render-speed check
  (`perf-check.tsx`/`.html`, see `FINDINGS.md` Section 14), the "Lit wraps React" shell
  (`gd-button-shell.ts`) and its own speed/isolation checks (`perf-check.tsx`'s shell scenario,
  `shell-isolation-check.tsx`/`.html`, see `FINDINGS.md` Section 15).
- `scripts/` — Node scripts for bundle-size measurement and the SSR/DSD check (see below).
- `FINDINGS.md` — the investigation write-up.

## Running locally

From the repo root (after `npm install`):

```bash
# Type-check, lint, and build the library
npm run type-check:web-components
npx nx lint web-components
npm run build:web-components          # runs type-check + lint + build together

# Start a dev server to view/interact with the harness pages in a browser
npm run dev:web-components
# then open, e.g.:
#   http://localhost:5173/harness/fidelity-check.html          (all 5 atoms, side-by-side with Storybook)
#   http://localhost:5173/harness/ctorndsd-286-repro.html       (Shadow DOM style-isolation repro)
#   http://localhost:5173/harness/remaining-findings-repro.html (cursor-jump / discoverability / popover repros)
# Vite prints the actual port on startup (defaults to 5173, or the next free port).

# Compare this package's bundle size against the React+Emotion originals (builds first)
npm run measure:web-components-size

# Server-render gd-button/gd-typography and write Declarative Shadow DOM reproduction pages
npm run check:web-components-ssr
# writes harness/ssr-dsd-static.html (zero client JS) and harness/ssr-dsd-hydrated.html
```

To compare against the real components while the dev server is running, also start Storybook
in a second terminal from the repo root: `npm run storybook` (serves at `http://localhost:6006`).

## Parallel-safety with CTORNDSD-590

This package is the only one of the two CTORNDSD-580 investigation tracks that touches shared
root config (one line in `package.json`'s `workspaces` array). The sibling React Native track
(`spike-react-native`, CTORNDSD-590) is deliberately kept fully standalone, outside npm
workspaces — see its own README — so the two tracks never edit the same shared file and can be
worked on independently (parallel branches/worktrees, or two engineers) with no merge conflicts
between them.
