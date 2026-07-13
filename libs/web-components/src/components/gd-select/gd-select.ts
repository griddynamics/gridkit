import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  resolveSelectStyle,
  createSelectStore,
  type InputColorVariantName,
  type SelectOption,
  type DesignCoreTheme,
} from 'gd-design-core';

/**
 * CTORNDSD-581 Select port (per the implementation plan's Migration Example) — reduced-scope PoC:
 * single-select only, no search, fixed-below positioning. Explicitly deferred from this
 * PoC: multi-select, search filtering, full keyboard navigation parity (see FINDINGS.md
 * for what a full-parity port would additionally require).
 *
 * Platform-native replacement evaluated here: the HTML `popover` attribute gives native
 * top-layer rendering plus light-dismiss (outside-click/Escape close) for free, replacing
 * the React original's hand-rolled Portal + `document.addEventListener` outside-click
 * logic. Positioning is still computed manually via `getBoundingClientRect()` on open
 * (fixed-below only, no top-flip) — CSS Anchor Positioning could replace that too, but
 * its browser-support bar is higher than `popover`'s; record which one this repo's actual
 * browser-support matrix can rely on rather than assuming evergreen-only support.
 *
 * Visual-fidelity fixes (found while comparing against the real Storybook Select): the
 * trigger arrow is a rotating SVG chevron (transform 0.3s ease), not swapped unicode
 * glyphs — the real `arrowDown` icon asset isn't ported, so this is a hand-drawn
 * approximation, consistent with Checkbox's check/minus icons. Trigger and dropdown have
 * **square corners** (no radius token at all on either in the real tokens) and the
 * dropdown gets the real `boxShadow` instead of none. `emptyItemsResult` is 100%
 * consumer-supplied content in the real component — no default "No options" text here.
 */
@customElement('gd-select')
export class GdSelect extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .wrapper {
      position: relative;
      display: inline-block;
    }
    .trigger {
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      box-sizing: border-box;
      font: inherit;
      cursor: pointer;
    }
    .trigger:disabled {
      cursor: not-allowed;
    }
    .dropdown {
      margin: 0;
      box-sizing: border-box;
      overflow-y: auto;
    }
    .dropdown:not(:popover-open) {
      display: none;
    }
    .option {
      cursor: pointer;
      padding: 8px;
    }
    .option[aria-selected='true'] {
      font-weight: 600;
    }
    .option:hover {
      background-color: var(--gd-select-hover-bg, #fff7e5);
    }
    .arrow {
      display: inline-flex;
      transition: transform 0.3s ease;
      transform: rotate(0deg);
    }
    .arrow[data-open] {
      transform: rotate(180deg);
    }
  `;

  @property({ type: Array }) items: SelectOption[] = [];
  @property({ attribute: false }) value: SelectOption | null = null;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) color: InputColorVariantName = 'primary';
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @query('.trigger') private _trigger!: HTMLButtonElement;
  @query('.dropdown') private _dropdown!: HTMLElement;

  private _store = createSelectStore({ disabled: this.disabled, value: this.value });
  private _unsubscribe?: () => void;

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = this._store.subscribe((state, prevState) => {
      this.requestUpdate();
      if (state.isOpen !== prevState.isOpen) this._syncPopover(state.isOpen);
    });
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    super.disconnectedCallback();
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('value')) this._store.getState().syncExternalValue(this.value);
    if (changed.has('disabled')) this._store.getState().setDisabled(this.disabled);
  }

  private _syncPopover(isOpen: boolean) {
    if (!this._dropdown) return;
    if (isOpen) {
      this._positionDropdown();
      if (!this._dropdown.matches(':popover-open')) this._dropdown.showPopover();
    } else if (this._dropdown.matches(':popover-open')) {
      this._dropdown.hidePopover();
    }
  }

  private _positionDropdown() {
    const rect = this._trigger.getBoundingClientRect();
    this._dropdown.style.position = 'fixed';
    this._dropdown.style.top = `${rect.bottom + 2}px`;
    this._dropdown.style.left = `${rect.left}px`;
    this._dropdown.style.width = `${rect.width}px`;
  }

  /** Native light-dismiss (outside-click/Escape) fires this without going through `_toggle()`. */
  private _onDropdownToggle(event: Event & { newState?: 'open' | 'closed' }) {
    if (event.newState === 'closed' && this._store.getState().isOpen) this._store.getState().close();
  }

  private _toggleOpen() {
    if (this.disabled) return;
    this._store.getState().toggle();
  }

  private _select(option: SelectOption) {
    const nextValue = this._store.getState().select(option);
    this.value = Array.isArray(nextValue) ? null : nextValue;
    this.dispatchEvent(new CustomEvent('gd-change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  render() {
    const state = this._store.getState();
    const resolved = resolveSelectStyle(this.theme, this.color);
    const selected = Array.isArray(state.internalValue) ? null : state.internalValue;

    const triggerStyle = {
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      fontWeight: `${resolved.fontWeight}`,
      color: resolved.color,
      borderWidth: `${resolved.borderWidth}`,
      borderStyle: 'solid',
      borderColor: resolved.borderColor,
      borderRadius: '0px',
      padding: '8px',
      background: resolved.surfaceColor,
    };

    const dropdownStyle = {
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      color: resolved.color,
      background: resolved.surfaceColor,
      boxShadow: resolved.boxShadow,
      borderRadius: '0px',
      padding: '0',
      '--gd-select-hover-bg': resolved.hoverBackgroundColor,
    };

    return html`
      <div class="wrapper">
        <button
          type="button"
          class="trigger"
          style=${styleMap(triggerStyle)}
          ?disabled=${this.disabled}
          aria-haspopup="listbox"
          aria-expanded=${state.isOpen}
          @click=${this._toggleOpen}
        >
          <span>${selected?.name ?? html`<slot name="placeholder"></slot>`}</span>
          <span class="arrow" ?data-open=${state.isOpen} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4.5 7L9 11.5L13.5 7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </button>
        <div
          class="dropdown"
          popover="auto"
          role="listbox"
          style=${styleMap(dropdownStyle)}
          @toggle=${this._onDropdownToggle}
        >
          ${this.items.length
            ? this.items.map(
                (item) => html`
                  <div
                    class="option"
                    role="option"
                    aria-selected=${selected?.value === item.value}
                    @click=${() => this._select(item)}
                  >
                    ${item.name}
                  </div>
                `
              )
            : html`<slot name="empty"></slot>`}
        </div>
      </div>
    `;
  }

  updated() {
    if (this._store.getState().isOpen) this._positionDropdown();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-select': GdSelect;
  }
}
