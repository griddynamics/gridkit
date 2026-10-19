import { css, html, nothing, type PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { textarea } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

export interface GdTextareaResizeDetail {
  width: number;
  height: number;
}

type TextareaTokens = Record<string, ButtonCssBlock> & { charCount: Record<string, ButtonCssBlock> };

@customElement('gd-textarea')
export class GdTextarea extends GdThemedElement {
  /**
   * Document-level resets do not reach a shadow root, so the equivalent reset lives here with zero
   * specificity (`:where`): the resolved `textarea` tokens win over it exactly as they do in the
   * document. The host renders no box of its own; the native control (or the counter wrapper) is the
   * layout box, which keeps the element interchangeable with a bare `<textarea>` in any flow.
   */
  static styles = css`
    :host {
      display: contents;
    }
    :where(*, ::before, ::after) {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
    }
    :where(textarea) {
      font-family: inherit;
      font-size: 100%;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
      resize: vertical;
    }
    :where(textarea)::placeholder {
      opacity: 1;
    }
    :where(:disabled) {
      cursor: default;
    }
  `;

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
  @state() private internalValue = '';
  @query('textarea') private control!: HTMLTextAreaElement;
  private _initialized = false;
  /** Initial text child: the platform's default value, so the markup carries the same content as a bare `<textarea>`. */
  private _initialText = '';
  private _tokenSheet?: CSSStyleSheet;
  private _tokenText = '';
  private _resizeObserver?: ResizeObserver;
  private _resizeSeen = false;

  connectedCallback() {
    super.connectedCallback();
    // Uncontrolled initial content (`defaultValue`) is used until a `value` is supplied.
    if (!this._initialized) {
      this._initialized = true;
      this.internalValue = this.value ?? this.defaultValue;
      this._initialText = this.value === undefined ? this.defaultValue : '';
    }
  }
  disconnectedCallback() {
    this._resizeObserver?.disconnect();
    this._resizeObserver = undefined;
    super.disconnectedCallback();
  }
  protected firstUpdated() {
    // Raw text elements cannot hold template expressions during server rendering, so set the text child here.
    // The live value is already dirty, so this only changes the markup (and what a form reset restores).
    this.control.defaultValue = this._initialText;
    if (this.autoFocus) this.control.focus();
    this.adjustHeight();
    // Report manual resizes, ignoring the initial observation like a user-driven resize callback would.
    if (typeof ResizeObserver !== 'undefined') {
      this._resizeObserver = new ResizeObserver(() => {
        if (!this._resizeSeen) {
          this._resizeSeen = true;
          return;
        }
        this.dispatchEvent(
          new CustomEvent<GdTextareaResizeDetail>('gd-resize', {
            detail: { width: this.control.scrollWidth, height: this.control.scrollHeight },
            bubbles: true,
            composed: true,
          })
        );
      });
      this._resizeObserver.observe(this.control);
    }
  }
  protected willUpdate(changed: PropertyValues<this>) {
    if (changed.has('value') && this.value !== undefined) this.internalValue = this.value;
    const t = resolveThemeTree(textarea, this.theme) as unknown as TextareaTokens;
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
    if (this.shadowRoot && cssText !== this._tokenText && typeof CSSStyleSheet !== 'undefined') {
      this._tokenText = cssText;
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets.filter((item) => item !== this._tokenSheet),
        sheet,
      ];
      this._tokenSheet = sheet;
    }
  }
  protected updated() {
    this.adjustHeight();
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
    const control = html`<textarea
      part="textarea"
      role="textbox"
      aria-multiline="true"
      aria-label=${this.getAttribute('aria-label') ?? nothing}
      aria-describedby=${this.ariaDescribedBy ?? nothing}
      name=${this.name}
      placeholder=${this.placeholder || nothing}
      .value=${this.internalValue}
      ?disabled=${this.disabled}
      ?readonly=${this.readOnly}
      rows=${this.rows ?? nothing}
      maxlength=${this.maxLength ?? nothing}
      @input=${this.input}
      @change=${this.change}
    ></textarea>`;
    if (this.maxCharacters === undefined) return control;
    return html`<div part="wrapper">
      ${control}<span class="counter" part="counter">${this.internalValue.length}/${this.maxCharacters}</span>
    </div>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-textarea': GdTextarea;
  }
}
