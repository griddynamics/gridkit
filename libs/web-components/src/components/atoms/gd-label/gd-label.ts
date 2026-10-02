import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { label } from 'gd-design-library/tokens';
import { get, resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

@customElement('gd-label')
export class GdLabel extends LitElement {
  @property({ type: String, attribute: 'for', reflect: true }) htmlFor?: string;
  @property({ attribute: false }) styles: Record<string, string | number> = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  render() {
    const tokens = resolveThemeTree(label, this.theme) as { default: Record<string, string | number> };
    return html`<label
      part="label"
      for=${this.htmlFor ?? ''}
      style=${styleMap({ ...tokens.default, gap: get(this.theme, 'spacing.xs', '4px'), ...this.styles })}
      ><slot></slot
    ></label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-label': GdLabel;
  }
}
