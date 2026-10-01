import { LitElement, html, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { textarea } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';

@customElement('gd-textarea')
export class GdTextarea extends LitElement {
  @property({ type: String }) value?: string;
  @property({ type: String, attribute: 'default-value' }) defaultValue = '';
  @property({ type: String, reflect: true }) name = 'textarea';
  @property({ type: String, reflect: true }) placeholder = '';
  @property({ type: String, reflect: true }) resize: 'none' | 'both' | 'horizontal' | 'vertical' = 'none';
  @property({ type: String, reflect: true }) variant: 'default' | 'inline' = 'default';
  @property({ type: String, reflect: true }) color: 'primary' | 'success' | 'warning' | 'error' = 'primary';
  @property({ type: String, attribute: 'aria-described-by' }) ariaDescribedBy?: string;
  @property({ type: Boolean, attribute: 'dynamic-height-adjustment' }) dynamicHeightAdjustment = false;
  @property({ type: Boolean, attribute: 'auto-focus' }) autoFocus = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: 'read-only', reflect: true }) readOnly = false;
  @property({ type: Number, reflect: true }) rows?: number;
  @property({ type: Number, attribute: 'max-length' }) maxLength?: number;
  @property({ type: Number, attribute: 'max-characters' }) maxCharacters?: number;
  @property({ type: String, attribute: 'min-height' }) minHeight?: string;
  @property({ type: String, attribute: 'max-height' }) maxHeight?: string;
  @property({ attribute: false }) styles: ButtonCssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  @state() private internalValue = '';
  @query('textarea') private control!: HTMLTextAreaElement;

  protected firstUpdated() {
    this.internalValue = this.value ?? this.defaultValue;
    if (this.autoFocus) this.control.focus();
    this.adjustHeight();
  }
  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('value') && this.value !== undefined) this.internalValue = this.value;
  }
  focus(options?: FocusOptions) {
    this.control?.focus(options);
  }
  private adjustHeight() {
    if (!this.dynamicHeightAdjustment || !this.control) return;
    this.control.style.height = 'auto';
    this.control.style.height = `${this.control.scrollHeight}px`;
  }
  private input(event: Event) {
    this.internalValue = (event.target as HTMLTextAreaElement).value;
    this.adjustHeight();
    this.dispatchEvent(
      new CustomEvent('gd-input', { detail: { value: this.internalValue }, bubbles: true, composed: true })
    );
  }
  private change() {
    this.dispatchEvent(
      new CustomEvent('gd-change', { detail: { value: this.internalValue }, bubbles: true, composed: true })
    );
  }

  render() {
    const t = resolveThemeTree(textarea, this.theme) as unknown as Record<string, ButtonCssBlock> & {
      charCount: Record<string, ButtonCssBlock>;
    };
    const exceeded = this.maxCharacters !== undefined && this.internalValue.length > this.maxCharacters;
    const cssText = [
      buttonCssBlockToText('textarea', t[this.variant]),
      buttonCssBlockToText('textarea', t[exceeded ? 'error' : this.color]),
      buttonCssBlockToText('textarea', {
        resize: this.resize,
        ...(this.minHeight ? { minHeight: this.minHeight } : {}),
        ...(this.maxHeight ? { maxHeight: this.maxHeight } : {}),
      }),
      buttonCssBlockToText('textarea', this.styles),
      buttonCssBlockToText('.counter', t.charCount.default),
      exceeded ? buttonCssBlockToText('.counter', t.charCount.exceeded) : '',
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    return html`<div part="wrapper">
      <textarea
        part="textarea"
        role="textbox"
        aria-multiline="true"
        aria-label=${this.getAttribute('aria-label') ?? nothing}
        aria-describedby=${this.ariaDescribedBy ?? nothing}
        name=${this.name}
        placeholder=${this.placeholder}
        .value=${this.internalValue}
        ?disabled=${this.disabled}
        ?readonly=${this.readOnly}
        rows=${this.rows ?? nothing}
        maxlength=${this.maxLength ?? nothing}
        @input=${this.input}
        @change=${this.change}
      ></textarea
      >${this.maxCharacters === undefined
        ? nothing
        : html`<span class="counter" part="counter">${this.internalValue.length}/${this.maxCharacters}</span>`}
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-textarea': GdTextarea;
  }
}
