import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { wrapper } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';

type WrapperVariant = 'inline' | 'section' | 'fullPage';
@customElement('gd-wrapper')
export class GdWrapper extends LitElement {
  @property({ type: String, reflect: true }) variant: WrapperVariant = 'inline';
  @property({ type: String, reflect: true }) as: keyof HTMLElementTagNameMap = 'div';
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  render() {
    const t = resolveThemeTree(wrapper, this.theme) as unknown as Record<string, ButtonCssBlock>;
    const css = [
      buttonCssBlockToText('.wrapper', t.default),
      buttonCssBlockToText('.wrapper', t[this.variant]),
      buttonCssBlockToText('.wrapper', this.styles),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const s = new CSSStyleSheet();
      s.replaceSync(css);
      this.shadowRoot.adoptedStyleSheets = [s];
    }
    const tag = unsafeStatic(this.as);
    return html`<${tag} class="wrapper" part="wrapper"><slot></slot></${tag}>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-wrapper': GdWrapper;
  }
}
