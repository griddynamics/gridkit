import { LitElement, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { image } from 'gd-design-library/tokens';
import { resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

export type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
type CssValues = Record<string, string | number>;

@customElement('gd-image')
export class GdImage extends LitElement {
  @property({ type: String, reflect: true }) src?: string;
  @property({ type: String, reflect: true }) alt = '';
  @property({ type: Number, reflect: true }) width?: number;
  @property({ type: Number, reflect: true }) height?: number;
  @property({ type: String, reflect: true }) caption?: string;
  @property({ type: String, attribute: 'object-fit', reflect: true }) objectFit: ImageObjectFit = 'cover';
  @property({ attribute: false }) styles: CssValues = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @state() private _loading = true;
  @state() private _failed = false;

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('src')) {
      this._loading = true;
      this._failed = false;
    }
  }

  private _loaded() {
    this._loading = false;
    this._failed = false;
    this.dispatchEvent(new CustomEvent('gd-load', { bubbles: true, composed: true }));
  }

  private _errored() {
    this._loading = false;
    this._failed = true;
    this.dispatchEvent(new CustomEvent('gd-error', { bubbles: true, composed: true }));
  }

  render() {
    const tokens = resolveThemeTree(image, this.theme) as unknown as Record<string, CssValues>;
    const wrapper = {
      ...tokens.wrapper,
      width: this.width ? `${this.width}px` : '100%',
      height: this.height ? `${this.height}px` : '100%',
    };
    const imageStyles = {
      ...tokens.default,
      objectFit: this.objectFit,
      opacity: this._loading ? 0 : 1,
      ...this.styles,
    };
    const showFallback = !this.src || this._failed;
    return html`<figure part="root" style=${styleMap(wrapper)}>
      ${this._loading && this.src
        ? html`<span part="placeholder" style=${styleMap(tokens.placeholder)}><slot name="placeholder"></slot></span>`
        : nothing}
      ${showFallback
        ? html`<slot name="fallback"></slot>`
        : html`<img
            part="image"
            src=${this.src!}
            alt=${this.alt}
            width=${this.width ?? nothing}
            height=${this.height ?? nothing}
            style=${styleMap(imageStyles)}
            @load=${this._loaded}
            @error=${this._errored}
          />`}
      ${this.caption
        ? html`<figcaption part="caption" style=${styleMap(tokens.caption)}>${this.caption}</figcaption>`
        : nothing}
    </figure>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-image': GdImage;
  }
}
