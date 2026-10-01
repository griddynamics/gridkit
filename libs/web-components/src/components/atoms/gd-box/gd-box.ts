import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { box } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

export type BoxVariant = 'horizontal' | 'vertical';
type CssValues = Record<string, string | number>;
interface ResolvedBoxTokens {
  default: CssValues;
  vertical: { default: CssValues; bordered: CssValues; highlighted: CssValues };
  horizontal: { default: CssValues; bordered: CssValues; highlighted: CssValues };
  shadowHover: CssValues;
}

@customElement('gd-box')
export class GdBox extends LitElement {
  @property({ type: String, reflect: true }) variant: BoxVariant = 'vertical';
  @property({ type: Boolean, attribute: 'is-bordered', reflect: true }) isBordered = false;
  @property({ type: Boolean, attribute: 'is-highlighted', reflect: true }) isHighlighted = false;
  @property({ type: Boolean, attribute: 'with-shadow-hover', reflect: true }) withShadowHover = false;
  @property({ type: Number, attribute: 'tabindex', reflect: true }) override tabIndex = -1;
  @property({ attribute: false }) styles: CssValues = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  render() {
    const tokens = resolveThemeTree(box, this.theme) as unknown as ResolvedBoxTokens;
    const variant = tokens[this.variant];
    const cssText = [
      buttonCssBlockToText('[part="root"]', tokens.default),
      buttonCssBlockToText('[part="root"]', variant.default),
      this.isBordered ? buttonCssBlockToText('[part="root"]', variant.bordered) : '',
      this.isHighlighted ? buttonCssBlockToText('[part="root"]', variant.highlighted) : '',
      this.withShadowHover ? buttonCssBlockToText('[part="root"]', tokens.shadowHover) : '',
      buttonCssBlockToText('[part="root"]', this.styles),
    ].join('\n');
    const root = this.shadowRoot;
    if (root && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      root.adoptedStyleSheets = [sheet];
    }
    return html`<div part="root"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-box': GdBox;
  }
}
