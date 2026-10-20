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
import { darkTheme } from './dark-theme';

type Item = { name: string; value: string };

const componentMetadata = {
  selector: 'gd-angular-fidelity-harness',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styles: [
    `
      :host { display: block; }
      .page { padding: 24px; min-height: 100vh; transition: background 0.2s ease-in-out, color 0.2s ease-in-out; }
      .toolbar { position: sticky; top: 0; z-index: 1; display: flex; gap: 16px; align-items: center; margin: -24px -24px 24px; padding: 12px 24px; border-bottom: 1px solid currentColor; }
      section { margin-bottom: 32px; }
      h3 { font-family: sans-serif; }
      .row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    `,
  ],
  template: `
    <gd-theme-provider #provider id="theme-provider" is-default (gd-theme-change)="onThemeChange($event)">
    <div id="harness-page" class="page" [style.background]="pageBackground" [style.color]="pageColor">
    <section class="toolbar" [style.background]="pageBackground === 'transparent' ? '#fff' : pageBackground">
      <gd-switch id="theme-toggle" [checked]="activeTheme === 'dark'" (gd-change)="onToggleTheme(provider, $event)">Dark theme</gd-switch>
      <output id="theme-active">Active theme: {{ activeTheme }}</output>
    </section>

    <section>
      <h3>Input — controlled value</h3>
      <div class="row">
        <gd-input id="input-repro" label="Label" helper-text="Helper text" color="primary"
          [value]="inputValue" (gd-input)="onInput($event)"></gd-input>
      </div>
    </section>

    <section><h3>Button — primary / secondary / outlined / disabled / loading</h3><div class="row">
      <gd-button variant="primary">Primary</gd-button>
      <gd-button variant="secondary">Secondary</gd-button>
      <gd-button variant="outlined">Outlined</gd-button>
      <gd-button variant="primary" disabled>Disabled</gd-button>
      <gd-button variant="primary" [isLoading]="true">Loading</gd-button>
    </div></section>

    <section><h3>Checkbox — default / checked / indeterminate / disabled</h3><div class="row">
      <gd-checkbox id="cb-default"></gd-checkbox>
      <gd-checkbox id="cb-checked" [checked]="checked" (gd-change)="onChecked($event)">Checked</gd-checkbox>
      <gd-checkbox id="cb-indeterminate" indeterminate>Indeterminate</gd-checkbox>
      <gd-checkbox id="cb-disabled" disabled checked>Disabled</gd-checkbox>
    </div></section>

    <section><h3>Typography — h1 / h2 / p</h3><div class="row">
      <div><gd-typography variant="h1" as="h1">Heading 1</gd-typography>
      <gd-typography variant="h2" as="h2">Heading 2</gd-typography>
      <gd-typography variant="p" as="p">Body paragraph text for comparison.</gd-typography></div>
    </div></section>

    <section><h3>Select — trigger + dropdown</h3><div class="row">
      <gd-select id="select-repro" [items]="items" [value]="selectedItem" (gd-change)="onSelect($event)"></gd-select>
    </div></section>

    <section><h3>Avatar — image / fallback / badge / sizes</h3><div class="row">
      <gd-avatar [src]="portrait" alt="Ada Lovelace" size="md"></gd-avatar>
      <gd-avatar fallback="AL" alt="Ada Lovelace" size="lg"></gd-avatar>
      <gd-avatar fallback="GD" alt="GridKit" size="xl" with-badge badge-color="bg.fill.success.primary.default" background-color="bg.fill.info.primary.default"></gd-avatar>
      <gd-avatar alt="Custom fallback" size="sm"><span slot="fallback">★</span></gd-avatar>
    </div></section>

    <section><h3>Menu — popover, selection, and light dismiss</h3><div class="row">
      <gd-menu (gd-change)="onMenu($event)">
        <span slot="trigger">Actions ▾</span><div slot="content">
          <button data-gd-menu-name="Edit" data-gd-menu-value="edit">Edit</button>
          <button data-gd-menu-name="Archive" data-gd-menu-value="archive">Archive</button>
        </div>
      </gd-menu><output>Selected: {{ menuValue }}</output>
    </div></section>

    <section><h3>Counter — quantity control</h3><div class="row">
      <gd-counter min="1" max="5" initial="1" (gd-change)="onCounter($event)"></gd-counter>
      <output>Value: {{ counterValue }}</output>
    </div></section>

    <section><h3>Box — vertical / horizontal / bordered / highlighted</h3><div class="row">
      <gd-box variant="vertical">Vertical box</gd-box>
      <gd-box variant="horizontal" is-bordered>Bordered horizontal box</gd-box>
      <gd-box is-bordered is-highlighted with-shadow-hover>Interactive box</gd-box>
    </div></section>

    <section><h3>Badge — variants / sizes / icons / disabled</h3><div class="row">
      <gd-badge variant="primary" appearance="filled" size="xs">Primary</gd-badge>
      <gd-badge variant="secondary" appearance="outline" size="md"><span slot="icon-start">★</span>With icon</gd-badge>
      <gd-badge variant="tertiary" appearance="filledLight" size="lg" disabled>Disabled</gd-badge>
    </div></section>

    <section><h3>Image — image / caption / fallback</h3><div class="row">
      <gd-image [src]="portrait" alt="Ada Lovelace" width="96" height="96" caption="Portrait"></gd-image>
      <gd-image src="/missing-image.png" alt="Unavailable image" width="96" height="96"><span slot="fallback">Image unavailable</span></gd-image>
    </div></section>

    <section><h3>Icon — shared React/Web Components catalog</h3><div class="row">
      <gd-icon name="star" size="xs"></gd-icon>
      <gd-icon name="search" size="md"></gd-icon>
      <gd-icon name="edit" size="xl" aria-label="Edit"></gd-icon>
    </div></section>

    <section><h3>InputFile — default / multiple / accept / icon</h3><div class="row">
      <gd-input-file>Browse Files</gd-input-file>
      <gd-input-file multiple accept="image/*">Choose images</gd-input-file>
      <gd-input-file is-icon aria-label="Upload file"><gd-icon name="upload"></gd-icon></gd-input-file>
      <gd-input-file disabled>Disabled</gd-input-file>
    </div></section>

    <section><h3>Label — text / icon / association</h3><div class="row">
      <gd-label for="angular-labelled-input">Account name</gd-label>
      <input id="angular-labelled-input" />
      <gd-label><gd-icon name="star"></gd-icon> Required label</gd-label>
    </div></section>

    <section><h3>Link — variants / underline / size / disabled</h3><div class="row">
      <gd-link href="#angular-link" variant="primary" size="sm">Primary</gd-link>
      <gd-link href="#angular-link" variant="inherit" underline="highlight" size="md">Highlighted</gd-link>
      <gd-link variant="inverted" size="lg" disabled>Disabled</gd-link>
    </div></section>

    <section><h3>Loader — circle / dots / sizes / wrapper variants</h3><div class="row">
      <gd-loader name="circle" size="xs"></gd-loader>
      <gd-loader name="dots" size="md" rounded="round"></gd-loader>
      <div style="position: relative; width: 120px; height: 80px; border: 1px dashed #728197"><gd-loader name="circle" size="lg" variant="section"></gd-loader></div>
      <gd-loader name="circle" size="sm" [withWrapper]="false"></gd-loader>
    </div></section>

    <section><h3>Separator — horizontal / vertical / labels / variants</h3><div class="row">
      <gd-separator length="180px"></gd-separator>
      <gd-separator length="180px" label="OR" label-position="center" size="md" variant="dashed"></gd-separator>
      <gd-separator length="80px" orientation="vertical" label="Or" size="md"></gd-separator>
    </div></section>

    <section><h3>Skeleton — rounded / circular / rectangular / children</h3><div class="row">
      <gd-skeleton width="180px" height="15px"></gd-skeleton>
      <gd-skeleton width="60px" height="60px" variant="circular"></gd-skeleton>
      <gd-skeleton width="180px" height="50px" variant="rectangular" background-color="theme.palette.success.main">Loading Content...</gd-skeleton>
    </div></section>

    <section><h3>Slider / dots — range and carousel navigation</h3><div class="row">
      <gd-slider min="0" max="100" value="45" aria-label="Volume"></gd-slider>
      <gd-slider-dots count="5" active-index="1"></gd-slider-dots>
    </div></section>
    <section><h3>Switch — default / checked / loading</h3><div class="row">
      <gd-switch>Notifications</gd-switch><gd-switch checked label="left">Enabled</gd-switch><gd-switch is-loading>Saving</gd-switch>
    </div></section>
    <section><h3>Textarea — colors / counter / resize</h3><div class="row">
      <gd-textarea placeholder="Comment"></gd-textarea><gd-textarea color="success" max-characters="100" default-value="Looks good"></gd-textarea><gd-textarea resize="both" rows="3"></gd-textarea>
    </div></section>
    <section><h3>Toggle — selected / disabled</h3><div class="row">
      <gd-toggle [items]="toggleItems" value="Option 1"></gd-toggle>
      <gd-toggle [items]="toggleItems" value="Option 2" disabled></gd-toggle>
    </div></section>
    <section><h3>Truncate — single / multiple lines</h3><div class="row">
      <gd-truncate style="width: 180px">A long single-line value that must be truncated.</gd-truncate>
      <gd-truncate style="width: 180px" lines="2">A longer block of content constrained to two lines for the Angular integration harness.</gd-truncate>
    </div></section>
    <section><h3>Wrapper — inline / section / full page</h3><div class="row">
      <gd-wrapper variant="inline">Inline content</gd-wrapper>
      <gd-wrapper variant="inline" as="section">Section content</gd-wrapper>
    </div></section>
    <section><h3>Layout — Column / Row / FlexContainer</h3><div class="row">
      <gd-column width="180px" gutter="8" align="center" [isWrap]="false">
        <span>Column one</span><span>Column two</span>
      </gd-column>
      <gd-row width="240px" gutter="8" justify="between" [isReversed]="true">
        <span>Row one</span><span>Row two</span>
      </gd-row>
      <gd-flex-container gap="8px" flex-direction="row" [styles]="layoutStyles">
        <span>Flex one</span><span>Flex two</span>
      </gd-flex-container>
    </div></section>
    <section><h3>ChatContainer — slots / event / imperative state</h3><div class="row">
      <gd-chat-container style="width: 520px; height: 220px" (gd-toggle-sidebar)="onChatToggle($event)">
        <strong slot="sidebar-header">History</strong>
        <span slot="sidebar">Angular sidebar</span>
        <span slot="sidebar-minified">Compact</span>
        <strong slot="header">Assistant</strong>
        <span>Angular chat content ({{ chatOpen ? 'open' : 'closed' }})</span>
      </gd-chat-container>
    </div></section>
    <section><h3>Portal — custom target / wrapper options</h3><div class="row">
      <div #portalTarget style="min-width:240px;padding:8px;border:1px dashed #728197">Angular portal target</div>
      <gd-portal [container]="portalTarget" [withWrapper]="false" [blocksScroll]="false" [WrapperView]="'main'">
        <span>Angular portal content</span>
      </gd-portal>
    </div></section>
    <section><h3>Scroll — vertical / horizontal / auto-hide</h3><div class="row">
      <gd-scroll vertical="visible" horizontal="auto" auto-hide [styles]="scrollStyles">
        <div style="width: 360px; height: 240px">Angular scroll content</div>
      </gd-scroll>
    </div></section>
    </div>
    </gd-theme-provider>
  `,
};

