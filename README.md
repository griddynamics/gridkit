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
yarn install
```

## Development

```bash
yarn storybook          # Storybook at http://localhost:6006
yarn test               # gd-design-library unit tests
yarn test:form-configurator   # form-configurator tests
yarn type-check         # TypeScript check
yarn lint               # ESLint
```

## Build

```bash
yarn build:ui                # Build gd-design-library (ESM + CJS + types)
yarn build:form-configurator # Build both form-configurator packages
yarn build-storybook         # Build static Storybook
```

## Verification (gd-design-library)

```bash
yarn verify:ui:full     # Full 10-phase dist verification + Verdaccio smoke test
yarn verify:ui:ci       # CI gate (non-zero exit on failure)
```

## Publishing

```bash
# gd-design-library — via GitHub Actions (publish.yaml) or:
yarn build:ui && yarn publish:ui

# form-configurator — via GitHub Actions (publish-form-configurator.yaml) or:
yarn build:form-configurator && yarn publish:form-configurator
```

## Scaffold a new component

```bash
yarn crc ComponentName
```
