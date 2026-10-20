import { html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { truncate } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

@customElement('gd-truncate')
export class GdTruncate extends GdThemedElement {
  @property({ type: Number, reflect: true }) lines = 1;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @state() isTruncated = false;
  @query('[part="content"]') private content!: HTMLElement;
  private observer?: ResizeObserver;
  protected firstUpdated() {
    this.measure();
    this.observer = new ResizeObserver(() => this.measure());
    this.observer.observe(this.content);
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    super.disconnectedCallback();
  }
  measure() {
    requestAnimationFrame(() => {
      if (this.content) this.isTruncated = this.content.scrollHeight > this.content.clientHeight;
    });
    return this.isTruncated;
  }
  render() {
    const t = resolveThemeTree(truncate, this.theme) as unknown as { default: ButtonCssBlock };
    const css = [
      // The content span is the root of the source Truncate: the host must not add a box of its own.
      ':host { display: contents; }',
      buttonCssBlockToText('.content', { boxSizing: 'border-box', borderWidth: 0, borderStyle: 'solid' }),
      buttonCssBlockToText('.content', t.default),
      buttonCssBlockToText('.content', { lineClamp: this.lines, WebkitLineClamp: this.lines }),
      buttonCssBlockToText('.content', this.styles),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const s = new CSSStyleSheet();
      s.replaceSync(css);
      this.shadowRoot.adoptedStyleSheets = [s];
    }
    return html`<span class="content" part="content" data-testid="Truncate"
      ><slot @slotchange=${this.measure}></slot
    ></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-truncate': GdTruncate;
  }
}
