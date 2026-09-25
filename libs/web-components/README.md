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

```bash
npm install
npm run dev:web-components
```

Open the Angular or Vue examples directly:

```bash
npm run dev:web-components:angular
npm run dev:web-components:vue
```

Build the library with:

```bash
npm run build:web-components
```