interface ThemeSwitcher extends HTMLElement {
  themeNames: string[];
  addTheme(name: string, theme: unknown): void;
  setTheme(name: string): void;
}

class FidelityHarnessComponent {
  activeTheme = 'default';
  pageBackground = 'transparent';
  pageColor = 'inherit';

  onToggleTheme(provider: ThemeSwitcher, event: Event) {
    const dark = (event as CustomEvent<{ checked: boolean }>).detail.checked;
    if (!provider.themeNames.includes('dark')) provider.addTheme('dark', darkTheme);
    provider.setTheme(dark ? 'dark' : 'default');
  }
  onThemeChange(event: Event) {
    const { name, theme } = (event as CustomEvent<{ name: string; theme: typeof defaultTheme }>).detail;
    this.activeTheme = name;
    // Page chrome follows the active theme's own background/text tokens (default stays unpainted
    // so the light render still matches the React baseline).
    this.pageBackground = name === 'default' ? 'transparent' : theme.colors.bg.default;
    this.pageColor = name === 'default' ? 'inherit' : theme.colors.text.default;
  }

  readonly items: Item[] = [
    { name: 'Alpha', value: 'a' },
    { name: 'Beta', value: 'b' },
    { name: 'Gamma', value: 'c' },
  ];
  readonly toggleItems = ['Option 1', 'Option 2', 'Option 3'];
  readonly layoutStyles = { padding: '8px', backgroundColor: '#f0f4f8' };
  readonly scrollStyles = { width: '180px', height: '120px', border: '1px solid #a0aec0' };
  readonly portrait =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%2391b8d8"/%3E%3Ccircle cx="32" cy="24" r="13" fill="%23f1c7a5"/%3E%3Cpath d="M8 64c3-18 14-27 24-27s21 9 24 27" fill="%233e6184"/%3E%3C/svg%3E';
  inputValue = 'Default Input';
  checked = true;
  selectedItem: Item | null = null;
  menuValue = 'None';
  counterValue = 1;
  chatOpen = false;

  onChatToggle(event: Event) {
    this.chatOpen = (event as CustomEvent<{ open: boolean }>).detail.open;
  }

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
