import { LitElement, html, nothing, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { counter } from 'gd-design-library/tokens';
import { resolveThemeTree, type DesignCoreTheme, type ButtonCssBlock } from 'gd-design-core';
import '../../atoms/gd-button/gd-button';
import '../../atoms/gd-input/gd-input';

type Styles = Record<string, string | number>;
type Tokens = {
  default: Styles;
  navButton: { default: ButtonCssBlock };
  webComponent: { host: Styles; root: Styles; inputHost: Styles; inputOuter: Styles; inputControl: ButtonCssBlock };
};
const tokens = (theme: DesignCoreTheme) => resolveThemeTree(counter, theme) as unknown as Tokens;

@customElement('gd-counter')
export class GdCounter extends LitElement {
  @property({ type: Number }) min = 1;
  @property({ type: Number }) max = 999;
  @property({ type: Number }) initial = 1;
  @property({ type: Boolean, attribute: 'is-disabled', reflect: true }) isDisabled = false;
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  private value = 1;
  private draft = '1';
  private initialized = false;
  connectedCallback() {
    super.connectedCallback();
    this.value = this.initial;
    this.draft = String(this.initial);
  }
  firstUpdated() {
    this.initialized = true;
    this.emit();
  }
  updated(changed: PropertyValues<this>) {
    Object.assign(this.style, tokens(this.theme).webComponent.host);
    if (changed.has('initial') && !this.initialized) {
      this.value = this.initial;
      this.draft = String(this.initial);
    }
  }
  private emit() {
    this.dispatchEvent(new CustomEvent('gd-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }
  private commit(value: number) {
    this.value = value;
    this.draft = String(value);
    this.emit();
    this.requestUpdate();
  }
  private onInput = (event: CustomEvent<{ value: string }>) => {
    if (/^\d*$/.test(event.detail.value)) this.draft = event.detail.value;
  };
  private onBlur = () => {
    const value = Number.parseInt(this.draft, 10);
    if (Number.isNaN(value)) {
      this.draft = String(this.value);
      this.requestUpdate();
    } else this.commit(Math.max(this.min, Math.min(this.max, value)));
  };
  render() {
    const t = tokens(this.theme);
    const root = Object.fromEntries(Object.entries(t.default).filter(([name]) => name !== '& input')) as Styles;
    const inputStyles = Object.fromEntries(
      Object.entries(t.webComponent.inputControl).filter(([, value]) => typeof value !== 'object')
    ) as Styles;
    return html`<div part="root" style=${styleMap({ ...root, ...t.webComponent.root })}>
      <gd-button
        part="decrement"
        variant="outlined"
        .isIcon=${true}
        .styles=${t.navButton.default}
        .theme=${this.theme}
        ?disabled=${this.isDisabled || this.value <= this.min}
        aria-label="Decrement counter"
        @click=${() => this.value > this.min && this.commit(this.value - 1)}
        ><svg part="decrement-icon" aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M19 13H5V11H19V13Z"></path></svg
      ></gd-button>
      <gd-input
        part="input"
        type="number"
        .value=${this.draft}
        .disabled=${this.isDisabled}
        .styles=${{ ...t.webComponent.inputHost, ...t.webComponent.inputOuter }}
        .inputStyles=${inputStyles}
        .inputStyleRules=${t.webComponent.inputControl}
        .theme=${this.theme}
        aria-label="Quantity value"
        aria-valuemin=${this.min}
        aria-valuemax=${this.max === Infinity ? nothing : this.max}
        @gd-input=${this.onInput}
        @focusout=${this.onBlur}
      ></gd-input>
      <gd-button
        part="increment"
        variant="outlined"
        .isIcon=${true}
        .styles=${t.navButton.default}
        .theme=${this.theme}
        ?disabled=${this.isDisabled || this.value >= this.max}
        aria-label="Increment counter"
        @click=${() => this.value < this.max && this.commit(this.value + 1)}
        ><svg part="increment-icon" aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path></svg
      ></gd-button>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-counter': GdCounter;
  }
}
