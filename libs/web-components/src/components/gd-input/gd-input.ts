import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  resolveThemeTree,
  get,
  createInputStore,
  debounce,
  type InputColorVariantName,
  type DesignCoreTheme,
} from 'gd-design-core';
import { input } from 'gd-design-library/tokens';

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

    return html`
      <div class="outer" style=${styleMap(outerStyle)}>
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
