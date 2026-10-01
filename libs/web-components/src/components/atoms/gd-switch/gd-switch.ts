import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { switchToken } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';
import '../gd-loader/gd-loader';

@customElement('gd-switch')
export class GdSwitch extends LitElement {
  @property({ type: String, reflect: true }) label: 'left' | 'right' = 'right';
  @property({ type: String, reflect: true }) name = 'switch';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: 'is-loading', reflect: true }) isLoading = false;
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  private change(event: Event) {
    if (this.disabled || this.isLoading) return;
    this.checked = (event.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent('gd-change', { detail: { checked: this.checked }, bubbles: true, composed: true })
    );
  }

  render() {
    const t = resolveThemeTree(switchToken, this.theme) as unknown as Record<string, ButtonCssBlock> & {
      wrapper: Record<string, ButtonCssBlock>;
      label: Record<string, ButtonCssBlock>;
      slider: Record<string, ButtonCssBlock>;
    };
    const off = this.disabled || this.isLoading;
    const cssText = [
      buttonCssBlockToText('.wrapper', t.wrapper.default),
      off ? buttonCssBlockToText('.wrapper', t.wrapper.disabled) : '',
      buttonCssBlockToText('.wrapper', this.styles),
      buttonCssBlockToText('.control', t.default),
      this.checked ? buttonCssBlockToText('.control', t.checked) : '',
      buttonCssBlockToText('.label', t.label.default ?? {}),
      buttonCssBlockToText('.label.right', t.label.right ?? {}),
      buttonCssBlockToText('.slider', t.slider.default),
      this.checked ? buttonCssBlockToText('.slider', t.slider.checked) : '',
      off ? buttonCssBlockToText('.slider', t.slider.disabled) : '',
      buttonCssBlockToText('input', t.checkbox),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    return html`<label class="wrapper" part="wrapper">
      ${this.label === 'left' ? html`<span class="label left" part="label"><slot></slot></span>` : nothing}
      <span class="control" part="control">
        ${this.isLoading
          ? html`<gd-loader name="circle" size="sm" .withWrapper=${false} .theme=${this.theme}></gd-loader>`
          : nothing}
        <span class="slider" part="slider"></span>
        <input
          part="input"
          type="checkbox"
          name=${this.name}
          .checked=${this.checked}
          ?disabled=${off}
          @change=${this.change}
        />
      </span>
      ${this.label === 'right' ? html`<span class="label right" part="label"><slot></slot></span>` : nothing}
    </label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-switch': GdSwitch;
  }
}
