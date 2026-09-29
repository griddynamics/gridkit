# GD Design System

Nx monorepo containing the GridKit design system packages.

## Packages

| Package                      | Version                                                         | Description                                     |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| `gd-design-library`          | ![npm](https://img.shields.io/npm/v/gd-design-library)          | GridKit React component library + design tokens |
| `gd-form-configurator`       | ![npm](https://img.shields.io/npm/v/gd-form-configurator)       | JSON-Schema form engine (AJV + Zustand)         |
| `gd-form-configurator-react` | ![npm](https://img.shields.io/npm/v/gd-form-configurator-react) | React bindings for gd-form-configurator         |

Not published, and under active investigation:

| Package                                  | Description                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `gd-design-core` (`libs/design-core`)    | Framework-agnostic state stores + token resolution. No React, no Lit, no `gd-design-library` dependency      |
| `web-components` (`libs/web-components`) | Lit custom-element port GridKit atoms. `private: true` — see [Web Components](libs/web-components/README.md) |

## Quick start

Install the primary package:

```bash
npm install gd-design-library
```

Import components and styles:

```tsx
import { Button, ThemeProvider } from 'gd-design-library';
import 'gd-design-library/styles.css';

export default function App() {
  return (
    <ThemeProvider>
      <Button variant="primary">Click me</Button>
    </ThemeProvider>
  );
}
```

See the [shared Storybook](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/introduction-welcome--docs) for design references, interactive component examples, and API documentation.

## Setup

```bash
# Node >= 22.17.0 required
npm install
```

## Development

```bash
npm run storybook          # Shared React + Web Components Storybook at http://localhost:6006
npm test                   # gd-design-library unit tests
npm run test:form-configurator   # form-configurator tests
npm run type-check         # TypeScript check
npm run lint               # ESLint
```

## Build

```bash
npm run build:ui                # Build gd-design-library (ESM + CJS + types)
npm run build:form-configurator # Build both form-configurator packages
npm run build-storybook         # Build and validate the complete static Storybook
```

## Storybook

Shared **Introduction**, **Theme & Tokens**, and framework-neutral **Patterns & Best Practices**
appear at the top level, before the framework catalogs.
One entry point contains two peer catalogs: **React** (components and React-specific guides)
and **Web Components** (native custom-element stories). The Web Components catalog currently
contains native stories and controls for the six existing atoms and two molecules.

`npm run storybook` manages both preview servers automatically; open `http://localhost:6006`.
Ports 6006 and 6007 must be free. There is no separate Web Components startup command.
`npm run build-storybook` produces one deployable directory at `libs/ui/storybook-static`,
including the composed preview under `web-components/`.

```bash
npm run storybook:check-links   # Validate built Storybooks and shipped AI documentation links
npm run storybook:test          # React interaction tests
npm run storybook:visual        # Existing React visual tests
```

React titles receive their `React/` prefix in `.storybook/main.ts`; do not add it again in
individual story/MDX titles. Framework-neutral MDX pages are explicitly listed by basename and
canonical ID in `bin/storybook/shared-docs.json` and receive no prefix. Keep basenames unique.
The shared pages cover welcome/contribution, default-theme JSON references, UI/UX principles,
and cross-device UX. Guides teaching React APIs (including Atomic Design examples, theme hooks,
FAQ, AI integration, form configuration, and component-based patterns) remain under React.
Use the IDs in the generated `index.json` for links. Both pre-migration URLs and interim
`react-` URLs for shared pages resolve to their canonical IDs, retaining args, globals, and anchors.
`bin/storybook/legacy-react-ids.json` is the frozen pre-migration inventory, not a generated
list to refresh when a story disappears. Link checks cover source documentation and the
`llms.txt`, AI Markdown/JSON, and AI JavaScript copied into the UI package.

Native browser smoke checks run with `node bin/storybook/smoke-test.mjs` after the combined build.
They render every native story and exercise custom events and popover dismissal.
The Angular/Vue and other Web Components harnesses remain unchanged until Phase 3.

## Verification (gd-design-library)

```bash
npm run verify:ui:full     # Full 10-phase dist verification + Verdaccio smoke test
npm run verify:ui:ci       # CI gate (non-zero exit on failure)
```

## Publishing

```bash
# gd-design-library
npm run build:ui && npm run publish:ui

# form-configurator — via GitHub Actions (publish-form-configurator.yaml) or:
npm run build:form-configurator && npm run publish:form-configurator
```
