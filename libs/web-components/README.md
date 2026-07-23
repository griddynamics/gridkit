# web-components

Lit implementation of `gd-design-library`'s atoms as native custom elements (`gd-button`,
`gd-checkbox`, `gd-typography`, `gd-input`, `gd-select`), built on `gd-design-core`'s shared
token resolvers and `zustand/vanilla` state stores. Originated as an investigation into
Lit/web-components as a wrapper strategy for GridKit — see `FINDINGS.md` for the full go/no-go
writeup, including the Shadow DOM style-isolation reproduction, the SSR/Declarative Shadow DOM
check, the bundle-size comparison against the React+Emotion originals, and a visual-fidelity
verification pass against real Storybook stories.

Never published — `private: true`. Not part of any `build:*`/`publish:*` root script; run its
own Nx targets and npm scripts directly (all documented below).

## What's here

- `src/components/gd-*/` — the 5 ported atoms, one Lit `LitElement` class per component.
- `src/index.ts` — barrel export.
- `harness/` — plain HTML + TSX pages for manual/browser-driven verification (no test
  runner): React consumption wrappers (`Gd*React.tsx`), the Shadow DOM style-isolation
  reproduction, the SSR/DSD reproductions, the visual-fidelity check page, the raw render-speed check
  (`perf-check.tsx`/`.html`, see `FINDINGS.md` Section 14), the "Lit wraps React" shell
  (`gd-button-shell.ts`) and its own speed/isolation checks (`perf-check.tsx`'s shell scenario,
  `shell-isolation-check.tsx`/`.html`, see `FINDINGS.md` Section 15).
- `scripts/` — Node scripts for bundle-size measurement and the SSR/DSD check (see below).
- `FINDINGS.md` — the investigation write-up.

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

React 19 also assigns primitive/object/array properties natively without a wrapper (documented
guidance, not independently re-verified in this repo's React-18-only environment — `FINDINGS.md`
Section 7) — but custom-event-to-callback translation always needs the wrapper (or a manual
`addEventListener`) regardless of React version.

### Per-component quick reference

| Component       | Key props (all also take `theme`, required)                                                                                                                                                              | Events                                                      | Slots                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `gd-button`     | `variant` (`primary`\|`secondary`\|`tertiary`\|`outlined`\|`text`\|`inherit`), `rounded`, `disabled`, `isLoading`, `isIcon`, `fullWidth`, `type`, `role`, `ariaLabel`, `ariaPressed`, `justifyContent`   | native `click` (bubbles through the shadow root unmodified) | default (content), `icon-start`, `icon-end` |
| `gd-checkbox`   | `checked` (JS property only — `attribute: false`, since an HTML attribute can't express "unset" the way the controlled/uncontrolled distinction needs), `indeterminate`, `disabled`, `size` (`sm`\|`md`) | `gd-change` — `detail: { checked }`                         | default (label)                             |
| `gd-input`      | `value`, `placeholder`, `label`, `helper-text`, `disabled`, `color` (`primary`\|`success`\|`warning`\|`error`), `debounce-callback-time`                                                                 | `gd-input` — `detail: { value }`                            | `adornment-start`, `adornment-end`          |
| `gd-select`     | `items` (array), `value`, `disabled`, `color`, `width`, `min-width`, `max-width`                                                                                                                         | `gd-change` — `detail: { value }`                           | `placeholder`, `empty`                      |
| `gd-typography` | `variant` (`span`\|`h1`–`h6`\|`p`\|`small`\|`caption`\|`header`\|`code`\|`kbd`), `as` (DOM tag), `style-variant` (single value or array)                                                                 | —                                                           | default (content)                           |

**Not yet supported by any component** (named gaps, not silently assumed): native `<form>`
participation (`ElementInternals`), CSS Parts (`::part()`) for styling internals from outside the
shadow root, and imperative public methods (e.g. `.focus()`).

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
#   http://localhost:5173/harness/shell-isolation-check.html    (Shadow DOM style-isolation repro)
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

## Parallel-safety

This package is the only one of the two investigation tracks that touches shared root config
(one line in `package.json`'s `workspaces` array). The sibling React Native track
(`react-native`) is deliberately kept fully standalone, outside npm workspaces — see its
own README — so the two tracks never edit the same shared file and can be worked on
independently (parallel branches/worktrees, or two engineers) with no merge conflicts between
them.
