import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  resolveInputStyle,
  createInputStore,
  debounce,
  type InputColorVariantName,
  type DesignCoreTheme,
} from 'gd-design-core';

/** libs/ui/src/tokens/input.ts's `helper` section: the label (size=md) always renders
 *  `colors.text.default` regardless of `color` — only the helperText (size=sm) is
 *  color-variant-dependent. Not exposed by `resolveInputStyle` (Input-structural chrome,
 *  not shared across adapters), so hardcoded here matching the real token values exactly. */
const HELPER_TEXT_COLOR: Record<InputColorVariantName, string> = {
  primary: '#000000',
  success: '#1F843A',
  warning: '#FFB800',
  error: '#BD1919',
};

/**
 * CTORNDSD-581 Input port (per the implementation plan's Migration Example) — the highest-risk
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
      gap: 4px;
    }
    .label,
    .helper {
      font-family: inherit;
    }
    .label {
      font-size: 14px;
      line-height: 20px;
    }
    .helper {
      font-size: 12px;
      line-height: 16px;
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
      z-index: 1;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      color: inherit;
      width: 100%;
      height: 40px;
      box-sizing: border-box;
      padding: 0 8px;
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
      border-radius: 0;
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

  @property({ type: String }) value = '';
  @property({ type: String }) placeholder = '';
  @property({ type: String }) label = '';
  @property({ type: String, attribute: 'helper-text' }) helperText = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) color: InputColorVariantName = 'primary';
  @property({ type: Number, attribute: 'debounce-callback-time' }) debounceCallbackTime?: number;
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @query('input') private _input!: HTMLInputElement;

  private _store = createInputStore({ debounceCallbackTime: this.debounceCallbackTime });
  private _unsubscribe?: () => void;
  /** Value last written into the DOM by the user's own keystroke — distinguishes an
   *  internal echo (safe, already live in the DOM) from an external prop write (guarded). */
  private _lastInternalValue = this.value;
  private _debouncedDispatch?: (value: string) => void;

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = this._store.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    super.disconnectedCallback();
  }

  firstUpdated() {
    this._input.value = this.value;
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('debounceCallbackTime')) {
      this._store.getState().setDebounceCallbackTime(this.debounceCallbackTime);
      this._debouncedDispatch = undefined;
    }
  }

  updated(changed: PropertyValues<this>) {
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
    const resolved = resolveInputStyle(this.theme, this.color);
    const focusColor = (this.theme.colors as { border?: { focus?: string } } | undefined)?.border?.focus ?? '#0069B4';
    const textColor = this.disabled ? resolved.disabledColor : resolved.color;

    const rowStyle = {
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      color: textColor,
      '--gd-input-placeholder-color': resolved.disabledColor,
    };
    const borderStyle = { borderWidth: `${resolved.borderWidth}`, borderColor: resolved.borderColor };
    const outlineStyle = { outlineColor: focusColor };
    const labelStyle = { color: '#000000' };
    const helperStyle = { color: HELPER_TEXT_COLOR[this.color] ?? HELPER_TEXT_COLOR.primary };

    return html`
      <div class="outer">
        ${this.label ? html`<span class="label" style=${styleMap(labelStyle)}>${this.label}</span>` : nothing}
        <div class="row" style=${styleMap(rowStyle)}>
          <slot name="adornment-start"></slot>
          <input
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            @input=${this._onInput}
            @mousedown=${this._onMouseDown}
            @keydown=${this._onKeyDown}
            @blur=${this._onBlur}
          />
          <span class="border" style=${styleMap(borderStyle)}></span>
          <span class="outline" style=${styleMap(outlineStyle)}></span>
          <slot name="adornment-end"></slot>
        </div>
        ${this.helperText
          ? html`<span class="helper" style=${styleMap(helperStyle)}>${this.helperText}</span>`
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
