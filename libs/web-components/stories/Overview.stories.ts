import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta = {
  title: 'Introduction/Overview',
  parameters: { controls: { disable: true } },
  render: () => {
    const page = document.createElement('main');
    page.style.cssText =
      'max-width: 900px; padding: 24px; font-family: "Fira Sans", sans-serif; line-height: 1.6; color: #262626';
    page.innerHTML = `
      <style>
        .overview h1 { font-size: 32px; line-height: 1.2; font-weight: 600; margin: 0 0 16px; }
        .overview h2 { font-size: 22px; line-height: 1.3; font-weight: 600; margin: 32px 0 12px; }
        .overview h3 { font-size: 17px; line-height: 1.4; font-weight: 600; margin: 24px 0 8px; }
        .overview p { margin: 0 0 12px; }
        .overview ul { margin: 8px 0 16px; padding-left: 24px; }
        .overview code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.9em; }
        .overview :not(pre) > code { padding: 2px 5px; border-radius: 4px; background: #f1f3f5; }
        .overview pre { overflow-x: auto; margin: 12px 0 20px; padding: 16px; border-radius: 8px; background: #171717; color: #f5f5f5; line-height: 1.45; }
        .overview .callout { margin: 20px 0; padding: 14px 16px; border-left: 4px solid #0069b4; background: #f2f8fc; }
      </style>

      <article class="overview">
        <h1>Using Web Components</h1>
        <p>
          GridKit Web Components are framework-independent custom HTML elements built with Lit. They provide
          GridKit design tokens, variants, states, and interaction patterns through standard browser APIs. Use
          them in plain HTML or inside any web framework without a framework-specific GridKit adapter.
        </p>
        <p>
          Component names start with <code>gd-</code>, for example <code>&lt;gd-button&gt;</code>,
          <code>&lt;gd-input&gt;</code>, and <code>&lt;gd-select&gt;</code>. Browse the <strong>Atoms</strong> and
          <strong>Molecules</strong> sections to inspect each component's properties, variants, events, slots,
          accessibility behavior, and token defaults.
        </p>

        <h2>Install and register</h2>
        <p>Install the component package and the GridKit design tokens in your application:</p>
        <pre><code>npm install web-components gd-design-library</code></pre>
        <p>
          Import the package once in your application entry point. The import registers every
          <code>gd-*</code> custom element with the browser.
        </p>
        <pre><code>import 'web-components';
import { defaultTheme } from 'gd-design-library/tokens';</code></pre>

        <h2>How values and events work</h2>
        <ul>
          <li>Pass text, numbers, and booleans through HTML attributes or framework bindings.</li>
          <li>Assign objects, arrays, functions, controlled values, and the theme as JavaScript properties.</li>
          <li>Listen for native events such as <code>gd-input</code> and <code>gd-change</code>.</li>
          <li>Read component data from <code>event.detail</code>.</li>
          <li>Use default and named slots for labels, icons, custom initiators, and other composed content.</li>
        </ul>
        <div class="callout">
          The theme is an object, so it must be assigned as a property. Writing
          <code>theme="defaultTheme"</code> in HTML passes only a string and does not apply the theme.
        </div>

        <h3>Plain JavaScript example</h3>
        <pre><code>const input = document.querySelector('gd-input');

input.theme = defaultTheme;
input.value = 'hello@example.com';
input.addEventListener('gd-input', (event) =&gt; {
  console.log(event.detail.value);
});</code></pre>

        <h2>Angular</h2>
        <p>
          Import the package in <code>main.ts</code>, enable custom elements with
          <code>CUSTOM_ELEMENTS_SCHEMA</code>, and use Angular property and event bindings. Property bindings are
          required for themes, arrays, objects, and controlled values.
        </p>
        <pre><code>// main.ts
import 'web-components';

// app.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { defaultTheme } from 'gd-design-library/tokens';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
    &lt;gd-input
      [theme]="theme"
      label="Email"
      [value]="email"
      (gd-input)="email = $any($event).detail.value"
    &gt;&lt;/gd-input&gt;

    &lt;gd-checkbox
      [theme]="theme"
      [checked]="accepted"
      (gd-change)="accepted = $any($event).detail.checked"
    &gt;
      Accept terms
    &lt;/gd-checkbox&gt;

    &lt;gd-button [theme]="theme" variant="primary" (click)="save()"&gt;
      Save
    &lt;/gd-button&gt;
  \`,
})
export class AppComponent {
  readonly theme = defaultTheme;
  email = '';
  accepted = false;

  save() {}
}</code></pre>

        <h2>Vue</h2>
        <p>
          Import the package in the application entry point. In Vue templates, use <code>.prop</code> when a
          value must be assigned to the custom element as a JavaScript property, and use Vue's normal
          <code>@event</code> syntax for native custom events.
        </p>
        <pre><code>// main.ts
import { createApp } from 'vue';
import 'web-components';
import App from './App.vue';

createApp(App).mount('#app');</code></pre>
        <pre><code>&lt;script setup lang="ts"&gt;
import { ref } from 'vue';
import { defaultTheme } from 'gd-design-library/tokens';

const email = ref('');
const accepted = ref(false);
&lt;/script&gt;

&lt;template&gt;
  &lt;gd-input
    :theme.prop="defaultTheme"
    label="Email"
    :value.prop="email"
    @gd-input="email = $event.detail.value"
  /&gt;

  &lt;gd-checkbox
    :theme.prop="defaultTheme"
    :checked.prop="accepted"
    @gd-change="accepted = $event.detail.checked"
  &gt;
    Accept terms
  &lt;/gd-checkbox&gt;

  &lt;gd-button :theme.prop="defaultTheme" variant="primary"&gt;
    Save
  &lt;/gd-button&gt;
&lt;/template&gt;</code></pre>

        <h2>Explore component APIs</h2>
        <p>
          Open a component story and use <strong>Controls</strong> to change its public properties. Interactive
          stories display emitted event details next to the component. Each documentation page also includes
          accessibility examples and the default design tokens used by that component.
        </p>
      </article>
    `;
    return page;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {};
