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

    <section><h3>Box — vertical / horizontal / bordered / highlighted</h3><div class="row">
      <gd-box variant="vertical" [theme]="theme">Vertical box</gd-box>
      <gd-box variant="horizontal" is-bordered [theme]="theme">Bordered horizontal box</gd-box>
      <gd-box is-bordered is-highlighted with-shadow-hover [theme]="theme">Interactive box</gd-box>
    </div></section>

    <section><h3>Badge — variants / sizes / icons / disabled</h3><div class="row">
      <gd-badge variant="primary" appearance="filled" size="xs" [theme]="theme">Primary</gd-badge>
      <gd-badge variant="secondary" appearance="outline" size="md" [theme]="theme"><span slot="icon-start">★</span>With icon</gd-badge>
      <gd-badge variant="tertiary" appearance="filledLight" size="lg" disabled [theme]="theme">Disabled</gd-badge>
    </div></section>

    <section><h3>Image — image / caption / fallback</h3><div class="row">
      <gd-image [src]="portrait" alt="Ada Lovelace" width="96" height="96" caption="Portrait" [theme]="theme"></gd-image>
      <gd-image src="/missing-image.png" alt="Unavailable image" width="96" height="96" [theme]="theme"><span slot="fallback">Image unavailable</span></gd-image>
    </div></section>

    <section><h3>Icon — shared React/Web Components catalog</h3><div class="row">
      <gd-icon name="star" size="xs" [theme]="theme"></gd-icon>
      <gd-icon name="search" size="md" [theme]="theme"></gd-icon>
      <gd-icon name="edit" size="xl" aria-label="Edit" [theme]="theme"></gd-icon>
    </div></section>

    <section><h3>InputFile — default / multiple / accept / icon</h3><div class="row">
      <gd-input-file [theme]="theme">Browse Files</gd-input-file>
      <gd-input-file multiple accept="image/*" [theme]="theme">Choose images</gd-input-file>
      <gd-input-file is-icon aria-label="Upload file" [theme]="theme"><gd-icon name="upload"></gd-icon></gd-input-file>
      <gd-input-file disabled [theme]="theme">Disabled</gd-input-file>
    </div></section>

    <section><h3>Label — text / icon / association</h3><div class="row">
      <gd-label for="angular-labelled-input" [theme]="theme">Account name</gd-label>
      <input id="angular-labelled-input" />
      <gd-label [theme]="theme"><gd-icon name="star"></gd-icon> Required label</gd-label>
    </div></section>

    <section><h3>Link — variants / underline / size / disabled</h3><div class="row">
      <gd-link href="#angular-link" variant="primary" size="sm" [theme]="theme">Primary</gd-link>
      <gd-link href="#angular-link" variant="inherit" underline="highlight" size="md" [theme]="theme">Highlighted</gd-link>
      <gd-link variant="inverted" size="lg" disabled [theme]="theme">Disabled</gd-link>
    </div></section>

    <section><h3>Loader — circle / dots / sizes / wrapper variants</h3><div class="row">
      <gd-loader name="circle" size="xs" [theme]="theme"></gd-loader>
      <gd-loader name="dots" size="md" rounded="round" [theme]="theme"></gd-loader>
      <gd-loader name="circle" size="lg" variant="section" [theme]="theme"></gd-loader>
      <gd-loader name="circle" size="sm" [withWrapper]="false" [theme]="theme"></gd-loader>
    </div></section>

    <section><h3>Separator — horizontal / vertical / labels / variants</h3><div class="row">
      <gd-separator length="180px" [theme]="theme"></gd-separator>
      <gd-separator length="180px" label="OR" label-position="center" size="md" variant="dashed" [theme]="theme"></gd-separator>
      <gd-separator length="80px" orientation="vertical" label="Or" size="md" [theme]="theme"></gd-separator>
    </div></section>

    <section><h3>Skeleton — rounded / circular / rectangular / children</h3><div class="row">
      <gd-skeleton width="180px" height="15px" [theme]="theme"></gd-skeleton>
      <gd-skeleton width="60px" height="60px" variant="circular" [theme]="theme"></gd-skeleton>
      <gd-skeleton width="180px" height="50px" variant="rectangular" background-color="theme.palette.success.main" [theme]="theme">Loading Content...</gd-skeleton>
    </div></section>

    <section><h3>Slider / dots — range and carousel navigation</h3><div class="row">
      <gd-slider min="0" max="100" value="45" aria-label="Volume" [theme]="theme"></gd-slider>
      <gd-slider-dots count="5" active-index="1" [theme]="theme"></gd-slider-dots>
    </div></section>
    <section><h3>Switch — default / checked / loading</h3><div class="row">
      <gd-switch [theme]="theme">Notifications</gd-switch><gd-switch checked label="left" [theme]="theme">Enabled</gd-switch><gd-switch is-loading [theme]="theme">Saving</gd-switch>
    </div></section>
    <section><h3>Textarea — colors / counter / resize</h3><div class="row">
      <gd-textarea placeholder="Comment" [theme]="theme"></gd-textarea><gd-textarea color="success" max-characters="100" default-value="Looks good" [theme]="theme"></gd-textarea><gd-textarea resize="both" rows="3" [theme]="theme"></gd-textarea>
    </div></section>
    <section><h3>Toggle — selected / disabled</h3><div class="row">
      <gd-toggle [items]="toggleItems" value="Option 1" [theme]="theme"></gd-toggle>
      <gd-toggle [items]="toggleItems" value="Option 2" disabled [theme]="theme"></gd-toggle>
    </div></section>
    <section><h3>Truncate — single / multiple lines</h3><div class="row">
      <gd-truncate style="width: 180px" [theme]="theme">A long single-line value that must be truncated.</gd-truncate>
      <gd-truncate style="width: 180px" lines="2" [theme]="theme">A longer block of content constrained to two lines for the Angular integration harness.</gd-truncate>
    </div></section>
    <section><h3>Wrapper — inline / section / full page</h3><div class="row">
      <gd-wrapper variant="inline" [theme]="theme">Inline content</gd-wrapper>
      <gd-wrapper variant="section" as="section" [theme]="theme">Section content</gd-wrapper>
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
  readonly toggleItems = ['Option 1', 'Option 2', 'Option 3'];
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
