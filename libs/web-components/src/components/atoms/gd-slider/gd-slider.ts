import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { slider } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';

@customElement('gd-slider')
export class GdSlider extends LitElement {
  @property({ type: Number, reflect: true }) min = 0;
  @property({ type: Number, reflect: true }) max = 100;
  @property({ type: Number }) value?: number;
  @property({ type: Number, reflect: true }) step = 1;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  @state() private currentValue = 0;

  protected willUpdate(changed: Map<PropertyKey, unknown>) {
    if (changed.has('value') || changed.has('min')) this.currentValue = this.value ?? this.min;
  }

  private onInput(event: Event) {
    const value = Math.min(this.max, Math.max(this.min, Number((event.target as HTMLInputElement).value)));
    this.currentValue = value;
    this.value = value;
    this.dispatchEvent(new CustomEvent('gd-change', { detail: { value }, bubbles: true, composed: true }));
  }

  render() {
    const tokens = resolveThemeTree(slider, this.theme) as unknown as { default: ButtonCssBlock };
    const fillRatio = this.max > this.min ? (this.currentValue - this.min) / (this.max - this.min) : this.min;
    const cssText = [
      buttonCssBlockToText('input', tokens.default),
      buttonCssBlockToText('input', { '--gd-slider-fill-ratio': fillRatio }),
      buttonCssBlockToText('input', this.styles),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    return html`<input
      part="slider"
      type="range"
      role="slider"
      min=${this.min}
      max=${this.max}
      step=${this.step}
      .value=${String(this.currentValue)}
      ?disabled=${this.disabled}
      aria-valuenow=${this.currentValue}
      aria-valuemin=${this.min}
      aria-valuemax=${this.max}
      aria-disabled=${this.disabled}
      aria-label=${this.getAttribute('aria-label') ?? 'Slider'}
      @input=${this.onInput}
    />`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-slider': GdSlider;
  }
}
