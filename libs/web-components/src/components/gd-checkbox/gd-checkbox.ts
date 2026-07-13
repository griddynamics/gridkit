import { LitElement, html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { resolveCheckboxStyle, createCheckboxStore, type CheckboxSizeName, type DesignCoreTheme } from 'gd-design-core';

/**
 * CTORNDSD-581 Checkbox port (per the implementation plan's Migration Example). Delegates all
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
      gap: 8px;
      cursor: pointer;
    }
    label[data-disabled] {
      cursor: not-allowed;
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

  @property({ attribute: false }) checked: boolean | undefined = undefined;
  @property({ type: Boolean, reflect: true }) indeterminate = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) size: CheckboxSizeName = 'md';
  @property({ attribute: false }) theme: DesignCoreTheme = {};

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

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = this._store.subscribe(() => this.requestUpdate());
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    super.disconnectedCallback();
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('checked')) this._store.getState().syncControlledValue(this.checked);
    if (changed.has('disabled')) this._store.getState().setDisabled(this.disabled);
  }

  updated(changed: PropertyValues<this>) {
    if ((changed.has('indeterminate') || !changed.size) && this._input) {
      // Direct DOM-API write — same trick as the React original (`inputRef.current.indeterminate = ...`),
      // since `indeterminate` has no HTML attribute or Lit reactive-property equivalent on <input>.
      this._input.indeterminate = this.indeterminate;
    }
  }

  private _onChange(event: Event) {
    if (this.disabled) return;
    this._store.getState().handleChange((event.target as HTMLInputElement).checked);
  }

  render() {
    const state = this._store.getState();
    const resolved = resolveCheckboxStyle(this.theme, this.size);
    const currentChecked = state.checked;

    const indicatorStyle = {
      width: `${resolved.indicatorSize}px`,
      height: `${resolved.indicatorSize}px`,
      borderRadius: `${resolved.indicatorDefault.borderRadius}`,
      borderWidth: `${resolved.indicatorDefault.borderWidth}`,
      borderStyle: 'solid',
      borderColor: resolved.indicatorDefault.borderColor,
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
      <label ?data-disabled=${this.disabled}>
        <input
          type="checkbox"
          .checked=${currentChecked}
          ?disabled=${this.disabled}
          aria-checked=${this.indeterminate ? 'mixed' : currentChecked}
          @change=${this._onChange}
        />
        <span class="indicator" style=${styleMap(indicatorStyle)}>
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
