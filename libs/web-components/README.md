# GridKit Web Components

GridKit Web Components provides design-system elements that work in any web application. They are native custom elements built with Lit, so they can be used in plain HTML, Angular, Vue, React, or another framework.

Available elements: `gd-button`, `gd-checkbox`, `gd-input`, `gd-select`, `gd-typography`, `gd-avatar`, `gd-menu`, and `gd-counter`.

## Install

```bash
npm install web-components gd-design-library
```

Import the library once to register its custom elements. Each element needs a GridKit theme; assign it as a JavaScript property, not as an HTML attribute.

```ts
import 'web-components';
import { defaultTheme } from 'gd-design-library/tokens';

document.querySelectorAll<HTMLElement & { theme: unknown }>('gd-button, gd-checkbox, gd-input').forEach((element) => {
  element.theme = defaultTheme;
});
```

## Use in HTML

```html
<gd-button variant="primary">Save</gd-button>
<gd-checkbox>Accept terms</gd-checkbox>
<gd-input label="Email" placeholder="name@example.com"></gd-input>
<gd-typography variant="h1" as="h1">Welcome</gd-typography>
```

Use attributes for strings and booleans, such as `variant`, `label`, and `disabled`. Pass objects, arrays, and controlled values as JavaScript properties. Components emit native custom events: `gd-input` returns `{ value }`, while `gd-change` returns the selected value or checkbox state.

## Angular

Register the elements once (for example, in `main.ts`), then allow custom elements in the consuming component or module.

```ts
// main.ts
import 'web-components';

// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { defaultTheme } from 'gd-design-library/tokens';

@Component({
  selector: 'app-root',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <gd-input [theme]="theme" label="Email" [value]="email" (gd-input)="email = $event.detail.value"></gd-input>
    <gd-checkbox [theme]="theme" [checked]="accepted" (gd-change)="accepted = $event.detail.checked">
      Accept terms
    </gd-checkbox>
    <gd-button [theme]="theme" variant="primary" (click)="save()">Save</gd-button>
  `,
})
export class AppComponent {
  theme = defaultTheme;
  email = '';
  accepted = false;
  save() {}
}
```

Use Angular property bindings (`[theme]`, `[items]`, `[value]`) for non-string values and event bindings (`(gd-input)`, `(gd-change)`) for component events.

## Vue

Register the elements once in your app entry file. In templates, use `.prop` for object values and component state.

```ts
// main.ts
import { createApp } from 'vue';
import 'web-components';
import App from './App.vue';

createApp(App).mount('#app');
```

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { defaultTheme } from 'gd-design-library/tokens';

const email = ref('');
const accepted = ref(false);
</script>

<template>
  <gd-input :theme.prop="defaultTheme" label="Email" :value.prop="email" @gd-input="email = $event.detail.value" />
  <gd-checkbox :theme.prop="defaultTheme" :checked.prop="accepted" @gd-change="accepted = $event.detail.checked">
    Accept terms
  </gd-checkbox>
  <gd-button :theme.prop="defaultTheme" variant="primary">Save</gd-button>
</template>
```

## Run locally

The shared Storybook is started from the repository root with `npm run storybook` and
opened at `http://localhost:6006`. Its **Web Components** section contains native stories, Controls, and docs for all eight
existing elements. Interactive stories show native event payloads below the component.

| Storybook component                                                                                                      | React-contract coverage                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| [Avatar](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-avatar--docs)         | Image, fallback, badge, every size, custom colors                                               |
| [Button](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-button--docs)         | Every variant and radius, full-width, icon-only, loading, disabled, icon slots                  |
| [Checkbox](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-checkbox--docs)     | Checked, indeterminate, disabled, both sizes; `gd-change` → `{ checked }`                       |
| [Input](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-input--docs)           | Types, validation colors, read-only/disabled, adornments; `gd-input`/`gd-change`                |
| [Select](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-select--docs)         | Single/multiple, search, auto-open, colors, adornments, custom initiator; `gd-change`           |
| [Typography](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-typography--docs) | All 18 variants, display sizes, style variants, alignment/color controls, semantic override     |
| [Counter](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_molecules-counter--docs)   | Minimum/maximum, custom range, disabled; `gd-change` → `{ value: number }`                      |
| [Menu](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_molecules-menu--docs)         | Placement, offsets, height constraints, close/persist behavior; `gd-change` → `{ data, value }` |

### React-to-custom-element contract

The ports preserve each source component's component-specific public contract using native
custom-element equivalents. Primitive props remain attributes/properties; objects, arrays,
functions, themes, and style objects are JavaScript properties. React callbacks become native
DOM/custom events, `ReactNode` props become default or named slots, and imperative refs become
public element methods. Generic React/Emotion box props are supplied with host CSS or the
component's `styles` property rather than reproduced as React-only prop names.

`react-parity.json` records the required mapping and Storybook examples for every shipped port.
`npm run check:web-components-ports` fails when an element, required mapping, or parity story is
missing. Unit tests cover the programmatic property/event contract; the Storybook smoke test also
checks multiple/searchable Select behavior and every Typography variant/display size in Chromium.

There is no separate Web Components Storybook command. Run `npm run build-storybook`
then `node bin/storybook/smoke-test.mjs` to verify every native story plus input, checkbox,
select, counter, and menu interactions in Chromium. The existing Angular/Vue harness
workflow below remains available until the later integration-check cleanup.

Start the development server for all Web Components examples:

```bash
npm install
npm run dev:web-components
```

Vite prints the local URL in the terminal (usually `http://localhost:5173`). The command does not select a framework or open a page by default. Choose the example you want in the browser:

- Angular: `http://localhost:5173/harness/fidelity-check.html`
- Vue: `http://localhost:5173/harness/fidelity-check-vue.html`

Build the library with:

```bash
npm run build:web-components
```
