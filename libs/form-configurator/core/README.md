# Form Configurator

A powerful, framework-agnostic, schema-driven form management library built by [Grid Dynamics](https://www.griddynamics.com/). Form Configurator enables developers to dynamically generate and manage complex forms from JSON schemas, with built-in state management, validation, and conditional logic.

## Overview

Form Configurator solves the challenge of building complex, dynamic forms by leveraging JSON Schema for structure and validation, combined with a flexible UI schema for layout and presentation. The library core is completely framework-agnostic, with adapters available for popular frameworks.

### Key Principles

**Schema-Driven Architecture**: Define your entire form structure, validation rules, and behavior using standardized JSON Schema. No need to write repetitive validation code or manual state management.

**Framework Agnostic Core**: The core library is independent of any UI framework. It manages form state, validation, and business logic, while framework-specific adapters handle rendering.

**Renderer Pattern**: Uses a tester-renderer pattern where testers determine which renderer should handle a given schema element. This makes the system highly extensible and customizable.

**Dynamic Behavior**: Support for conditional visibility, enablement, and even dynamic schema updates based on form data. Forms can adapt their structure and validation rules as users interact with them.

**Efficient State Management**: Built on Zustand for lightweight, performant state management with granular subscriptions and updates.

---

## Features

- **Declarative Forms**: Define forms using JSON Schema and UI Schema
- **Automatic Validation**: Powered by AJV with support for custom formats and error messages
- **Conditional Logic**: Show/hide and enable/disable fields based on other field values
- **Dynamic Schema Updates**: Modify validation rules and field options based on form state
- **Array Support**: Built-in support for dynamic arrays with add/remove capabilities
- **Custom Renderers**: Extend with custom field types and layouts
- **Type Safe**: Full TypeScript support with comprehensive type definitions
- **Lightweight**: Minimal dependencies (AJV, Zustand, core-js)

---

## Installation

```bash
npm install gd-form-configurator
```

For React applications, we also provide a ready-to-use React adapter:

```bash
npm install gd-form-configurator-react
```

---

## Quick Start

### Basic Example

```javascript
import { FormEngine } from 'gd-form-configurator';
import 'gd-form-configurator/styles';

// 1. Define your data schema
const schema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      minLength: 2,
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      minLength: 2,
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
    },
  },
  required: ['firstName', 'lastName', 'email'],
};

// 2. Define your UI schema (layout)
const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/firstName' },
    { type: 'Control', scope: '#/properties/lastName' },
    { type: 'Control', scope: '#/properties/email' },
  ],
};

// 3. Initialize the form engine
const initialData = {
  firstName: '',
  lastName: '',
  email: '',
};

const formEngine = new FormEngine(schema, uischema, initialData);

// 4. Mount to a DOM element
formEngine.mount('form-container');

// 5. Subscribe to data changes
formEngine.subscribe((state) => {
  console.log('Form data:', state.data);
  console.log('Validation errors:', state.errors);
});

// 6. Validate and get data
const errors = formEngine.validate();
if (errors.length === 0) {
  const formData = formEngine.getData();
  console.log('Valid form data:', formData);
}
```

### Conditional Logic Example

```javascript
const schema = {
  type: 'object',
  properties: {
    hasVehicle: {
      type: 'boolean',
      title: 'Do you own a vehicle?',
    },
    vehicleType: {
      type: 'string',
      enum: ['car', 'motorcycle', 'truck'],
      title: 'Vehicle Type',
    },
  },
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/hasVehicle',
    },
    {
      type: 'Control',
      scope: '#/properties/vehicleType',
      // Show this field only when hasVehicle is true
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/hasVehicle',
          schema: { const: true },
        },
      },
    },
  ],
};

const formEngine = new FormEngine(schema, uischema, { hasVehicle: false });
formEngine.mount('form-container');
```

### Dynamic Schema Updates

```javascript
const schema = {
  type: 'object',
  properties: {
    country: {
      type: 'string',
      enum: ['USA', 'Canada', 'Mexico'],
      title: 'Country',
    },
    state: {
      type: 'string',
      title: 'State/Province',
    },
  },
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/country' },
    {
      type: 'Control',
      scope: '#/properties/state',
      // Update state options based on selected country
      rule: {
        effect: 'UPDATE_SCHEMA',
        condition: {
          scope: '#/properties/country',
          schema: { const: 'USA' },
        },
        schema: {
          enum: ['California', 'Texas', 'New York', 'Florida'],
        },
      },
    },
  ],
};

const formEngine = new FormEngine(schema, uischema, {});
formEngine.mount('form-container');
```

---

## Logging

Form Configurator includes an optional logging system that helps you monitor form behavior, debug issues, and integrate with your existing logging infrastructure.

### Basic Usage

```javascript
import { FormEngine, ConsoleLogger } from 'gd-form-configurator';

// Create a logger (or use your own)
const logger = new ConsoleLogger('[MyApp]');

// Pass logger as the last parameter to FormEngine
const formEngine = new FormEngine(
  schema,
  uischema,
  initialData,
  rendererRegistry,
  undefined, // reRender callback (for vanilla JS, pass undefined)
  logger
);
```

### Custom Logger

You can use any logger that implements the `ILogger` interface:

```javascript
import { ILogger } from 'gd-form-configurator';

const myLogger: ILogger = {
  debug: (message, ...meta) => console.debug(message, ...meta),
  info: (message, ...meta) => console.info(message, ...meta),
  warn: (message, ...meta) => console.warn(message, ...meta),
  error: (message, ...meta) => console.error(message, ...meta),
};

const formEngine = new FormEngine(schema, uischema, initialData, undefined, undefined, myLogger);
```

### Integration with Popular Loggers

**Winston:**

```javascript
import winston from 'winston';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

const formEngine = new FormEngine(schema, uischema, initialData, undefined, undefined, winstonLogger);
```

**Pino:**

```javascript
import pino from 'pino';

const pinoLogger = pino({ level: 'info' });
const formEngine = new FormEngine(schema, uischema, initialData, undefined, undefined, pinoLogger);
```

### What Gets Logged

- **Error Level**: Mount failures, renderer not found, array operation failures
- **Warn Level**: Validation errors, UISchema warnings, invalid operations
- **Info Level**: Initialization complete, validation results, schema updates, array operations
- **Debug Level**: Field updates, re-renders, rule evaluations, renderer selection

### Silent Mode (Default)

If no logger is provided, Form Configurator uses a no-op logger that silently discards all log calls:

```javascript
// No logger - silent operation
const formEngine = new FormEngine(schema, uischema, initialData);
```

---

## Core Concepts

### JSON Schema

The data schema defines the structure, types, and validation rules for your form data. Form Configurator uses standard JSON Schema (Draft 7) with AJV for validation.

**Supported Types**: `string`, `number`, `integer`, `boolean`, `array`, `object`

**Validation Keywords**: `required`, `minLength`, `maxLength`, `minimum`, `maximum`, `pattern`, `enum`, `format`, and more

**Custom Formats**: `email`, `uri`, `date`, `time`, `tel`, `color`, `file`, `search`, `password`

### UI Schema

The UI schema defines how the form is rendered - the layout, field ordering, labels, and conditional behavior.

**Layout Types**:

- `VerticalLayout` - Stack fields vertically
- `HorizontalLayout` - Arrange fields horizontally
- `Group` - Fieldset grouping with optional legend
- `Categorization` - Tab-based categorization

**Rules**: Control dynamic behavior with four effect types:

- `SHOW` / `HIDE` - Conditional visibility
- `ENABLE` / `DISABLE` - Conditional field enablement
- `UPDATE_SCHEMA` - Dynamic schema modifications

### Form Engine

The `FormEngine` class is the main entry point. It orchestrates validation, state management, and rendering.

**Key Methods**:

```javascript
// Initialize and mount
formEngine.mount(elementId: string): void

// Data operations
formEngine.getData(): any
formEngine.updateField(path: string, updater: Function): void

// Schema updates
formEngine.updateSchema(newSchema: DataSchema): void
formEngine.updateUiSchema(newUiSchema: UISchema): void

// Validation
formEngine.validate(): ErrorObject[]

// Array operations
formEngine.addArrayItem(path: string, item?: any): void
formEngine.removeArrayItem(path: string, index: number): void
formEngine.moveArrayItem(path: string, fromIndex: number, toIndex: number): void

// Reset operations
formEngine.resetToEmpty(): void
formEngine.resetToInitial(): void
formEngine.resetToData(customData: any): void

// State subscription
formEngine.subscribe(listener: Function): () => void

// Cleanup
formEngine.destroy(): void
```

### State Management

Form Configurator uses Zustand for state management. You can access the store directly:

```javascript
import { useFormStore } from 'gd-form-configurator';

const formEngine = new FormEngine(schema, uischema, initialData);

// Access state
const state = formEngine.useStore.getState();
console.log(state.data);
console.log(state.errors);
console.log(state.schema);

// Subscribe to changes
const unsubscribe = formEngine.useStore.subscribe((state) => {
  console.log('State updated:', state);
});
```

### Custom Renderers

Extend Form Configurator with custom renderers for specialized controls:

```javascript
import { vanillaRenderers } from 'gd-form-configurator';

// Define a custom tester
const customTester = (uischema, schema) => {
  return uischema.options?.custom === 'rating' ? 5 : -1;
};

// Define a custom renderer
const customRenderer = ({ schema, data, path, updateField }) => {
  const container = document.createElement('div');
  // ... render your custom control
  return container;
};

// Register custom renderer
const customRegistry = [{ tester: customTester, renderer: customRenderer }, ...vanillaRenderers];

const formEngine = new FormEngine(schema, uischema, initialData, customRegistry);
```

---

## React Integration

For React applications, we provide a ready-to-use adapter with pre-built components:

```bash
npm install gd-form-configurator-react
```

```jsx
import { FormBuilder } from 'gd-form-configurator-react';
import 'gd-form-configurator/styles';

function MyForm() {
  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <FormBuilder
      schema={schema}
      uischema={uischema}
      initialData={{}}
      onSubmit={handleSubmit}
      onChange={(data) => console.log('Data changed:', data)}
    />
  );
}
```

The React adapter includes pre-built controls for all common input types and integrates seamlessly with Grid Dynamics UI components.

---

## API Reference

### FormEngine Constructor

```typescript
new FormEngine(
  schema: DataSchema,
  uischema: UISchema,
  data: unknown,
  rendererRegistry?: RendererRegistryEntry[],
  reRender?: () => void
)
```

### DataSchema Interface

```typescript
interface DataSchema {
  type: string | string[];
  properties?: { [property: string]: DataSchema };
  required?: string[];
  additionalProperties?: boolean;
  title?: string;
  description?: string;
  enum?: any[];
  format?: string;
  minimum?: number;
  maximum?: number;
  maxLength?: number;
  minLength?: number;
  items?: DataSchema | DataSchema[];
}
```

### UISchema Interface

```typescript
type UISchema = ControlElement | VerticalLayout | HorizontalLayout | GroupLayout | CategorizationLayout;

interface ControlElement {
  type: 'Control';
  scope: string;
  label?: string;
  rule?: Rule;
  options?: { [key: string]: any };
}

interface Rule {
  effect: 'SHOW' | 'HIDE' | 'ENABLE' | 'DISABLE' | 'UPDATE_SCHEMA';
  condition: {
    scope: string;
    schema: DataSchema;
  };
  schema?: Partial<DataSchema>; // For UPDATE_SCHEMA effect
}
```

---

## Testing

Run the test suite:

```bash
nx test form-configurator-core
```

---

## Building

Build the library for production:

```bash
nx build form-configurator-core
```

The output will be in `dist/libs/form-configurator/`.

---

## Browser Support

Form Configurator supports all modern browsers:

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

For older browsers, you may need to include polyfills for `structuredClone`.

---

## Contributing

This repository is maintained by Grid Dynamics R&D. Contributions are welcome! Please follow the project's contribution guidelines.

---

## License

MIT License - see LICENSE file for details

---

## Links

- **GitHub**: [https://github.com/griddynamics/rnd-composable-commerce](https://github.com/griddynamics/rnd-composable-commerce)
- **Grid Dynamics**: [https://www.griddynamics.com/](https://www.griddynamics.com/)
- **NPM Package**: `gd-form-configurator`
- **React Adapter**: `gd-form-configurator-react`

---

## Support

For issues, questions, or contributions, please visit our GitHub repository or contact the Grid Dynamics R&D team.
