import { html, css, nothing, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { select } from 'gd-design-library/tokens';
import {
  buttonCssBlockToText,
  resolveThemeTree,
  createSelectStore,
  filterSelectOptions,
  type ButtonCssBlock,
  type SelectOption,
  type SelectItemIdentifier,
  type InputColorVariantName,
} from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';
import '../gd-button/gd-button';
import '../gd-icon/gd-icon';

/** An option of the dropdown. `disabled` options are shown but cannot be chosen. */
export type GdSelectOption = SelectOption & { disabled?: boolean };

interface ResolvedSelectTokens {
  default: ButtonCssBlock;
  disabled?: ButtonCssBlock;
  initiatorWrapper: ButtonCssBlock;
  dropdown: ButtonCssBlock;
  button: Record<'default' | InputColorVariantName, ButtonCssBlock>;
  item: { default: ButtonCssBlock; disabled: ButtonCssBlock };
  arrowIconWrapper: {
    default: ButtonCssBlock;
    transform: { open: ButtonCssBlock; close: ButtonCssBlock };
  };
  icons: { arrowIcon: { name: string; fill: string; width: number; height: number } };
  adornment: { default: ButtonCssBlock };
  searchInput: { default: ButtonCssBlock };
}

/** Gap in px between the trigger and the dropdown. */
const DROPDOWN_GAP = 1;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Select with single and multiple selection, adornments, a custom initiator, imperative methods,
 * custom identifiers, validation colors, search, and disabled and empty states.
 *
 * Structure of the rendered tree:
 *
 * ```
 * <div class="select">                            positioned root; width, min/max width and `styles` land here
 *   <div class="initiator-wrapper">               click and arrow-key handling
 *     <slot name="initiator">                     optional custom initiator, replaces the trigger
 *     <gd-button class="trigger" variant="inherit">
 *       <span slot="icon-start">  <slot name="adornment-start">
 *       selected text or placeholder
 *       <span slot="icon-end">    <slot name="adornment-end"> + rotating <gd-icon> chevron
 *   <div class="dropdown" popover="manual">       top layer, positioned below (or above) the trigger
 *     <input type="search"> (searchable)
 *     <slot>                                      custom content rendered before the options
 *     options, or <slot name="empty"> when there are none
 * ```
 *
 * The host itself generates no box (`display: contents`) because the positioned `.select` element is the
 * component root. The dropdown lives in the top layer through the `popover` attribute. Outside-click,
 * Escape and Tab dismissal are handled explicitly so they behave the same for user input and for scripted
 * events. Positioning is computed on open and while the page scrolls or resizes: below the trigger, or above
 * it when there is not enough room.
 *
 * Events: `gd-change` carries the new value (an option, or an array in multiple mode); `gd-select` carries
 * `{ data, index }` for every chosen option; `gd-initiator-click` is cancelable and skips the default
 * toggle when prevented.
 */
@customElement('gd-select')
export class GdSelect extends GdThemedElement {
  static styles = css`
    :host {
      display: contents;
    }
    /* The global reset (box-sizing, border) does not reach a shadow root. */
    *,
    *::before,
    *::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
    }
    .select {
      position: relative;
      display: inline-block;
    }
    .trigger {
      display: block;
    }
    /* A custom initiator fills the wrapper like the trigger does. */
    .initiator-wrapper ::slotted(*) {
      width: 100%;
    }
    .dropdown {
      /* The popover UA stylesheet adds a border, padding, background and auto margins. */
      border: none;
      overflow-y: auto;
    }
    .dropdown:not(:popover-open) {
      display: none;
    }
    .search {
      font: inherit;
    }
  `;

  @property({ type: Array }) items: GdSelectOption[] = [];
  @property({ type: Number, attribute: 'items-count' }) itemsCount?: number;
  @property({ attribute: false }) value: SelectOption | SelectOption[] | null = null;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) color: InputColorVariantName = 'primary';
  @property({ type: String }) placeholder = 'Select';
  @property({ type: Boolean }) multiple = false;
  @property({ type: Boolean }) searchable = false;
  @property({ type: String, attribute: 'search-placeholder' }) searchPlaceholder = 'Search...';
  @property({ type: Boolean, attribute: 'auto-open' }) autoOpen = true;
  @property({ type: String, attribute: 'dropdown-max-height' }) dropdownMaxHeight = '240px';
  @property({ attribute: false }) activeIndex?: string | number;
  @property({ attribute: false }) itemIdentifier?: SelectItemIdentifier;
  @property({ attribute: false }) itemStringifier: (item: SelectOption) => string = (item) => item.name;
  @property({ attribute: false }) renderOption?: (data: {
    item: SelectOption;
    index: number;
    isActiveItem: boolean;
    className: string;
  }) => unknown;
  /** Width, minimum width and maximum width of the select (defaults: `100%`, unset, `initial`). */
  @property({ type: String }) width = '100%';
  @property({ type: String, attribute: 'min-width' }) minWidth?: string;
  @property({ type: String, attribute: 'max-width' }) maxWidth = 'initial';
  @property({ attribute: false }) styles: Record<string, string | number> = {};

  @query('.trigger') private _trigger?: HTMLElement;
  @query('.initiator-wrapper') private _initiatorWrapper!: HTMLElement;
  @query('.dropdown') private _dropdown!: HTMLElement;
  @query('.search') private _search?: HTMLInputElement;

  private _store = createSelectStore({ disabled: this.disabled, value: this.value });
  private _unsubscribe?: () => void;
  private _slotObserver?: MutationObserver;
  private _removeOpenListeners?: () => void;
  private _sheet?: CSSStyleSheet;
  private _sheetText = '';
  private _placement: 'top' | 'bottom' = 'bottom';

  connectedCallback() {
    super.connectedCallback();
    this._unsubscribe = this._store.subscribe((state, prevState) => {
      this.requestUpdate();
      if (state.isOpen !== prevState.isOpen) this._syncPopover(state.isOpen);
    });
    // Adornments and a custom initiator are optional slotted children: the wrappers around them (and the
    // trigger itself) only render when they exist.
    this._slotObserver = new MutationObserver(() => this.requestUpdate());
    this._slotObserver.observe(this, { childList: true, attributes: true, attributeFilter: ['slot'], subtree: false });
  }

  disconnectedCallback() {
    this._unsubscribe?.();
    this._slotObserver?.disconnect();
    this._removeOpenListeners?.();
    super.disconnectedCallback();
  }

  willUpdate(changed: PropertyValues<this>) {
    if (changed.has('multiple')) this._store.getState().setMultiple(this.multiple);
    if (changed.has('value') || changed.has('multiple')) this._store.getState().syncExternalValue(this.value);
    if (changed.has('disabled')) {
      this._store.getState().setDisabled(this.disabled);
      if (this.disabled) this._store.getState().close();
    }
  }

  /** True while the dropdown is open. */
  get isOpen() {
    return this._store.getState().isOpen;
  }

  /** The selected option (single mode) or the array of selected options (multiple mode). */
  get selectedValue() {
    return this._store.getState().internalValue;
  }

  open() {
    this._store.getState().open();
  }

  close() {
    this._store.getState().close();
  }

  toggle() {
    this._store.getState().toggle();
  }

  /** Choose `option` programmatically, exactly as if it had been clicked in the dropdown. */
  selectOption(option: SelectOption, index?: number) {
    if (this.disabled || !option) return;
    const nextValue = this._store.getState().select(option, this.itemIdentifier);
    this.value = nextValue;
    this.dispatchEvent(
      new CustomEvent('gd-select', { detail: { data: option, index }, bubbles: true, composed: true })
    );
    this.dispatchEvent(new CustomEvent('gd-change', { detail: { value: this.value }, bubbles: true, composed: true }));
    // Single selection closes the dropdown and hands the focus back to the trigger.
    if (!this.multiple) setTimeout(() => this._focusTrigger());
  }

  private _syncPopover(isOpen: boolean) {
    this._removeOpenListeners?.();
    this._removeOpenListeners = undefined;
    this.dispatchEvent(new CustomEvent(isOpen ? 'gd-open' : 'gd-close', { bubbles: true, composed: true }));
    if (!this._dropdown) return;
    if (isOpen) {
      this._positionDropdown();
      if (!this._dropdown.matches(':popover-open')) this._dropdown.showPopover();
      this._listenWhileOpen();
      if (this.searchable) setTimeout(() => this._search?.focus());
    } else if (this._dropdown.matches(':popover-open')) {
      this._dropdown.hidePopover();
    }
  }

  private _listenWhileOpen() {
    const onMouseDown = (event: MouseEvent) => {
      if (!event.composedPath().includes(this._initiatorWrapper) && !event.composedPath().includes(this._dropdown))
        this.close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (this.disabled) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        this.close();
        this._focusTrigger();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        this.close();
        this._focusNextAfterSelect();
      }
    };
    const onViewportChange = () => this._positionDropdown();
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('scroll', onViewportChange, true);
    this._removeOpenListeners = () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('scroll', onViewportChange, true);
    };
  }

  private _positionDropdown() {
    const anchor = this._initiatorWrapper ?? this._trigger;
    if (!anchor || !this._dropdown) return;
    const rect = anchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const requestedMax = parseFloat(String(this.dropdownMaxHeight));
    const canFitBelow = spaceBelow >= requestedMax + DROPDOWN_GAP;
    const canFitAbove = spaceAbove >= requestedMax + DROPDOWN_GAP;

    let placement: 'top' | 'bottom' = 'bottom';
    if (!canFitBelow && canFitAbove) placement = 'top';
    else if (!canFitBelow && !canFitAbove) placement = spaceBelow >= spaceAbove ? 'bottom' : 'top';
    this._placement = placement;

    const available = (placement === 'bottom' ? spaceBelow : spaceAbove) - DROPDOWN_GAP;
    const style = this._dropdown.style;
    style.position = 'fixed';
    style.left = `${Math.floor(rect.left)}px`;
    style.width = `${rect.width}px`;
    style.maxWidth = this.maxWidth;
    style.minWidth = this.minWidth ?? '';
    style.maxHeight = `${Math.floor(Math.max(0, Math.min(requestedMax, available)))}px`;
    if (placement === 'bottom') {
      style.top = `${Math.floor(rect.bottom + DROPDOWN_GAP)}px`;
      style.bottom = 'auto';
    } else {
      style.top = 'auto';
      style.bottom = `${Math.floor(viewportHeight - rect.top + DROPDOWN_GAP)}px`;
    }
  }

  /** Focus the first keyboard-focusable element of the initiator (the trigger button by default). */
  private _focusTrigger() {
    if (this.disabled) return;
    const custom = this.querySelector<HTMLElement>(':scope > [slot="initiator"]');
    const target = custom
      ? ((custom.matches(FOCUSABLE) ? custom : custom.querySelector<HTMLElement>(FOCUSABLE)) ??
        custom.shadowRoot?.querySelector<HTMLElement>(FOCUSABLE))
      : this._trigger?.shadowRoot?.querySelector<HTMLElement>('button');
    target?.focus();
  }

  /** Tab closes the dropdown and moves the focus to the next tab stop after the select. */
  private _focusNextAfterSelect() {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>(FOCUSABLE));
    const next = candidates.find(
      (candidate) =>
        !this.contains(candidate) && Boolean(this.compareDocumentPosition(candidate) & Node.DOCUMENT_POSITION_FOLLOWING)
    );
    next?.focus();
  }

  /** Focusable elements of the open dropdown in document order: search field, slotted content, options. */
  private _dropdownFocusables() {
    const result: HTMLElement[] = [];
    for (const child of Array.from(this._dropdown.children)) {
      if (child instanceof HTMLSlotElement) {
        for (const assigned of child.assignedElements({ flatten: true }) as HTMLElement[]) {
          if (assigned.matches(FOCUSABLE)) result.push(assigned);
          result.push(...Array.from(assigned.querySelectorAll<HTMLElement>(FOCUSABLE)));
          const inner = assigned.shadowRoot?.querySelectorAll<HTMLElement>(FOCUSABLE);
          if (inner) result.push(...Array.from(inner));
        }
      } else if (child.matches(FOCUSABLE)) result.push(child as HTMLElement);
    }
    return result;
  }

  private _onDropdownKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const focusables = this._dropdownFocusables();
    const active = this._deepActive();
    const index = focusables.findIndex((item) => item === active || item.contains(active));
    const step = event.key === 'ArrowUp' ? -1 : 1;
    focusables[index + step]?.focus();
  }

  private _deepActive() {
    let active: Element | null = document.activeElement;
    while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
    return active;
  }

  private _onInitiatorKeyDown(event: KeyboardEvent) {
    if (this.disabled || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
    event.preventDefault();
    if (!this._store.getState().isOpen) {
      this.open();
      return;
    }
    const focusables = this._dropdownFocusables();
    (event.key === 'ArrowUp' ? focusables[focusables.length - 1] : focusables[0])?.focus();
  }

  private _onInitiatorClick(event: MouseEvent) {
    if (this.disabled) return;
    const proceed = this.dispatchEvent(
      new CustomEvent('gd-initiator-click', { detail: { event }, bubbles: true, composed: true, cancelable: true })
    );
    if (proceed && this.autoOpen) this._store.getState().toggle();
  }

  private _onOptionKeyDown(event: KeyboardEvent, option: GdSelectOption, index: number) {
    if (option.disabled || event.key !== 'Enter') return;
    event.preventDefault();
    this.selectOption(option, index);
  }

  private _onSearch(event: Event) {
    this._store.getState().setSearchText((event.target as HTMLInputElement).value);
  }

  private _isSelected(option: SelectOption, selectedItems: SelectOption[]) {
    return selectedItems.some((current) =>
      this.itemIdentifier ? this.itemIdentifier(current, option) : current.value === option.value
    );
  }

  private _hasSlotted(name: string) {
    // Light-DOM children do not exist during server rendering, where no slotted content can be detected.
    return typeof this.querySelector === 'function' && Boolean(this.querySelector(`:scope > [slot="${name}"]`));
  }

  private _adoptTokenSheet(tokens: ResolvedSelectTokens) {
    const disabledBlock = this.disabled ? (tokens.disabled ?? {}) : {};
    const layout: ButtonCssBlock = { width: this.width, maxWidth: this.maxWidth };
    if (this.minWidth) layout.minWidth = this.minWidth;
    // The dropdown is positioned in the viewport (`fixed`) instead of the token's `absolute`.
    const dropdownTokens = { ...tokens.dropdown };
    delete dropdownTokens.position;
    const text = [
      buttonCssBlockToText('.select', tokens.default),
      buttonCssBlockToText('.select', disabledBlock),
      buttonCssBlockToText('.select', layout),
      buttonCssBlockToText('.select', this.styles),
      buttonCssBlockToText('.initiator-wrapper', tokens.initiatorWrapper),
      buttonCssBlockToText('.dropdown', dropdownTokens),
      buttonCssBlockToText('.option', tokens.item.default),
      buttonCssBlockToText('.option.disabled', tokens.item.disabled),
      buttonCssBlockToText('.adornment', tokens.adornment.default),
      buttonCssBlockToText('.arrow', tokens.arrowIconWrapper.default),
      buttonCssBlockToText('.arrow', tokens.arrowIconWrapper.transform.close),
      buttonCssBlockToText('.arrow[data-open]', tokens.arrowIconWrapper.transform.open),
      buttonCssBlockToText('.search', tokens.searchInput.default),
    ].join('\n');
    if (!this.shadowRoot || typeof CSSStyleSheet === 'undefined' || text === this._sheetText) return;
    this._sheetText = text;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(text);
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets.filter((item) => item !== this._sheet),
      sheet,
    ];
    this._sheet = sheet;
  }

  /** The dropdown content only exists while the dropdown is open. */
  private _renderDropdownContent(searchText: string, visibleItems: GdSelectOption[], selectedItems: SelectOption[]) {
    return html`
      ${this.searchable
        ? html`<input
            type="text"
            class="search"
            part="search"
            placeholder=${this.searchPlaceholder}
            .value=${searchText}
            @input=${this._onSearch}
            @click=${(event: Event) => event.stopPropagation()}
            @keydown=${(event: Event) => event.stopPropagation()}
            aria-label=${this.searchPlaceholder || 'Search options'}
          />`
        : nothing}
      <slot></slot>
      ${visibleItems.length
        ? visibleItems.map((item, index) => {
            const isSelected = this._isSelected(item, selectedItems);
            const isActive = isSelected || String(this.activeIndex) === String(index);
            const className = `option${isActive ? ' active' : ''}${item.disabled ? ' disabled' : ''}`;
            const custom = this.renderOption?.({ item, index, isActiveItem: isSelected, className });
            return html`
              <div
                class=${className}
                part="option"
                role="option"
                tabindex=${item.disabled ? -1 : 0}
                aria-selected=${isSelected}
                aria-disabled=${item.disabled ? 'true' : nothing}
                @click=${() => !item.disabled && this.selectOption(item, index)}
                @keydown=${(event: KeyboardEvent) => this._onOptionKeyDown(event, item, index)}
              >
                ${custom ?? item.name}
              </div>
            `;
          })
        : html`<slot name="empty"></slot>`}
    `;
  }

  render() {
    const state = this._store.getState();
    const tokens = resolveThemeTree(select, this.theme) as unknown as ResolvedSelectTokens;
    this._adoptTokenSheet(tokens);

    const selected = Array.isArray(state.internalValue) ? null : state.internalValue;
    const selectedItems = Array.isArray(state.internalValue) ? state.internalValue : selected ? [selected] : [];
    const visibleItems = (filterSelectOptions(this.items, state.searchText, this.itemStringifier) ??
      []) as GdSelectOption[];
    const triggerText = this.multiple
      ? selectedItems.length
        ? selectedItems.map(this.itemStringifier).join(', ')
        : this.placeholder
      : selected?.value
        ? this.itemStringifier(selected)
        : this.placeholder;

    const triggerStyles: ButtonCssBlock = {
      ...tokens.button.default,
      ...(tokens.button[this.color] ?? {}),
      // The ellipsis rules of the initiator wrapper apply to the content of the trigger button.
      '& .gd-button__content': {
        ...((tokens.button.default['.gd-button__content'] as ButtonCssBlock | undefined) ?? {}),
        ...((tokens.initiatorWrapper['.gd-button__content'] as ButtonCssBlock | undefined) ?? {}),
      },
    };
    delete triggerStyles['.gd-button__content'];
    const arrow = tokens.icons.arrowIcon;
    const hasInitiator = this._hasSlotted('initiator');
    const hasStart = this._hasSlotted('adornment-start');
    const hasEnd = this._hasSlotted('adornment-end');

    return html`
      <div class="select" part="select">
        <div
          class="initiator-wrapper"
          part="initiator-wrapper"
          @click=${this._onInitiatorClick}
          @keydown=${this._onInitiatorKeyDown}
        >
          ${hasInitiator
            ? html`<slot name="initiator"></slot>`
            : html`<gd-button
                class="trigger"
                part="trigger"
                variant="inherit"
                .theme=${this.theme}
                .styles=${triggerStyles}
                ?disabled=${this.disabled}
              >
                ${hasStart
                  ? html`<span class="adornment" slot="icon-start"><slot name="adornment-start"></slot></span>`
                  : nothing}
                ${triggerText}
                <span class="adornment" slot="icon-end">
                  ${hasEnd ? html`<span class="adornment"><slot name="adornment-end"></slot></span>` : nothing}
                  <span class="arrow" ?data-open=${state.isOpen} aria-hidden="true">
                    <gd-icon
                      .theme=${this.theme}
                      .name=${arrow.name}
                      .fill=${arrow.fill}
                      .width=${arrow.width}
                      .height=${arrow.height}
                    ></gd-icon>
                  </span>
                </span>
              </gd-button>`}
        </div>
        <div
          class="dropdown"
          part="dropdown"
          popover="manual"
          role="listbox"
          aria-multiselectable=${this.multiple}
          @keydown=${this._onDropdownKeyDown}
        >
          ${state.isOpen ? this._renderDropdownContent(state.searchText, visibleItems, selectedItems) : nothing}
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
