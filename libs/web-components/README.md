# GridKit Web Components

GridKit Web Components provides design-system elements that work in any web application. They are native custom elements built with Lit, so they can be used in plain HTML, Angular, Vue, React, or another framework.

Available elements: `gd-avatar`, `gd-badge`, `gd-box`, `gd-button`, `gd-checkbox`, `gd-icon`, `gd-image`, `gd-input`, `gd-input-file`, `gd-label`, `gd-link`, `gd-loader`, `gd-select`, `gd-separator`, `gd-skeleton`, `gd-slider`, `gd-slider-dots`, `gd-switch`, `gd-textarea`, `gd-toggle`, `gd-truncate`, `gd-typography`, `gd-wrapper`, `gd-counter`, and `gd-menu`.

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
opened at `http://localhost:6006`. Its **Web Components** section contains native stories, Controls, and docs for all twenty-five
existing elements. Interactive stories show native event payloads below the component.

| Storybook component                                                                                                      | React-contract coverage                                                                          |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| [Avatar](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-avatar--docs)         | Image, fallback, badge, every size, custom colors                                                |
| [Badge](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-badge--docs)           | Variants, appearances, sizes, disabled state, and icon slots                                     |
| [Box](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-box--docs)               | Vertical/horizontal layout, borders, highlight, shadow hover, and slotted content                |
| [Button](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-button--docs)         | Every variant and radius, full-width, icon-only, loading, disabled, icon slots                   |
| [Checkbox](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-checkbox--docs)     | Checked, indeterminate, disabled, both sizes; `gd-change` → `{ checked }`                        |
| [Input](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-input--docs)           | Types, validation colors, read-only/disabled, adornments; `gd-input`/`gd-change`                 |
| [Image](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-image--docs)           | Loading placeholder, fallback slot, caption, sizing, object fit, and load/error events           |
| [Icon](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-icon--docs)             | All built-in icons from the shared core catalog, token sizes, and theme-aware fills              |
| [InputFile](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-inputfile--docs)   | Accept/capture/multiple/disabled behavior, custom label, icon label, and `gd-change` file detail |
| [Label](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-label--docs)           | Native label association, slotted content, icons, and style overrides                            |
| [Link component](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-link--docs)   | Variants, sizes, underline states, disabled semantics, targets, and href                         |
| [Loader](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-loader--docs)         | Circle/dots, sizes, rounded dots, wrappers, section, and native full-page top layer              |
| [Select](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-select--docs)         | Single/multiple, search, auto-open, colors, adornments, custom initiator; `gd-change`            |
| [Separator](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-separator--docs)   | Orientations, line variants, thickness, labels, semantic elements, lengths, and colors           |
| [Skeleton](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-skeleton--docs)     | Rounded/rectangular/circular shapes, dimensions, colors, animation control, and child content    |
| [Slider](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-slider--docs)         | Range limits, controlled values, keyboard input, disabled state, visual fill, and events         |
| [SliderDots](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-sliderdots--docs) | Accessible carousel tabs, active state, larger sets, and selection events                        |
| [Switch](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-switch--docs)         | Checked, disabled, loading, controlled/uncontrolled behavior, label placement, and events        |
| [Textarea](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-textarea--docs)     | Values, colors, resize modes, dynamic height, focus, character limits, and input/change events   |
| [Toggle](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-toggle--docs)         | String/object items, selected value, disabled state, custom item rendering, and change events    |
| [Truncate](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-truncate--docs)     | Single/multiple-line truncation, style overrides, overflow measurement, and accessibility        |
| [Typography](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-typography--docs) | All 18 variants, display sizes, style variants, alignment/color controls, semantic override      |
| [Wrapper](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_atoms-wrapper--docs)       | Inline, section and full-page layout variants, semantic tag override, content, and styles        |
| [Counter](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_molecules-counter--docs)   | Minimum/maximum, custom range, disabled; `gd-change` → `{ value: number }`                       |
| [Menu](https://storybook.cto-rnd-system-design.griddynamics.net/?path=/docs/web-components_molecules-menu--docs)         | Placement, offsets, height constraints, close/persist behavior; `gd-change` → `{ data, value }`  |

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
checks representative interactions, semantic output, and visual state for the interactive ports in Chromium.

There is no separate Web Components Storybook command. Run `npm run build-storybook`
then `node bin/storybook/smoke-test.mjs` to verify every native story and representative
interactions in Chromium. The Angular and Vue harnesses cover the complete supported catalog.

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
