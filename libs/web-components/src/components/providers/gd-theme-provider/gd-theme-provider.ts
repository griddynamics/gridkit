import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { defaultTheme } from 'gd-design-library/tokens';
import {
  THEME_PROVIDER_READY_EVENT,
  THEME_REQUEST_EVENT,
  type ThemeLike,
  type ThemeRequestDetail,
} from '../../../core';

export interface ThemeChangeDetail {
  name: string;
  theme: ThemeLike;
}

const themeName = (theme: ThemeLike | undefined): string => (typeof theme?.name === 'string' ? theme.name : '');

/**
 * Web-component counterpart of React's `ThemeProvider` + `useTheme()`.
 *
 * Every `gd-*` element below it (including inside other elements' shadow roots) receives the
 * active theme and re-renders when it changes. An element whose `theme` property is assigned
 * directly keeps that value.
 *
 * Same contract as React:
 * - `initialTheme` — registered under its `name`, active at start. `is-default` (or no
 *   `initialTheme` at all) uses `defaultTheme` from `gd-design-library/tokens`.
 * - `setTheme(name)` — switch to a registered theme; an unknown name reverts to the initial one
 *   and logs a warning. The `theme-name` attribute does the same declaratively.
 * - `addTheme(name, theme)` — register another theme; an existing name is skipped with a warning.
 *   Adding never switches the active theme.
 *
 * Dispatches `gd-theme-change` (`ThemeChangeDetail`) after the active theme changes.
 */
@customElement('gd-theme-provider')
export class GdThemeProvider extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  @property({ attribute: false }) initialTheme?: ThemeLike;
  @property({ type: Boolean, attribute: 'is-default' }) isDefault = false;
  /** Name of the theme to activate; unknown or empty falls back to the initial theme. */
  @property({ type: String, attribute: 'theme-name', reflect: true }) themeName = '';

  private readonly _added = new Map<string, ThemeLike>();
  // Last theme each subscriber was given, so a change is pushed exactly once per subscriber.
  private readonly _subscribers = new Map<(theme: ThemeLike) => void, ThemeLike | undefined>();
  private _announced?: ThemeLike;

  constructor() {
    super();
    this.addEventListener(THEME_REQUEST_EVENT, (event) => {
      const { callback, registerUnsubscribe } = (event as CustomEvent<ThemeRequestDetail>).detail;
      event.stopPropagation();
      const theme = this.theme;
      this._subscribers.set(callback, theme);
      registerUnsubscribe(() => this._subscribers.delete(callback));
      callback(theme);
    });
  }

  private get _initial(): ThemeLike {
    return this.isDefault || !this.initialTheme ? (defaultTheme as ThemeLike) : this.initialTheme;
  }

  /** Initial theme first, so it wins over an added theme with the same name (as in React). */
  private get _registry(): Map<string, ThemeLike> {
    const initial = this._initial;
    return new Map([...this._added, [themeName(initial), initial]]);
  }

  /** The active theme object, computed on demand so it is never stale. */
  get theme(): ThemeLike {
    return this._registry.get(this.themeName) ?? this._initial;
  }

  /** Name of the active theme. */
  get activeThemeName(): string {
    return themeName(this.theme);
  }

  /** Names of every registered theme. */
  get themeNames(): string[] {
    return [...this._registry.keys()];
  }

  setTheme(name = ''): void {
    if (this._registry.has(name)) {
      this.themeName = name;
      return;
    }
    console.warn(`gd-theme-provider: theme "${name}" does not exist, reverting to "${themeName(this._initial)}"`, {
      availableThemes: this.themeNames,
    });
    this.themeName = '';
  }

  addTheme(name: string, config: ThemeLike): void {
    if (this._registry.has(name)) {
      console.warn(`gd-theme-provider: theme "${name}" already exists, skipping`);
      return;
    }
    this._added.set(name, config);
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    // Descendants that connected before this element was defined/attached ask again.
    this.dispatchEvent(new CustomEvent(THEME_PROVIDER_READY_EVENT, { bubbles: true, composed: true }));
  }

  protected firstUpdated() {
    this._announced = this.theme;
  }

  protected updated() {
    const theme = this.theme;
    this._subscribers.forEach((last, callback) => {
      if (last === theme) return;
      this._subscribers.set(callback, theme);
      callback(theme);
    });
    if (theme === this._announced) return;
    this._announced = theme;
    this.dispatchEvent(
      new CustomEvent<ThemeChangeDetail>('gd-theme-change', {
        detail: { name: themeName(theme), theme },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-theme-provider': GdThemeProvider;
  }
}
