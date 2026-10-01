import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { sliderDots } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';

@customElement('gd-slider-dots')
export class GdSliderDots extends LitElement {
  @property({ type: Number, reflect: true }) count = 0;
  @property({ type: Number, attribute: 'active-index', reflect: true }) activeIndex = 0;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  private select(index: number) {
    this.activeIndex = index;
    this.dispatchEvent(new CustomEvent('gd-change', { detail: { index }, bubbles: true, composed: true }));
  }

  render() {
    const tokens = resolveThemeTree(sliderDots, this.theme) as unknown as {
      container: { default: ButtonCssBlock };
      dot: { default: ButtonCssBlock; active: ButtonCssBlock };
    };
    const cssText = [
      buttonCssBlockToText('.dots', tokens.container.default),
      buttonCssBlockToText('.dots', this.styles),
      buttonCssBlockToText('.dot', tokens.dot.default),
      buttonCssBlockToText('.dot[aria-selected="true"]', tokens.dot.active),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    return html`<div class="dots" part="dots" role="tablist">
      ${repeat(
        Array.from({ length: Math.max(0, this.count) }, (_, index) => index),
        (index) => index,
        (index) =>
          html`<button
            class="dot"
            part="dot"
            type="button"
            role="tab"
            aria-label=${`Go to slide ${index + 1}`}
            aria-selected=${index === this.activeIndex}
            @click=${() => this.select(index)}
          ></button>`
      )}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-slider-dots': GdSliderDots;
  }
}
