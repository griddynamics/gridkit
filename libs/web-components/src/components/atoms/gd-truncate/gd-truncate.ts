import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { truncate } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';

@customElement('gd-truncate')
export class GdTruncate extends LitElement {
  @property({ type: Number, reflect: true }) lines = 1;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
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
      buttonCssBlockToText('.content', t.default),
      buttonCssBlockToText('.content', { lineClamp: this.lines, WebkitLineClamp: this.lines }),
      buttonCssBlockToText('.content', this.styles),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const s = new CSSStyleSheet();
      s.replaceSync(css);
      this.shadowRoot.adoptedStyleSheets = [s];
    }
    return html`<span class="content" part="content"><slot @slotchange=${this.measure}></slot></span>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-truncate': GdTruncate;
  }
}
