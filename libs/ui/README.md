# GridKit – Grid Dynamics Design System

![GridKit Logo](https://unpkg.com/gd-design-library/gridKit_logo.png)

**GridKit** is Grid Dynamics' official React component library — 64 accessible, themeable components built for e-commerce and enterprise applications. It connects directly to Figma design tokens and includes a built-in AI layer that lets LLMs generate and render UI at runtime.

**Browse components:** [Storybook](https://storybook.cto-rnd-system-design.griddynamics.net)

---

## At a glance

|                |                                                     |
| -------------- | --------------------------------------------------- |
| Components     | 64 — atoms, molecules, organisms, layout            |
| Theming        | Runtime switching, Figma-synced design tokens       |
| Accessibility  | WCAG 2.1 AA                                         |
| AI integration | LLM → React/TSX code **or** A2UI JSON → rendered UI |
| Testing        | Vitest + React Testing Library                      |
| Build          | Vite, ESM + CJS, tree-shakeable                     |

---

## Quick start

### 1. Install

```bash
npm install gd-design-library @emotion/styled @emotion/react
```

### 2. Wrap your app

```tsx
import { ThemeProvider } from 'gd-design-library';
import 'gd-design-library/styles.css'; // optional: GD global styles, reset, fonts

function App() {
  return (
    <ThemeProvider isDefault>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 3. Use a component

```tsx
import { Button, Typography } from 'gd-design-library';

function Hero() {
  return (
    <>
      <Typography variant="h1">Hello GridKit</Typography>
      <Button variant="primary" onClick={() => alert('clicked')}>
        Get started
      </Button>
    </>
  );
}
```

That's it. Open [Storybook](https://storybook.cto-rnd-system-design.griddynamics.net) to browse all 64 components with live props and code samples.

---

## Theming

### Use the built-in default theme

Pass `isDefault` to `ThemeProvider` — applies GD tokens and global styles automatically.

```tsx
<ThemeProvider isDefault>
  <App />
</ThemeProvider>
```

### Extend the default theme

Override only the tokens you need. Everything else inherits from `defaultTheme`.

```tsx
import { ThemeProvider, defaultTheme } from 'gd-design-library';
import myBrandTokens from './myBrandTokens';

const theme = { ...defaultTheme, ...myBrandTokens };

<ThemeProvider initialTheme={theme}>
  <App />
</ThemeProvider>;
```

### Switch themes at runtime

Use the `useTheme` hook and `updateThemeTokens` to create and activate a custom theme dynamically.

```tsx
import { useEffect } from 'react';
import { updateThemeTokens, defaultTheme, useTheme } from 'gd-design-library';

export function useCustomTheme() {
  const { addTheme, setTheme } = useTheme();

  useEffect(() => {
    const custom = { ...defaultTheme, name: 'brand' };

    updateThemeTokens(custom, {
      'button.default': { borderRadius: '32px' },
      'select.dropdown': { backgroundColor: '#f5f5f5', borderRadius: '8px' },
    });

    addTheme(custom.name, custom);
    setTheme(custom.name);
  }, []);
}
```

Call `useCustomTheme()` anywhere in your tree — components update immediately.

**Token shape example** (`myBrandTokens.json`):

```json
{
  "name": "brand",
  "button.default": { "borderRadius": "4px" },
  "chatbubble.question": { "background": "#F1F5FA" }
}
```

---

## AI integration — A2UI

A2UI (Agent-to-UI) lets an LLM output a structured JSON spec. GridKit renders it as real React components — no JSX on your side.

### How it works

```text
User message → LLM (with system prompt from buildA2UISystemPrompt)
                    → A2UISpec JSON (validated against schema)
                          → renderA2UISpec → React components
```

Two functions, one shared `actions` array:

| Function                         | What it does                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `buildA2UISystemPrompt(options)` | Generates the LLM system instruction. Injects your `actions` as the only callable action types. |
| `renderA2UISpec(spec, actions)`  | Maps the validated JSON spec to GridKit components and wires action handlers.                   |

### Minimal example

```tsx
import { buildA2UISystemPrompt, renderA2UISpec } from 'gd-design-library/ai';
import type { A2UIActionDefinition } from 'gd-design-library/ai';

// Define actions once — shared by prompt builder and renderer
const actions: A2UIActionDefinition[] = [
  {
    type: 'add-to-cart',
    description: 'Add a product to the cart. payload: { productId: string, quantity: number }',
    handler: ({ payload }) => addToCart(payload),
  },
];

// Build the system prompt for your LLM
const systemPrompt = buildA2UISystemPrompt({
  agentId: 'shop-agent',
  agentName: 'Shop Assistant',
  context: 'E-commerce product catalog.',
  actions,
});

// Render whatever the LLM returns
function AgentResponse({ spec }) {
  return <>{renderA2UISpec(spec, actions)}</>;
}
```

### Gemini structured output

Pass the schema directly to `responseSchema` — the model returns valid JSON every time.

```tsx
import { buildA2UIGeminiRequest, A2UI_SPEC_SCHEMA } from 'gd-design-library/ai';

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: A2UI_SPEC_SCHEMA,
  },
});

const result = await model.generateContent(
  buildA2UIGeminiRequest('Show a product analytics dashboard', {
    agentId: 'analytics-agent',
    context: 'Product analytics for an e-commerce platform.',
    actions,
  })
);
```

### Validate before rendering

```tsx
import schema from 'gd-design-library/ai/ui-specification-schema.json';
import Ajv from 'ajv';

const validate = new Ajv().compile(schema);

if (!validate(spec)) {
  console.error('Invalid A2UI spec:', validate.errors);
}
```

Full reference: [`./ai/README.md`](./ai/README.md) and [`./ai/PROMPT_USAGE_MANUAL.md`](./ai/PROMPT_USAGE_MANUAL.md)

---

## Project structure

```text
libs/ui/src/
├── components/
│   ├── atoms/       # 21 primitives — Button, Input, Badge, …
│   ├── molecules/   # 18 composites — Accordion, Table, …
│   ├── organisms/   # 10 sections — Card, Chart, Modal, …
│   └── layout/      # 6 containers — Row, Column, FlexContainer, …
├── ai/              # AI integration (code mode + A2UI mode)
├── tokens/          # Design tokens (synced from Figma)
├── hooks/           # Shared React hooks
└── utils/           # Utility functions
```

## License

© Grid Dynamics. All rights reserved. For internal and authorized client use only.
