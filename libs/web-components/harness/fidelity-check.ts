// Angular is the default cross-framework visual-fidelity harness. It uses the
// custom elements directly: no framework adapter is involved.
import '@angular/compiler';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// Harness-only built stylesheet: it supplies the real font and reset used by the
// React Storybook baseline. Build it first with `npm run build:ui`.
// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../dist/libs/ui/styles.css';
import { defaultTheme } from 'gd-design-library/tokens';
import '../src/index';

type Item = { name: string; value: string };

const componentMetadata = {
  selector: 'gd-angular-fidelity-harness',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      :host { display: block; padding: 24px; }
      section { margin-bottom: 32px; }
      h3 { font-family: sans-serif; }
      .row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    `,
  ],
  template: `
    <section>
      <h3>Input — controlled value</h3>
      <div class="row">
        <gd-input id="input-repro" label="Label" helper-text="Helper text" color="primary"
          [theme]="theme" [value]="inputValue" (gd-input)="onInput($event)"></gd-input>
      </div>
    </section>

    <section><h3>Button — primary / secondary / outlined / disabled / loading</h3><div class="row">
      <gd-button variant="primary" [theme]="theme">Primary</gd-button>
      <gd-button variant="secondary" [theme]="theme">Secondary</gd-button>
      <gd-button variant="outlined" [theme]="theme">Outlined</gd-button>
      <gd-button variant="primary" [theme]="theme" disabled>Disabled</gd-button>
      <gd-button variant="primary" [theme]="theme" [isLoading]="true">Loading</gd-button>
    </div></section>

    <section><h3>Checkbox — default / checked / indeterminate / disabled</h3><div class="row">
      <gd-checkbox id="cb-default" [theme]="theme"></gd-checkbox>
      <gd-checkbox id="cb-checked" [theme]="theme" [checked]="checked" (gd-change)="onChecked($event)">Checked</gd-checkbox>
      <gd-checkbox id="cb-indeterminate" [theme]="theme" indeterminate>Indeterminate</gd-checkbox>
      <gd-checkbox id="cb-disabled" [theme]="theme" disabled checked>Disabled</gd-checkbox>
    </div></section>

    <section><h3>Typography — h1 / h2 / p</h3><div class="row">
      <div><gd-typography variant="h1" as="h1" [theme]="theme">Heading 1</gd-typography>
      <gd-typography variant="h2" as="h2" [theme]="theme">Heading 2</gd-typography>
      <gd-typography variant="p" as="p" [theme]="theme">Body paragraph text for comparison.</gd-typography></div>
    </div></section>

    <section><h3>Select — trigger + dropdown</h3><div class="row">
      <gd-select id="select-repro" [items]="items" [value]="selectedItem" [theme]="theme" (gd-change)="onSelect($event)"></gd-select>
    </div></section>

    <section><h3>Avatar — image / fallback / badge / sizes</h3><div class="row">
      <gd-avatar [src]="portrait" alt="Ada Lovelace" size="md" [theme]="theme"></gd-avatar>
      <gd-avatar fallback="AL" alt="Ada Lovelace" size="lg" [theme]="theme"></gd-avatar>
      <gd-avatar fallback="GD" alt="GridKit" size="xl" with-badge badge-color="bg.fill.success.primary.default" background-color="bg.fill.info.primary.default" [theme]="theme"></gd-avatar>
      <gd-avatar alt="Custom fallback" size="sm" [theme]="theme"><span slot="fallback">★</span></gd-avatar>
    </div></section>

    <section><h3>Menu — popover, selection, and light dismiss</h3><div class="row">
      <gd-menu [theme]="theme" (gd-change)="onMenu($event)">
        <span slot="trigger">Actions ▾</span><div slot="content">
          <button data-gd-menu-name="Edit" data-gd-menu-value="edit">Edit</button>
          <button data-gd-menu-name="Archive" data-gd-menu-value="archive">Archive</button>
        </div>
      </gd-menu><output>Selected: {{ menuValue }}</output>
    </div></section>

    <section><h3>Counter — quantity control</h3><div class="row">
      <gd-counter min="1" max="5" initial="1" [theme]="theme" (gd-change)="onCounter($event)"></gd-counter>
      <output>Value: {{ counterValue }}</output>
    </div></section>
  `,
};

class FidelityHarnessComponent {
  readonly theme = defaultTheme;
  readonly items: Item[] = [
    { name: 'Alpha', value: 'a' },
    { name: 'Beta', value: 'b' },
    { name: 'Gamma', value: 'c' },
  ];
  readonly portrait =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';
  inputValue = 'Default Input';
  checked = true;
  selectedItem: Item | null = null;
  menuValue = 'None';
  counterValue = 1;

  onInput(event: Event) {
    this.inputValue = (event as CustomEvent<{ value: string }>).detail.value;
  }
  onChecked(event: Event) {
    this.checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
  }
  onSelect(event: Event) {
    this.selectedItem = (event as CustomEvent<{ value: Item | null }>).detail.value;
  }
  onMenu(event: Event) {
    const { data } = (event as CustomEvent<{ data: Item }>).detail;
    this.menuValue = `${data.name} (${data.value})`;
  }
  onCounter(event: Event) {
    this.counterValue = (event as CustomEvent<{ value: number }>).detail.value;
  }
}

// Calling the decorator explicitly keeps this standalone JIT harness compatible
// with Vite's plain TypeScript transform; no Angular CLI compiler is needed.
Component(componentMetadata)(FidelityHarnessComponent);

bootstrapApplication(FidelityHarnessComponent).catch((error: unknown) => console.error(error));
