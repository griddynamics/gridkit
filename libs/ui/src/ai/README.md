# AI Integration System - GridKit Design System

> **Comprehensive AI integration system** for reliable code generation and UI spec generation using the GridKit Design System components.

---

## Overview

The GridKit Design System provides a complete AI integration system that enables AI agents to work with the design system in **two distinct modes**:

| Mode          | Output                  | Entry point  | Use when                                         |
| ------------- | ----------------------- | ------------ | ------------------------------------------------ |
| **Code mode** | React/TSX source code   | `prompts.ts` | LLM generates runnable component code            |
| **A2UI mode** | A2UI JSON specification | `a2ui/`      | LLM generates a JSON UI spec rendered at runtime |

### Code Mode

The LLM produces production-ready TSX using gd-design-library components directly. Best for design tools, Storybook generation, and developer assistants.

### A2UI Mode

The LLM produces a JSON payload in the [A2UI format](https://a2ui.org) that a client application renders using GridKit components at runtime. Best for conversational agents, dynamic UI, and agent-to-UI communication (see `apps/agent-service`).

The AI integration system includes discovery utilities, validation mechanisms, and optimized prompt generation for Claude, GPT-4, and Gemini.

### Interactive Documentation

📖 **Explore the AI Integration System in Storybook**:  
[View AI Integration Documentation](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/introduction-welcome--docs)

The Storybook provides interactive examples, component playgrounds, and comprehensive documentation for all AI integration features. You can experiment with components, see live examples, and understand how to use the system effectively.

For detailed usage instructions and code examples, see the [Prompt Usage Manual](./PROMPT_USAGE_MANUAL.md).

## Key Features

- **🔍 Component Discovery** - Find components by name, category, feature, or use case
- **✅ Schema Validation** - Validate component schemas and generated code
- **📝 Prompt Generation** - Generate optimized prompts for Claude, GPT-4, and Gemini
- **🛡️ Automatic Guardrails** - Guardrails automatically extracted from component schemas
- **📚 Comprehensive Schemas** - Complete component documentation with examples and patterns
- **🧪 Test Suite** - Comprehensive tests for all AI integration features

## Installation

```typescript
// Code mode — generates React/TSX
import {
  buildClaudeSystemPrompt,
  buildContextualPrompt,
  buildGPT4Prompt,
  buildGeminiPrompt,
  discovery,
  validateSchema,
  validateGeneratedCode,
  componentIndex,
} from 'gd-design-library/ai';

// A2UI mode — generates JSON specs for runtime rendering
import {
  buildA2UISystemPrompt,
  buildA2UIGeminiRequest,
  A2UI_SPEC_SCHEMA,
  A2UI_COMPONENT_MAP,
  A2UI_AVAILABLE_ICONS,
  A2UI_BUTTON_VARIANTS,
  getA2UIPropEnum,
  type A2UIActionDefinition, // shared action definition type
} from 'gd-design-library/ai';

// A2UI mode — React renderer (pass same A2UIActionDefinition[] for wired handlers)
import { renderA2UISpec } from 'gd-design-library/renderer';
```

## Quick Start

### A2UI Mode (JSON spec generation)

```typescript
import { buildA2UISystemPrompt, A2UI_SPEC_SCHEMA } from 'gd-design-library/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: buildA2UISystemPrompt(),
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.7,
  },
});

const result = await model.generateContent('Show a product dashboard with sales metrics');
const a2uiSpec = JSON.parse(result.response.text());
// → A2UISpec — render with GridKit components
```

Or use the convenience helper that packages system prompt + user message + generation config in one call:

```typescript
import { buildA2UIGeminiRequest } from 'gd-design-library/ai';

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
const result = await model.generateContent(
  buildA2UIGeminiRequest('Show a product dashboard', {
    agentId: 'my-agent',
    context: 'E-commerce analytics platform.',
  })
);
```

### Code Mode (React/TSX generation)

### Basic Prompt Usage

```typescript
import { buildClaudeSystemPrompt } from 'gd-design-library/ai';

const prompt = buildClaudeSystemPrompt('Create a sign-in form with email and password');
```

### Component Discovery

```typescript
import { discovery, getComponentsByCategory } from 'gd-design-library/ai';

// Get component by name
const button = discovery.getComponent('Button');

// Search components
const formComponents = discovery.searchComponents('form');

// Get by category
const layoutComponents = getComponentsByCategory('Layout & Structure');

// Get related components
const related = discovery.getRelatedComponents('Input');
```

### Code Validation

```typescript
import { validateGeneratedCode, validateSchema } from 'gd-design-library/ai';

// Validate generated code
const result = validateGeneratedCode(generatedCode);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}

// Validate component schema
const schemaResult = validateSchema(componentSchema);
```

## Documentation Files

### Core Documentation

1. **[a2ui/A2UI_PROTOCOL.md](./a2ui/A2UI_PROTOCOL.md)** - A2UI protocol specification
   - Full spec structure with all fields
   - All 52 component types with props and notes
   - Action types: application-defined via `A2UIActionDefinition[]` passed to `buildA2UISystemPrompt` and `renderA2UISpec`
   - `buildA2UISystemPrompt` options deep reference
   - Showcase prompt example

2. **[PROMPT_USAGE_MANUAL.md](./PROMPT_USAGE_MANUAL.md)** - Code-mode prompt usage guide
   - Basic prompt usage
   - Contextual prompts
   - Agent-specific prompts (Claude, GPT-4, Gemini)
   - Discovery utilities
   - Validation
   - Best practices and troubleshooting

### External References

- **[llms.txt](./../llms.txt)** - LLM-friendly documentation (package root)
- **[Component Storybook](https://storybook.cto-rnd-system-design.griddynamics.net/)** - Interactive component documentation

## API Reference

### A2UI Mode Functions

| Export                                      | Description                                                                                              | Returns                              |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `buildA2UISystemPrompt(options?)`           | System instruction string for A2UI JSON generation. See [Options](#builda2uisystemprompt-options) below. | `string`                             |
| `buildA2UIGeminiRequest(message, options?)` | Full Gemini request object (contents + generationConfig) ready to pass to `model.generateContent()`      | `object`                             |
| `A2UI_SPEC_SCHEMA`                          | Full A2UI spec schema for Gemini `responseSchema` or AJV validation                                      | `object`                             |
| `A2UI_SPEC_SCHEMA_SIMPLE`                   | Minimal schema for basic structural validation only                                                      | `object`                             |
| `A2UI_COMPONENT_MAP`                        | A2UI type → GridKit component mapping. Built from `aiComponentsSchema` (single source of truth).         | `Record<string, A2UIComponentEntry>` |
| `A2UI_COMPONENT_TYPES`                      | All valid A2UI component type strings (auto-generated from map)                                          | `readonly string[]`                  |
| `A2UI_AVAILABLE_ICONS`                      | All valid icon names — derived from `Icon.ts` schema `availableIcons`                                    | `readonly string[]`                  |
| `A2UI_ICON_CATALOG`                         | Semantic icon usage guide grouped by category — derived from `Icon.ts` schema `iconCatalog`              | `object`                             |
| `A2UI_BUTTON_VARIANTS`                      | Valid Button `variant` values — derived via `getA2UIPropEnum('button', 'variant')`                       | `readonly string[]`                  |
| `getA2UIPropEnum(type, propName)`           | Get enum values for any A2UI component prop — e.g. `getA2UIPropEnum('badge', 'size')`                    | `readonly string[]`                  |
| `getGridKitComponent(type)`                 | Get GridKit component name for an A2UI type string                                                       | `string`                             |
| `type A2UIActionDefinition`                 | Shared action definition type — pass to both `buildA2UISystemPrompt` and `renderA2UISpec`                | —                                    |

---

### `A2UIActionDefinition`

The central type that connects the LLM prompt and the React renderer. Define your application actions once and pass the same array to both functions.

```typescript
import type { A2UIActionDefinition } from 'gd-design-library/ai';

type A2UIActionDefinition = {
  /** Action type string used as `type` in A2UI JSON. Must be unique across definitions. */
  type: string;
  /** Human-readable description injected into the LLM system prompt. */
  description: string;
  /** Runtime handler called when the action fires in the rendered UI. */
  handler?: (action: A2UIAction) => void;
};
```

| Field         | Type                           | Required | Description                                                                                                               |
| ------------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `type`        | `string`                       | ✓        | Action type string used as `type` in A2UI JSON. Must be unique.                                                           |
| `description` | `string`                       | ✓        | Injected into the LLM prompt. Describe what the action does and the expected `payload` shape.                             |
| `handler`     | `(action: A2UIAction) => void` | —        | Called by `renderA2UISpec` when a component fires this action. Receives the full `A2UIAction` object including `payload`. |

**How dispatch works in `renderA2UISpec`:**

1. A button has `actions: ["my_action_id"]` in the spec
2. On click, the renderer looks up `"my_action_id"` in `spec.ui.actions`
3. Finds the matching `A2UIActionDefinition` by `type`
4. Calls `definition.handler(action)` with the full `A2UIAction` including `payload`

**`renderA2UISpec` signature with actions:**

```typescript
import { renderA2UISpec } from 'gd-design-library/renderer';
import type { A2UIActionDefinition } from 'gd-design-library/ai';

function renderA2UISpec(spec?: Pick<A2UISpec, 'ui'> | null, actions?: A2UIActionDefinition[]): ReactNode;
```

---

### `buildA2UISystemPrompt` Options

```typescript
buildA2UISystemPrompt(options?: A2UISystemPromptOptions): string
```

All options are optional. The prompt stays in sync with the live component map automatically.

| Option             | Type                                | Default                     | Description                                                                                                                                                                                                                                                                                                                              |
| ------------------ | ----------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `agentId`          | `string`                            | `"a2ui-agent"`              | Unique agent identifier placed in `metadata.agentId` of every generated spec.                                                                                                                                                                                                                                                            |
| `agentName`        | `string`                            | `"Grid Dynamics Assistant"` | Human-readable agent name placed in `metadata.agentName`.                                                                                                                                                                                                                                                                                |
| `provider`         | `string`                            | —                           | Optional LLM provider or orchestration source placed in `metadata.provider`. Useful for knowledge sharing across any LLM integration.                                                                                                                                                                                                    |
| `scenario`         | `string`                            | —                           | Optional scenario, route, or use-case identifier placed in `metadata.scenario`.                                                                                                                                                                                                                                                          |
| `segment`          | `string`                            | —                           | Optional orchestration segment identifier placed in `metadata.segment` when a larger flow is split into parts.                                                                                                                                                                                                                           |
| `theme`            | `"light" \| "dark" \| "auto"`       | `"light"`                   | Default UI theme placed in `metadata.theme`.                                                                                                                                                                                                                                                                                             |
| `imageSources`     | `string \| string[]`                | —                           | Restrict `image` component `src` values to specific hosts. When omitted the LLM may use any public CDN. Pass a host or list of hosts to limit to those only. Pass `[]` to disable all remote images (LLM will omit image components entirely).                                                                                           |
| `locale`           | `string`                            | —                           | BCP 47 locale code (e.g. `"de-DE"`). Injected into `metadata.locale` and hints the LLM to generate content in that language/locale. Also auto-selects price format (EU languages → EU convention, others → US).                                                                                                                          |
| `context`          | `string`                            | —                           | Free-form description of the application or use case. Injected as a `## USE CASE CONTEXT` section at the top of the prompt — gives the LLM domain knowledge before generating.                                                                                                                                                           |
| `priceFormat`      | `"us" \| "eu" \| PriceFormatCustom` | —                           | Explicit price/currency convention. Overrides locale-based detection. `"us"` → `$1,299.99`. `"eu"` → `1 299,99 €`. Object → fine-grained control (see below).                                                                                                                                                                            |
| `customGuardrails` | `string[]`                          | `[]`                        | Additional constraint rules appended after the 15 system-defined guardrails under `### ADDITIONAL GUARDRAILS`. Each string is one rule.                                                                                                                                                                                                  |
| `customRules`      | `string[]`                          | `[]`                        | Additional generation rules appended after the 15 system-defined rules, auto-numbered.                                                                                                                                                                                                                                                   |
| `actions`          | `A2UIActionDefinition[]`            | `[]`                        | Application-defined actions. Each entry defines a `type` string (used in the JSON spec), a `description` injected into the prompt, and an optional `handler` called by `renderA2UISpec`. **Pass the same array to both functions.** This is the **only** way to make action types available to the LLM — no built-in action types exist. |

**`PriceFormatCustom` fields:**

| Field                | Type                  | Default    | Description                                                |
| -------------------- | --------------------- | ---------- | ---------------------------------------------------------- |
| `symbolPosition`     | `"before" \| "after"` | `"before"` | Symbol before (`$99`) or after with a space (`99 €`).      |
| `decimalSeparator`   | `"." \| ","`          | `"."`      | Decimal separator character.                               |
| `thousandsSeparator` | `"," \| " " \| "."`   | `","`      | Thousands grouping separator.                              |
| `trailingZeros`      | `boolean`             | `false`    | When `false`, omits trailing zeros (`"99"` not `"99.00"`). |

#### Examples

**Minimal — all defaults:**

```typescript
const instruction = buildA2UISystemPrompt();
```

**E-commerce agent with brand CDN, custom constraints, and wired action handlers:**

```typescript
import type { A2UIActionDefinition } from 'gd-design-library/ai';
import { renderA2UISpec } from 'gd-design-library/renderer';

// Define once — used by both buildA2UISystemPrompt and renderA2UISpec
const actions: A2UIActionDefinition[] = [
  {
    type: 'add-to-cart',
    description: 'Add a product to the cart. payload: { productId: string, quantity: number }',
    handler: (action) => cart.add(action.payload),
  },
  {
    type: 'show-toast',
    description: 'Show a notification. payload: { message: string, variant: "success" | "error" | "info" }',
    handler: (action) => toast(action.payload?.message),
  },
];

const instruction = buildA2UISystemPrompt({
  agentId: 'shop-agent',
  agentName: 'Shop Assistant',
  provider: 'openai',
  scenario: 'product-discovery',
  segment: 'list',
  imageSources: ['cdn.myshop.com', 'assets.myshop.com'],
  context: 'E-commerce product catalog and checkout assistant for MyShop retail platform.',
  customGuardrails: [
    'Always show prices in USD with the $ symbol.',
    'Every product card must include price, rating, and an "Add to Cart" button.',
  ],
  customRules: ['Use grid layout with gridColumns: 2 for all product listings.'],
  actions, // LLM sees "add-to-cart" and "show-toast" as the only valid action types
});

// Later in React — same array wires buttons to handlers
const ui = renderA2UISpec(spec, actions);
```

**Multi-language support:**

```typescript
const instruction = buildA2UISystemPrompt({
  agentId: 'support-de',
  locale: 'de-DE',
  context: 'German-language customer support portal.',
  // locale 'de-DE' auto-selects EU price format: 1 299,99 €
});
```

**EU e-commerce — explicit price format (overrides locale):**

```typescript
const instruction = buildA2UISystemPrompt({
  agentId: 'shop-eu',
  locale: 'fr-FR',
  priceFormat: 'eu',
  // price components: currentValue="99,99" currencySymbol="€" currencySymbolPosition="after" → "99,99 €"
});
```

**Custom price format (Swiss: symbol before, comma decimal, period thousands):**

```typescript
const instruction = buildA2UISystemPrompt({
  priceFormat: {
    symbolPosition: 'before',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    trailingZeros: false,
  },
  // Produces: CHF 1.299,99
});
```

**Using with Gemini structured output schema:**

```typescript
import { buildA2UISystemPrompt, A2UI_SPEC_SCHEMA } from 'gd-design-library/ai';

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  systemInstruction: buildA2UISystemPrompt({ agentId: 'my-agent' }),
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: A2UI_SPEC_SCHEMA,
    temperature: 0.7,
  },
});
```

### Discovery Functions

| Function                                     | Description            | Returns                        |
| -------------------------------------------- | ---------------------- | ------------------------------ |
| `discovery.getComponent(name)`               | Get component by name  | `ComponentSchema \| undefined` |
| `discovery.searchComponents(query)`          | Search components      | `ComponentSchema[]`            |
| `getComponentsByCategory(category)`          | Get by category        | `ComponentSchema[]`            |
| `getComponentsByFeature(feature)`            | Get by feature         | `ComponentSchema[]`            |
| `getComponentsByUseCase(useCase)`            | Get by use case        | `ComponentSchema[]`            |
| `discovery.getRelatedComponents(name)`       | Get related components | `ComponentSchema[]`            |
| `discovery.getComponentsByComplexity(level)` | Get by complexity      | `ComponentSchema[]`            |
| `findPatterns(components, useCase?)`         | Find patterns          | `Pattern[]`                    |

### Prompt Functions

| Function                                  | Description                | Returns        |
| ----------------------------------------- | -------------------------- | -------------- |
| `buildClaudeSystemPrompt(request)`        | Build Claude system prompt | `string`       |
| `buildContextualPrompt(request, context)` | Build contextual prompt    | `string`       |
| `buildGPT4Prompt(request)`                | Build GPT-4 format prompt  | `Message[]`    |
| `buildGeminiPrompt(request)`              | Build Gemini format prompt | `GeminiPrompt` |

### Validation Functions

| Function                      | Description               | Returns                |
| ----------------------------- | ------------------------- | ---------------------- |
| `validateSchema(schema)`      | Validate component schema | `ValidationResult`     |
| `validateAllSchemas()`        | Validate all schemas      | `{ results, summary }` |
| `validateGeneratedCode(code)` | Validate generated code   | `ValidationResult`     |

### Schema Index

```typescript
import { componentIndex } from 'gd-design-library/ai';

// Get components by Atomic Design category
const atoms = componentIndex.byCategory['Atoms'];
const molecules = componentIndex.byCategory['Molecules'];
const organisms = componentIndex.byCategory['Organisms'];
const layout = componentIndex.byCategory['Layout'];

// Get by complexity
const simpleComponents = componentIndex.byComplexity.Low;

// Get by feature
const formComponents = componentIndex.byFeature['Forms'];
```

## Figma Token Maps

Purpose-built reverse-lookup tables at `$GD_PATH/ai/figma-maps/`. Load before any Figma-to-code or Figma-to-A2UI task that involves translating Figma inspection output (hex values, px values, variable names, shadow strings, icon names) into GridKit design tokens.

Each JSON file has a top-level `$usage` key documenting the exact lookup algorithm and critical rules for that category. Full resolution rules are in `.claude/rules/gd-design-rag-resolution.md`.

### Quick-Reference Table

| File                     | Use for                                                                                    | Primary lookup                |
| ------------------------ | ------------------------------------------------------------------------------------------ | ----------------------------- |
| `figma-color-map.json`   | Figma `gds.color.*` variable or raw hex → color token + `themeAccess`                      | `hexIndex["#RRGGBB"]`         |
| `figma-spacing-map.json` | Figma `gds.spacing/space/scale.*` or px → spacing token + `scaleDecisionGuide`             | `pxIndex["16px"]`             |
| `figma-radius-map.json`  | Figma `gds.border.radius.*` or px/% → `radius.*` token                                     | `pxIndex["4px"]`              |
| `figma-font-map.json`    | Figma `gds.font.*` or typography value → `font.*` token; includes `knownGaps`              | `valueIndex.fontSize["20px"]` |
| `figma-shadow-map.json`  | Figma shadow style or CSS value → `shadows.*` token; `elevationDecisionGuide` for UI roles | `valueIndex["0px 2px..."]`    |
| `figma-icon-map.json`    | Figma Material icon name ↔ GridKit `IconsList` key                                         | `figmaNameIndex["close"]`     |

### Resolution Priority

1. **CSS var name** — `var(--gds-color-text-default, ...)` → strip `--gds-`, kebab→dot → `color.text.default`.
2. **Figma variable name** — CamelCase split: `borderRadiusXL` → `radius.xl`, `fontSizeH5` → `font.size.h5`.
3. **Value reverse-lookup** — query `hexIndex` / `pxIndex` / `valueIndex` in the appropriate map file.
4. **No match** — record `"unmatched:<rawValue>"` in `tokenBindings`.

### Critical Cross-Category Rules

- **Never emit `cssVar` or `var(--gds-*)` strings in TSX.** Always use `themeAccess` from `useTheme()`.
- **`lineHeight` token is 3 levels deep**: `font.line.height.h5` → `theme.font?.line?.height?.h5`. Never `theme.font?.lineHeight?.h5`.
- **Font tokens have no CSS vars** — use raw CSS value in `styling`; token dot-path in `tokenBindings`.
- **Shadow design drift** (levels 1–3): Figma raw value ≠ token multi-layer value. Token is canonical.
- **`#FFFFFF` → `color.bg.surface`** — not unmatched white. Always run `hexIndex` before declaring no match.

### Importing Maps

```typescript
import { FIGMA_TOKEN_MAPS, FIGMA_COLOR_MAP, FIGMA_SPACING_MAP } from 'gd-design-library/ai/figma-maps';

// All maps as a grouped object
const { color, spacing, radius, font, shadow, icon } = FIGMA_TOKEN_MAPS;

// Direct hex → token lookup
const tokenPath = FIGMA_COLOR_MAP.hexIndex['#FFFFFF']; // → "color.bg.surface"

// Spacing px → token lookup
const { preferred } = FIGMA_SPACING_MAP.pxIndex['16px']; // → "spacing.md"
```

## Usage Examples

### Contextual Prompt with Specific Components

```typescript
import { buildContextualPrompt } from 'gd-design-library/ai';

const prompt = buildContextualPrompt('Create a form', {
  components: ['Form', 'Input', 'Button'],
});
```

### GPT-4 Format

```typescript
import { buildGPT4Prompt } from 'gd-design-library/ai';

const messages = buildGPT4Prompt('Create a sign-in form');
// Returns: [{ role: 'system', content: '...' }, { role: 'user', content: '...' }]
```

### Gemini Format

```typescript
import { buildGeminiPrompt } from 'gd-design-library/ai';

const prompt = buildGeminiPrompt('Create a sign-in form');
// Returns: { contents: [...], generationConfig: {...} }
```

### Discovery Workflow

```typescript
import { discovery, getComponentsByCategory } from 'gd-design-library/ai';

// Discover form-related components
const formComponents = discovery.searchComponents('form');
const formCategory = getComponentsByCategory('Forms & Inputs');

// Get related components
const related = formComponents.flatMap((c) => discovery.getRelatedComponents(c.name));
```

## Testing

### Run All Tests

```bash
yarn test
```

### Run AI Tests Only

```bash
# Runs only tests in src/ai/__tests__/ folder
yarn test:ai
```

### Watch Mode

```bash
yarn test:ai:watch
```

### Test Files

- `validation.test.ts` — Schema & code validation tests
- `prompts.test.ts` — Prompt generation tests
- `discovery.test.ts` — Component discovery tests
- `schemas.test.ts` — Schema registry tests
- `integration.test.ts` — End-to-end workflow tests
- `a2ui/system-prompt.test.ts` — System prompt builder tests
- `a2ui/image-policy.test.ts` — Image policy / URL validation tests

## File Structure

```text
./ai
├── README.md                          # This file
├── PROMPT_USAGE_MANUAL.md             # Prompt usage guide (code mode)
├── a2ui/                              # A2UI JSON spec integration
│   ├── A2UI_PROTOCOL.md               # Protocol spec, all component types, options reference
│   ├── index.ts                       # Barrel exports
│   ├── component-map.ts               # A2UI type → GridKit component mapping (built from aiComponentsSchema)
│   ├── image-policy.ts                # Allowed image hosts, URL validation
│   ├── spec-schema.ts                 # A2UISpec TypeScript types + A2UI_SPEC_SCHEMA (AJV/Gemini)
│   ├── system-prompt.ts               # buildA2UISystemPrompt(), buildA2UIGeminiRequest()
│   ├── system-prompt.test.ts          # System prompt builder tests
│   ├── image-policy.test.ts           # Image policy tests
│   └── ui-specification-schema.json   # JSON Schema (AJV validation in agent-service)
├── __tests__/                         # Tests
│   ├── discovery.test.ts
│   ├── integration.test.ts
│   ├── prompts.test.ts
│   ├── schemas.test.ts
│   └── validation.test.ts
├── figma-maps/                        # Figma → GridKit token reverse-lookup tables
│   ├── figma-color-map.json           # Figma gds.color.* vars + hex → color.* token + themeAccess
│   ├── figma-spacing-map.json         # Figma gds.spacing/space/scale vars + px → spacing token + scaleDecisionGuide
│   ├── figma-radius-map.json          # Figma gds.border.radius.* vars + px/% → radius.* token
│   ├── figma-font-map.json            # Figma gds.font.* vars + values → font.* token; knownGaps list
│   ├── figma-shadow-map.json          # Figma shadow styles + CSS values → shadows.box.*/semantic; elevationDecisionGuide
│   ├── figma-icon-map.json            # GridKit IconsList keys ↔ Figma Material icon names; figmaNameIndex
│   └── index.ts                       # Barrel exports (FIGMA_COLOR_MAP, FIGMA_SPACING_MAP, …, FIGMA_TOKEN_MAPS)
├── schemas/
│   ├── components/                    # Component schemas (55 files)
│   │   ├── Button.ts
│   │   ├── Card.ts
│   │   ├── Chart.ts
│   │   ├── Input.ts
│   │   └── ...
│   ├── components.ts                  # Schema registry (aiComponentsSchema)
│   ├── hooks/
│   │   └── useTheme.ts                # Theme hook schema
│   └── index.ts                       # Schema index
├── discovery.ts                       # Discovery utilities
├── validation.ts                      # Validation utilities
├── prompts.ts                         # Code-mode prompt generation (CLAUDE_GRIDKIT_SYSTEM_PROMPT)
└── index.ts                           # Main exports (both modes)
```

## Component Catalog

> **Auto-generated** from `libs/ui/src/ai/schemas/` by `bin/generate-ai-docs.mjs`.
> Run `yarn build:ui` to regenerate. Do not edit the block between the markers manually.

<!-- AUTO-GENERATED:COMPONENTS:START -->

_66 components total — generated from `libs/ui/src/ai/schemas/` on 2026-07-15._

### Other

#### ThemeProvider

**Complexity:** N/A | **Import:** `import { ThemeProvider } from 'gd-design-library'`

Context provider component that enables theme support throughout the application, allowing child components to access theme values via useTheme hook.

<!-- prettier-ignore -->
| Prop           | Type              | Description                                                 |
| -------------- | ----------------- | ----------------------------------------------------------- |
| `children`     | `React.ReactNode` | Child components that will have access to the theme context |
| `initialTheme` | `Theme`           | Initial theme object to apply when component mounts         |
| `isDefault`    | `boolean`         | Whether to use the default theme instead of initialTheme    |

**Example:**

<!-- prettier-ignore -->
```tsx
<ThemeProvider isDefault>{children}</ThemeProvider>
```

#### useTheme

**Complexity:** N/A | **Import:** `import { useTheme } from 'gd-design-library'`

Hook for accessing and managing application themes dynamically with support for switching between themes and adding new themes at runtime.

<!-- prettier-ignore -->
| Prop       | Type                                    | Description                                                               |
| ---------- | --------------------------------------- | ------------------------------------------------------------------------- |
| `theme`    | `Theme`                                 | Current active theme object containing all theme tokens and configuration |
| `setTheme` | `(name: string) => void`                | Function to switch to an existing theme by its name                       |
| `addTheme` | `(name: string, config: Theme) => void` | Function to add a new theme dynamically at runtime                        |

**Example:**

<!-- prettier-ignore -->
```tsx
const { theme, setTheme, addTheme } = useTheme();
```

### Layout & Structure

#### FlexContainer

**Complexity:** Low | **Import:** `import { FlexContainer } from 'gd-design-library'`

General-purpose flexbox container with direct support for gap, flexDirection, alignItems, justifyContent, and additional box-style layout overrides.

<!-- prettier-ignore -->
| Prop             | Type                                                           | Description                                                                                    |
| ---------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `gap`            | `string`                                                       | CSS gap between flex items (e.g. "8px", "1rem")                                                |
| `flexDirection`  | `"row"` \| `"column"` \| `"row-reverse"` \| `"column-reverse"` | Direction of the flex container layout                                                         |
| `alignItems`     | `string`                                                       | CSS align-items value (e.g. "center", "flex-start")                                            |
| `justifyContent` | `string`                                                       | CSS justify-content value (e.g. "space-between", "center")                                     |
| `children`       | `A2UIComponent[]`                                              | Nested A2UI child components rendered inside the flex container                                |
| `styling`        | `object`                                                       | CSS style overrides for sizing, spacing, overflow, and other flex-related presentation details |

**Example:**

<!-- prettier-ignore -->
```tsx
<FlexContainer gap="12px" flexDirection="column" alignItems="center">...</FlexContainer>
```

#### Column

**Complexity:** Low | **Import:** `import { Column } from 'gd-design-library'`

Vertical flex layout container. Arranges children top to bottom with configurable spacing, alignment, wrapping, reversal, and flex sizing.

<!-- prettier-ignore -->
| Prop         | Type                                                                        | Description                                                                                          |
| ------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `gutter`     | `string` \| `number`                                                        | Gap between direct children. Accepts a number (pixels) or a real CSS value such as "16px" or "1rem". |
| `align`      | `"start"` \| `"center"` \| `"end"` \| `"stretch"`                           | Cross-axis alignment for children in the column                                                      |
| `justify`    | `"start"` \| `"center"` \| `"end"` \| `"space-between"` \| `"space-around"` | Main-axis distribution for the vertical flow                                                         |
| `isWrap`     | `boolean`                                                                   | Whether children may wrap onto additional columns when space is constrained                          |
| `isReversed` | `boolean`                                                                   | Reverses the visual direction so children flow bottom-to-top instead of top-to-bottom                |
| `flex`       | `string`                                                                    | CSS flex shorthand applied to the column when it is placed inside a flex parent                      |
| `children`   | `A2UIComponent[]`                                                           | Nested A2UI child components rendered inside the column                                              |
| `as`         | `string`                                                                    | Underlying HTML element to render, such as "section", "main", "article", "aside", or "header"        |
| _...+1 more_ |                                                                             |                                                                                                      |

**Example:**

<!-- prettier-ignore -->
```tsx
<Column gutter={16} align="center" justify="start">...</Column>
```

#### Row

**Complexity:** Low | **Import:** `import { Row } from 'gd-design-library'`

Horizontal flex layout container. Arranges children side by side with configurable spacing, alignment, wrapping, reversal, and flex sizing.

<!-- prettier-ignore -->
| Prop         | Type                                                                        | Description                                                                                          |
| ------------ | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `gutter`     | `string` \| `number`                                                        | Gap between direct children. Accepts a number (pixels) or a real CSS value such as "16px" or "1rem". |
| `align`      | `"start"` \| `"center"` \| `"end"` \| `"stretch"`                           | Cross-axis alignment for children in the row                                                         |
| `justify`    | `"start"` \| `"center"` \| `"end"` \| `"space-between"` \| `"space-around"` | Main-axis distribution for the horizontal flow                                                       |
| `isWrap`     | `boolean`                                                                   | Whether children may wrap onto additional lines when space is constrained                            |
| `isReversed` | `boolean`                                                                   | Reverses the visual direction so children flow right-to-left instead of left-to-right                |
| `flex`       | `string`                                                                    | CSS flex shorthand applied to the row when it is placed inside a flex parent                         |
| `children`   | `A2UIComponent[]`                                                           | Nested A2UI child components rendered inside the row                                                 |
| `as`         | `string`                                                                    | Underlying HTML element to render, such as "section", "nav", "main", "article", or "header"          |
| _...+1 more_ |                                                                             |                                                                                                      |

**Example:**

<!-- prettier-ignore -->
```tsx
<Row justify="space-between" align="center" isWrap gutter={16}>...</Row>
```

#### Box

**Complexity:** Low | **Import:** `import { Box } from 'gd-design-library'`

Foundational layout primitive providing a flexible container with built-in flexbox support, focus management, and interaction states. Serves as the base for Card and other complex components.

<!-- prettier-ignore -->
| Prop              | Type                           | Description                                                                                                        |
| ----------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `variant`         | `"horizontal"` \| `"vertical"` | Box orientation variant controlling flex direction                                                                 |
| `isBordered`      | `boolean`                      | Adds border to the box from theme tokens                                                                           |
| `isHighlighted`   | `boolean`                      | Enables highlight effect on hover with outline appearance                                                          |
| `withShadowHover` | `boolean`                      | Adds box shadow on hover for elevation/lift effect                                                                 |
| `children`        | `Component[]`                  | Nested A2UI child components rendered inside the box.                                                              |
| `tabIndex`        | `number`                       | Tab index for keyboard navigation when box is focusable                                                            |
| `styling`         | `object`                       | CSS style overrides for layout concerns such as gap, padding, margin, width, height, overflow, and flex alignment. |

**Example:**

<!-- prettier-ignore -->
```tsx
<Box variant="vertical" padding="20px">Simple container</Box>
```

#### Card

**Complexity:** Low | **Import:** `import { Card } from 'gd-design-library'`

Content container. Groups related UI. Supports border, highlight, and shadow-hover states. ALWAYS set both padding and gutter on the card root.

<!-- prettier-ignore -->
| Prop              | Type                           | Description                                                                                                                              |
| ----------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`         | `"vertical"` \| `"horizontal"` | Layout variant of the card                                                                                                               |
| `isBordered`      | `boolean`                      | Adds border styling to the card                                                                                                          |
| `isHighlighted`   | `boolean`                      | Applies outline on hover for selection state                                                                                             |
| `withShadowHover` | `boolean`                      | Adds elevation shadow on hover (requires styling.backgroundColor)                                                                        |
| `padding`         | `string`                       | REQUIRED inner padding (e.g. "16px"; use "0" when card-image is first child)                                                             |
| `gutter`          | `string`                       | REQUIRED gap between direct card children (e.g. "12px")                                                                                  |
| `children`        | `A2UIComponent[]`              | Card subcomponents (card-row, card-column, card-image, card-title, card-description, card-price, card-button, card-counter, card-rating) |
| `styling`         | `object`                       | CSS style overrides for the card container                                                                                               |

**Example:**

<!-- prettier-ignore -->
```tsx
<Card width="330px" gutter="16px" isBordered><Card.Image src={imgUrl} /><Card.Column padding="0 16px 16px" gutter="16px"><Card.Title>Product Name</Card.Title><Card.Description>Product description text</Card.Description><Card.Price currentValue="20" currencySymbol="$" /><Card.Button onClick={handleClick}>Add to Cart</Card.Button></Card.Column></Card>
```

#### Scroll

**Complexity:** Low | **Import:** `import { Scroll } from 'gd-design-library'`

Scrollable container with configurable vertical and horizontal scrollbar visibility plus optional auto-hide behavior.

<!-- prettier-ignore -->
| Prop         | Type                                  | Description                                                                     |
| ------------ | ------------------------------------- | ------------------------------------------------------------------------------- |
| `children`   | `A2UIComponent[]`                     | Nested A2UI child components rendered inside the scroll container               |
| `vertical`   | `"hidden"` \| `"visible"` \| `"auto"` | Vertical scrollbar visibility                                                   |
| `horizontal` | `"hidden"` \| `"visible"` \| `"auto"` | Horizontal scrollbar visibility                                                 |
| `autoHide`   | `boolean`                             | Whether visible scrollbars fade out when the user stops scrolling               |
| `styling`    | `object`                              | CSS style overrides — include maxHeight/height to constrain the scrollable area |

**Example:**

<!-- prettier-ignore -->
```tsx
<Scroll vertical="auto" horizontal="hidden"><LongContent /></Scroll>
```

#### Separator

**Complexity:** Low | **Import:** `import { Separator } from 'gd-design-library'`

Visual divider between sections. Horizontal by default; supports optional inline text label (e.g. "OR").

<!-- prettier-ignore -->
| Prop            | Type                                           | Description                                                                                                                                                                                                                                    |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation`   | `"horizontal"` \| `"vertical"`                 | Separator direction: horizontal (default) or vertical                                                                                                                                                                                          |
| `variant`       | `"solid"` \| `"dashed"` \| `"dotted"`          | Line style of the separator                                                                                                                                                                                                                    |
| `label`         | `string`                                       | Optional inline text displayed with the line (e.g. "OR")                                                                                                                                                                                       |
| `labelPosition` | `"start"` \| `"center"` \| `"end"`             | Position of the label along the separator                                                                                                                                                                                                      |
| `color`         | `string`                                       | Color of the separator line. Prefer theme color token paths (e.g. "border.default", "border.error"). Palette-style aliases like "brand.500" and "theme.palette.warning.main" are also accepted. Use raw CSS/hex only when no theme token fits. |
| `labelColor`    | `string`                                       | Color of the label text. Prefer theme color token paths (e.g. "text.caption", "text.warning"). Palette-style aliases like "brand.500" and "theme.palette.warning.main" are also accepted. Use raw CSS/hex only when no theme token fits.       |
| `size`          | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | Thickness/size of the separator line                                                                                                                                                                                                           |
| `length`        | `string`                                       | Explicit separator length. Especially useful for vertical separators (for example "40px" or "100%").                                                                                                                                           |
| _...+2 more_    |                                                |                                                                                                                                                                                                                                                |

**Example:**

<!-- prettier-ignore -->
```tsx
<Separator />
```

#### Wrapper

**Complexity:** Low | **Import:** `import { Wrapper } from 'gd-design-library'`

Flexible container component that provides semantic HTML element wrapping with customizable layout variants and styling. Useful for creating layout contexts, semantic sections, and responsive containers.

<!-- prettier-ignore -->
| Prop        | Type                                      | Description                                                                                       |
| ----------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `as`        | `string`                                  | Overrides the default wrapper HTML element used for rendering (e.g., "div", "section", "article") |
| `variant`   | `"inline"` \| `"section"` \| `"fullPage"` | Determines the wrapper preset used for semantic layout contexts                                   |
| `children`  | `A2UIComponent[]`                         | Nested A2UI child components rendered inside the wrapper.                                         |
| `className` | `string`                                  | Additional CSS class names to be applied to the wrapper element                                   |
| `styling`   | `object`                                  | CSS style overrides for the wrapper                                                               |

**Example:**

<!-- prettier-ignore -->
```tsx
<Wrapper variant="section" as="section">Main content section</Wrapper>
```

#### Accordion

**Complexity:** Medium | **Import:** `import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from 'gd-design-library'`

Collapsible content panels. Supports single or multiple expanded items. Built with AccordionItem / AccordionHeader / AccordionContent subcomponents.

<!-- prettier-ignore -->
| Prop                  | Type              | Description                                                         |
| --------------------- | ----------------- | ------------------------------------------------------------------- |
| `children`            | `A2UIComponent[]` | Accordion-item children that define the full accordion structure    |
| `allowMultipleExpand` | `boolean`         | Whether multiple items can be expanded simultaneously               |
| `withoutSeparator`    | `boolean`         | When true, removes the visual divider lines between accordion items |
| `isInline`            | `boolean`         | When true, renders the accordion header in an inline layout         |
| `value`               | `string[]`        | Controlled array of expanded accordion-item IDs                     |
| `defaultValue`        | `string[]`        | Initial array of expanded accordion-item IDs                        |
| `styling`             | `object`          | CSS style overrides for the accordion                               |

**Example:**

<!-- prettier-ignore -->
```tsx
<Accordion defaultValue={["item1"]}>
  <AccordionItem id="item1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" />}>
      <h3>Section 1</h3>
    </AccordionHeader>
    <AccordionContent>
      <p>Content 1</p>
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Forms & Input

#### Search

**Complexity:** Medium | **Import:** `import { Search } from 'gd-design-library'`

Search input component with dropdown results list for real-time filtering and selection of items with customizable rendering and keyboard navigation support.

<!-- prettier-ignore -->
| Prop               | Type                                                                                         | Description                                                                                                                           |
| ------------------ | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `value`            | `string`                                                                                     | Current value of the search input field                                                                                               |
| `placeholder`      | `string`                                                                                     | Placeholder text shown when search input is empty                                                                                     |
| `options`          | `Array<{ value: unknown; label: string; disabled?: boolean; icon?: string; href?: string }>` | Array of search result options to display in the dropdown.                                                                            |
| `emptyItemsResult` | `string`                                                                                     | Message displayed when no options match the current search value.                                                                     |
| `actions`          | `string[]`                                                                                   | Optional action IDs triggered when the user types or selects an option. The renderer includes trigger metadata in the action payload. |
| `width`            | `string`                                                                                     | Width of the search input field                                                                                                       |
| `styling`          | `object`                                                                                     | CSS style overrides including width for the search component                                                                          |

**Example:**

<!-- prettier-ignore -->
```tsx
<Search items={products} value={query} onType={handleSearch} onSelect={handleSelect} placeholder="Search products..." />
```

#### Select

**Complexity:** Medium | **Import:** `import { Select } from 'gd-design-library'`

Dropdown selection component with customizable options and behavior. Supports both single and multiple selection modes.

<!-- prettier-ignore -->
| Prop                | Type                                                                          | Description                                                                        |
| ------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `options`           | `Array<{ label: string; value: unknown; disabled?: boolean; icon?: string }>` | Dropdown options shown in the menu. Each option uses the shared A2UI option shape. |
| `value`             | `unknown` \| `unknown[]` \| `null`                                            | Currently selected option value. Use an array when multiple=true.                  |
| `placeholder`       | `string`                                                                      | Text to display when no value is selected                                          |
| `disabled`          | `boolean`                                                                     | Whether the select is disabled                                                     |
| `multiple`          | `boolean`                                                                     | Whether to allow multiple selection                                                |
| `searchable`        | `boolean`                                                                     | Whether to show a search input for filtering options                               |
| `searchPlaceholder` | `string`                                                                      | Placeholder text for the internal search input when searchable is true             |
| `color`             | `"primary"` \| `"error"` \| `"success"` \| `"warning"`                        | Color state for validation feedback                                                |
| _...+6 more_        |                                                                               |                                                                                    |

**Example:**

<!-- prettier-ignore -->
```tsx
<Select items={[{name: "Option 1", value: "1"}]} value={selectedValue} onChange={handleChange} placeholder="Choose an option" />
```

#### Input

**Complexity:** Medium | **Import:** `import { Input } from 'gd-design-library'`

Versatile form input component supporting multiple field types including text, email, password, checkbox, radio, and more. Includes built-in label, helper text, and adornment support.

<!-- prettier-ignore -->
| Prop          | Type                                                                                                                                                                                            | Description                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `label`       | `string`                                                                                                                                                                                        | Input label text displayed above the field                                 |
| `placeholder` | `string`                                                                                                                                                                                        | Placeholder text shown when input is empty                                 |
| `value`       | `string`                                                                                                                                                                                        | Controlled value of the input                                              |
| `variant`     | `"text"` \| `"email"` \| `"password"` \| `"number"` \| `"tel"` \| `"url"` \| `"search"` \| `"radio"` \| `"checkbox"` \| `"date"` \| `"time"` \| `"month"` \| `"week"` \| `"color"` \| `"range"` | Input field type variant                                                   |
| `required`    | `boolean`                                                                                                                                                                                       | Whether the input is required for form validation                          |
| `disabled`    | `boolean`                                                                                                                                                                                       | Whether the input is disabled                                              |
| `readOnly`    | `boolean`                                                                                                                                                                                       | Whether the input is read-only                                             |
| `helpText`    | `string`                                                                                                                                                                                        | Helper text shown below the field (e.g. format hints, validation messages) |
| _...+10 more_ |                                                                                                                                                                                                 |                                                                            |

**Example:**

<!-- prettier-ignore -->
```tsx
<Input variant={InputVariantType.Email} label="Email Address" placeholder="user@example.com" required />
```

#### InputFile

**Complexity:** Medium | **Import:** `import { InputFile } from 'gd-design-library'`

File picker button wrapping a native file input with design system styling. Use DragAndDrop instead when a full drop zone with inline validation is needed.

<!-- prettier-ignore -->
| Prop         | Type                                     | Description                                                                        |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| `label`      | `string`                                 | Button text shown on the file picker trigger (for example "Browse Files").         |
| `accept`     | `string`                                 | MIME types or file extensions to accept (e.g. "image/*", ".pdf,.doc")              |
| `multiple`   | `boolean`                                | Whether multiple files can be selected at once                                     |
| `disabled`   | `boolean`                                | Whether the file picker is disabled                                                |
| `capture`    | `boolean` \| `'user'` \| `'environment'` | Mobile camera capture mode: "user" for front camera, "environment" for rear camera |
| `variant`    | `string`                                 | Internal button variant (for example outlined, text, or primary).                  |
| `icon`       | `string`                                 | Leading icon name for the internal button trigger.                                 |
| `iconEnd`    | `string`                                 | Trailing icon name for the internal button trigger.                                |
| _...+4 more_ |                                          |                                                                                    |

**Example:**

<!-- prettier-ignore -->
```tsx
// Basic file upload with change handler
const handleFileChange = (e) => {
  const files = e.target.files;
  console.log("Selected files:", files);
};
<InputFile onChange={handleFileChange}>Browse Files</InputFile>
```

#### Form

**Complexity:** Medium | **Import:** `import { Form } from 'gd-design-library'`

Semantic form wrapper component that handles form submission, field changes, and provides a structured container for form elements with built-in event handling.

<!-- prettier-ignore -->
| Prop       | Type              | Description                                                   |
| ---------- | ----------------- | ------------------------------------------------------------- |
| `children` | `A2UIComponent[]` | Form fields, buttons, and other form controls                 |
| `styling`  | `object`          | CSS style overrides for the form (e.g. { maxWidth: "600px" }) |
| `actions`  | `string[]`        | Action IDs from ui.actions to trigger on form submit          |

**Example:**

<!-- prettier-ignore -->
```tsx
<Form onSubmit={handleSubmit}><Input name="email" type="email" required /><Button type="submit">Submit</Button></Form>
```

#### Label

**Complexity:** Low | **Import:** `import { Label } from 'gd-design-library'`

Semantic label component for form controls providing accessible text labels with customizable spacing and interaction support.

<!-- prettier-ignore -->
| Prop        | Type     | Description                                                                |
| ----------- | -------- | -------------------------------------------------------------------------- |
| `label`     | `string` | Visible label text.                                                        |
| `htmlFor`   | `string` | ID of the associated form control (links label to input for accessibility) |
| `ariaLabel` | `string` | Accessible label when visual label alone is insufficient                   |
| `styling`   | `object` | CSS style overrides for the label                                          |

**Example:**

<!-- prettier-ignore -->
```tsx
<Label htmlFor="email-input">Email Address</Label>
```

#### Slider

**Complexity:** Medium | **Import:** `import { Slider } from 'gd-design-library'`

Range input component for selecting numeric values within a defined range with visual feedback and accessibility support.

<!-- prettier-ignore -->
| Prop       | Type       | Description                                            |
| ---------- | ---------- | ------------------------------------------------------ |
| `value`    | `number`   | Current value of the slider (controlled)               |
| `min`      | `number`   | Minimum value of the slider                            |
| `max`      | `number`   | Maximum value of the slider                            |
| `step`     | `number`   | Step increment for the slider                          |
| `disabled` | `boolean`  | Whether the slider is disabled                         |
| `actions`  | `string[]` | Action IDs from ui.actions to trigger on value change. |
| `styling`  | `object`   | CSS style overrides for the slider                     |

**Example:**

<!-- prettier-ignore -->
```tsx
<Slider min={0} max={100} value={50} onChange={handleChange} />
```

#### Switch

**Complexity:** Low | **Import:** `import { Switch } from 'gd-design-library'`

Toggle switch for binary on/off states. Ideal for settings, preferences, and feature toggles.

<!-- prettier-ignore -->
| Prop        | Type                  | Description                                                                                                                                                          |
| ----------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `checked`   | `boolean`             | Checked/on state of the switch (controlled)                                                                                                                          |
| `disabled`  | `boolean`             | Whether the switch is disabled                                                                                                                                       |
| `isLoading` | `boolean`             | Shows a loading overlay on the switch and disables interaction during async operations                                                                               |
| `value`     | `string`              | Text label content displayed next to the switch toggle (rendered as children).                                                                                       |
| `label`     | `"left"` \| `"right"` | LabelPosition — which side of the toggle the text appears on. Valid values: "left" \| "right" (default "right"). NEVER use this for text content; put text in value. |
| `name`      | `string`              | HTML name attribute for form submission                                                                                                                              |
| `styling`   | `object`              | CSS style overrides for the switch                                                                                                                                   |
| `actions`   | `string[]`            | Action IDs from ui.actions to trigger on toggle                                                                                                                      |

**Example:**

<!-- prettier-ignore -->
```tsx
{ "type": "switch", "id": "notifications_switch", "value": "Enable notifications" }
```

#### Toggle

**Complexity:** Medium | **Import:** `import { Toggle } from 'gd-design-library'`

Multi-option toggle component for selecting between multiple values with customizable rendering and keyboard support. Ideal for view switchers, filters, and mode selectors.

<!-- prettier-ignore -->
| Prop       | Type                                                                          | Description                                           |
| ---------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- |
| `options`  | `Array<{ label: string; value: unknown; disabled?: boolean; icon?: string }>` | Toggle options using the shared A2UI option shape.    |
| `value`    | `unknown`                                                                     | Currently selected value (controlled)                 |
| `disabled` | `boolean`                                                                     | Whether the toggle is disabled                        |
| `styling`  | `object`                                                                      | CSS style overrides for the toggle                    |
| `actions`  | `string[]`                                                                    | Action IDs from ui.actions to trigger on value change |

**Example:**

<!-- prettier-ignore -->
```tsx
<Toggle items={["List", "Grid", "Gallery"]} value={viewMode} onValueChange={setViewMode} />
```

#### Textarea

**Complexity:** Medium | **Import:** `import { Textarea } from 'gd-design-library'`

Multi-line text input with dynamic height adjustment, resize control, and helper text support.

<!-- prettier-ignore -->
| Prop                      | Type                                                   | Description                                                 |
| ------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `placeholder`             | `string`                                               | Placeholder text shown when textarea is empty               |
| `value`                   | `string`                                               | Controlled value of the textarea                            |
| `disabled`                | `boolean`                                              | Whether the textarea is disabled                            |
| `readOnly`                | `boolean`                                              | Whether the textarea is read-only                           |
| `variant`                 | `"default"` \| `"inline"`                              | Visual style variant of the textarea                        |
| `color`                   | `"primary"` \| `"error"` \| `"success"` \| `"warning"` | Color state for validation feedback                         |
| `resize`                  | `"none"` \| `"both"` \| `"horizontal"` \| `"vertical"` | Controls user resize behavior of the textarea               |
| `dynamicHeightAdjustment` | `boolean`                                              | Auto-grows the textarea height to fit content as user types |
| _...+6 more_              |                                                        |                                                             |

**Example:**

<!-- prettier-ignore -->
```tsx
<Textarea name="description" placeholder="Enter description..." rows={4} maxLength={500} />
```

#### Counter

**Complexity:** Medium | **Import:** `import { Counter } from 'gd-design-library'`

Numeric input component with increment/decrement controls for selecting values within a defined range. Provides accessible controls for quantity selection, settings adjustment, or any numeric value input.

<!-- prettier-ignore -->
| Prop       | Type       | Description                                                                                        |
| ---------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `initial`  | `number`   | Starting value of the counter                                                                      |
| `min`      | `number`   | Minimum allowed value (decrement button disables at this value)                                    |
| `max`      | `number`   | Maximum allowed value (increment button disables at this value)                                    |
| `disabled` | `boolean`  | Whether the counter is disabled                                                                    |
| `actions`  | `string[]` | Action IDs from ui.actions to trigger on value change. Runtime payload automatically includes qty. |
| `styling`  | `object`   | CSS style overrides for the counter wrapper                                                        |

**Example:**

<!-- prettier-ignore -->
```tsx
<Counter initial={1} min={1} max={10} onCounterChange={handleQuantityChange} />
```

#### Rating

**Complexity:** Medium | **Import:** `import { Rating } from 'gd-design-library'`

Interactive star rating component for collecting user feedback, displaying ratings, or showing quality indicators with customizable maximum value, read-only mode, and various size options.

<!-- prettier-ignore -->
| Prop           | Type                       | Description                                                       |
| -------------- | -------------------------- | ----------------------------------------------------------------- |
| `value`        | `number`                   | Current rating value (0–max), supports fractional values like 3.5 |
| `defaultValue` | `number`                   | Initial rating value for uncontrolled usage                       |
| `max`          | `number`                   | Total number of stars (default 5)                                 |
| `readOnly`     | `boolean`                  | When true, rating is display-only and non-interactive             |
| `size`         | `"sm"` \| `"md"` \| `"lg"` | Size variant of the rating component                              |
| `name`         | `string`                   | HTML name attribute for grouping radio inputs                     |
| `actions`      | `string[]`                 | Action IDs from ui.actions to trigger when the rating changes     |
| `styling`      | `object`                   | CSS style overrides for the rating component                      |

**Example:**

<!-- prettier-ignore -->
```tsx
<Rating value={4} max={5} onChange={handleRatingChange} />
```

#### DragAndDropFiles

**Complexity:** Medium | **Import:** `import { DragAndDropFiles } from 'gd-design-library'`

File upload component with drag-and-drop functionality, providing visual feedback during drag operations and customizable drop zones for intuitive file uploading experiences.

<!-- prettier-ignore -->
| Prop               | Type              | Description                                                                                                              |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `children`         | `A2UIComponent[]` | Components rendered inside the default drop-zone state.                                                                  |
| `dragOverChildren` | `A2UIComponent[]` | Components rendered as the drag-over overlay while files are hovering over the drop zone.                                |
| `actions`          | `string[]`        | Optional action IDs triggered when files are dropped. The renderer includes dropped file metadata in the action payload. |
| `styling`          | `object`          | Custom CSS properties for styling the drag-and-drop container.                                                           |

**Example:**

<!-- prettier-ignore -->
```tsx
<DragAndDropFiles onDrop={handleFileUpload} dragOverContent={<Typography>Drop files here</Typography>}>{uploadButton}</DragAndDropFiles>
```

#### RadioGroup

**Complexity:** Medium | **Import:** `import { RadioGroup } from 'gd-design-library'`

Radio button group component for single selection from multiple options with flexible layout variants (row, column, grid) and customization options including images, colors, tooltips, and custom rendering.

<!-- prettier-ignore -->
| Prop           | Type                                                                                                          | Description                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`      | `Array<{ value: string; label: string; disabled?: boolean; hex?: string; image?: string; tooltip?: string }>` | Array of radio options. Each option has value, label, optional disabled, and visual extras (theme-token-or-hex swatch color, image URL, tooltip). Prefer theme tokens in options[].hex before raw hex colors. |
| `value`        | `string`                                                                                                      | Currently selected value (controlled)                                                                                                                                                                         |
| `defaultValue` | `string`                                                                                                      | Initially selected value (uncontrolled)                                                                                                                                                                       |
| `variant`      | `"row"` \| `"column"` \| `"grid"`                                                                             | Layout arrangement of the radio items                                                                                                                                                                         |
| `size`         | `"sm"` \| `"md"`                                                                                              | Size of the radio items                                                                                                                                                                                       |
| `gutter`       | `string` \| `number`                                                                                          | Spacing between radio items                                                                                                                                                                                   |
| `gridColumns`  | `number` \| `string`                                                                                          | Number of columns for grid variant                                                                                                                                                                            |
| `gridRows`     | `number` \| `string`                                                                                          | Number of rows for grid variant                                                                                                                                                                               |
| _...+10 more_  |                                                                                                               |                                                                                                                                                                                                               |

**Example:**

<!-- prettier-ignore -->
```tsx
<RadioGroup options={[{label: "Option 1", value: "1"}, {label: "Option 2", value: "2"}]} value={selected} onChange={setSelected} />
```

#### Checkbox

**Complexity:** Low | **Import:** `import { Checkbox } from 'gd-design-library'`

Standalone checkbox atom with indeterminate state, size variants, and accessible labeling. Use for boolean toggles in forms and settings. In A2UI specs, represent checkboxes as { type: "input", variant: "checkbox" } — do NOT emit { type: "checkbox" }.

<!-- prettier-ignore -->
| Prop            | Type             | Description                                                      |
| --------------- | ---------------- | ---------------------------------------------------------------- |
| `checked`       | `boolean`        | Whether the checkbox is checked                                  |
| `indeterminate` | `boolean`        | Whether the checkbox shows an indeterminate (mixed) state        |
| `disabled`      | `boolean`        | Disables the checkbox interaction                                |
| `name`          | `string`         | HTML name attribute for form submission                          |
| `value`         | `string`         | Value associated with the checkbox for form data                 |
| `size`          | `'sm'` \| `'md'` | Size variant of the checkbox                                     |
| `label`         | `string`         | Visible label rendered next to the checkbox control.             |
| `actions`       | `string[]`       | Action IDs from ui.actions to trigger when the checkbox changes. |
| _...+1 more_    |                  |                                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<Checkbox checked={agreed} onValueChange={setAgreed}>I agree to the terms</Checkbox>
```

#### InputArea

**Complexity:** Medium | **Import:** `import { InputArea } from 'gd-design-library'`

Multi-line text input organism with auto-growing rows, character count, attachment button, and send action. Use for chat inputs, comment boxes, and message composers.

<!-- prettier-ignore -->
| Prop                   | Type      | Description                                    |
| ---------------------- | --------- | ---------------------------------------------- |
| `value`                | `string`  | Controlled text value of the input area        |
| `placeholder`          | `string`  | Placeholder text shown when the input is empty |
| `disabled`             | `boolean` | Disables the input area and all its actions    |
| `maxLength`            | `number`  | Maximum number of characters allowed           |
| `showCharacterCount`   | `boolean` | Whether to display a character count indicator |
| `showAttachmentButton` | `boolean` | Whether to show the attachment action button   |
| `showSendButton`       | `boolean` | Whether to show the send action button         |
| `sendButtonLabel`      | `string`  | Accessible label for the send button           |
| _...+10 more_          |           |                                                |

**Example:**

<!-- prettier-ignore -->
```tsx
<InputArea value={message} showSendButton placeholder="Type a message..." actions={["send"]} />
```

#### AttachmentFile

**Complexity:** Low | **Import:** `import { AttachmentFile } from 'gd-design-library'`

File attachment chip: file-copy icon on the left, bold file name (truncates with tooltip on hover), optional small metadata row (fileType · fileSize, both truncate), and a close/remove (×) button on the right. Horizontal inline chip, typically 40–48 px tall with rounded corners. Renders above the InputArea textarea or standalone. Use actions[] to wire the remove button in A2UI; in TSX use onRemove. Figma component set names: "AttachmentFile", "Attachment File", "File Chip", "File Tag", "attachment-chip". Also matches any chip/pill node that contains a file name + a remove/close affordance.

<!-- prettier-ignore -->
| Prop                | Type       | Description                                                                                                                                                                                                                                                                                      |
| ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `fileName`          | `string`   | Name of the attached file displayed in the chip. Truncates with a tooltip on hover when long. Required.                                                                                                                                                                                          |
| `fileType`          | `string`   | File type label shown below the file name (e.g. "PDF", "doc"). Truncates with ellipsis when long.                                                                                                                                                                                                |
| `fileSize`          | `string`   | File size label shown below the file name (e.g. "1.2 MB").                                                                                                                                                                                                                                       |
| `separator`         | `string`   | Character rendered between fileType and fileSize in the metadata row. Defaults to "·". Override for designs that use "/" or "\|".                                                                                                                                                                |
| `actions`           | `string[]` | Action IDs from ui.actions to trigger when the remove (×) button is clicked. The remove button is only rendered when this array is non-empty. In TSX this maps to onRemove. Example: set actions: ["remove_notes_txt"] and define { id: "remove_notes_txt", type: "remove-file" } in ui.actions. |
| `removeButtonLabel` | `string`   | Accessible aria-label for the remove button.                                                                                                                                                                                                                                                     |
| `disabled`          | `boolean`  | Disables the remove button, preventing file removal.                                                                                                                                                                                                                                             |
| `isLoading`         | `boolean`  | Shows a spinner in place of the remove button while the file is uploading. Only takes effect when actions[] is also provided (TSX: when onRemove is set).                                                                                                                                        |
| _...+1 more_        |            |                                                                                                                                                                                                                                                                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<AttachmentFile fileName="report.pdf" fileType="PDF" fileSize="1.2 MB" onRemove={() => removeFile(id)} />
```

### Communication & Chat

#### ChatContainer

**Complexity:** Medium | **Import:** `import { ChatContainer } from 'gd-design-library'`

Specialized layout component for building chat interfaces with collapsible sidebar. Provides organized structure for chat applications with sidebar navigation, headers, and content areas. Supports both expanded and minified sidebar states.

<!-- prettier-ignore -->
| Prop                       | Type              | Description                                                                                      |
| -------------------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `children`                 | `A2UIComponent[]` | Nested A2UI child components rendered in the main chat content area                              |
| `isOpen`                   | `boolean`         | Controlled sidebar open state                                                                    |
| `sidebarContent`           | `A2UIComponent[]` | Named slot for the expanded sidebar content such as conversations, channels, or navigation       |
| `sidebarMinifiedContent`   | `A2UIComponent[]` | Named slot for the collapsed or icon-only sidebar rail                                           |
| `sidebarHeaderContent`     | `A2UIComponent[]` | Named slot rendered above the expanded sidebar content, typically for search, filters, or titles |
| `headerContent`            | `A2UIComponent[]` | Named slot rendered in the main header area above the chat body                                  |
| `showSidebarAsideControl`  | `boolean`         | Whether to show the toggle button in the sidebar                                                 |
| `showSidebarHeaderControl` | `boolean`         | Whether to show the toggle button in the main header                                             |
| _...+1 more_               |                   |                                                                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<ChatContainer isOpen={true} onToggleSidebar={handleToggle} headerContent={<Header />} sidebarContent={<ConversationList />} sidebarMinifiedContent={<IconNav />}>{chatMessages}</ChatContainer>
```

#### ChatBubble

**Complexity:** Medium | **Import:** `import { ChatBubble } from 'gd-design-library'`

Chat message bubble component for displaying conversation messages with distinct styling for questions and answers, optional action buttons, and status indicators for message states.

<!-- prettier-ignore -->
| Prop             | Type                                         | Description                                                                                                                   |
| ---------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `variant`        | `"question"` \| `"answer"`                   | Visual style: "question" for user messages, "answer" for agent responses                                                      |
| `children`       | `A2UIComponent[]`                            | Optional rich child content rendered inside the bubble after the main text. Use label or value for plain message text.        |
| `status`         | `"pending"` \| `"fulfilled"` \| `"rejected"` | Message generation status — "pending" while streaming/generating, "fulfilled" when complete, "rejected" when generation fails |
| `actionChildren` | `A2UIComponent[]`                            | Components rendered below the message body in the dedicated action row.                                                       |
| `size`           | `"sm"` \| `"md"` \| `"lg"`                   | Size of the chat bubble                                                                                                       |
| `styling`        | `object`                                     | CSS style overrides for the chat bubble                                                                                       |

**Example:**

<!-- prettier-ignore -->
```tsx
<ChatBubble variant="question">How can I help you today?</ChatBubble>
```

### Content & Text

#### Typography

**Complexity:** Low | **Import:** `import { Typography } from 'gd-design-library'`

All text: headings (h1–h6), body paragraphs, caption-styled metadata, code snippets. Accepts box model props (margin, padding, width) directly — no wrapper needed. IMPORTANT: variant="caption" renders a real <caption> element by default, so outside table captions pair it with as="div" or as="span".

<!-- prettier-ignore -->
| Prop           | Type                                                                                                                                                                                                   | Description                                                                                                                                                                                                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`        | `string`                                                                                                                                                                                               | Text content to display (also accepted as value)                                                                                                                                                                                                                                                                                                                            |
| `variant`      | `"h1"` \| `"h2"` \| `"h3"` \| `"h4"` \| `"h5"` \| `"h6"` \| `"p"` \| `"span"` \| `"small"` \| `"strong"` \| `"i"` \| `"code"` \| `"kbd"` \| `"caption"` \| `"header"` \| `"sup"` \| `"sub"` \| `"div"` | Semantic HTML element. Valid values: h1\|h2\|h3\|h4\|h5\|h6\|p\|span\|small\|strong\|i\|code\|kbd\|caption\|header\|sup\|sub\|div. NEVER use body1, body2, inherit, display, subtitle1, subtitle2 — these are enum key names, not valid variant values. IMPORTANT: variant="caption" renders a real <caption> element by default; outside tables use as="div" or as="span". |
| `color`        | `string`                                                                                                                                                                                               | Text color. Prefer theme color token paths (e.g. "text.secondary", "text.warning", "text.default"). Use raw CSS/hex only when no theme token fits.                                                                                                                                                                                                                          |
| `align`        | `"start"` \| `"end"` \| `"left"` \| `"center"` \| `"right"` \| `"justify"`                                                                                                                             | Text alignment                                                                                                                                                                                                                                                                                                                                                              |
| `styleVariant` | `"bold"` \| `"semibold"` \| `"normal"` \| `"light"` \| `"italic"` \| `"small"` \| `"underline"` \| `"uppercase"` \| `"lowercase"` \| `"strike"`                                                        | Additional style modifiers (can be combined as array)                                                                                                                                                                                                                                                                                                                       |
| `size`         | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"`                                                                                                                                                         | Size override for the text                                                                                                                                                                                                                                                                                                                                                  |
| `as`           | `string`                                                                                                                                                                                               | Override the rendered HTML element (e.g. render h2 styles on an h1 element). Use as="div" or as="span" with variant="caption" outside table captions.                                                                                                                                                                                                                       |
| `styling`      | `object`                                                                                                                                                                                               | CSS style overrides including textAlign, color, and other CSS properties                                                                                                                                                                                                                                                                                                    |

**Example:**

<!-- prettier-ignore -->
```tsx
// Basic heading with alignment
<Typography variant="h1" align="center">Welcome to Our Platform</Typography>
```

### Display & Content

#### Badge

**Complexity:** Low | **Import:** `import { Badge } from 'gd-design-library'`

Badge component for displaying small pieces of information, status indicators, counts, or labels. Supports multiple variants and visual options with icon support. A2UI SPEC: use top-level "label" for badge text, top-level "iconStart" for the leading badge icon, and top-level "iconEnd" for the trailing badge icon. Legacy top-level "icon" is still accepted as a fallback alias for "iconStart". The renderer maps those icon names to the underlying Badge `iconStart?: ReactNode` and `iconEnd?: ReactNode` props internally, so do not pass raw React nodes in the A2UI payload.

<!-- prettier-ignore -->
| Prop         | Type                                                                          | Description                                                                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`      | `string`                                                                      | Badge text or count to display (maps to children)                                                                                                                             |
| `variant`    | `"primary"` \| `"secondary"` \| `"tertiary"` \| `"quaternary"` \| `"quinary"` | Visual style variant of the badge                                                                                                                                             |
| `size`       | `"sm"` \| `"md"` \| `"lg"`                                                    | Size of the badge                                                                                                                                                             |
| `appearance` | `"filled"` \| `"filledLight"` \| `"outline"` \| `"outlineFilledLight"`        | Visual fill style of the badge                                                                                                                                                |
| `disabled`   | `boolean`                                                                     | Whether the badge is disabled                                                                                                                                                 |
| `iconStart`  | `string`                                                                      | Leading icon name from the shared A2UI icon catalog. The renderer converts this to the underlying Badge `iconStart?: ReactNode` prop. Preferred over the legacy `icon` alias. |
| `iconEnd`    | `string`                                                                      | Trailing icon name from the shared A2UI icon catalog. The renderer converts this to the underlying Badge `iconEnd?: ReactNode` prop.                                          |
| `styling`    | `object`                                                                      | CSS style overrides for the badge                                                                                                                                             |

**Example:**

<!-- prettier-ignore -->
```tsx
<Badge>New</Badge>
```

#### AvatarUser

**Complexity:** Low | **Import:** `import { AvatarUser } from 'gd-design-library'`

Composite avatar component that displays a user with avatar image, name, optional subtitle, and optional badge. Supports card and profile layout variants.

<!-- prettier-ignore -->
| Prop          | Type                                           | Description                                                                                                                          |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `name`        | `string`                                       | Primary user display name shown next to or below the avatar. When src is omitted, the A2UI renderer derives initials from this name. |
| `variant`     | `"card"` \| `"profile"`                        | Layout variant of the component                                                                                                      |
| `subtitle`    | `string`                                       | Secondary line of text beneath the name, such as a role, team, or email address                                                      |
| `description` | `string`                                       | Fallback subtitle text. Used when subtitle is absent — the renderer promotes description to the subtitle slot automatically.         |
| `src`         | `string`                                       | URL of the avatar image                                                                                                              |
| `alt`         | `string`                                       | Alt text for the avatar image                                                                                                        |
| `size`        | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | Avatar size. Preferred A2UI field — use this over sizeVariant for consistency with the Avatar component.                             |
| `sizeVariant` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | Avatar size variant. Alias for size — both are accepted; size is preferred in A2UI specs.                                            |
| _...+9 more_  |                                                |                                                                                                                                      |

**Example:**

<!-- prettier-ignore -->
```tsx
<AvatarUser name="John Doe" />
```

#### Table

**Complexity:** High | **Import:** `import { Table, TableColumn, TableRowData, TableHead, TableBody, TableFooter, TableRow, TableCell, TableHeaderCell, TablePagination } from 'gd-design-library'`

Comprehensive table component with virtualization, pagination, sorting, expandable rows, custom header rendering, and imperative scroll methods. Built with subcomponents for flexible composition.

<!-- prettier-ignore -->
| Prop           | Type                                                                        | Description                                                                                                                     |
| -------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `columns`      | `Array<{ key: string; label: string; sortable?: boolean; width?: string }>` | Column definitions used by the A2UI table renderer. Each column needs a key and label, plus optional sortable and width values. |
| `rows`         | `Array<Record<string, unknown>>`                                            | Preferred row data source. Each object should include keys matching the configured columns.                                     |
| `data`         | `Array<Record<string, unknown>>`                                            | Legacy alias for rows; supported for backward compatibility                                                                     |
| `pagination`   | `boolean`                                                                   | Whether to show built-in pagination controls                                                                                    |
| `pageSize`     | `number`                                                                    | Default number of rows per page when pagination is enabled                                                                      |
| `pageSizes`    | `number[]`                                                                  | Selectable page-size options for the pagination control                                                                         |
| `stickyHeader` | `boolean`                                                                   | Keep the table header fixed while scrolling                                                                                     |
| `stickyFooter` | `boolean`                                                                   | Keep the table footer fixed while scrolling                                                                                     |
| _...+6 more_   |                                                                             |                                                                                                                                 |

**Example:**

<!-- prettier-ignore -->
```tsx
// Basic Table - Simple table with columns and data
import { Table, TableColumn } from 'gd-design-library';

const columns: TableColumn<any>[] = [
  { id: 'name', label: 'Name', accessor: 'name' },
  { id: 'email', label: 'Email', accessor: 'email' },
  { id: 'role', label: 'Role', accessor: 'role' },
];

const data = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'User' },
];

<Table columns={columns} data={data} />
```

#### Truncate

**Complexity:** Low | **Import:** `import { Truncate, type TruncateRef } from 'gd-design-library'`

Text truncation component that limits content to a specified number of lines using CSS line-clamp. Provides uniform truncation with visual alignment support and exposes truncation state via ref API for programmatic access.

<!-- prettier-ignore -->
| Prop      | Type     | Description                                                     |
| --------- | -------- | --------------------------------------------------------------- |
| `label`   | `string` | Text content to display and truncate.                           |
| `lines`   | `number` | Maximum number of lines before truncation (uses CSS line-clamp) |
| `styling` | `object` | CSS style overrides for the truncate component                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<Truncate>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Truncate>
```

### Actions & Controls

#### Button

**Complexity:** Low | **Import:** `import { Button } from 'gd-design-library'`

Clickable button with multiple style variants (primary, secondary, tertiary, outlined, text). Use actions[] to wire up A2UI interactions.

<!-- prettier-ignore -->
| Prop         | Type                                                                                    | Description                                                                                                                                                                                                                                        |
| ------------ | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`      | `string`                                                                                | Button text content (maps to children)                                                                                                                                                                                                             |
| `variant`    | `"primary"` \| `"secondary"` \| `"tertiary"` \| `"outlined"` \| `"text"` \| `"inherit"` | Visual style variant of the button. Valid ButtonVariant values (always lowercase): primary\|secondary\|tertiary\|outlined\|text\|inherit. NEVER use capitalized forms (Primary, Secondary…) or non-existent variants (danger, contained, default). |
| `disabled`   | `boolean`                                                                               | Disables the button preventing interaction                                                                                                                                                                                                         |
| `isLoading`  | `boolean`                                                                               | Shows a loading spinner inside the button and disables it                                                                                                                                                                                          |
| `fullWidth`  | `boolean`                                                                               | Makes the button fill the full width of its container                                                                                                                                                                                              |
| `isIcon`     | `boolean`                                                                               | Renders the button as a square icon-only button (no text)                                                                                                                                                                                          |
| `icon`       | `string`                                                                                | Leading icon name from the shared A2UI icon catalog.                                                                                                                                                                                               |
| `iconEnd`    | `string`                                                                                | Trailing icon name from the shared A2UI icon catalog.                                                                                                                                                                                              |
| _...+7 more_ |                                                                                         |                                                                                                                                                                                                                                                    |

**Example:**

<!-- prettier-ignore -->
```tsx
<Button variant="primary" onClick={handleSubmit}>Submit</Button>
```

### Navigation & Structure

#### Link

**Complexity:** Low | **Import:** `import { Link } from 'gd-design-library'`

Accessible anchor component for navigation with support for internal and absolute URL destinations, multiple visual variants, and proper security attributes. A2UI SPEC: use top-level "label" for text, plus top-level "href", "variant", "underline", "target", and "rel". Do NOT use "children" or put href inside "attributes". For custom hover colors, use the top-level "styling" object with standard CSS values. Figma color tokens: gds.color.text.link → color.text.link.default (#53B7E8) for default link state; gds.color.text.link.hover → color.text.link.hover (#278CBF) — pass default via the top-level "color" prop and hover via styling["&:hover"].color.

<!-- prettier-ignore -->
| Prop         | Type                                                        | Description                                                                                                 |
| ------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `label`      | `string`                                                    | A2UI: link text. Use top-level label instead of children.                                                   |
| `href`       | `string`                                                    | URL destination for the link. Top-level field in A2UI.                                                      |
| `target`     | `"_blank"` \| `"_self"` \| `"_parent"` \| `"_top"`          | Browsing context: "_blank" to open in new tab, "_self" for same tab. Top-level field in A2UI.               |
| `rel`        | `string`                                                    | Relationship attribute (e.g. "noopener noreferrer" for links opened in a new tab). Top-level field in A2UI. |
| `variant`    | `"primary"` \| `"secondary"` \| `"inverted"` \| `"inherit"` | Visual style variant of the link. Top-level field in A2UI.                                                  |
| `size`       | `"sm"` \| `"md"` \| `"lg"`                                  | Size variant of the link text. Top-level field in A2UI.                                                     |
| `underline`  | `"default"` \| `"highlight"` \| `"none"`                    | Underline style for the link. Top-level field in A2UI.                                                      |
| `disabled`   | `boolean`                                                   | Whether the link is disabled (prevents click interaction)                                                   |
| _...+7 more_ |                                                             |                                                                                                             |

**Example:**

<!-- prettier-ignore -->
```tsx
<Link href="/about" variant="primary">About Us</Link>
```

#### Breadcrumbs

**Complexity:** Low | **Import:** `import { Breadcrumbs } from 'gd-design-library'`

Navigation component that displays the current page location within a hierarchical structure, providing users with a trail of links to navigate back to parent pages.

<!-- prettier-ignore -->
| Prop                     | Type                                                                                      | Description                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `options`                | `Array<{ label: string; value?: string` \| `number; href?: string; disabled?: boolean }>` | Ordered breadcrumb items. Use href for navigable ancestors; omit href on the last item to mark the current page. |
| `separator`              | `string`                                                                                  | Text separator rendered between breadcrumb items (for example "/" or ">")                                        |
| `separatorIcon`          | `string`                                                                                  | Optional icon name rendered between breadcrumb items instead of a text separator                                 |
| `icon`                   | `string`                                                                                  | Optional leading icon shown before the breadcrumb trail                                                          |
| `iconEnd`                | `string`                                                                                  | Optional trailing icon shown after the breadcrumb trail                                                          |
| `separatorAfterLastItem` | `boolean`                                                                                 | Whether to show a separator after the last item                                                                  |
| `bordered`               | `boolean`                                                                                 | Whether to show a bordered container around the breadcrumbs                                                      |
| `ariaLabel`              | `string`                                                                                  | Accessible label for the breadcrumbs nav element (e.g. "Page navigation")                                        |
| _...+1 more_             |                                                                                           |                                                                                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<Breadcrumbs items={[<Link href="/">Home</Link>, <Link href="/products">Products</Link>, <Typography>Detail</Typography>]} />
```

#### Tabs

**Complexity:** Medium | **Import:** `import { Tabs } from 'gd-design-library'`

Navigation component that organizes content into separate views accessed through tabbed interfaces. Supports disabled states, notice counters, and keyboard navigation for accessible multi-section content organization.

<!-- prettier-ignore -->
| Prop        | Type                                                                                                                          | Description                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `options`   | `Array<{ label: string; value?: string` \| `number; disabled?: boolean; noticeCounter?: number` \| `string; icon?: string }>` | Tab definitions in display order. Match each option with the child panel at the same index. |
| `children`  | `A2UIComponent[]`                                                                                                             | Tab panel content components. Children are matched to options by index.                     |
| `value`     | `number`                                                                                                                      | Index of the currently active tab (0-based)                                                 |
| `actions`   | `string[]`                                                                                                                    | Action IDs from ui.actions to trigger when the active tab changes                           |
| `ariaLabel` | `string`                                                                                                                      | Accessible label for the tab navigation element                                             |
| `styling`   | `object`                                                                                                                      | CSS style overrides for the tabs component                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<Tabs tabs={[{label: "Overview", content: <Overview />}, {label: "Details", content: <Details />}]} />
```

#### Stepper

**Complexity:** Medium | **Import:** `import { Stepper } from 'gd-design-library'`

Progress indicator component that displays multi-step processes or workflows with visual feedback for completed, current, and upcoming steps. Supports custom step content, validation states, and interactive navigation between steps.

<!-- prettier-ignore -->
| Prop          | Type                                                                                                             | Description                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `options`     | `Array<{ label: string; value?: string` \| `number; validationStatus?: "success"` \| `"error"; icon?: string }>` | Ordered step definitions. Each option can include a label, optional value, validationStatus, and optional icon.         |
| `value`       | `number`                                                                                                         | Index of the currently active step (0-based)                                                                            |
| `isIconsView` | `boolean`                                                                                                        | Whether to render step indicators as icons instead of numbers                                                           |
| `actions`     | `string[]`                                                                                                       | Action IDs from ui.actions to trigger when a step is clicked. Runtime payload includes index, status, value, and label. |
| `styling`     | `object`                                                                                                         | CSS style overrides for the stepper                                                                                     |

**Example:**

<!-- prettier-ignore -->
```tsx
<Stepper steps={[{label: "Details"}, {label: "Payment"}, {label: "Review"}]} activeStep={1} />
```

#### Dropdown

**Complexity:** Medium | **Import:** `import { Dropdown } from 'gd-design-library'`

Keyboard-navigable dropdown container used to group focusable option content, typically inside Menu or Select-style experiences.

<!-- prettier-ignore -->
| Prop        | Type              | Description                                         |
| ----------- | ----------------- | --------------------------------------------------- |
| `width`     | `string`          | CSS width for the dropdown container (e.g. "240px") |
| `maxHeight` | `string`          | Maximum height for scrollable menus (e.g. "300px")  |
| `children`  | `A2UIComponent[]` | Dropdown-item elements or other focusable content   |
| `styling`   | `object`          | CSS style overrides for the dropdown surface        |

**Example:**

<!-- prettier-ignore -->
```tsx
<Dropdown><DropdownItem name="Profile" value="profile" /></Dropdown>
```

#### DropdownItem

**Complexity:** Low | **Import:** `import { DropdownItem } from 'gd-design-library'`

Selectable menu option used inside Dropdown or Menu content. Supports keyboard selection, disabled state, and Select context integration.

<!-- prettier-ignore -->
| Prop       | Type                 | Description                                                               |
| ---------- | -------------------- | ------------------------------------------------------------------------- |
| `label`    | `string`             | Human-readable display text for the dropdown item                         |
| `value`    | `string` \| `number` | Underlying option value returned on selection                             |
| `disabled` | `boolean`            | Prevents selection and keyboard activation                                |
| `actions`  | `string[]`           | Action IDs from ui.actions to trigger when this dropdown item is selected |
| `styling`  | `object`             | CSS style overrides for the dropdown item                                 |

**Example:**

<!-- prettier-ignore -->
```tsx
<DropdownItem name="Delete" value="delete" />
```

#### Menu

**Complexity:** Medium | **Import:** `import { Menu, MenuRef } from 'gd-design-library'`

Flexible dropdown menu component with smart positioning, customizable behavior, public API via ref, and full Box layout support.

<!-- prettier-ignore -->
| Prop            | Type                                                                                     | Description                                                |
| --------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `label`         | `string`                                                                                 | Text displayed in the trigger button                       |
| `icon`          | `string`                                                                                 | Optional leading icon for the trigger button               |
| `iconEnd`       | `string`                                                                                 | Optional trailing icon for the trigger button              |
| `variant`       | `string`                                                                                 | Trigger button variant (for example "text" or "secondary") |
| `options`       | `Array<{ value: string` \| `number; label: string; disabled?: boolean; href?: string }>` | Menu item definitions rendered inside the dropdown         |
| `placement`     | `"top-left"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-right"`                     | Position of the dropdown relative to the trigger           |
| `closeOnSelect` | `boolean`                                                                                | Whether the menu closes after an item is selected          |
| `offsetX`       | `number`                                                                                 | Horizontal pixel offset between menu and trigger           |
| _...+6 more_    |                                                                                          |                                                            |

**Example:**

<!-- prettier-ignore -->
```tsx
<Menu content={<DropdownItem name="Profile" value="profile" />} onSelect={(props) => console.log(props.data)}>Menu</Menu>
```

#### Header

**Complexity:** High | **Import:** `import { Header } from 'gd-design-library'`

Responsive site header organism with logo, actions, optional search, top banner, and a mobile navigation drawer pattern.

<!-- prettier-ignore -->
| Prop             | Type                                                                  | Description                                                                                                                                                      |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `logoChildren`   | `A2UIComponent[]`                                                     | Components rendered in the logo slot of the header.                                                                                                              |
| `menuChildren`   | `A2UIComponent[]`                                                     | Components rendered in the primary navigation slot.                                                                                                              |
| `actionChildren` | `A2UIComponent[]`                                                     | Components rendered in the utility/action slot on the right side of the header.                                                                                  |
| `showSearch`     | `boolean`                                                             | Enables the built-in search placement in the header                                                                                                              |
| `showTopBanner`  | `boolean`                                                             | Shows an announcement banner above the main navigation                                                                                                           |
| `bannerChildren` | `A2UIComponent[]`                                                     | Components rendered inside the optional top banner.                                                                                                              |
| `bgColor`        | `string`                                                              | Background color override for the header. Prefer theme color token paths (for example "bg.surface" or "bg.fill.info.primary.default") before raw CSS/hex colors. |
| `mobileMenuList` | `Array<{ title: string; path?: string; icon?: string; id?: string }>` | Array of mobile drawer menu items with visible title text and optional path/icon metadata.                                                                       |
| _...+4 more_     |                                                                       |                                                                                                                                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<Header logo={<Logo />} menu={<MainNav />} actions={<AccountActions />} />
```

#### SliderDots

**Complexity:** Low | **Import:** `import { SliderDots } from 'gd-design-library'`

Dot-based pagination indicator for carousels, image galleries, and step-based flows. Highlights the active dot and supports click navigation.

<!-- prettier-ignore -->
| Prop          | Type       | Description                                                  |
| ------------- | ---------- | ------------------------------------------------------------ |
| `count`       | `number`   | Total number of dots to render                               |
| `activeIndex` | `number`   | Zero-based index of the currently active dot                 |
| `actions`     | `string[]` | Action IDs from ui.actions to trigger when a dot is clicked. |
| `styling`     | `object`   | CSS style overrides for the dots container                   |

**Example:**

<!-- prettier-ignore -->
```tsx
<SliderDots count={5} activeIndex={currentSlide} onDotClick={goToSlide} />
```

#### Sidebar

**Complexity:** Medium | **Import:** `import { Sidebar } from 'gd-design-library'`

Collapsible navigation sidebar organism with nested menu items, active state tracking, and customizable header/footer. Use for app-level or section-level navigation.

<!-- prettier-ignore -->
| Prop             | Type                                                                                                                                                                                                              | Description                                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `items`          | `Array<{ id: string; label: string; icon?: string; href?: string; disabled?: boolean; children?: Array<{ id: string; label: string; icon?: string; href?: string; disabled?: boolean; children?: unknown[] }> }>` | Array of navigation items with id, label, optional icon metadata, and nested children.                                         |
| `activeItemId`   | `string`                                                                                                                                                                                                          | ID of the currently active navigation item                                                                                     |
| `collapsed`      | `boolean`                                                                                                                                                                                                         | Whether the sidebar is in collapsed (icon-only) mode                                                                           |
| `width`          | `string`                                                                                                                                                                                                          | CSS width of the sidebar in expanded state                                                                                     |
| `collapsedWidth` | `string`                                                                                                                                                                                                          | CSS width of the sidebar in collapsed state                                                                                    |
| `actions`        | `string[]`                                                                                                                                                                                                        | Optional action IDs triggered when a navigation item is clicked. The renderer includes the clicked item in the action payload. |
| `headerChildren` | `A2UIComponent[]`                                                                                                                                                                                                 | Components rendered at the top of the sidebar.                                                                                 |
| `footerChildren` | `A2UIComponent[]`                                                                                                                                                                                                 | Components rendered at the bottom of the sidebar.                                                                              |
| _...+2 more_     |                                                                                                                                                                                                                   |                                                                                                                                |

**Example:**

<!-- prettier-ignore -->
```tsx
<Sidebar items={navItems} activeItemId={currentPage} onItemClick={navigate} header={<Logo />} />
```

### Content & Media

#### Icon

**Complexity:** Low | **Import:** `import { Icon } from 'gd-design-library'`

SVG icon component that renders icons from a registered list with customizable size and color options. CRITICAL: Only use icon names from the availableIcons list. A2UI SPEC: set icon name in top-level "icon" field, "fill"/"fillSvg" as top-level fields (NOT inside "attributes", NOT inside "styling"). Example: {"type":"icon","icon":"star","size":"md","fill":"icon.primary"}.

<!-- prettier-ignore -->
| Prop         | Type                                                      | Description                                                                                                                                                                                                                                                                                                          |
| ------------ | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `icon`       | `string`                                                  | A2UI spec field for the icon name — MUST be from availableIcons. In A2UI JSON use top-level "icon" field: {"type":"icon","icon":"star"}. Do NOT use "label" or "attributes.name" for the icon name.                                                                                                                  |
| `size`       | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` \| `"xxl"` | Top-level size token. Resolves to fixed px dimensions: xs=14, sm=16, md=18, lg=24, xl=32, xxl=40. Overrides width/height when set.                                                                                                                                                                                   |
| `width`      | `number`                                                  | Top-level custom width in pixels. Only used when size is not set. Example: 20.                                                                                                                                                                                                                                       |
| `height`     | `number`                                                  | Top-level custom height in pixels. Only used when size is not set. Example: 20.                                                                                                                                                                                                                                      |
| `fill`       | `string`                                                  | Top-level A2UI field. Fill color for multi-path icons. Prefer theme color token paths (e.g. "icon.error", "icon.primary", "icon.default", "icon.success", "icon.info", "icon.warning", "icon.white", "icon.black"). Use raw CSS/hex only when no theme token fits. Do NOT put this inside "attributes" or "styling". |
| `fillSvg`    | `string`                                                  | Top-level A2UI field. Uniform fill color for the entire SVG. Prefer theme color token paths (same options as fill). Use raw CSS/hex only when no theme token fits. Use when you want one single color across the whole icon. Do NOT put this inside "attributes" or "styling".                                       |
| `ariaLabel`  | `string`                                                  | Accessible label for meaningful or interactive standalone icons.                                                                                                                                                                                                                                                     |
| `actions`    | `string[]`                                                | Action IDs from ui.actions to trigger on click.                                                                                                                                                                                                                                                                      |
| _...+1 more_ |                                                           |                                                                                                                                                                                                                                                                                                                      |

**Example:**

<!-- prettier-ignore -->
```tsx
<Icon name="search" size="md" />
```

#### Image

**Complexity:** Low | **Import:** `import { Image } from 'gd-design-library'`

Responsive image component with loading states, fallback support, and optional caption for displaying visual content.

<!-- prettier-ignore -->
| Prop         | Type                                                               | Description                                                                        |
| ------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `src`        | `string`                                                           | URL of the image to display                                                        |
| `alt`        | `string`                                                           | Alternative text for accessibility                                                 |
| `width`      | `number`                                                           | Width of the image in pixels                                                       |
| `height`     | `number`                                                           | Height of the image in pixels                                                      |
| `caption`    | `string`                                                           | Caption text displayed below the image                                             |
| `objectFit`  | `"cover"` \| `"contain"` \| `"fill"` \| `"none"` \| `"scale-down"` | CSS object-fit value for how the image fills its box                               |
| `as`         | `string`                                                           | HTML element to wrap the image in (e.g. "figure" for semantic markup with caption) |
| `captionAs`  | `string`                                                           | HTML element to use for the caption (default: "figcaption")                        |
| _...+2 more_ |                                                                    |                                                                                    |

**Example:**

<!-- prettier-ignore -->
```tsx
<Image src="/photo.jpg" alt="Product photo" width={400} height={300} />
```

#### Avatar

**Complexity:** Low | **Import:** `import { Avatar } from 'gd-design-library'`

User avatar component for displaying profile pictures, initials, or icons with support for badges, fallback content, and various size options. A2UI SPEC: all props are top-level fields — do NOT use "attributes" or "fallbackComponent". Use "label" or "value" for initials text. Use "size" or "sizeVariant" for size. For an icon inside the avatar, set top-level "icon" plus optional "fill" or "fillSvg"; the renderer maps that to Avatar fallback content internally. For a status badge ON the avatar use withBadge + badgeColor directly on this component — do NOT place a separate "badge" or sibling "icon" next to the avatar. Prefer theme color tokens before raw CSS/hex. Example: {"type":"avatar","icon":"star","size":"xl","backgroundColor":"#cfaaa7","fill":"#646464"}.

<!-- prettier-ignore -->
| Prop          | Type                                           | Description                                                                                                                                                                                       |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`                                       | A2UI: initials text shown as fallback (e.g. "JD"). Use label OR value — do NOT use "fallbackComponent". Renderer checks label first, then value.                                                  |
| `value`       | `string`                                       | Alias for label: initials text shown as avatar fallback when label is absent (e.g. "JD"). The renderer promotes value to the fallback slot automatically. Prefer label in new A2UI specs.         |
| `src`         | `string`                                       | Image URL. Top-level field in A2UI spec.                                                                                                                                                          |
| `alt`         | `string`                                       | Image alt text. Top-level field in A2UI spec.                                                                                                                                                     |
| `size`        | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | Avatar size. Preferred A2UI field — use this over sizeVariant.                                                                                                                                    |
| `sizeVariant` | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | Avatar size variant. Alias for size — both are accepted; size is preferred in A2UI specs.                                                                                                         |
| `withBadge`   | `boolean`                                      | Show status dot badge ON the avatar. Top-level field.                                                                                                                                             |
| `badgeColor`  | `string`                                       | Badge background color. Top-level field. Prefer theme color token paths (e.g. "bg.fill.success.primary.default", "bg.fill.error.primary.default"). Use raw CSS/hex only when no theme token fits. |
| _...+6 more_  |                                                |                                                                                                                                                                                                   |

**Example:**

<!-- prettier-ignore -->
```tsx
<Avatar src="/user-photo.jpg" alt="John Doe" sizeVariant="lg" />
```

#### Price

**Complexity:** Low | **Import:** `import { Price } from 'gd-design-library'`

Price display component for showing product prices with support for current and discounted pricing, currency formatting, and customizable styling for e-commerce applications.

<!-- prettier-ignore -->
| Prop                     | Type                       | Description                                                                                         |
| ------------------------ | -------------------------- | --------------------------------------------------------------------------------------------------- |
| `currentValue`           | `string`                   | Formatted current price string (e.g. "29.99", "1,299")                                              |
| `oldValue`               | `string`                   | Original/struck-through price for showing discounts                                                 |
| `currencySymbol`         | `string`                   | Currency symbol to display (e.g. "$", "€", "£")                                                     |
| `currencySymbolPosition` | `"before"` \| `"after"`    | Position of currency symbol. "before" (default): "$29.99"; "after": "29,99 €" (European convention) |
| `size`                   | `'sm'` \| `'md'` \| `'lg'` | Size variant of the price text                                                                      |
| `styling`                | `object`                   | CSS style overrides for the price component                                                         |

**Example:**

<!-- prettier-ignore -->
```tsx
// US convention (symbol before, period decimal)
<Price currentValue="29.99" currencySymbol="$" />
```

### Feedback & Status

#### InlineNotification

**Complexity:** Low | **Import:** `import { InlineNotification } from 'gd-design-library'`

Inline notification component for displaying contextual messages, alerts, and feedback with different severity levels.

<!-- prettier-ignore -->
| Prop       | Type                                                             | Description                                                                        |
| ---------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `variant`  | `"info"` \| `"warning"` \| `"error"` \| `"success"` \| `"basic"` | Visual severity variant of the notification                                        |
| `label`    | `string`                                                         | Optional emphasized heading shown at the top of the notification                   |
| `value`    | `string`                                                         | Primary body message shown inside the notification                                 |
| `children` | `A2UIComponent[]`                                                | Optional nested components rendered below the text for richer notification content |
| `styling`  | `object`                                                         | CSS style overrides for the notification                                           |

**Example:**

<!-- prettier-ignore -->
```tsx
<InlineNotification variant="success">Your changes have been saved successfully.</InlineNotification>
```

#### Loader

**Complexity:** Low | **Import:** `import { Loader } from 'gd-design-library'`

Loading indicator component that displays animated spinners or dots to communicate loading states, with flexible wrapper options and size variants. A2UI SPEC: use top-level "name" for animation type ("circle" or "dots"), plus top-level "size", optional "rounded" for dots, "variant", and "withWrapper".

<!-- prettier-ignore -->
| Prop             | Type                                                                                   | Description                                                            |
| ---------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `name`           | `"circle"` \| `"dots"`                                                                 | Animation type of the loader                                           |
| `variant`        | `"inline"` \| `"block"` \| `"flex"` \| `"absolute"` \| `"fixed"` \| `"fullPage"`       | Display variant controlling loader positioning and layout              |
| `size`           | `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"`                                         | Size variant of the loader                                             |
| `rounded`        | `"none"` \| `"default"` \| `"round"` \| `"xs"` \| `"sm"` \| `"md"` \| `"lg"` \| `"xl"` | Border radius for dots animation (only applies when name="dots")       |
| `withWrapper`    | `boolean`                                                                              | Whether to wrap loader in a container element                          |
| `animationProps` | `string`                                                                               | Custom CSS animation shorthand for fine-grained loader motion control. |
| `styling`        | `object`                                                                               | CSS style overrides for the loader                                     |

**Example:**

<!-- prettier-ignore -->
```tsx
<Loader name="circle" size="md" />
```

#### Skeleton

**Complexity:** Low | **Import:** `import { Skeleton } from 'gd-design-library'`

Loading placeholder component that displays animated shapes to indicate content is being loaded, improving perceived performance by showing the structure of upcoming content.

<!-- prettier-ignore -->
| Prop              | Type                                           | Description                                                                                                                                                                                                                     |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`         | `"rounded"` \| `"circular"` \| `"rectangular"` | Shape variant of the skeleton element                                                                                                                                                                                           |
| `width`           | `string`                                       | Width of the skeleton element (e.g. "100%", "200px")                                                                                                                                                                            |
| `height`          | `string`                                       | Height of the skeleton element (e.g. "40px", "1em")                                                                                                                                                                             |
| `backgroundColor` | `string`                                       | Fill color of the skeleton element. Prefer theme color token paths or palette-style aliases (e.g. "bg.fill.success.primary.default", "brand.500", "theme.palette.success.main"). Use raw CSS/hex only when no theme token fits. |
| `animationName`   | `string`                                       | Animation keyframe name. Accepts theme animation token names such as "blinkKeyframes", raw CSS animation names, or null to disable the built-in animation.                                                                      |
| `animationProps`  | `string`                                       | Custom animation CSS value for advanced customization                                                                                                                                                                           |
| `children`        | `Component[]`                                  | Nested A2UI child placeholders for complex loading layouts.                                                                                                                                                                     |
| `styling`         | `object`                                       | CSS style overrides for the skeleton element                                                                                                                                                                                    |

**Example:**

<!-- prettier-ignore -->
```tsx
<Skeleton variant="rectangular" width="100%" height="200px" />
```

#### Snackbar

**Complexity:** Medium | **Import:** `import { showSnackbar, SnackbarVariant, SnackbarPosition } from 'gd-design-library'`

Toast notification system for displaying temporary messages, alerts, and feedback with configurable positioning, duration, and styling. Use showSnackbar() function to trigger notifications.

<!-- prettier-ignore -->
| Prop             | Type                                                                                                        | Description                                                       |
| ---------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `label`          | `string`                                                                                                    | Optional title text displayed at the top of the snackbar          |
| `value`          | `string`                                                                                                    | Main body message of the snackbar                                 |
| `variant`        | `"info"` \| `"warning"` \| `"error"` \| `"success"`                                                         | Visual style variant determining color and icon                   |
| `placement`      | `"top-left"` \| `"top-center"` \| `"top-right"` \| `"bottom-left"` \| `"bottom-center"` \| `"bottom-right"` | Screen placement of the snackbar overlay                          |
| `duration`       | `number` \| `null`                                                                                          | Auto-dismiss duration in ms; null or 0 for persistent snackbars   |
| `dismissOnClick` | `boolean`                                                                                                   | Whether clicking the snackbar dismisses it                        |
| `colored`        | `boolean`                                                                                                   | Whether to use a colored (filled) background matching the variant |
| `isAnimated`     | `boolean`                                                                                                   | Whether the snackbar should animate in and out                    |
| _...+2 more_     |                                                                                                             |                                                                   |

**Example:**

<!-- prettier-ignore -->
```tsx
const SnackbarExample = () => { const onClick = () => { showSnackbar({ title: "Info", message: "This is an example of snackbar message.", variant: SnackbarVariant.Info, position: SnackbarPosition.TopRight, duration: 3000, dismissOnClick: true }); }; return ( <div> <SnackbarManager /> <Button onClick={onClick}>Show Snackbar</Button> </div> ); };
```

#### SnackbarManager

**Complexity:** Low | **Import:** `import { SnackbarManager } from 'gd-design-library'`

Global snackbar container component that manages and displays all snackbar notifications. Must be included once at the app root level to enable showSnackbar() functionality.

**Example:**

<!-- prettier-ignore -->
```tsx
<SnackbarManager />
```

#### ProgressBar

**Complexity:** Low | **Import:** `import { ProgressBar } from 'gd-design-library'`

Visual progress indicator component that displays task completion status with determinate or indeterminate states, customizable colors, and optional percentage display for tracking operations, uploads, or multi-step processes.

<!-- prettier-ignore -->
| Prop              | Type      | Description                                                                                                                                                        |
| ----------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`           | `string`  | Optional visible label rendered alongside the progress bar                                                                                                         |
| `value`           | `number`  | Progress value from 0 to 100 (omit for indeterminate mode)                                                                                                         |
| `indeterminate`   | `boolean` | Show animated indeterminate mode for unknown durations                                                                                                             |
| `showPercentage`  | `boolean` | Show numeric percentage label (default: false)                                                                                                                     |
| `fillColor`       | `string`  | Color of the filled progress track. Prefer theme color token paths (for example "bg.fill.primary" or "bg.fill.success.primary.default") before raw CSS/hex colors. |
| `backgroundColor` | `string`  | Background track color. Prefer theme color token paths (for example "bg.fill.disabled" or "bg.fill.info.secondary.default") before raw CSS/hex colors.             |
| `ariaLabel`       | `string`  | Accessible label announced to screen readers                                                                                                                       |
| `styling`         | `object`  | CSS style overrides for the progress bar                                                                                                                           |

**Example:**

<!-- prettier-ignore -->
```tsx
<ProgressBar value={75} showPercentage />
```

### Content & Structure

#### List

**Complexity:** Low | **Import:** `import { List } from 'gd-design-library'`

Flexible list component for displaying collections of items with various style variants including unordered, ordered, and inline layouts.

<!-- prettier-ignore -->
| Prop      | Type                                                                                                     | Description                                                          |
| --------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `options` | `Array<{ label: string; value?: string` \| `number; icon?: string }>`                                    | Preferred list item source for simple text or icon-backed list rows  |
| `value`   | `Array<string` \| `number` \| `{ label?: string; name?: string; title?: string; description?: string }>` | Fallback array source for primitive or lightweight object list items |
| `variant` | `"ordered-circle"` \| `"ordered-square"` \| `"unordered-dot"` \| `"unordered-check"`                     | List style variant controlling bullet/numbering style                |
| `size`    | `"sm"` \| `"md"`                                                                                         | Size of the list items                                               |
| `styling` | `object`                                                                                                 | CSS style overrides for the list                                     |

**Example:**

<!-- prettier-ignore -->
```tsx
<List variant="unordered-dot" items={["First item", "Second item", "Third item"]} />
```

### Overlay & Dialog

#### Modal

**Complexity:** Medium | **Import:** `import { Modal } from 'gd-design-library'`

Overlay dialog component for displaying content in a layer above the main application, with built-in backdrop, close controls, and accessibility features for focused user interactions.

<!-- prettier-ignore -->
| Prop                  | Type              | Description                                                                                                |
| --------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `label`               | `string`          | Modal heading text rendered in the header area. Use title only when a separate metadata field is required. |
| `title`               | `string`          | Optional alternate heading text used for the modal header.                                                 |
| `footer`              | `A2UIComponent[]` | Components rendered in the modal footer area.                                                              |
| `children`            | `A2UIComponent[]` | Components rendered in the modal body.                                                                     |
| `showCloseButton`     | `boolean`         | Whether to show the × close button in the header                                                           |
| `closeOnEscape`       | `boolean`         | Whether pressing Escape closes the modal                                                                   |
| `closeOnClickOutside` | `boolean`         | Whether clicking the backdrop closes the modal                                                             |
| `isCustomView`        | `boolean`         | When true, suppresses default header/footer rendering for fully custom layouts                             |
| _...+1 more_          |                   |                                                                                                            |

**Example:**

<!-- prettier-ignore -->
```tsx
<Modal isOpen={isOpen} onClose={handleClose} title="Confirm Action" footer={<Button onClick={handleConfirm}>Confirm</Button>}>Are you sure you want to proceed?</Modal>
```

#### Portal

**Complexity:** Medium | **Import:** `import { Portal } from 'gd-design-library'`

Utility component that renders its children into a different part of the DOM tree, useful for modals, tooltips, and overlays that need to escape parent container constraints while maintaining React component hierarchy.

<!-- prettier-ignore -->
| Prop             | Type                                      | Description                                                                                   |
| ---------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| `blocksScroll`   | `boolean`                                 | Whether to prevent scrolling of the underlying content when portal is open                    |
| `container`      | `string`                                  | Optional CSS selector for the portal target container. Omit to render into document.body.     |
| `withWrapper`    | `boolean`                                 | Whether to wrap the portal content in a container element                                     |
| `wrapperVariant` | `"inline"` \| `"section"` \| `"fullPage"` | The style variant for the wrapper container                                                   |
| `WrapperView`    | `string`                                  | Underlying HTML element to use for the optional wrapper, such as "div", "section", or "aside" |
| `children`       | `A2UIComponent[]`                         | Nested A2UI child components rendered inside the portal                                       |
| `styling`        | `object`                                  | CSS style overrides for the portal container                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<Portal blocksScroll={true}><Modal isOpen={true} onClose={handleClose}>{modalContent}</Modal></Portal>
```

#### Tooltip

**Complexity:** Medium | **Import:** `import { Tooltip } from 'gd-design-library'`

Contextual information overlay component that displays helpful text on hover or focus, with smart positioning, configurable delays, and full accessibility support through portal rendering.

<!-- prettier-ignore -->
| Prop              | Type                                           | Description                                                                             |
| ----------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------- |
| `content`         | `string`                                       | Tooltip text displayed on hover or focus                                                |
| `children`        | `A2UIComponent[]`                              | The trigger component(s) that show the tooltip on hover or focus                        |
| `placement`       | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | Position of the tooltip relative to the trigger element                                 |
| `delay`           | `number`                                       | Delay in milliseconds before the tooltip appears                                        |
| `gap`             | `number`                                       | Pixel gap between the tooltip and the trigger element                                   |
| `as`              | `string`                                       | HTML element to render the tooltip trigger wrapper as (e.g. "span" for inline contexts) |
| `ariaLabel`       | `string`                                       | Accessible label for the trigger wrapper element                                        |
| `ariaDescribedBy` | `string`                                       | Optional ARIA description id forwarded to the trigger wrapper                           |
| _...+1 more_      |                                                |                                                                                         |

**Example:**

<!-- prettier-ignore -->
```tsx
<Tooltip content="Save your changes" position="top"><Button>Save</Button></Tooltip>
```

#### SearchModal

**Complexity:** High | **Import:** `import { SearchModal } from 'gd-design-library'`

Modal-style search surface with built-in search field, loading state, history/results sections, and result click handling.

<!-- prettier-ignore -->
| Prop                    | Type                                                                                                                                                                                           | Description                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `placeholder`           | `string`                                                                                                                                                                                       | Placeholder text for the internal search input.                                  |
| `searchValue`           | `string`                                                                                                                                                                                       | Current search query value                                                       |
| `isLoading`             | `boolean`                                                                                                                                                                                      | Shows a skeleton loader while fetching results                                   |
| `results`               | `Array<{ id?: string; title: string; description?: string; icon?: string; date?: number; items?: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }>` | Live search result items to display. Grouped items use the nested items[] shape. |
| `historyResults`        | `Array<{ id?: string; title: string; description?: string; icon?: string; date?: number; items?: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }>` | Recent or grouped history result items shown before a query is typed.            |
| `noResultsLabel`        | `string`                                                                                                                                                                                       | Empty-state message shown when a live query returns no results                   |
| `noHistoryResultsLabel` | `string`                                                                                                                                                                                       | Empty-state message shown before any query is typed                              |
| `newSearchCta`          | `string`                                                                                                                                                                                       | Call-to-action label for starting a new search                                   |
| _...+7 more_            |                                                                                                                                                                                                |                                                                                  |

**Example:**

<!-- prettier-ignore -->
```tsx
<SearchModal modalProps={{ isOpen, onClose }} results={results} historyResults={recent} />
```

### Navigation & Display

#### Carousel

**Complexity:** Medium | **Import:** `import { Carousel } from 'gd-design-library'`

Container component for displaying a series of content in a scrollable format with navigation controls. Supports horizontal and vertical layouts with touch/swipe, keyboard navigation, and customizable slide dimensions. In A2UI, use this for prompts like image gallery, gallery, slider, slideshow, or "generate carousel 7 images", and whenever vertical layout or a single focused image sequence is requested.

<!-- prettier-ignore -->
| Prop              | Type                           | Description                                                                                                             |
| ----------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `children`        | `A2UIComponent[]`              | Carousel slide content. In A2UI, use direct "image" children or "carousel-slide" wrappers containing one "image" child. |
| `layout`          | `"horizontal"` \| `"vertical"` | Scroll direction of the carousel                                                                                        |
| `variant`         | `"cards"` \| `"single"`        | Visual variant of the carousel                                                                                          |
| `showArrows`      | `boolean`                      | Whether to show previous/next arrow navigation buttons                                                                  |
| `showDots`        | `boolean`                      | Whether to show dot indicators for each slide                                                                           |
| `thumbs`          | `"start"` \| `"end"`           | Position of thumbnail navigation strip relative to main carousel                                                        |
| `isFocusable`     | `boolean`                      | Whether slides can receive keyboard focus                                                                               |
| `carouselOptions` | `object`                       | Optional Embla carousel options such as loop or align. Only used by type "carousel".                                    |
| _...+1 more_      |                                |                                                                                                                         |

**Example:**

<!-- prettier-ignore -->
```tsx
<Carousel showDots={true}><Carousel.Slide><Image src="/slide1.jpg" /></Carousel.Slide><Carousel.Slide><Image src="/slide2.jpg" /></Carousel.Slide></Carousel>
```

#### ContentCarousel

**Complexity:** Medium | **Import:** `import { ContentCarousel } from 'gd-design-library'`

Production-ready horizontal carousel component with smart navigation, accessibility, and touch support. Built on Embla Carousel with item-by-item scrolling, keyboard navigation, and responsive design. Use for product galleries, testimonials, team showcases, image collections, or any repeated horizontal content. In A2UI, prefer this over "carousel" for prompts like "generate carousel 5 image items", "carousel of cards", "carousel of text blocks", "carousel of blocks", or other repeated horizontal item collections that explicitly say items/cards/blocks/text. Plain image-only carousel prompts should use "carousel" instead. In A2UI JSON, encode slide content in children[] and never emit React-only items/renderItem fields.

<!-- prettier-ignore -->
| Prop              | Type                     | Description                                                                                                                                                                    |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `children`        | `A2UIComponent[]`        | Repeated slide content. In A2UI, provide children[] of "image", "card", "carousel-slide", typography blocks, or other supported slide content. Do not use items or renderItem. |
| `showArrows`      | `boolean`                | Whether to show previous/next arrow navigation buttons                                                                                                                         |
| `showDots`        | `boolean`                | Whether to show dot indicators                                                                                                                                                 |
| `isFocusable`     | `boolean`                | Whether slides can receive keyboard focus                                                                                                                                      |
| `visibleItems`    | `number`                 | Number of slides visible at once                                                                                                                                               |
| `scrollStep`      | `number`                 | Number of items to scroll per navigation action                                                                                                                                |
| `scrollAlignment` | `"left"` \| `"centered"` | Alignment of the active slide within the viewport                                                                                                                              |
| `styling`         | `object`                 | CSS style overrides for the carousel container                                                                                                                                 |

**Example:**

<!-- prettier-ignore -->
```tsx
{ type: "content-carousel", showArrows: true, showDots: true, visibleItems: 3, children: [{ type: "card", ... }] }
```

### Widgets

#### DragAndDrop

**Complexity:** High | **Import:** `import { DragAndDrop } from 'gd-design-library'`

Workflow upload widget that combines drag-and-drop handling, inline validation, and an InputFile fallback trigger into a single controlled upload surface. In A2UI, describe it with JSON-safe fields and actions[] rather than React callbacks or refs.

<!-- prettier-ignore -->
| Prop                   | Type                                                    | Description                                                                                                     |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `title`                | `string`                                                | Primary heading shown inside the default upload surface. Falls back to label when omitted.                      |
| `description`          | `string`                                                | Supporting copy explaining allowed formats, file size limits, or the next upload step.                          |
| `inputFileButtonLabel` | `string`                                                | Visible label for the built-in InputFile trigger button inside the default upload surface.                      |
| `acceptedFileTypes`    | `string[]`                                              | Allowed MIME types for dropped or selected files (for example ["image/png", "application/pdf"]).                |
| `maxFileSize`          | `number`                                                | Maximum allowed size in bytes for each file.                                                                    |
| `maxFiles`             | `number`                                                | Maximum total number of files allowed in the widget at once.                                                    |
| `errors`               | `string[]`                                              | Inline validation or upload error messages rendered below the uploader controls.                                |
| `files`                | `Array<{ name: string; size?: number; type?: string }>` | Optional controlled file metadata used by A2UI renderers to preserve the current file count between re-renders. |
| _...+7 more_           |                                                         |                                                                                                                 |

**Example:**

<!-- prettier-ignore -->
```tsx
{ type: "drag-and-drop", title: "Upload assets", description: "PNG, JPG or PDF up to 10MB", inputFileButtonLabel: "Choose files" }
```

### Data Display

#### Chart

**Complexity:** High | **Import:** `import { Chart } from 'gd-design-library'`

Reusable data visualization component supporting line, bar, area, pie, and donut chart variants. Built on visx internally with a GridKit-native API. Features consistent theming, interactive legend, custom tooltips, responsive sizing, and built-in loading/empty/error states.

<!-- prettier-ignore -->
| Prop          | Type                                                                                                                                                                                            | Description                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`     | `"line"` \| `"bar"` \| `"area"` \| `"pie"` \| `"donut"`                                                                                                                                         | Chart type to render                                                                                                                                                                      |
| `data`        | `Array<Record<string, string` \| `number` \| `null>>`                                                                                                                                           | Array of data records to visualize.                                                                                                                                                       |
| `xKey`        | `string`                                                                                                                                                                                        | Field name in data records to use as the x-axis key                                                                                                                                       |
| `series`      | `Array<{ dataKey: string; label?: string; color?: string; stackId?: string; curveType?: "monotone"` \| `"linear"` \| `"step"` \| `"natural"; fillOpacity?: number; hidden?: boolean }>`         | Series definitions for XY charts (line, bar, area) — each entry maps a data field to a chart series. When using series[].color, Prefer theme color token paths before raw CSS/hex colors. |
| `pieConfig`   | `{ nameKey: string; dataKey: string; innerRadius?: string` \| `number; outerRadius?: string` \| `number; showLabels?: boolean; paddingAngle?: number; startAngle?: number; endAngle?: number }` | Configuration for pie/donut charts.                                                                                                                                                       |
| `title`       | `string`                                                                                                                                                                                        | Visible or screen-reader chart title passed to the chart container.                                                                                                                       |
| `label`       | `string`                                                                                                                                                                                        | Accessible chart label used when title text is not enough.                                                                                                                                |
| `description` | `string`                                                                                                                                                                                        | Accessible chart description for screen readers.                                                                                                                                          |
| _...+15 more_ |                                                                                                                                                                                                 |                                                                                                                                                                                           |

**Example:**

<!-- prettier-ignore -->
```tsx
// Line Chart - Monthly revenue and profit
import { Chart } from 'gd-design-library';

const data = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 5000, profit: 3800 },
];

<Chart
  variant="line"
  data={data}
  xKey="month"
  series={[
    { dataKey: 'revenue', label: 'Revenue' },
    { dataKey: 'profit', label: 'Profit' },
  ]}
  title="Revenue vs Profit"
/>
```

### Media & Display

#### ImagePreview

**Complexity:** Medium | **Import:** `import { ImagePreview } from 'gd-design-library'`

Image gallery organism with thumbnail navigation, counter overlay, and optional lightbox. Use for previewing collections of images with navigation controls.

<!-- prettier-ignore -->
| Prop                | Type                                                     | Description                                                                                                                            |
| ------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `images`            | `Array<{ src: string; alt?: string; caption?: string }>` | Array of image objects with src, alt text, and optional caption.                                                                       |
| `initialIndex`      | `number`                                                 | Zero-based index of the initially displayed image                                                                                      |
| `showThumbnails`    | `boolean`                                                | Whether to show thumbnail strip for navigation                                                                                         |
| `showCounter`       | `boolean`                                                | Whether to show a current/total image counter overlay                                                                                  |
| `showArrows`        | `boolean`                                                | Whether to show previous/next navigation arrows                                                                                        |
| `thumbnailPosition` | `'bottom'` \| `'left'`                                   | Position of the thumbnail strip relative to the main image                                                                             |
| `actions`           | `string[]`                                               | Optional action IDs triggered when the active image changes. The renderer includes the new index and image item in the action payload. |
| `children`          | `A2UIComponent[]`                                        | Optional components rendered below the image preview.                                                                                  |
| _...+1 more_        |                                                          |                                                                                                                                        |

**Example:**

<!-- prettier-ignore -->
```tsx
<ImagePreview images={photos} showThumbnails showArrows onImageChange={setActive} />
```

<!-- AUTO-GENERATED:COMPONENTS:END -->

## Component Schema Structure

Each component schema includes:

- **Required Fields**: `name`, `import`, `description`, `category`, `complexity`
- **Props**: Complete prop documentation with types and descriptions
- **Examples**: 5-10 code examples
- **Quick Start**: Basic usage examples
- **Common Patterns**: 3-5 common use cases with code
- **Best Practices**: 5-15 guidelines including guardrails
- **Troubleshooting**: Common issues and solutions
- **Composition Tips**: Integration with other components

## Guardrails

Guardrails are automatically extracted from component schemas. They include:

- Component-specific constraints (e.g., "ONLY use these icon names")
- API limitations (e.g., "Do NOT use prop X with prop Y")
- Critical requirements (marked with "CRITICAL:" prefix)

These are automatically included in generated prompts to ensure correct code generation.

## Best Practices

1. **Use Contextual Prompts** - Include specific components when you know what's needed
2. **Validate Generated Code** - Always validate AI-generated code before use
3. **Use Discovery** - Discover related components for better composition
4. **Check Guardrails** - Review guardrails for component-specific constraints
5. **Test Thoroughly** - Run tests to ensure schemas are valid

## Troubleshooting

### Common Issues

| Issue                            | Solution                                              |
| -------------------------------- | ----------------------------------------------------- |
| Missing props in schema          | Add to `props` array with type and description        |
| Invalid examples                 | Ensure examples use correct component names and props |
| Guardrails not working           | Add to `bestPractices` with "CRITICAL:" prefix        |
| Discovery not finding components | Check component name matches schema name              |
| Prompt too long                  | Use contextual prompts for specific components        |

## Contributing

When adding new components or updating schemas:

1. Update component schema in `schemas/components/`
2. Add examples and patterns
3. Include guardrails in `bestPractices`
4. Update composition tips
5. Run validation tests: `yarn test:ai`
6. Update documentation if needed

- [Prompt Usage Manual](./PROMPT_USAGE_MANUAL.md) - Complete guide for using prompts
- [llms.txt](./../llms.txt) - LLM-friendly documentation

---

**Version**: 1.0.0
**Last Updated**: March 2026
