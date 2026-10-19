import { html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { link } from 'gd-design-library/tokens';
import { buttonCssBlockToText, get, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

type LinkVariant = 'primary' | 'secondary' | 'inverted' | 'inherit';
type LinkSize = 'sm' | 'md' | 'lg';
type LinkUnderline = 'default' | 'highlight' | 'none';
type CssBlock = ButtonCssBlock;

@customElement('gd-link')
export class GdLink extends GdThemedElement {
  @property({ type: String, reflect: true }) variant: LinkVariant = 'primary';
  @property({ type: String, reflect: true }) size?: LinkSize;
  @property({ type: String, reflect: true }) underline: LinkUnderline = 'default';
  @property({ type: String, reflect: true }) color?: string;
  @property({ type: String, reflect: true }) cursor = 'pointer';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String, reflect: true }) target?: string;
  @property({ type: String, reflect: true }) href?: string;
  @property({ type: String, reflect: true }) rel?: string;
  @property({ attribute: false }) styles: CssBlock = {};

  render() {
    const tokens = resolveThemeTree(link, this.theme) as unknown as Record<string, CssBlock> & {
      sizeMap: Record<LinkSize, CssBlock>;
      underline: Record<LinkUnderline, CssBlock>;
    };
    const color = this.color ? get(this.theme, `colors.${this.color}`, this.color) : undefined;
    const cssText =
      // React gets `a { text-decoration: inherit }` from the global reset in styles.css, which does not
      // reach a shadow root; without it the UA underline of an `a[href]` doubles the token underline.
      buttonCssBlockToText('a', { textDecoration: 'inherit' }) +
      [
        tokens.default,
        tokens[this.variant],
        this.size ? tokens.sizeMap[this.size] : {},
        this.underline !== 'default' ? tokens.underline[this.underline] : {},
        this.styles,
        color ? { color } : {},
      ]
        .map((block) => buttonCssBlockToText('a', block))
        .join('\n') +
      buttonCssBlockToText('a', { cursor: this.disabled ? 'default' : this.cursor });
    const root = this.shadowRoot;
    if (root && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      root.adoptedStyleSheets = [sheet];
    }
    return html`<a
      part="link"
      class=${this.disabled ? 'Link--disabled' : ''}
      href=${this.disabled ? nothing : (this.href ?? nothing)}
      target=${this.target ?? nothing}
      rel=${this.rel ?? ''}
      aria-disabled=${String(this.disabled)}
      @click=${(event: Event) => {
        if (this.disabled) event.preventDefault();
      }}
      ><slot></slot
    ></a>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-link': GdLink;
  }
}
