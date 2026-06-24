# GD Design System

Nx monorepo containing the GridKit design system packages.

## Packages

| Package                      | Version                                                         | Description                                     |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------- |
| `gd-design-library`          | ![npm](https://img.shields.io/npm/v/gd-design-library)          | GridKit React component library + design tokens |
| `gd-form-configurator`       | ![npm](https://img.shields.io/npm/v/gd-form-configurator)       | JSON-Schema form engine (AJV + Zustand)         |
| `gd-form-configurator-react` | ![npm](https://img.shields.io/npm/v/gd-form-configurator-react) | React bindings for gd-form-configurator         |

## Setup

```bash
# Node >= 22.17.0 required
npm install
```

## Development

```bash
npm run storybook          # Storybook at http://localhost:6006
npm test                   # gd-design-library unit tests
npm run test:form-configurator   # form-configurator tests
npm run type-check         # TypeScript check
npm run lint               # ESLint
```

## Build

```bash
npm run build:ui                # Build gd-design-library (ESM + CJS + types)
npm run build:form-configurator # Build both form-configurator packages
npm run build-storybook         # Build static Storybook
```

## Verification (gd-design-library)

```bash
npm run verify:ui:full     # Full 10-phase dist verification + Verdaccio smoke test
npm run verify:ui:ci       # CI gate (non-zero exit on failure)
```

## Publishing

```bash
# gd-design-library — via GitHub Actions (publish.yaml) or:
npm run build:ui && npm run publish:ui

# form-configurator — via GitHub Actions (publish-form-configurator.yaml) or:
npm run build:form-configurator && npm run publish:form-configurator
```

## Scaffold a new component

```bash
npm run crc ComponentName
```
