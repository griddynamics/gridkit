import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { label } from 'gd-design-library/tokens';
import { resolveThemeTree } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

@customElement('gd-label')
export class GdLabel extends GdThemedElement {
  @property({ type: String, attribute: 'for', reflect: true }) htmlFor?: string;
  @property({ attribute: false }) styles: Record<string, string | number> = {};
  render() {
    const tokens = resolveThemeTree(label, this.theme) as { default: Record<string, string | number> };
    return html`<label part="label" for=${this.htmlFor ?? ''} style=${styleMap({ ...tokens.default, ...this.styles })}
      ><slot></slot
    ></label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-label': GdLabel;
  }
}
