import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { checkbox } from 'gd-design-library/tokens';
import { resolveThemeTree, createCheckboxStore, type CheckboxSizeName, type DesignCoreTheme } from 'gd-design-core';

interface ResolvedCheckboxTokens {
  indicatorSize: number;
  iconSize: number;
  indicatorDefault: { border: string; backgroundColor: string; borderRadius: string | number };
  indicatorChecked: { backgroundColor: string; borderColor: string };
  indicatorIndeterminate: { backgroundColor: string; borderColor: string };
  wrapperGap: string | number;
}

/**
 * Resolves the REAL `checkbox` object (`gd-design-library/tokens`) against `theme` — the
 * single-source-of-truth replacement for the old, hand-mirrored `resolveCheckboxStyle` in
 * `gd-design-core` (deleted; see that package's `tokenResolvers/checkbox.ts`). `size` reads the
 * real `checkbox.size.<sm|md>` scale directly instead of a hand-copied `SIZE_PX` table. No
 * `label` fields are read — `Checkbox.tsx` renders its label as a bare, unstyled span.
 */
function resolveCheckboxTokens(theme: DesignCoreTheme, size: CheckboxSizeName): ResolvedCheckboxTokens {
  const resolved = resolveThemeTree(checkbox, theme) as unknown as {
    wrapper: { default: { gap: string | number } };
    indicator: {
      default: { border: string; backgroundColor: string; borderRadius: string | number };
      checked: { backgroundColor: string; borderColor: string };
      indeterminate: { backgroundColor: string; borderColor: string };
    };
    size: Record<CheckboxSizeName, { width: string; height: string; iconSize: number }>;
  };
  const sizeTokens = resolved.size[size] ?? resolved.size.md;

  return {
    indicatorSize: parseFloat(sizeTokens.width),
    iconSize: sizeTokens.iconSize,
    indicatorDefault: resolved.indicator.default,
    indicatorChecked: resolved.indicator.checked,
    indicatorIndeterminate: resolved.indicator.indeterminate,
    wrapperGap: resolved.wrapper.default.gap,
  };
}

/**
 * Checkbox port (per the implementation plan's Migration Example). Delegates all
 * controlled/uncontrolled + indeterminate state to gd-design-core's `createCheckboxStore`
 * (subscribed in `connectedCallback`) instead of re-deriving it here — the store already
 * collapses `Checkbox.tsx`'s `isControlled` branch into one always-owned `checked` value;
 * a "controlled" consumer just listens for `gd-change` and writes `.checked` back.
 *
 * Boolean-attribute finding: `checked` is declared `attribute: false` on purpose. A real
 * HTML boolean attribute can only be present/absent (true/false) — it cannot represent
 * "unset" the way the store's `checked !== undefined` controlled-check needs. So the
 * controlled/uncontrolled distinction this component preserves is only reachable via the
 * JS property (`el.checked = true`), never via markup (`<gd-checkbox checked>`). Record
 * this as a real constraint, not an oversight: markup-only consumers cannot express
 * "uncontrolled" for a boolean prop, only JS-property consumers (which is exactly the
 * React 19 native property-assignment heuristic path) can.
 */
