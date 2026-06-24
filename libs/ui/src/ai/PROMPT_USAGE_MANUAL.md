# Prompt Usage Manual: GridKit Design System AI Integration

> **Comprehensive guide** for using prompt generation utilities with the GridKit Design System AI integration system.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Basic Prompt Usage](#basic-prompt-usage)
3. [Contextual Prompts](#contextual-prompts)
4. [Agent-Specific Prompts](#agent-specific-prompts)
5. [Discovery Utilities](#discovery-utilities)
6. [Validation](#validation)
7. [Best Practices](#best-practices)
8. [Examples](#examples)
9. [Troubleshooting](#troubleshooting)

---

## Introduction

The GridKit Design System provides a comprehensive AI integration system that enables reliable code generation using only the design system's components. This manual covers how to use the prompt generation utilities effectively.

### Key Features

- **Automatic Guardrail Extraction**: Guardrails are automatically extracted from component schemas
- **Context-Aware Prompts**: Generate prompts with specific component details
- **Multi-Agent Support**: Optimized prompts for Claude, GPT-4, and Gemini
- **Discovery Utilities**: Find components by category, feature, or use case
- **Validation**: Validate schemas and generated code

### Installation

```typescript
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
```

---

## Basic Prompt Usage

### Standard Prompt Builder

The most common way to generate prompts is using `buildClaudeSystemPrompt`:

```typescript
import { buildClaudeSystemPrompt } from 'gd-design-library/ai';

const prompt = buildClaudeSystemPrompt('Create a sign-in form with email and password');
```

**What it includes:**

- System instructions for the AI agent
- Hard requirements (TSX only, single-source imports)
- API constraints and guardrails (automatically extracted)
- Complete component catalog
- Composition tips
- General guidelines

**Output:**

```text
You are Claude Code acting as a senior React UI engineer...
[System instructions]
[Guardrails]
[Component catalog]
[Composition tips]

Task: Create a sign-in form with email and password
```

### Direct System Prompt

For advanced use cases, you can access the system prompt directly:

```typescript
import { CLAUDE_GRIDKIT_SYSTEM_PROMPT } from 'gd-design-library/ai';

const customPrompt = `${CLAUDE_GRIDKIT_SYSTEM_PROMPT}\n\nTask: ${userRequest}`;
```

### Legacy Builder

For backward compatibility:

```typescript
import { buildGDLibraryPrompt } from 'gd-design-library/ai';

const prompt = buildGDLibraryPrompt('Create a user profile card');
// Same as buildClaudeSystemPrompt
```

---

## Contextual Prompts

Contextual prompts include detailed documentation for specific components, reducing token usage and improving accuracy.

### Basic Contextual Prompt

```typescript
import { buildContextualPrompt } from 'gd-design-library/ai';

const prompt = buildContextualPrompt('Create a form', {
  components: ['Form', 'Input', 'Button'],
});
```

**What it includes:**

- Standard system prompt
- Detailed documentation for specified components:
  - Component description
  - All props with types and descriptions
  - Quick start examples
  - Code examples

### Advanced Contextual Prompt

```typescript
const prompt = buildContextualPrompt('Create a complex form with validation', {
  components: ['Form', 'Input', 'Textarea', 'Select', 'Button', 'InlineNotification'],
  patterns: ['form-validation', 'error-handling'],
  constraints: ['accessibility', 'responsive'],
});
```

**Benefits:**

- Reduced token usage (only relevant components included)
- Better accuracy (detailed component docs)
- Faster generation (less context to process)

### When to Use Contextual Prompts

✅ **Use contextual prompts when:**

- You know which components you need
- Working with complex components (Accordion, Table, etc.)
- Token limits are a concern
- You need detailed prop information

❌ **Use standard prompts when:**

- You want the AI to discover components
- Working with simple requests
- You need the full component catalog

---

## Agent-Specific Prompts

Different AI agents require different prompt formats. The library provides optimized formats for each.

### Claude (Anthropic)

```typescript
import { buildClaudeSystemPrompt } from 'gd-design-library/ai';

const prompt = buildClaudeSystemPrompt('Create a form');
// Returns: string with system instructions
```

**Format:** Single string with system instructions and task

### GPT-4 (OpenAI)

```typescript
import { buildGPT4Prompt } from 'gd-design-library/ai';

const messages = buildGPT4Prompt('Create a sign-in form');
// Returns: Array of message objects
```

**Format:**

```typescript
[
  {
    role: 'system',
    content: '...system instructions...',
  },
  {
    role: 'user',
    content: 'Create a sign-in form',
  },
];
```

**Usage with OpenAI API:**

```typescript
import { buildGPT4Prompt } from 'gd-design-library/ai';
import OpenAI from 'openai';

const openai = new OpenAI();
const messages = buildGPT4Prompt('Create a sign-in form');

const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages,
});
```

### Gemini (Google)

```typescript
import { buildGeminiPrompt } from 'gd-design-library/ai';

const request = buildGeminiPrompt('Create a form');
// Returns: Gemini API request object
```

**Format:**

```typescript
{
  contents: [
    {
      parts: [
        {
          text: '...system instructions...\n\nTask: Create a form',
        },
      ],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  },
}
```

**Usage with Google Gemini API:**

```typescript
import { buildGeminiPrompt } from 'gd-design-library/ai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const request = buildGeminiPrompt('Create a form');
const result = await model.generateContent(request);
```

---

## Discovery Utilities

Before generating prompts, you may want to discover which components are available for your use case.

### Get Component by Name

```typescript
import { discovery } from 'gd-design-library/ai';

const button = discovery.getComponent('Button');
console.log(button?.description);
console.log(button?.props);
```

### Search Components

```typescript
const formComponents = discovery.searchComponents('form');
// Returns: [Input, Form, Select, Textarea, ...]
```

### Get Components by Category

```typescript
import { getComponentsByCategory } from 'gd-design-library/ai';

// Using Atomic Design categories
const atoms = getComponentsByCategory('Atoms');
// Returns: [Button, Input, Icon, Typography, Avatar, Badge, ...]

const molecules = getComponentsByCategory('Molecules');
// Returns: [Form, Accordion, Tabs, Rating, Breadcrumbs, ...]

const organisms = getComponentsByCategory('Organisms');
// Returns: [Card, Modal, Carousel, Header, Search, ...]

const layoutComponents = getComponentsByCategory('Layout');
// Returns: [Row, Column, FlexContainer, Portal, Scroll, ...]
```

**Available Categories (Atomic Design):**

- `'Atoms'` - Basic building blocks (Button, Input, Icon, Typography, etc.)
- `'Molecules'` - Simple combinations (Form, Accordion, Tabs, Rating, etc.)
- `'Organisms'` - Complex UI sections (Card, Modal, Carousel, Header, etc.)
- `'Layout'` - Structure & arrangement (Row, Column, FlexContainer, Portal, etc.)

### Get Components by Feature

```typescript
import { getComponentsByFeature } from 'gd-design-library/ai';

const validationComponents = getComponentsByFeature('validation');
// Returns components with validation features
```

### Get Components by Use Case

```typescript
import { getComponentsByUseCase } from 'gd-design-library/ai';

const formComponents = getComponentsByUseCase('user registration');
// Returns components with patterns matching the use case
```

### Get Components by Complexity

```typescript
const simpleComponents = discovery.getComponentsByComplexity('Low');
const complexComponents = discovery.getComponentsByComplexity('High');
```

### Find Related Components

```typescript
const related = discovery.getRelatedComponents('Input');
// Returns components mentioned in Input's composition tips
// Example: [Form, Label, Button, ...]
```

### Find Patterns

```typescript
import { findPatterns } from 'gd-design-library/ai';

const patterns = findPatterns(['Form', 'Input', 'Button'], 'validation');
// Returns patterns matching the use case
```

### Using Schema Index

```typescript
import { componentIndex } from 'gd-design-library/ai';

// Get by Atomic Design category
const atoms = componentIndex.byCategory['Atoms'];
const molecules = componentIndex.byCategory['Molecules'];
const organisms = componentIndex.byCategory['Organisms'];
const layout = componentIndex.byCategory['Layout'];

// Get by complexity
const simpleComponents = componentIndex.byComplexity.Low;

// Get by feature
const formComponents = componentIndex.byFeature['Forms'];
```

---

## Validation

### Validate Component Schema

```typescript
import { validateSchema } from 'gd-design-library/ai';

const result = validateSchema(componentSchema);

if (!result.valid) {
  console.error('Schema errors:', result.errors);
}
console.warn('Warnings:', result.warnings);
```

**Checks:**

- Required fields (name, import, description)
- Props structure
- Examples count
- Best practices count
- Quick start examples

### Validate All Schemas

```typescript
import { validateAllSchemas } from 'gd-design-library/ai';

const { results, summary } = validateAllSchemas();

console.log(`Valid: ${summary.valid}/${summary.total}`);
console.log(`Errors: ${summary.totalErrors}`);
console.log(`Warnings: ${summary.totalWarnings}`);

// Check specific component
const buttonResult = results.get('Button');
```

### Validate Generated Code

```typescript
import { validateGeneratedCode } from 'gd-design-library/ai';

const generatedCode = `
import { Button } from 'gd-design-library';

export function MyButton() {
  return <Button variant="primary">Click me</Button>;
}
`;

const result = validateGeneratedCode(generatedCode);

if (!result.valid) {
  console.error('Code errors:', result.errors);
}
console.warn('Warnings:', result.warnings);
```

**Checks:**

- Imports are from `gd-design-library`
- Components exist in the library
- Warns about raw HTML elements

---

## Best Practices

### 1. Use Contextual Prompts for Complex Requests

```typescript
// ✅ Good: Specific components
const prompt = buildContextualPrompt('Create a form', {
  components: ['Form', 'Input', 'Button'],
});

// ❌ Less efficient: Full catalog
const prompt = buildClaudeSystemPrompt('Create a form');
```

### 2. Discover Components Before Prompting

```typescript
// ✅ Good: Discover first
const formComponents = discovery.searchComponents('form');
const prompt = buildContextualPrompt('Create a form', {
  components: formComponents.map((c) => c.name),
});

// ❌ Less efficient: Guess components
const prompt = buildClaudeSystemPrompt('Create a form');
```

### 3. Validate Generated Code

```typescript
// ✅ Good: Validate after generation
const code = await generateCode(prompt);
const validation = validateGeneratedCode(code);
if (!validation.valid) {
  // Handle errors
}

// ❌ Risky: Use without validation
const code = await generateCode(prompt);
// Use code directly
```

### 4. Use Appropriate Agent Format

```typescript
// ✅ Good: Use correct format
const messages = buildGPT4Prompt('Create a form'); // For OpenAI
const request = buildGeminiPrompt('Create a form'); // For Gemini

// ❌ Wrong: Using wrong format
const prompt = buildClaudeSystemPrompt('Create a form'); // String format
// Won't work with OpenAI/Gemini APIs
```

### 5. Leverage Schema Index

```typescript
// ✅ Good: Use index for quick lookups
const formControls = componentIndex.byCategory['Forms & Inputs'];

// ❌ Less efficient: Search every time
const formControls = discovery.searchComponents('form');
```

### 6. Include Use Case Context

```typescript
// ✅ Good: Specific use case
const prompt = buildClaudeSystemPrompt(
  'Create a user registration form with email, password, and confirm password fields. Include validation and error messages.'
);

// ❌ Less clear: Vague request
const prompt = buildClaudeSystemPrompt('Create a form');
```

---

## Examples

### Example 1: Simple Form

```typescript
import { buildClaudeSystemPrompt } from 'gd-design-library/ai';

const prompt = buildClaudeSystemPrompt(
  'Create a sign-in form with email and password fields, a submit button, and a link to sign up'
);

// Send to AI agent
const code = await generateCode(prompt);
```

### Example 2: Complex Component with Context

```typescript
import { buildContextualPrompt, discovery } from 'gd-design-library/ai';

// Discover Accordion components
const accordion = discovery.getComponent('Accordion');
const related = discovery.getRelatedComponents('Accordion');

// Build contextual prompt
const prompt = buildContextualPrompt('Create an FAQ section with accordion items', {
  components: ['Accordion', ...related.map((c) => c.name)],
});

const code = await generateCode(prompt);
```

### Example 3: Multi-Agent Support

```typescript
import { buildGPT4Prompt, buildGeminiPrompt } from 'gd-design-library/ai';

// For OpenAI
const openaiMessages = buildGPT4Prompt('Create a dashboard layout');
const openaiResult = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: openaiMessages,
});

// For Google Gemini
const geminiRequest = buildGeminiPrompt('Create a dashboard layout');
const geminiResult = await gemini.generateContent(geminiRequest);
```

### Example 4: Discovery-Driven Prompt

```typescript
import { discovery, getComponentsByCategory, buildContextualPrompt } from 'gd-design-library/ai';

// Find all form components
const formComponents = getComponentsByCategory('Forms & Inputs');

// Get related components
const relatedComponents = formComponents.flatMap((c) => discovery.getRelatedComponents(c.name));

// Build prompt with discovered components
const prompt = buildContextualPrompt('Create a comprehensive form', {
  components: [...formComponents.map((c) => c.name), ...relatedComponents.map((c) => c.name)],
});

const code = await generateCode(prompt);
```

### Example 5: Validation Workflow

```typescript
import { buildClaudeSystemPrompt, validateGeneratedCode, validateAllSchemas } from 'gd-design-library/ai';

// Validate schemas first
const { summary } = validateAllSchemas();
if (summary.invalid > 0) {
  console.error('Some schemas are invalid!');
  return;
}

// Generate code
const prompt = buildClaudeSystemPrompt('Create a button');
const code = await generateCode(prompt);

// Validate generated code
const validation = validateGeneratedCode(code);
if (!validation.valid) {
  console.error('Generated code has errors:', validation.errors);
  // Retry or fix
} else if (validation.warnings.length > 0) {
  console.warn('Warnings:', validation.warnings);
  // Review warnings
} else {
  // Use code
  console.log('Code is valid!');
}
```

---

## Troubleshooting

### Issue: Prompt Too Long

**Problem:** Prompt exceeds token limits

**Solution:** Use contextual prompts with specific components

```typescript
// Instead of:
const prompt = buildClaudeSystemPrompt('Create a form');

// Use:
const prompt = buildContextualPrompt('Create a form', {
  components: ['Form', 'Input', 'Button'],
});
```

### Issue: Wrong Component Names

**Problem:** AI uses components not in the library

**Solution:** Use discovery utilities to verify components

```typescript
const component = discovery.getComponent('Button');
if (!component) {
  console.error('Component not found!');
}

// Or validate generated code
const validation = validateGeneratedCode(code);
if (!validation.valid) {
  // Check validation.errors
}
```

### Issue: Missing Guardrails

**Problem:** Generated code violates constraints

**Solution:** Guardrails are automatically included, but verify they're extracted

```typescript
// Guardrails are automatically extracted from schemas
// Check component schema has CRITICAL/IMPORTANT notes in bestPractices
const component = discovery.getComponent('Icon');
console.log(component?.bestPractices);
```

### Issue: Wrong Agent Format

**Problem:** Using Claude format with GPT-4/Gemini

**Solution:** Use agent-specific prompt builders

```typescript
// ❌ Wrong
const prompt = buildClaudeSystemPrompt('Create a form'); // String
const result = await openai.chat.completions.create({
  messages: [{ role: 'user', content: prompt }], // Wrong format
});

// ✅ Correct
const messages = buildGPT4Prompt('Create a form'); // Array
const result = await openai.chat.completions.create({
  messages, // Correct format
});
```

### Issue: Components Not Found

**Problem:** Discovery returns empty results

**Solution:** Check component names and categories

```typescript
// Verify component exists
const allComponents = componentIndex.byCategory;
console.log('Available categories:', Object.keys(allComponents));

// Search with different queries
const results1 = discovery.searchComponents('input');
const results2 = discovery.searchComponents('form');
```

### Issue: Validation Fails

**Problem:** Generated code fails validation

**Solution:** Check errors and retry with more specific prompt

```typescript
const validation = validateGeneratedCode(code);
if (!validation.valid) {
  console.error('Errors:', validation.errors);

  // Retry with more specific prompt
  const betterPrompt = buildContextualPrompt(userRequest, {
    components: ['Form', 'Input', 'Button'], // Be specific
  });
}
```

---

## Quick Reference

### Prompt Builders

| Function                                  | Use Case                         | Returns          |
| ----------------------------------------- | -------------------------------- | ---------------- |
| `buildClaudeSystemPrompt(request)`        | Standard prompts for Claude      | `string`         |
| `buildContextualPrompt(request, context)` | Prompts with specific components | `string`         |
| `buildGPT4Prompt(request)`                | Prompts for OpenAI GPT-4         | `Array<Message>` |
| `buildGeminiPrompt(request)`              | Prompts for Google Gemini        | `GeminiRequest`  |

### Discovery Functions

| Function                               | Use Case               | Returns                        |
| -------------------------------------- | ---------------------- | ------------------------------ |
| `discovery.getComponent(name)`         | Get component by name  | `ComponentSchema \| undefined` |
| `discovery.searchComponents(query)`    | Search components      | `ComponentSchema[]`            |
| `getComponentsByCategory(category)`    | Get by category        | `ComponentSchema[]`            |
| `getComponentsByFeature(feature)`      | Get by feature         | `ComponentSchema[]`            |
| `getComponentsByUseCase(useCase)`      | Get by use case        | `ComponentSchema[]`            |
| `discovery.getRelatedComponents(name)` | Get related components | `ComponentSchema[]`            |
| `findPatterns(components, useCase?)`   | Find patterns          | `Pattern[]`                    |

### Validation Functions

| Function                      | Use Case                  | Returns                |
| ----------------------------- | ------------------------- | ---------------------- |
| `validateSchema(schema)`      | Validate component schema | `ValidationResult`     |
| `validateAllSchemas()`        | Validate all schemas      | `{ results, summary }` |
| `validateGeneratedCode(code)` | Validate generated code   | `ValidationResult`     |

---

## Additional Resources

- [AI README](./README.md) - Detailed AI integration docs
- [llms.txt](./../../llms.txt) - LLM-friendly documentation

---

## Summary

This manual covers:

1. ✅ Basic prompt usage with `buildClaudeSystemPrompt`
2. ✅ Contextual prompts for better accuracy
3. ✅ Agent-specific formats (Claude, GPT-4, Gemini)
4. ✅ Discovery utilities for finding components
5. ✅ Validation for schemas and generated code
6. ✅ Best practices and examples
7. ✅ Troubleshooting common issues

By following this manual, you'll be able to effectively use the GridKit Design System's AI integration to generate reliable, consistent React components.
