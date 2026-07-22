# gd-design-core

Framework-agnostic core for GridKit's cross-platform architecture strategy , Option 2: "Framework-Agnostic Core + Thin
Per-Platform Adapters"). This package holds each of the 5 atom-tier components' actual behavior — token
resolution, controlled/uncontrolled state, debounce timers, open/close/selection state — with **zero
React-DOM, Emotion, Shadow-DOM, or React Native assumptions**.

It is the base platform intended to be consumed by:

- Lit component subscribes via
  `store.subscribe()` / `store.getState()` inside `connectedCallback()`. No hook, no adapter package
  required on the Lit side beyond the subscription call itself.
- React and React Native
  consume identically via `useStore(vanillaStore, selector)` (from `zustand`), since RN is still React,
  just a different renderer.
- The existing React web implementation (`libs/ui`) — not modified by this package; adopting it there is a
  separate, later decision (see the Decision Points in the strategy doc). Nothing here changes `libs/ui`'s
  shipped behavior today.

## Scope

Covers the same 5 atoms both spikes port: `Button`, `Checkbox`, `Typography`, `Input`, `Select`.

- **`tokenResolvers/`** — pure functions, one per atom, that resolve a theme object plus a variant/size into
  plain, platform-neutral style values (no CSS strings, no Emotion pseudo-selector objects). Every atom gets
  one, since token resolution is the one thing all 5 can share regardless of how much behavior they have.
- **`stores/`** — per-atom state factories built on `zustand/vanilla`'s `createStore`, for the 3 atoms with
  real behavior to extract: `Checkbox` (controlled/uncontrolled resolution + indeterminate), `Input`
  (debounce + mouse/keyboard interaction tracking), `Select` (open/close, single/multi selection, search
  filtering). `Button` and `Typography` have no store — per the strategy doc's comparison table, they are
  purely presentational.

Deliberately **out of scope** here (kept in each platform's own adapter, since it's genuinely
platform-specific): DOM/viewport positioning (`Select`'s dropdown placement), portal/outside-click
detection, keyboard-arrow DOM focus traversal, and any CSS/StyleSheet/Shadow-DOM rendering itself. The
strategy doc's per-atom table calls this out explicitly: shared-core feasibility rises with how much of a
component's complexity is state/behavior rather than presentation or rendering.

## Usage

### React / React Native

```ts
import { useStore } from 'zustand';
import { createCheckboxStore } from 'gd-design-core/stores';

const store = createCheckboxStore({ checked, onValueChange });
const isChecked = useStore(store, (s) => s.checked);
```

### Lit / any vanilla consumer

```ts
import { createCheckboxStore } from 'gd-design-core/stores';

const store = createCheckboxStore({ onValueChange: (checked) => this.dispatchEvent(/* ... */) });

connectedCallback() {
  super.connectedCallback();
  this._unsubscribe = store.subscribe((state) => this.requestUpdate());
}
```

### Token resolution (any adapter)

```ts
import { resolveButtonVariantStyle } from 'gd-design-core/tokenResolvers';

const style = resolveButtonVariantStyle(theme, 'primary');
// { container, containerHover, containerActive, containerDisabled, textColor, label }
```

## Theme parameter

Resolvers accept a loosely-typed `DesignCoreTheme` (see `src/types.ts`) — a structural subset of
`gd-design-library`'s theme shape covering only the token paths these 5 atoms' resolvers read
(`colors.*`, `font.*`, `spacing.*`, `radius.*`, `values.*`). This package does not import
`gd-design-library` at runtime, so it stays buildable and testable independently of `libs/ui`; any
object shaped like `gd-design-library`'s `defaultTheme` (or a per-platform equivalent) satisfies it.
