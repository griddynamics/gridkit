import { nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { loader, animations, wrapper } from 'gd-design-library/tokens';
import { buttonCssBlockToText, cssKeyframesToText, get, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

type LoaderName = 'circle' | 'dots';
type LoaderVariant = 'inline' | 'section' | 'fullPage';
type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type CssBlock = ButtonCssBlock;

const isMeaningfulNode = (node: Node) =>
  node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim()));

@customElement('gd-loader')
export class GdLoader extends GdThemedElement {
  @property({ type: String, reflect: true }) name: LoaderName = 'circle';
  @property({ type: String, reflect: true }) variant: LoaderVariant = 'inline';
  @property({ type: String, reflect: true }) size: LoaderSize = 'md';
  @property({ type: String, reflect: true }) rounded = 'none';
  @property({ type: String, attribute: 'animation-props' }) animationProps = '2000ms ease-in-out infinite';
  @property({ type: Boolean, attribute: 'with-wrapper' }) withWrapper = true;
  /** Wrapper element tag, like React's `WrapperView` (default `span`). */
  @property({ type: String, attribute: 'wrapper-view' }) WrapperView: keyof HTMLElementTagNameMap = 'span';
  @property({ attribute: false }) styles: CssBlock = {};

  /**
   * React's `<Loader>` renders its `children` INSTEAD of the built-in animation (still inside the
   * wrapper). Slotted light-DOM content does the same here, so the spinner is only rendered while
   * the default slot is empty.
   */
  @state() private _hasContent = false;

  connectedCallback() {
    super.connectedCallback();
    this._hasContent = Array.from(this.childNodes).some(isMeaningfulNode);
  }

  private _onSlotChange(event: Event) {
    this._hasContent = (event.target as HTMLSlotElement).assignedNodes({ flatten: true }).some(isMeaningfulNode);
  }

  protected updated() {
    const surface = this.shadowRoot?.querySelector<HTMLElement>('[part="wrapper"]');
    if (!surface || this.variant !== 'fullPage' || surface.matches(':popover-open')) return;
    surface.showPopover?.();
  }

  render() {
    const loaderTokens = (this.theme.loader as typeof loader | undefined) ?? loader;
    const animationTokens = (this.theme.animations as typeof animations | undefined) ?? animations;
    const tokens = resolveThemeTree(loaderTokens, this.theme) as unknown as Record<string, CssBlock> & {
      circle: Record<string, CssBlock>;
      dots: Record<string, CssBlock>;
    };
    const resolvedAnimations = resolveThemeTree(animationTokens, this.theme) as unknown as Record<string, CssBlock>;
    const animationName = this.name === 'circle' ? 'spinKeyframes' : 'bounceKeyframes';
    const frames = resolvedAnimations[animationName];
    const wrapperTokens = resolveThemeTree(
      (this.theme.wrapper as typeof wrapper | undefined) ?? wrapper,
      this.theme
    ) as unknown as Record<string, CssBlock>;
    const radius = get(this.theme, `radius.${this.rounded}`, '0px');
    const cssText = [
      // React renders the wrapper span as the component's root; an extra inline host box would add a line
      // box (strut) around it, making the loader ~3px taller inside flex columns and rows.
      buttonCssBlockToText(':host', { display: 'contents' }),
      // React gets this from the global reset in styles.css, which does not reach a shadow root; without
      // it the circle's border adds to its width/height and every size renders larger than in React.
      buttonCssBlockToText('.wrapper, .loader, .dot', { boxSizing: 'border-box' }),
      // Same `wrapper` tokens React's <Wrapper> applies: centering, backdrop blur/tint, and the
      // inline / section (absolute fill) / fullPage (fixed viewport) positioning.
      buttonCssBlockToText('.wrapper', wrapperTokens.default),
      buttonCssBlockToText('.wrapper', wrapperTokens[this.variant] ?? {}),
      // A `popover` surface (fullPage) ships UA margin/border/padding/overflow that React's portal
      // wrapper does not have.
      buttonCssBlockToText('.wrapper[popover]', {
        margin: 0,
        border: 0,
        padding: 0,
        overflow: 'visible',
        maxWidth: 'none',
        maxHeight: 'none',
      }),
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
      cssKeyframesToText(
        `gd-loader-${this.name === 'circle' ? 'spin' : 'bounce'}`,
        frames as unknown as Record<string, CssBlock>
      ),
    ].join('\n');
    const root = this.shadowRoot;
    if (root && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      root.adoptedStyleSheets = [sheet];
    }
    const loaderElement = html`<span
      class="loader"
      part="loader"
      role="status"
      aria-label=${this.getAttribute('aria-label') ?? 'Loading'}
      >${this.name === 'dots'
        ? html`<span class="dot" part="dot"></span><span class="dot" part="dot"></span
            ><span class="dot" part="dot"></span>`
        : ''}</span
    >`;
    const content: TemplateResult = html`${this._hasContent ? nothing : loaderElement}<slot
        @slotchange=${this._onSlotChange}
      ></slot>`;
    if (!this.withWrapper) return content;
    const tag = unsafeStatic(/^[a-z][a-z0-9-]*$/.test(this.WrapperView) ? this.WrapperView : 'span');
    return html`<${tag} class="wrapper" part="wrapper" popover=${this.variant === 'fullPage' ? 'manual' : nothing}
      >${content}</${tag}
    >`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-loader': GdLoader;
  }
}
