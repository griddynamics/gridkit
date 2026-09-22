import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { input } from 'gd-design-library/tokens';
import {
  resolveThemeTree,
  get,
  createInputStore,
  debounce,
  type InputColorVariantName,
  type DesignCoreTheme,
} from 'gd-design-core';

interface ResolvedInputTokens {
  fontFamily: string | number;
  fontSize: string | number;
  color: string;
  disabledColor: string;
  border: string;
  labelColor: string;
  helperTextColor: string;
  wrapperGap: string | number;
  labelFontSize: string | number;
  labelLineHeight: string | number;
  helperFontSize: string | number;
  helperLineHeight: string | number;
  zIndex: string | number;
  horizontalPadding: string | number;
  borderRadius: string | number;
}

/**
 * Resolves the REAL `input` object (`gd-design-library/tokens`) against `theme` — the
 * single-source-of-truth replacement for the old, hand-mirrored `resolveInputStyle` in
 * `gd-design-core` (deleted; see that package's `tokenResolvers/input.ts` for the exact real
 * paths this reads: `input.wrapper.withGap.gap`, `input.helper.default.{sm,md}`,
 * `input.helper.<variant>.sm.color`, `input.input.default.padding`,
 * `input.input.defaultInteraction['& + .Input__border'].borderRadius`,
 * `input.input.<variant>['& + .Input__border'].border`). `fontFamily`/`fontSize` are the one
 * exception — the real `input.ts` object has neither (the real `<input>` inherits both from the
 * app's global CSS reset), so those two are resolved from the same shared `font.*` theme tokens
 * every other component uses, same as `gd-button.ts`.
 */
