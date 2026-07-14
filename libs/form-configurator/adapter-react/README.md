# Form Configurator - React Adapter

React adapter for [gd-form-configurator](https://www.npmjs.com/package/gd-form-configurator) - a schema-driven form builder with built-in validation and state management.

## Installation

```bash
npm install gd-form-configurator-react
```

This package includes the core library as a dependency, so you don't need to install `gd-form-configurator` separately.

---

## Quick Start

```jsx
import { FormBuilder } from 'gd-form-configurator-react';
import 'gd-form-configurator/styles';

function MyForm() {
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string', title: 'Name' },
      email: { type: 'string', format: 'email', title: 'Email' },
      age: { type: 'number', minimum: 18, title: 'Age' },
    },
    required: ['name', 'email'],
  };

  const uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/name' },
      { type: 'Control', scope: '#/properties/email' },
      { type: 'Control', scope: '#/properties/age' },
    ],
  };

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
  };

  const handleChange = (data) => {
    console.log('Form data changed:', data);
  };

  return (
    <FormBuilder schema={schema} uischema={uischema} initialData={{}} onSubmit={handleSubmit} onChange={handleChange} />
  );
}
```

---

## Features

- **Pre-built React Components**: All standard HTML5 input types supported
- **Grid Dynamics UI Integration**: Seamless integration with Grid Kit components
- **Automatic Control Selection**: Intelligent control selection based on schema format
- **Custom Controls**: Easy to add your own custom React components
- **Type Safe**: Full TypeScript support
- **Hooks API**: Access form state with React hooks

---

## Built-in Controls

The React adapter includes ready-to-use controls for:

- Text, Email, Password, URL, Tel
- Number, Range
- Date, Time
- Select, Switch, Checkbox, Radio
- Textarea, Color, File, Search
- Arrays (with add/remove/reorder)

Controls are automatically selected based on your schema's `type` and `format` properties.

---

## Custom Controls

Add your own custom React components:

```jsx
import { FormBuilder } from 'gd-form-configurator-react';

const RatingControl = ({ value, onChange, label, errors }) => (
  <div>
    <label>{label}</label>
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onChange(star)} style={{ color: value >= star ? 'gold' : 'gray' }}>
          ★
        </button>
      ))}
    </div>
    {errors.length > 0 && <span>{errors[0].message}</span>}
  </div>
);

const customControls = [
  {
    name: 'rating',
    renderer: RatingControl,
  },
];

function MyForm() {
  const uischema = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/rating',
        options: { custom: 'rating' }, // Activate custom control
      },
    ],
  };

  return <FormBuilder schema={schema} uischema={uischema} initialData={{}} customControls={customControls} />;
}
```

---

## Hooks API

Access form state directly in your components:

```jsx
import { FormBuilder, useFormEngine, useFormStore } from 'gd-form-configurator-react';

function FormActions() {
  const engine = useFormEngine();
  const { data, errors } = useFormStore((state) => ({
    data: state.data,
    errors: state.errors,
  }));

  const handleValidate = () => {
    const validationErrors = engine.validate();
    if (validationErrors.length === 0) {
      console.log('Form is valid!');
    }
  };

  const handleReset = () => {
    engine.resetToEmpty();
  };

  return (
    <div>
      <button onClick={handleValidate}>Validate</button>
      <button onClick={handleReset}>Reset</button>
      <div>Errors: {errors.length}</div>
    </div>
  );
}

function App() {
  return (
    <FormBuilder schema={schema} uischema={uischema} initialData={{}}>
      <FormActions />
    </FormBuilder>
  );
}
```

---

## Logging

The React adapter supports logging through the `logger` prop.

### Using a Custom Logger

```jsx
import { FormBuilder, ILogger } from 'gd-form-configurator-react';

const myLogger: ILogger = {
  debug: (msg, ...meta) => console.debug(msg, ...meta),
  info: (msg, ...meta) => console.info(msg, ...meta),
  warn: (msg, ...meta) => console.warn(msg, ...meta),
  error: (msg, ...meta) => console.error(msg, ...meta),
};

function MyForm() {
  return <FormBuilder schema={schema} uischema={uischema} initialData={{}} logger={myLogger} onSubmit={handleSubmit} />;
}
```

### What Gets Logged

- **Error**: Form initialization failures, renderer not found, array operation errors
- **Warn**: Validation warnings, UISchema issues
- **Info**: Form initialization, validation completion, schema updates
- **Debug**: Field updates, re-renders, rule evaluations

### Silent Mode (Default)

If no logger is provided, the form operates silently without logging:

```jsx
// No logger - silent operation (default)
<FormBuilder schema={schema} uischema={uischema} initialData={{}} />
```

---

## FormBuilder Props

```typescript
interface FormBuilderProps {
  schema: DataSchema; // JSON Schema definition
  uischema: UISchema; // UI Schema for layout
  initialData: any; // Initial form data
  customControls?: CustomControl[]; // Custom React components
  onChange?: (data: any) => void; // Called on data change
  onSubmit?: (data: any) => void; // Called on valid form submit
  children?: React.ReactNode; // Additional content
  logger?: ILogger; // Optional logger instance
}
```

---

## Peer Dependencies

This package requires:

- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0

---

## Core Library Documentation

For complete documentation on schemas, validation, conditional logic, and advanced features, see the [core library documentation](https://www.npmjs.com/package/gd-form-configurator).

---

## License

MIT License - see LICENSE file for details

---

## Links

- **Core Library**: [gd-form-configurator](https://www.npmjs.com/package/gd-form-configurator)
- **GitHub**: [https://github.com/griddynamics/rnd-composable-commerce](https://github.com/griddynamics/rnd-composable-commerce)
- **Grid Dynamics**: [https://www.griddynamics.com/](https://www.griddynamics.com/)
