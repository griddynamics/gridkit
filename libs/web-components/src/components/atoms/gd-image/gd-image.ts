import { css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { styleMap } from 'lit/directives/style-map.js';
import { image } from 'gd-design-library/tokens';
import { resolveThemeTree } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';
import '../gd-skeleton/gd-skeleton';

export type ImageObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
type CssValues = Record<string, string | number>;

const SAFE_TAG = /^[a-z][a-z0-9-]*$/i;
const safeTag = (tag: string | undefined, fallback: string) => unsafeStatic(tag && SAFE_TAG.test(tag) ? tag : fallback);

@customElement('gd-image')
export class GdImage extends GdThemedElement {
  // The global reset of the page does not reach a shadow root; these rules reproduce it for the
  // elements rendered here (the host stays transparent so the wrapper takes part in the page layout).
  static styles = css`
    :host {
      display: contents;
    }
    [part='root'],
    [part='placeholder'],
    [part='caption'] {
      box-sizing: border-box;
      margin: 0;
      border: 0 solid;
    }
    img {
      display: block;
      vertical-align: middle;
      max-width: 100%;
      height: auto;
      border: 0 solid;
      box-sizing: border-box;
    }
  `;

  @property({ type: String, reflect: true }) src?: string;
  @property({ type: String, reflect: true }) alt = '';
  @property({ type: Number, reflect: true }) width?: number;
  @property({ type: Number, reflect: true }) height?: number;
  @property({ type: String, reflect: true }) caption?: string;
  /** Text shown over the image while it loads. The `placeholder` slot accepts richer content. */
  @property({ type: String, reflect: true }) placeholder?: string;
  /** Tag of the wrapper element, `div` by default (for example `figure`). */
  @property({ type: String, reflect: true }) as = 'div';
  /** Tag of the caption element, `figcaption` by default (for example `p`). */
  @property({ type: String, attribute: 'caption-as', reflect: true }) captionAs = 'figcaption';
  @property({ type: String, attribute: 'object-fit', reflect: true }) objectFit: ImageObjectFit = 'cover';
  @property({ attribute: false }) styles: CssValues = {};

  @state() private _loading = true;
  @state() private _failed = false;
  @state() private _hasPlaceholder = false;

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

  private _placeholderChanged(event: Event) {
    this._hasPlaceholder = (event.target as HTMLSlotElement).assignedNodes().length > 0;
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
    const showPlaceholder = this._loading && Boolean(this.src) && (this._hasPlaceholder || Boolean(this.placeholder));
    const wrapperTag = safeTag(this.as, 'div');
    const captionTag = safeTag(this.captionAs, 'figcaption');
    return html`<${wrapperTag} part="root" style=${styleMap(wrapper)}>
      <span
        part="placeholder"
        aria-hidden=${showPlaceholder ? nothing : 'true'}
        style=${styleMap({ ...tokens.placeholder, display: showPlaceholder ? tokens.placeholder.display : 'none' })}
        ><gd-skeleton height="100%" .theme=${this.theme}
          ><slot name="placeholder" @slotchange=${this._placeholderChanged}
            >${this._loading ? (this.placeholder ?? nothing) : nothing}</slot
          ></gd-skeleton
      ></span>
      ${
        showFallback
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
            />`
      }
      ${
        this.caption
          ? html`<${captionTag} part="caption" style=${styleMap(tokens.caption)}>${this.caption}</${captionTag}>`
          : nothing
      }
    </${wrapperTag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-image': GdImage;
  }
}
