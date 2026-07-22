import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  resolveThemeTree,
  createSelectStore,
  type InputColorVariantName,
  type SelectOption,
  type DesignCoreTheme,
} from 'gd-design-core';
import { select } from 'gd-design-library/tokens';

interface ResolvedSelectTokens {
  fontFamily: string | number;
  fontSize: string | number;
  fontWeight: string | number;
  color: string;
  surfaceColor: string;
  border: string;
  hoverBackgroundColor: string;
  boxShadow: string;
  triggerPadding: string | number;
  dropdownPadding: string | number;
}

/**
 * Resolves the REAL `select` object (`gd-design-library/tokens`) against `theme` — the
 * single-source-of-truth replacement for the old, hand-mirrored `resolveSelectStyle` in
 * `gd-design-core` (deleted; see that package's `tokenResolvers/select.ts` history). Reads
 * `select.dropdown.*` for surface/typography, `select.button.<variant>.border` (falling back to
 * `select.button.default`, which is itself the `primary`-equivalent border) for the trigger
 * border, and `select.item.default['&:hover, &.active'].backgroundColor` for the hover/selected
 * background — the exact paths `resolveSelectStyle` used to hand-duplicate.
 */
function resolveSelectTokens(theme: DesignCoreTheme, color: InputColorVariantName): ResolvedSelectTokens {
  const resolved = resolveThemeTree(select, theme) as unknown as {
    dropdown: {
      color: string;
      fontFamily: string | number;
      fontSize: string | number;
      fontWeight: string | number;
      background: string;
      boxShadow: string;
      margin: string | number;
      padding: string | number;
    };
    button: { default: { border: string; padding: string | number } } & Record<
      InputColorVariantName,
      { border: string }
    >;
    item: { default: { '&:hover, &.active': { backgroundColor: string } } };
  };

  const buttonTokens = resolved.button[color] ?? resolved.button.default;

  return {
    fontFamily: resolved.dropdown.fontFamily,
    fontSize: resolved.dropdown.fontSize,
    fontWeight: resolved.dropdown.fontWeight,
    color: resolved.dropdown.color,
    surfaceColor: resolved.dropdown.background,
    border: buttonTokens.border,
    hoverBackgroundColor: resolved.item.default['&:hover, &.active'].backgroundColor,
    boxShadow: resolved.dropdown.boxShadow,
    triggerPadding: resolved.button.default.padding,
    dropdownPadding: resolved.dropdown.padding,
  };
}

/**
 * Select port (per the implementation plan's Migration Example) — reduced-scope PoC:
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
      position: relative;
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
      /* Matches the real trigger's own Button internals: button.default's universal
         disabled-selector rule sets cursor to 'default', not 'not-allowed' — Select's own
         button tokens never override cursor, so 'default' is what actually renders. */
      cursor: default;
    }
    /* The real trigger IS a <Button> (SelectStyled.tsx's DropdownButtonStyled), so its focus
       ring is button.default['&:focus-visible'] — getFocusStyles' ::after ring (inset -4px,
       2px border, colors.border.focus), same mechanism gd-button.ts/gd-input.ts already use.
       Corners are always square here (Select's real tokens have no radius at all), so
       border-radius is a static 0px, not a resolved value like gd-button's 'rounded' prop. */
    .trigger:focus-visible {
      outline: none;
    }
    .trigger:focus-visible::after {
      content: '';
      position: absolute;
      inset: -4px;
      border: 2px solid var(--gd-select-focus-color, #0069b4);
      border-radius: 0px;
      pointer-events: none;
    }
    .dropdown {
      /* The popover UA stylesheet applies a default solid border (black, via currentColor)
         to any popover element — the real select.ts dropdown token has no border at all,
         only boxShadow, so this must be explicitly reset. */
      border: none;
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
    .option:hover,
    .option[aria-selected='true'] {
      /* Matches the real item.default's hover-and-active rule — both hover AND the
         currently-selected option share the same bg.fill.hover background; the real tokens
         have no font-weight change for the selected state at all. */
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
  /** Mirrors `Select.tsx`'s `width`/`minWidth`/`maxWidth` props (real defaults:
   *  `width: '100%'`, `maxWidth: 'initial'`, `minWidth` unset) — applied to the trigger
   *  wrapper. Without an explicit width, an empty trigger (no selected value, no
   *  `placeholder` slot content) shrinks to its intrinsic content width (just the chevron),
   *  and since the dropdown's width tracks the trigger's rendered width 1:1, option text
   *  gets visually clipped instead of wrapping to a comfortably wide box. */
  @property({ type: String }) width = '100%';
  @property({ type: String, attribute: 'min-width' }) minWidth?: string;
  @property({ type: String, attribute: 'max-width' }) maxWidth = 'initial';
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
    // Applied directly on the host (`:host`'s own inline style), not just the shadow-root
    // `.wrapper` — a percentage width on a shadow-DOM child only resolves against a
    // *definite* containing-block width, and `:host` itself defaults to `auto` (shrink-to-fit)
    // with no width set here. Matches the real `Select.tsx`'s `width`/`minWidth`/`maxWidth`
    // props being applied straight to its single outermost styled element.
    if (changed.has('width')) this.style.width = this.width;
    if (changed.has('maxWidth')) this.style.maxWidth = this.maxWidth;
    if (changed.has('minWidth')) this.style.minWidth = this.minWidth ?? '';
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
    this._dropdown.style.maxWidth = this.maxWidth;
    this._dropdown.style.minWidth = this.minWidth ?? '';
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
    const resolved = resolveSelectTokens(this.theme, this.color);
    const selected = Array.isArray(state.internalValue) ? null : state.internalValue;
    // Same expression gd-input.ts uses for its own focus ring — the real button.default
    // `'&:focus-visible'` color path (`colors.border.focus`).
    const focusColor = (this.theme.colors as { border?: { focus?: string } } | undefined)?.border?.focus ?? '#0069B4';

    // Sizing itself (`width`/`maxWidth`/`minWidth`) is applied directly to the host in
    // `willUpdate` — this just fills the now-definite host content box.
    const wrapperStyle = { width: '100%' };

    const triggerStyle = {
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      fontWeight: `${resolved.fontWeight}`,
      color: resolved.color,
      border: resolved.border,
      borderRadius: '0px',
      padding: `${resolved.triggerPadding}`,
      background: resolved.surfaceColor,
      '--gd-select-focus-color': focusColor,
    };

    const dropdownStyle = {
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      color: resolved.color,
      background: resolved.surfaceColor,
      boxShadow: resolved.boxShadow,
      borderRadius: '0px',
      // `dropdown.margin` and `dropdown.padding` are both real `spacing.none` — same resolved
      // field reused for both, since they're the same token value in the real component too.
      margin: `${resolved.dropdownPadding}`,
      padding: `${resolved.dropdownPadding}`,
      '--gd-select-hover-bg': resolved.hoverBackgroundColor,
    };

    return html`
      <div class="wrapper" style=${styleMap(wrapperStyle)}>
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