function resolveInputTokens(theme: DesignCoreTheme, color: InputColorVariantName): ResolvedInputTokens {
  const resolved = resolveThemeTree(input, theme) as unknown as {
    wrapper: { withGap: { gap: string | number } };
    input: {
      default: {
        color: string;
        padding: string | number;
        '&:not([type="radio"], [type="checkbox"], [type="range"])': { zIndex: string | number };
        '&[readonly], &:disabled': { color: string };
      };
      defaultInteraction: { '& + .Input__border': { borderRadius: string | number } };
    } & Record<InputColorVariantName, { '& + .Input__border': { border: string } }>;
    helper: {
      default: {
        sm: { fontSize: string | number; lineHeight: string | number };
        md: { color: string; fontSize: string | number; lineHeight: string | number };
      };
    } & Record<InputColorVariantName, { sm: { color?: string } }>;
  };

  const inputDefault = resolved.input.default;
  const colorTokens = resolved.input[color] ?? resolved.input.primary;
  const helperColorTokens = resolved.helper[color] ?? resolved.helper.primary;

  return {
    fontFamily: get(theme, 'font.family', '"Fira Sans", sans-serif'),
    fontSize: get(theme, 'font.size.p', '16px'),
    color: inputDefault.color,
    disabledColor: inputDefault['&[readonly], &:disabled'].color,
    border: colorTokens['& + .Input__border'].border,
    labelColor: resolved.helper.default.md.color,
    helperTextColor: helperColorTokens.sm.color ?? resolved.helper.default.md.color,
    wrapperGap: resolved.wrapper.withGap.gap,
    labelFontSize: resolved.helper.default.md.fontSize,
    labelLineHeight: resolved.helper.default.md.lineHeight,
    helperFontSize: resolved.helper.default.sm.fontSize,
    helperLineHeight: resolved.helper.default.sm.lineHeight,
    zIndex: inputDefault['&:not([type="radio"], [type="checkbox"], [type="range"])'].zIndex,
    horizontalPadding: inputDefault.padding,
    borderRadius: resolved.input.defaultInteraction['& + .Input__border'].borderRadius,
  };
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
export class GdInput extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .outer {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .row {
      position: relative;
      display: inline-flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }
    input {
      position: relative;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      color: inherit;
      width: 100%;
      height: 40px;
      box-sizing: border-box;
    }
    input:disabled {
      cursor: default;
    }
    input::placeholder {
      color: var(--gd-input-placeholder-color, #a3a3a3);
    }
    .border,
    .outline {
      position: absolute;
      inset: 0;
      pointer-events: none;
      box-sizing: border-box;
    }
    .border {
      border-style: solid;
    }
    .outline {
      outline-style: none;
    }
    input:focus-visible ~ .outline {
      outline-style: solid;
      outline-width: 2px;
      outline-offset: 3px;
    }
  `;

  /**
   * Form participation (CTORNDSD-646b). Opting in makes `<gd-input>` a form-associated custom
   * element: it appears in `form.elements`, contributes to `FormData` under `name`, participates
   * in constraint validation, and receives `formResetCallback`/`formDisabledCallback`.
   */
  static formAssociated = true;

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) label = '';
  @property({ type: String, attribute: 'helper-text' }) helperText = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) color: InputColorVariantName = 'primary';
  @property({ type: Number, attribute: 'debounce-callback-time' }) debounceCallbackTime?: number;
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  /** Submitted under this key in `FormData`. No `name` means no form submission, same as native. */
  @property({ type: String }) name = '';
  @property({ type: Boolean, reflect: true }) required = false;

  @query('input') private _input!: HTMLInputElement;

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
    if (this._defaultValue === undefined) this._defaultValue = this.value;
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    super.disconnectedCallback();
  }

  firstUpdated() {
    this._input.value = this.value;
    this._syncFormState();
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('debounceCallbackTime')) {
      this._store.getState().setDebounceCallbackTime(this.debounceCallbackTime);
      this._debouncedDispatch = undefined;
    }
  }

  updated(changed: PropertyValues<this>) {
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
    const newValue = (event.target as HTMLInputElement).value;
    this._lastInternalValue = newValue;
    this.value = newValue;
    this._getDebouncedDispatch()(newValue);
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

  render() {
    const resolved = resolveInputTokens(this.theme, this.color);
    const focusColor = (this.theme.colors as { border?: { focus?: string } } | undefined)?.border?.focus ?? '#0069B4';
    const textColor = this.disabled ? resolved.disabledColor : resolved.color;

    const outerStyle = { gap: `${resolved.wrapperGap}` };
    const rowStyle = {
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      color: textColor,
      zIndex: `${resolved.zIndex}`,
      padding: `0 ${resolved.horizontalPadding}`,
      '--gd-input-placeholder-color': resolved.disabledColor,
    };
    const borderStyle = {
      border: resolved.border,
      borderRadius: `${resolved.borderRadius}`,
    };
    const outlineStyle = { outlineColor: focusColor, borderRadius: `${resolved.borderRadius}` };
    // Reuses the SAME resolved.fontFamily as the `<input>` itself (rowStyle above) — the real
    // InputHelper (label/helperText) has no explicit fontFamily of its own either, relying on
    // ambient inheritance from the host app's global reset, which would leave these two spans
    // free to silently diverge from the input's own (explicitly-resolved) font in a standalone
    // render with no such reset present.
    const labelStyle = {
      color: resolved.labelColor,
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.labelFontSize}`,
      lineHeight: `${resolved.labelLineHeight}`,
    };
    const helperStyle = {
      color: resolved.helperTextColor,
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.helperFontSize}`,
      lineHeight: `${resolved.helperLineHeight}`,
    };

    // `part` attributes (CTORNDSD-646b) expose these internals to consumer CSS via
    // `gd-input::part(input)` etc. This is the only sanctioned way to style inside a shadow root
    // from outside it; without it, a consumer's only escape hatch is the `theme` property.
    return html`
      <div class="outer" part="outer" style=${styleMap(outerStyle)}>
        ${this.label
          ? html`<label class="label" part="label" for="control" style=${styleMap(labelStyle)}>${this.label}</label>`
          : nothing}
        <div class="row" part="row" style=${styleMap(rowStyle)}>
          <slot name="adornment-start"></slot>
          <input
            part="input"
            id="control"
            aria-label=${this.label ? nothing : this.placeholder || nothing}
            name=${this.name || nothing}
            ?required=${this.required}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            @input=${this._onInput}
            @mousedown=${this._onMouseDown}
            @keydown=${this._onKeyDown}
            @blur=${this._onBlur}
          />
          <span class="border" part="border" style=${styleMap(borderStyle)}></span>
          <span class="outline" part="outline" style=${styleMap(outlineStyle)}></span>
          <slot name="adornment-end"></slot>
        </div>
        ${this.helperText
          ? html`<span class="helper" part="helper" style=${styleMap(helperStyle)}>${this.helperText}</span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-input': GdInput;
  }
}
