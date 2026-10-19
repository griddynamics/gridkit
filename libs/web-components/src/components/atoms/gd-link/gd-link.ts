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
  // Like the source component, links open in a new browsing context unless another target is set.
  @property({ type: String, reflect: true }) target: string | undefined = '_blank';
  @property({ type: String, reflect: true }) href?: string;
  @property({ type: String, reflect: true }) rel?: string;
  /** Explicit ARIA role of the rendered anchor. */
  @property({ attribute: false }) role: string | null = 'link';
  /** Tab order of the rendered anchor; a disabled link is always removed from the tab order. */
  @property({ type: Number, attribute: false }) tabindex = 0;
  /** Accessible label of the rendered anchor. */
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
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
      // The host adds no box of its own: the anchor is the root element, as in the source component.
      ':host { display: contents; }\n' +
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
      rel=${this.rel || nothing}
      role=${this.role ?? nothing}
      tabindex=${this.disabled ? -1 : this.tabindex}
      aria-disabled=${this.disabled ? 'true' : nothing}
      aria-label=${this.ariaLabel ?? nothing}
      data-testid="Link"
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
