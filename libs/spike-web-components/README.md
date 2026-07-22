# spike-web-components (CTORNDSD-581)

Disposable Lit/web-components PoC package. See `plans/ctorndsd-581-lit-webcomponents-spike.md` for the
full scope, Ordered Work, and worked Migration Examples this package executes against.

`gd-button` (`src/components/gd-button/`) is seeded here as a working smoke test proving the platform
builds and consumes `gd-design-core`'s `resolveButtonVariantStyle` — it is **not** the full spike. The
remaining 4 atoms (`Checkbox`, `Typography`, `Input`, `Select`) and the CTORNDSD-286 Shadow DOM
reproduction, SSR/DSD check, and bundle-size measurement are the spike's own execution work per its plan.

Never published — `private: true`. Not part of any `build:*`/`publish:*` root script; run its own Nx
targets directly (`nx build spike-web-components`, `nx lint spike-web-components`).

## Parallel-safety with CTORNDSD-590

This package (and the shared `gd-design-core` workspace package) touch shared root config (e.g. lines in
`package.json`'s `workspaces` array / root scripts). `spike-react-native` (CTORNDSD-590) is deliberately kept fully
standalone, outside npm workspaces — see its own README — so the two spikes never edit the same shared
file and can be executed independently (parallel branches/worktrees, or two engineers) with no merge
conflicts between them.
