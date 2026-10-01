import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { switchToggle } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';
import '../gd-button/gd-button';

export interface GdToggleItem {
  label?: unknown;
  value: unknown;
}
@customElement('gd-toggle')
export class GdToggle extends LitElement {
  @property({ attribute: false }) items: Array<string | GdToggleItem> = [];
  @property({ attribute: false }) value?: unknown;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) renderItemContent?: (item: string | GdToggleItem, index: number) => unknown;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  private normalized(item: string | GdToggleItem): GdToggleItem {
    return typeof item === 'object' ? item : { label: item, value: item };
  }
  private select(value: unknown) {
    if (this.disabled) return;
    this.value = value;
    this.dispatchEvent(new CustomEvent('gd-change', { detail: { value }, bubbles: true, composed: true }));
  }
  render() {
    const t = resolveThemeTree(switchToggle, this.theme) as unknown as Record<string, ButtonCssBlock>;
    const css = [
      buttonCssBlockToText('.toggle', t.default),
      this.disabled ? buttonCssBlockToText('.toggle', t.disabled) : '',
      buttonCssBlockToText('.toggle', this.styles),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const s = new CSSStyleSheet();
      s.replaceSync(css);
      this.shadowRoot.adoptedStyleSheets = [s];
    }
    return html`<div class="toggle" part="toggle" role="group">
      ${repeat(
        this.items,
        (_, i) => i,
        (item, index) => {
          const x = this.normalized(item);
          return html`<gd-button
            part="item"
            .theme=${this.theme}
            variant=${Object.is(x.value, this.value) ? 'primary' : 'text'}
            ?disabled=${this.disabled}
            aria-pressed=${Object.is(x.value, this.value)}
            @click=${() => this.select(x.value)}
            >${this.renderItemContent?.(item, index) ?? x.label ?? ''}</gd-button
          >`;
        }
      )}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-toggle': GdToggle;
  }
}
