# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Nx monorepo containing three publishable packages:

| Package                      | Path                                   | Description                                                     |
| ---------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| `gd-design-library`          | `libs/ui`                              | GridKit React component library + design tokens + A2UI renderer |
| `gd-form-configurator`       | `libs/form-configurator/core`          | Framework-agnostic JSON-Schema form engine (AJV + Zustand)      |
| `gd-form-configurator-react` | `libs/form-configurator/adapter-react` | React bindings for form-configurator                            |

Node >= 22.17.0, npm workspaces. Run `npm install` after cloning.

## Commands

```bash
# Development
npm run storybook              # Storybook dev server at http://localhost:6006
npm test                       # Unit tests for gd-design-library (vitest, jsdom)
npm run test:ai                # AI integration tests in src/ai/__tests__/
npm run test:form-configurator # Unit tests for both form-configurator packages (jest)
npm run type-check             # TypeScript check for ui lib
npm run lint                   # ESLint across all projects
npm run lint:fix               # ESLint with auto-fix
npm run format:check           # Prettier check
npm run format                 # Prettier write

# Run a specific test file
npx vitest --config=libs/ui/vitest.config.ts --project=unit --run src/components/atoms/Button/Button.test.tsx

# Storybook tests (requires Playwright browsers)
npm run storybook:test         # Run all Storybook interaction tests
npm run storybook:visual       # Run visual regression tests

# Building
npm run build:ui               # Full gd-design-library build: readme-stats + ai-docs + type-check + nx build + postbuild-types
npm run build:form-configurator
npm run build-storybook

# Verification (run on built dist — requires npm run build:ui first)
npm run verify:ui:full         # All 10 verification phases + Verdaccio smoke test
npm run verify:ui:ci           # CI gate (non-zero exit on failure)

# Scaffolding
npm run crc ComponentName      # Interactive scaffold for a new component (prompts for tier)
```

## Architecture

### gd-design-library (`libs/ui`)

**Theme system** — all styling flows through a single theme object. `ThemeProvider` (wrapping `@emotion/react`'s provider) accepts a theme and exposes it via the `useTheme()` hook. Each component reads `const { theme } = useTheme()` and passes `theme` to its Emotion `css` calls. Token files in `libs/ui/src/tokens/` (one per component, e.g. `button.ts`, `typography.ts`) compose into `defaultTheme`. Consumers override the theme by passing a custom object to `ThemeProvider`.

**Component structure** — every component lives in `libs/ui/src/components/{atoms|molecules|organisms|widget}/{Name}/`:

- `Name.tsx` — logic, `forwardRef`, reads `useTheme()`, delegates rendering to `NameStyled.tsx`
- `NameStyled.tsx` — Emotion `css` prop component; receives `theme` and variant props, produces CSS via token lookups (`get(theme, 'button.primary', {})`)
- `Name.types.ts` — prop types and enums
- `Name.stories.tsx` — Storybook stories
- `Name.test.tsx` — Vitest unit tests (`@testing-library/react`)
- `Name.test.visual.tsx` — Vitest visual regression tests (Playwright, only some components)

Component tiers: `atoms` (primitive building blocks), `molecules` (composed from atoms), `organisms` (complex, domain-aware), `widget` (currently only `DragAndDrop`).

Path aliases defined in `libs/ui/vitest.alias.ts` and `libs/ui/tsconfig.json`: `@components`, `@hooks`, `@tokens`, `@types`, `@utils`, `@constants`, `@assets`, `@stories`.

**Build output** — Vite produces both ESM (`.js`, `preserveModules`) and CJS (`.cjs`) to `dist/libs/ui`. Post-build step (`scripts/postbuild-types.mjs`) patches `.d.ts` exports. React and `@emotion/*` are externalized. `bin/export-theme.js` serializes `defaultTheme` to JSON from the built dist; it runs automatically as part of `npm run storybook` and `npm run build-storybook`.

**AI integration — two modes:**

- **Code mode** (`gd-design-library/ai`) — utilities for LLMs generating TSX source code: component discovery (`discovery.ts`), schema validation (`validation.ts`), and prompt builders (`prompts.ts`) for Claude/GPT-4/Gemini. Tests live in `src/ai/__tests__/`.
- **A2UI mode** (`src/ai/a2ui/`) — JSON protocol where an LLM emits an `A2UISpec` that `renderA2UISpec` (`src/utils/a2ui/render.tsx`) renders at runtime using GridKit components. Spec schema, system prompt generator, and component map live in `src/ai/a2ui/`. Integration tests (`*.a2ui.integration.tsx`) require `ANTHROPIC_API_KEY`.

Both modes are exported from the `gd-design-library/ai` subpath. Pre-computed Figma → GridKit token lookup tables live in `src/ai/figma-maps/`. The `llms.txt` at the package root is the canonical component API reference, auto-generated by `npm run generate-ai-docs`.

### gd-form-configurator (`libs/form-configurator`)

Framework-agnostic core (`gd-form-configurator`) + React adapter (`gd-form-configurator-react`). The core uses AJV for JSON Schema validation and Zustand for form state. Key exports: `FormConfigurator` orchestrator, `ControlRegistry` for registering field renderers, `DispatchService` for form actions. The adapter adds `FormBuilder`, layout components, and built-in controls (Text, Number, Select, Array, and layout types Vertical/Horizontal/Categorization/Group/Nested).

## Testing

The `libs/ui` vitest config defines four test projects:

- `unit` — jsdom, `**/*.{test,spec}.{ts,tsx}`
- `visual` — Playwright/Chromium, `**/*.test.visual.{ts,tsx}`
- `storybook` — Playwright/Chromium against Storybook, `**/*.stories.*`
- `a2ui-integration` — Playwright/Chromium, `**/*.a2ui.integration.{ts,tsx}`, requires `ANTHROPIC_API_KEY`

The form-configurator packages use Jest (`jest.config.ts` per package).

## Conventions

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.) enforced by commitlint.
- **Pre-commit**: prettier format check + lint-staged (ESLint + prettier on staged `libs/**` files, markdownlint on `*.md`).
- **New components**: `npm run crc ComponentName` launches an interactive prompt to choose the tier (atoms/molecules/organisms/widget) and scaffolds all required files.
- **Styling**: never write raw hex or pixel literals in component styles. Access values through the theme object (`get(theme, 'component.variant', {})`). Use the Emotion `css` prop, not inline `style` or CSS modules.
- **SSR compatibility**: components must render without errors in a Node environment. Mark client-only hooks with `'use client'` directive. The `ssr-check` and `rsc-render-check` scripts in `verify:ui` catch violations.