@customElement('gd-checkbox')
export class GdCheckbox extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    label {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    label[data-disabled] {
      cursor: default;
      opacity: 0.5;
    }
    input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      margin: 0;
    }
    .indicator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    svg {
      display: block;
    }
  `;

  /**
   * Form participation (CTORNDSD-646b). See `_syncFormState` and `formResetCallback` for the one
   * real conflict this creates with the `attribute: false` controlled-value design above.
   */
  static formAssociated = true;

  @property({ attribute: false }) checked: boolean | undefined = undefined;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) size: CheckboxSizeName = 'md';
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  /** Submitted under this key in `FormData`. No `name` means no form submission, same as native. */
  @property({ type: String }) name = '';
  /** Submitted value when checked. Matches native `<input type="checkbox">`, which submits `'on'`. */
  @property({ type: String }) value = 'on';
  @property({ type: Boolean, reflect: true }) required = false;

  @query('input') private _input!: HTMLInputElement;

  private _store: ReturnType<typeof createCheckboxStore> = createCheckboxStore({
    checked: this.checked,
    indeterminate: this.indeterminate,
    disabled: this.disabled,
    onValueChange: (checked) => {
      this.dispatchEvent(new CustomEvent('gd-change', { detail: { checked }, bubbles: true, composed: true }));
    },
  });

  private _unsubscribe?: () => void;
  private readonly _internals: ElementInternals;
  /**
   * The checked state `formResetCallback` restores.
   *
   * **This is where form participation collides with the `attribute: false` design above.** A native
   * `<input type="checkbox">` reads its reset state from the `checked` *attribute*, which is exactly
   * the mechanism this component deliberately does not have — a boolean attribute cannot express
   * "unset", and that distinction is what the store's controlled/uncontrolled check depends on. So
   * the reset default cannot be read from markup at reset time; it is captured once, on first
   * connect, from the initial property value. Consequence: a consumer who assigns `.checked` after
   * mount changes the current state but **not** what `form.reset()` restores — divergent from
   * native, where setting the attribute changes both.
   */
  private _defaultChecked?: boolean;

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

  /**
   * Fired by the browser on `form.reset()` / `<button type="reset">`.
   *
   * Uses the store's `resetTo`, **not** `syncControlledValue`. That distinction is a real bug found
   * by measurement, not a stylistic choice: `syncControlledValue(undefined)` deliberately preserves
   * the current `checked` (faithful to React, where controlled → uncontrolled keeps the value), so
   * calling it here left the box checked and kept submitting `'on'` after a reset. `resetTo` is the
   * action that expresses "restore to the default", and it fires no `onValueChange` — native
   * checkboxes emit no `change` event on form reset.
   */
  formResetCallback() {
    this.checked = this._defaultChecked;
    this._store.getState().resetTo(this._defaultChecked);
    this._syncFormState();
  }

  /** Fired when an ancestor `<fieldset disabled>` toggles. */
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  /** Fired on session restore / autofill. */
  formStateRestoreCallback(state: string | File | FormData | null) {
    const restored = state !== null;
    this.checked = restored;
    this._store.getState().syncControlledValue(restored);
    this._syncFormState();
  }

  /**
   * Pushes the current state into the form and recomputes constraint validity.
   *
   * Matches native checkbox submission semantics: an unchecked box submits **nothing** (the key is
   * absent from `FormData`), not an empty string — hence `setFormValue(null)`.
   */
  private _syncFormState() {
    const isChecked = this._store.getState().checked === true;
    this._internals.setFormValue(isChecked ? this.value : null);

    if (this.required && !isChecked) {
      this._internals.setValidity(
        { valueMissing: true },
        'Please check this box if you want to proceed.',
        this._input ?? undefined
      );
    } else {
      this._internals.setValidity({});
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = this._store.subscribe(() => {
      this.requestUpdate();
      this._syncFormState();
    });
    if (this._defaultChecked === undefined) this._defaultChecked = this.checked;
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    super.disconnectedCallback();
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('checked')) this._store.getState().syncControlledValue(this.checked);
    if (changed.has('disabled')) this._store.getState().setDisabled(this.disabled);
  }

  firstUpdated() {
    this._syncFormState();
  }

  updated(changed: PropertyValues<this>) {
    if ((changed.has('indeterminate') || !changed.size) && this._input) {
      // Direct DOM-API write — same trick as the React original (`inputRef.current.indeterminate = ...`),
      // since `indeterminate` has no HTML attribute or Lit reactive-property equivalent on <input>.
      this._input.indeterminate = this.indeterminate;
    }
    if (changed.has('required') || changed.has('value') || changed.has('checked')) this._syncFormState();
  }

  private _onChange(event: Event) {
    if (this.disabled) return;
    this._store.getState().handleChange((event.target as HTMLInputElement).checked);
  }

  render() {
    const state = this._store.getState();
    const resolved = resolveCheckboxTokens(this.theme, this.size);
    const currentChecked = state.checked;

    const wrapperStyle = { gap: `${resolved.wrapperGap}` };

    const indicatorStyle = {
      width: `${resolved.indicatorSize}px`,
      height: `${resolved.indicatorSize}px`,
      borderRadius: `${resolved.indicatorDefault.borderRadius}`,
      border: resolved.indicatorDefault.border,
      backgroundColor: resolved.indicatorDefault.backgroundColor,
      ...(this.indeterminate
        ? {
            backgroundColor: resolved.indicatorIndeterminate.backgroundColor,
            borderColor: resolved.indicatorIndeterminate.borderColor,
          }
        : currentChecked
          ? {
              backgroundColor: resolved.indicatorChecked.backgroundColor,
              borderColor: resolved.indicatorChecked.borderColor,
            }
          : {}),
    };

    return html`
      <label part="label" ?data-disabled=${this.disabled} style=${styleMap(wrapperStyle)}>
        <input
          part="input"
          type="checkbox"
          .checked=${currentChecked}
          ?disabled=${this.disabled}
          ?required=${this.required}
          aria-checked=${this.indeterminate ? 'mixed' : currentChecked}
          @change=${this._onChange}
        />
        <span class="indicator" part="indicator" style=${styleMap(indicatorStyle)}>
          ${this.indeterminate
            ? html`<svg width=${resolved.iconSize} height=${resolved.iconSize} viewBox="0 0 10 10" fill="none">
                <path d="M1 5H9" stroke="white" stroke-width="1.5" stroke-linecap="round" />
              </svg>`
            : currentChecked
              ? html`<svg width=${resolved.iconSize} height=${resolved.iconSize} viewBox="0 0 10 10" fill="none">
                  <path
                    d="M1.5 5L4 7.5L8.5 2.5"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>`
              : nothing}
        </span>
        <!-- Bare span, no style — matches Checkbox.tsx's real unstyled label span exactly:
             no css/style prop at all, purely ambient-inherited color/font, which crosses
             the shadow boundary the same way regular DOM inheritance does. -->
        <span><slot></slot></span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-checkbox': GdCheckbox;
  }
}
