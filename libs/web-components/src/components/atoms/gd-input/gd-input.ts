import { css, nothing, type PropertyValues } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { input } from 'gd-design-library/tokens';
import {
  resolveThemeTree,
  get,
  createInputStore,
  debounce,
  buttonCssBlockToText,
  cssPropertyValueToText,
  type ButtonCssBlock,
  type InputColorVariantName,
  type ThemeLike,
} from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

type CssBlock = ButtonCssBlock;

interface InputTokenTree {
  wrapper: { default: CssBlock; withGap: CssBlock };
  input: { default: CssBlock; defaultInteraction: CssBlock; mouseInteraction: CssBlock } & Record<
    InputColorVariantName,
    CssBlock
  >;
  helper: {
    default: { sm: CssBlock; md: CssBlock };
  } & Record<InputColorVariantName, { sm: CssBlock; md: CssBlock }>;
  adornment: { default: CssBlock };
}

/** Variants without a focus border/outline: native-looking controls draw their own focus ring. */
const FOCUS_EXCLUDED_VARIANTS = ['checkbox', 'radio', 'range'];

/**
 * The real `Input` draws everything through the `input` token tree (`gd-design-library/tokens`).
 * The shadow root renders the same DOM shape (wrapper, optional label, field row, native control
 * followed by the `Input__border` and `Input__outline` siblings, optional helper text) and the
 * resolved token tree is serialised verbatim, so values never drift from the shared design tokens.
 * Document-level resets do not reach a shadow root, so the equivalent reset lives in `static styles`
 * with zero specificity (`:where`) to let token rules win exactly as they do in the document.
 */
function inputStyleText(theme: ThemeLike, color: InputColorVariantName, isMouseInteraction: boolean): string {
  const tokens = resolveThemeTree(input, theme) as unknown as InputTokenTree;
  const colorKey = tokens.input[color] ? color : 'primary';
  return [
    buttonCssBlockToText('.wrapper', tokens.wrapper.default),
    buttonCssBlockToText('.wrapper.with-gap', tokens.wrapper.withGap),
    buttonCssBlockToText('input', tokens.input.default),
    buttonCssBlockToText('input', isMouseInteraction ? tokens.input.mouseInteraction : tokens.input.defaultInteraction),
    buttonCssBlockToText('input', tokens.input[colorKey]),
    buttonCssBlockToText('.label', tokens.helper.default.md),
    buttonCssBlockToText('.label', tokens.helper.primary.md),
    buttonCssBlockToText('.helper', tokens.helper.default.sm),
    buttonCssBlockToText('.helper', tokens.helper[colorKey].sm),
    buttonCssBlockToText('.adornment', tokens.adornment.default),
  ].join('');
}

/**
 * Input port (per the implementation plan's Migration Example) — the highest-risk
 * small atom: a controlled `value` over a custom-element boundary has no reconciliation
 * layer protecting cursor position the way React's controlled-input diffing does.
 *
 * Cursor-jump mitigation (must be empirically verified, not assumed):
 * `.value` is never template-bound directly (`.value=${this.value}` would let every
 * external property write clobber the live DOM value unconditionally). Instead this
 * component tracks whether the pending `value` change originated from the user's own
 * keystroke (`_lastInternalValue`) or from an external property/attribute write. An
 * external write while the native `<input>` still has focus is dropped rather than
 * applied — the concrete activeElement-guard from the plan — and only re-applied once
 * the input actually loses focus. Record in FINDINGS.md whether this drop-while-focused
 * behavior is itself an acceptable trade (vs. the alternative of letting the cursor jump).
 *
 * Visual-fidelity fixes (found while comparing against the real Storybook Input, the
 * originally reported gap): the real component draws its visible border on an
 * absolutely-positioned sibling `<span>` (`.Input__border`), not the input's own CSS
 * border, and layers a second sibling (`.Input__outline`) for the focus ring — both with
 * **square corners** (`radius.none`), not rounded. It also renders an optional `label`
 * (above, 14px/#000) and `helperText` (below, 12px, color mapped by `color`) — entirely
 * missing from the original port. `:focus-visible` is used natively here for the ring
 * (the real component manually mirrors keyboard-vs-mouse interaction since it predates
 * broad `:focus-visible` support), which is a closer, simpler equivalent, not a lesser one.
 */
