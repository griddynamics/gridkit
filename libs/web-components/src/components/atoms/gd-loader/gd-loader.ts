import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { loader, animations } from 'gd-design-library/tokens';
import { buttonCssBlockToText, get, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';

type LoaderName = 'circle' | 'dots';
type LoaderVariant = 'inline' | 'section' | 'fullPage';
type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type CssBlock = ButtonCssBlock;

@customElement('gd-loader')
export class GdLoader extends LitElement {
  @property({ type: String, reflect: true }) name: LoaderName = 'circle';
  @property({ type: String, reflect: true }) variant: LoaderVariant = 'inline';
  @property({ type: String, reflect: true }) size: LoaderSize = 'md';
  @property({ type: String, reflect: true }) rounded = 'none';
  @property({ type: String, attribute: 'animation-props' }) animationProps = '1000ms ease-in-out infinite';
  @property({ type: Boolean, attribute: 'with-wrapper' }) withWrapper = true;
  @property({ attribute: false }) styles: CssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  protected updated() {
    const surface = this.shadowRoot?.querySelector<HTMLElement>('[part="wrapper"]');
    if (!surface || this.variant !== 'fullPage' || surface.matches(':popover-open')) return;
    surface.showPopover?.();
  }

  render() {
    const tokens = resolveThemeTree(loader, this.theme) as unknown as Record<string, CssBlock> & {
      circle: Record<string, CssBlock>;
      dots: Record<string, CssBlock>;
    };
    const resolvedAnimations = resolveThemeTree(animations, this.theme) as unknown as Record<string, CssBlock>;
    const animationName = this.name === 'circle' ? 'spinKeyframes' : 'bounceKeyframes';
    const frames = resolvedAnimations[animationName];
    const radius = get(this.theme, `radius.${this.rounded}`, '0px');
    const cssText = [
      buttonCssBlockToText('.loader', tokens.default),
      buttonCssBlockToText('.loader', tokens[this.variant] ?? {}),
      buttonCssBlockToText('.loader', tokens[this.name].default),
      buttonCssBlockToText('.loader', tokens[this.name][this.size]),
      this.name === 'circle'
        ? buttonCssBlockToText('.loader', { animation: `gd-loader-spin ${this.animationProps}` })
        : '',
      this.name === 'dots'
        ? buttonCssBlockToText('.dot', { borderRadius: radius, animation: `gd-loader-bounce ${this.animationProps}` })
        : '',
      buttonCssBlockToText('.loader', this.styles),
      buttonCssBlockToText(`@keyframes gd-loader-${this.name === 'circle' ? 'spin' : 'bounce'}`, frames),
    ].join('\n');
    const root = this.shadowRoot;
    if (root && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      root.adoptedStyleSheets = [sheet];
    }
    const content = html`<span
      class="loader"
      part="loader"
      role="status"
      aria-label=${this.getAttribute('aria-label') ?? 'Loading'}
      >${this.name === 'dots'
        ? html`<span class="dot" part="dot"></span><span class="dot" part="dot"></span
            ><span class="dot" part="dot"></span>`
        : ''}<slot></slot
    ></span>`;
    return this.withWrapper
      ? html`<span part="wrapper" popover=${this.variant === 'fullPage' ? 'manual' : nothing}>${content}</span>`
      : content;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-loader': GdLoader;
  }
}