@customElement('gd-input')
export class GdInput extends GdThemedElement {
  static styles = css`
    :host {
      display: contents;
    }
    :where(*, ::before, ::after) {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
    }
    :where(input) {
      font-family: inherit;
      font-size: 100%;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
    }
    :where([type='search']) {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }
    :where(::-webkit-search-decoration) {
      -webkit-appearance: none;
    }
    :where(::-webkit-inner-spin-button, ::-webkit-outer-spin-button) {
      height: auto;
    }
    :where(input)::placeholder {
      opacity: 1;
    }
    :where(:disabled) {
      cursor: default;
    }
    :where(label) {
      cursor: auto;
    }
  `;

  /**
   * Form participation (CTORNDSD-646b). Opting in makes `<gd-input>` a form-associated custom
   * element: it appears in `form.elements`, contributes to `FormData` under `name`, participates
   * in constraint validation, and receives `formResetCallback`/`formDisabledCallback`.
   */
  static formAssociated = true;

  @property({ type: String }) value = '';
  @property({ type: String }) type = 'text';
  /** React calls the native input type `variant`; keep `type` as a compatibility alias. */
  @property({ type: String }) variant?: string;
  @property({ type: String, attribute: 'default-value' }) defaultValue?: string;
  @property({ type: Boolean, reflect: true }) readOnly = false;
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean, attribute: 'default-checked' }) defaultChecked = false;
  @property({ type: String }) width?: string;
  /** Element rendered as the outer wrapper: a `label` (default) or a plain `span`. */
  @property({ type: String, attribute: 'wrapper-as' }) wrapperAs: 'label' | 'span' = 'label';
  /** Extra class names applied to the wrapper element (React's `className`). */
  @property({ type: String, attribute: 'wrapper-class' }) wrapperClass = '';
  /** Component-token layout overrides for composed ports; never consumer literal CSS. */
  @property({ attribute: false }) styles: Record<string, string | number> = {};
  @property({ attribute: false }) inputStyles: Record<string, string | number> = {};
  @property({ attribute: false }) inputStyleRules: ButtonCssBlock = {};
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
  @property({ type: String, attribute: 'aria-valuemin' }) ariaValueMin: string | null = null;
  @property({ type: String, attribute: 'aria-valuemax' }) ariaValueMax: string | null = null;
  /** React's boolean `ariaRequired` maps to the platform's string ARIA reflection. */
  @property({ type: Boolean, attribute: 'aria-required' }) ariaRequiredValue = false;
  @property({ type: String, attribute: 'aria-describedby' }) ariaDescribedBy: string | null = null;
  @property({ type: String }) inputmode?: string;
  @property({ type: String }) role: string | null = null;
  @property({ type: Number }) tabIndex = 0;
  @property({ type: String }) placeholder = '';
  @property({ type: String }) label = '';
  @property({ type: String, attribute: 'helper-text' }) helperText = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) color: InputColorVariantName = 'primary';
  @property({ type: Number, attribute: 'debounce-callback-time' }) debounceCallbackTime?: number;
  /** Submitted under this key in `FormData`. No `name` means no form submission, same as native. */
  @property({ type: String }) name = '';
  @property({ type: Boolean, reflect: true }) required = false;

  @query('input') private _input!: HTMLInputElement;
  private _ruleSheet?: CSSStyleSheet;
  private _ruleText = '';
  private _tokenSheet?: CSSStyleSheet;
  private _tokenText = '';
  private _slotObserver?: MutationObserver;

  private _store = createInputStore({ debounceCallbackTime: this.debounceCallbackTime });
  private _unsubscribe?: () => void;
  /** Value last written into the DOM by the user's own keystroke — distinguishes an
   *  internal echo (safe, already live in the DOM) from an external prop write (guarded). */
  private _lastInternalValue = this.value;
  private _debouncedDispatch?: (value: string) => void;
  private readonly _internals: ElementInternals;
  /**
   * The value `formResetCallback` restores. Unlike native `<input>`, which reads its reset value
   * from the `value` *attribute* at reset time, a custom element's property may have been written
   * imperatively with no attribute present — so the default is captured once, on first connect,
   * from whatever the initial property/attribute produced.
   */
  private _defaultValue?: string;

  constructor() {
    super();
    // Must be called in the constructor — attachInternals() throws if called later.
    this._internals = this.attachInternals();
  }

  /** The owning `<form>`, or null. Mirrors `HTMLInputElement.form`. */
  get form(): HTMLFormElement | null {
    return this._internals.form;
  }

  get validity(): ValidityState {
    return this._internals.validity;
  }

  get validationMessage(): string {
    return this._internals.validationMessage;
  }

  get willValidate(): boolean {
    return this._internals.willValidate;
  }

  checkValidity(): boolean {
    return this._internals.checkValidity();
  }

  reportValidity(): boolean {
    return this._internals.reportValidity();
  }

  /** Fired by the browser on `form.reset()` / `<button type="reset">`. */
  formResetCallback() {
    this.value = this._defaultValue ?? '';
    this._lastInternalValue = this.value;
    if (this._input) this._input.value = this.value;
    this._syncFormState();
  }

  /** Fired when an ancestor `<fieldset disabled>` toggles. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /** Fired on session restore / autofill. */
  formStateRestoreCallback(state: string | File | FormData | null) {
    if (typeof state === 'string') {
      this.value = state;
      this._lastInternalValue = state;
      if (this._input) this._input.value = state;
      this._syncFormState();
    }
  }

  /** Pushes the current value into the form and recomputes constraint validity. */
  private _syncFormState() {
    this._internals.setFormValue(this.value);

    if (this.required && this.value === '') {
      this._internals.setValidity({ valueMissing: true }, 'Please fill out this field.', this._input ?? undefined);
    } else {
      this._internals.setValidity({});
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = this._store.subscribe(() => this.requestUpdate());
    // Adornments are optional slotted children; the adornment wrappers only render when one exists.
    this._slotObserver = new MutationObserver(() => this.requestUpdate());
    this._slotObserver.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'], subtree: false });
    if (this._defaultValue === undefined) {
      this._defaultValue = this.defaultValue ?? this.value;
      // Uncontrolled initial content (React's `defaultValue`): shown until a `value` is supplied.
      if (!this.value && this.defaultValue) this.value = this._lastInternalValue = this.defaultValue;
    }
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    this._slotObserver?.disconnect();
    super.disconnectedCallback();
  }

  firstUpdated() {
    this._input.value = this.value;
    if (this.defaultChecked && !this.checked) this.checked = true;
    this._syncFormState();
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('debounceCallbackTime')) {
      this._store.getState().setDebounceCallbackTime(this.debounceCallbackTime);
      this._debouncedDispatch = undefined;
    }
    const type = this.variant ?? this.type;
    const tokenText = inputStyleText(
      this.theme,
      this.color,
      this._store.getState().isMouseInteraction && !FOCUS_EXCLUDED_VARIANTS.includes(type)
    );
    if (this.shadowRoot && tokenText !== this._tokenText) {
      this._tokenText = tokenText;
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(tokenText);
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets.filter((item) => item !== this._tokenSheet),
        sheet,
      ];
      this._tokenSheet = sheet;
    }
  }

  updated(changed: PropertyValues<this>) {
    const cssText = buttonCssBlockToText('input', this.inputStyleRules);
    if (this.shadowRoot && cssText !== this._ruleText) {
      this._ruleText = cssText;
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [
        ...this.shadowRoot.adoptedStyleSheets.filter((item) => item !== this._ruleSheet),
        sheet,
      ];
      this._ruleSheet = sheet;
    }
    // Form state tracks `value` and `required` regardless of the cursor guard below: the guard
    // exists to protect the *DOM input's* cursor, not to withhold the value from the form.
    if (changed.has('value') || changed.has('required')) this._syncFormState();

    if (!changed.has('value') || !this._input) return;

    if (this.value === this._lastInternalValue) return; // already live in the DOM from the keystroke itself

    const isFocused = this.shadowRoot?.activeElement === this._input;
    if (isFocused) return; // activeElement guard: drop the external write rather than jump the cursor

    this._input.value = this.value;
    this._lastInternalValue = this.value;
  }

  private _dispatchValue(value: string) {
    this.dispatchEvent(new CustomEvent('gd-input', { detail: { value }, bubbles: true, composed: true }));
  }

  private _getDebouncedDispatch(): (value: string) => void {
    const ms = this._store.getState().debounceCallbackTime;
    if (typeof ms !== 'number') return (value) => this._dispatchValue(value);
    if (!this._debouncedDispatch) this._debouncedDispatch = debounce((value: string) => this._dispatchValue(value), ms);
    return this._debouncedDispatch;
  }

  private _onInput(event: Event) {
    const control = event.target as HTMLInputElement;
    const newValue = control.value;
    this.checked = control.checked;
    this._syncRadioGroup(control);
    this._lastInternalValue = newValue;
    this.value = newValue;
    this._getDebouncedDispatch()(newValue);
    this.dispatchEvent(
      new CustomEvent('gd-change', {
        detail: { value: newValue, checked: control.checked },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onMouseDown() {
    this._store.getState().registerMouseDown();
  }

  private _onKeyDown(event: KeyboardEvent) {
    this._store.getState().registerKeyDown(event.key === 'Tab');
  }

  private _onBlur() {
    this._store.getState().registerBlur();
    // Any external value dropped while focused (activeElement guard above) is reconciled here.
    if (this.value !== this._input.value) {
      this._input.value = this.value;
      this._lastInternalValue = this.value;
    }
  }

  private _hasSlotted(name: string) {
    // Light-DOM children do not exist during server rendering, where no adornment can be detected.
    return typeof this.querySelector === 'function' && Boolean(this.querySelector(`:scope > [slot="${name}"]`));
  }

  /** Native radio groups do not span shadow roots, so uncheck sibling radios sharing this `name`. */
  private _syncRadioGroup(control: HTMLInputElement) {
    if (control.type !== 'radio' || !control.checked || !this.name) return;
    const root = this.getRootNode() as Document | ShadowRoot;
    for (const other of Array.from(root.querySelectorAll<GdInput>('gd-input'))) {
      if (other !== this && other.name === this.name && (other.variant ?? other.type) === 'radio')
        other.checked = false;
    }
  }

  render() {
    const inputType = this.variant ?? this.type;
    const showFocus = !FOCUS_EXCLUDED_VARIANTS.includes(inputType);
    const hasHelpers = Boolean(this.label || this.helperText);
    const asLabel = this.wrapperAs !== 'span';
    const controlId = this.id ? `${this.id}-control` : 'control';
    const wrapperStyle = {
      fontFamily: `${get(this.theme, 'font.family', '"Fira Sans", sans-serif')}`,
      ...(this.width ? { width: this.width } : {}),
      ...Object.fromEntries(
        Object.entries(this.styles).map(([name, value]) => [name, cssPropertyValueToText(name, value)])
      ),
    };

    const hasStart = this._hasSlotted('adornment-start');
    const hasEnd = this._hasSlotted('adornment-end');
    const labelTemplate = this.label ? html`<span class="label" part="label" id="label">${this.label}</span>` : nothing;

    // `part` attributes expose these internals to consumer CSS via `gd-input::part(input)` etc.
    // This is the only sanctioned way to style inside a shadow root from outside it; without it,
    // a consumer's only escape hatch is the `theme` property.
    const content = html`
      ${labelTemplate}
      <span class="wrapper" part="row" style="width: 100%">
        ${hasStart
          ? html`<span class="adornment" part="adornment-start"><slot name="adornment-start"></slot></span>`
          : nothing}
        <input
          part="input"
          id=${controlId}
          type=${inputType}
          style=${styleMap(this.inputStyles)}
          aria-label=${this.ariaLabel ?? (this.label ? nothing : this.placeholder || nothing)}
          aria-valuemin=${this.ariaValueMin ?? nothing}
          aria-valuemax=${this.ariaValueMax ?? nothing}
          aria-required=${String(this.ariaRequiredValue)}
          aria-describedby=${this.ariaDescribedBy ?? (this.helperText ? 'helper' : nothing)}
          inputmode=${this.inputmode ?? nothing}
          role=${this.role ?? nothing}
          tabindex=${this.tabIndex}
          name=${this.name || nothing}
          ?required=${this.required}
          ?readonly=${this.readOnly}
          .checked=${this.checked}
          placeholder=${this.placeholder || nothing}
          ?disabled=${this.disabled}
          @input=${this._onInput}
          @mousedown=${this._onMouseDown}
          @keydown=${this._onKeyDown}
          @blur=${this._onBlur}
        />
        ${showFocus
          ? html`<span class="Input__border" part="border"></span><span class="Input__outline" part="outline"></span>`
          : nothing}
        ${hasEnd
          ? html`<span class="adornment" part="adornment-end"><slot name="adornment-end"></slot></span>`
          : nothing}
      </span>
      ${this.helperText
        ? html`<span class="helper" part="helper" id=${this.ariaDescribedBy ?? 'helper'}>${this.helperText}</span>`
        : nothing}
    `;

    const tag = unsafeStatic(asLabel ? 'label' : 'span');
    return staticHtml`<${tag}
      class="outer wrapper ${hasHelpers ? 'with-gap' : ''} ${this.wrapperClass}"
      part="outer"
      for=${asLabel ? controlId : nothing}
      aria-labelledby=${!asLabel && this.label ? 'label' : nothing}
      style=${styleMap(wrapperStyle)}
    >${content}</${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-input': GdInput;
  }
}
