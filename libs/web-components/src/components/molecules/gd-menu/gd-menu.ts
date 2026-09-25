import { LitElement, html, type PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { menu } from 'gd-design-library/tokens';
import { resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

export type MenuPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

interface ResolvedMenuTokens {
  backgroundColor: string;
  boxShadow: string;
  zIndex: string | number;
}

interface ResolvedWebComponentTokens {
  host: { display: string };
  trigger: { default: Record<string, string | number>; focusVisible: Record<string, string | number> };
  content: Record<string, string | number>;
}

export interface MenuOption {
  name?: string;
  value: unknown;
}

function resolveMenuTokens(theme: DesignCoreTheme): {
  content: ResolvedMenuTokens;
  webComponent: ResolvedWebComponentTokens;
} {
  const resolved = resolveThemeTree(menu, theme) as unknown as {
    content: { default: ResolvedMenuTokens };
    webComponent: ResolvedWebComponentTokens;
  };
  return { content: resolved.content.default, webComponent: resolved.webComponent };
}

/**
 * Native Custom Element port of React Menu. The React portal and document-level Escape/outside-click
 * effect become the platform `popover` primitive. Consumer content signals selection either with
 * `data-gd-menu-value`/optional `data-gd-menu-name`, a composed `gd-menu-select` event, or the
 * rendered contract of the source React Storybook's `DropdownItem`. Both paths emit
 * the React Menu-compatible `{ data: { name?, value }, value }` `gd-change` detail.
 */
@customElement('gd-menu')
export class GdMenu extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: 'close-on-select' }) closeOnSelect = true;
  @property({ type: Number, attribute: 'min-height' }) minHeight = 80;
  @property({ type: Number, attribute: 'max-height' }) maxHeight = 400;
  @property({ type: Number, attribute: 'offset-x' }) offsetX = 4;
  @property({ type: Number, attribute: 'offset-y' }) offsetY = 4;
  @property({ type: String }) placement: MenuPlacement = 'bottom-right';
  @property({ attribute: false }) selectedValue: unknown = undefined;
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @query('.trigger') private _trigger!: HTMLButtonElement;
  @query('.content') private _content!: HTMLElement;
  private _triggerFocused = false;

  connectedCallback() {
    super.connectedCallback();
    // Selection originates in consumer-owned light DOM. Listen on the host so composed
    // events from nested slotted items are not dependent on Shadow DOM slot delegation.
    this.addEventListener('gd-menu-select', this._onSelect);
    // Some embedded Chromium popover implementations consume the first `click` while promoting
    // content into the top layer. Capture `pointerdown` so pointer selection is handled before
    // that native behavior; retain `click` below for keyboard activation.
    this.addEventListener('pointerdown', this._onSlottedItemClick, true);
    this.addEventListener('click', this._onSlottedItemClick);
  }

  disconnectedCallback() {
    this.removeEventListener('gd-menu-select', this._onSelect);
    this.removeEventListener('pointerdown', this._onSlottedItemClick, true);
    this.removeEventListener('click', this._onSlottedItemClick);
    super.disconnectedCallback();
  }

  updated(changed: PropertyValues<this>) {
    const tokens = resolveMenuTokens(this.theme);
    this.style.display = tokens.webComponent.host.display;
    if (!changed.has('open')) return;
    if (this.open) this._show();
    else this._hide();
  }

  openMenu() {
    this.open = true;
  }
  closeMenu() {
    this.open = false;
  }
  toggleMenu() {
    this.open = !this.open;
  }

  private _show() {
    // Do not measure immediately after changing Lit state. Native popovers enter the top layer
    // asynchronously; before the `toggle` event their UA geometry can still be viewport-sized,
    // which would make the overflow clamp place a small menu at the viewport's top-left.
    // A native popover is momentarily laid out at its UA default (usually 0,0). Keep that
    // transient frame inert; otherwise a fast first click can hit a menu item before its final
    // geometry is applied, making the next click look like the one that selected it.
    this._content.style.visibility = 'hidden';
    if (!this._content.matches(':popover-open')) this._content.showPopover();
    // A first pass also keeps the component functional in browser test environments that expose
    // `showPopover()` but do not dispatch the platform `toggle` event.
    this._queuePosition();
  }

  private _hide() {
    if (this._content?.matches(':popover-open')) this._content.hidePopover();
  }

  private _queuePosition() {
    requestAnimationFrame(() => {
      if (this.open && this._content.matches(':popover-open')) this._position();
    });
  }

  private _position() {
    const trigger = this._trigger.getBoundingClientRect();
    const content = this._content.getBoundingClientRect();
    const top = this.placement.startsWith('top')
      ? trigger.top - content.height - this.offsetY
      : trigger.bottom + this.offsetY;
    const left = this.placement.endsWith('left')
      ? trigger.left - content.width - this.offsetX
      : trigger.right + this.offsetX;
    const boundedTop = Math.max(this.offsetY, Math.min(top, window.innerHeight - content.height - this.offsetY));
    const boundedLeft = Math.max(this.offsetX, Math.min(left, window.innerWidth - content.width - this.offsetX));
    this._content.style.top = `${boundedTop}px`;
    this._content.style.left = `${boundedLeft}px`;
    this._content.style.maxHeight = `${Math.min(this.maxHeight, window.innerHeight - boundedTop - this.offsetY)}px`;
    this._content.style.minHeight = `${Math.min(this.minHeight, window.innerHeight - boundedTop - this.offsetY)}px`;
    this._content.style.visibility = 'visible';
  }

  private _onPopoverToggle() {
    // Some Chromium embeddings dispatch a plain `Event` for `toggle` without `newState`.
    // Inspect the native state on the next frame instead of relying on that optional field:
    // it is the one portable signal that top-layer layout is final.
    requestAnimationFrame(() => {
      if (this._content.matches(':popover-open')) {
        this._position();
      } else if (this.open) {
        this.open = false;
      }
    });
  }

  private _onSelect = (event: Event) => {
    const detail = (event as CustomEvent<{ data?: MenuOption; value?: unknown }>).detail;
    this._select(detail?.data ?? detail);
  };

  private _onSlottedItemClick = (event: Event) => {
    if (!this.open) return;
    const item = event
      .composedPath()
      .find((candidate): candidate is HTMLElement => this._isSelectableSlottedItem(candidate));
    if (item) {
      this._select({
        name: item.dataset.gdMenuName || item.textContent?.trim() || undefined,
        // The React DropdownItem's `value` prop is not serialized into the DOM. Its Storybook
        // examples use string values, so text is the compatible fallback that still closes the
        // menu. Consumers needing a distinct or non-string value use the explicit data attribute
        // or `gd-menu-select` event contract above.
        value: item.dataset.gdMenuValue ?? item.textContent?.trim(),
      });
    }
  };

  private _isSelectableSlottedItem(candidate: EventTarget): candidate is HTMLElement {
    if (!(candidate instanceof HTMLElement) || !candidate.closest('[slot="content"]')) return false;
    if (candidate.matches('[disabled], [aria-disabled="true"], [data-disabled="true"]')) return false;
    return candidate.matches('[data-gd-menu-value], [data-testid="DropdownItem"], [role="menuitem"], [role="option"]');
  }

  private _select(selection: MenuOption | unknown) {
    const data = this._toMenuOption(selection);
    this.selectedValue = data;
    this.dispatchEvent(
      new CustomEvent('gd-change', { detail: { data, value: data.value }, bubbles: true, composed: true })
    );
    if (this.closeOnSelect) this.closeMenu();
  }

  private _toMenuOption(selection: MenuOption | unknown): MenuOption {
    if (typeof selection === 'object' && selection !== null && 'value' in selection) {
      return selection as MenuOption;
    }
    return { value: selection };
  }

  render() {
    const tokens = resolveMenuTokens(this.theme);
    const triggerStyle = this._triggerFocused
      ? { ...tokens.webComponent.trigger.default, ...tokens.webComponent.trigger.focusVisible }
      : tokens.webComponent.trigger.default;
    return html`
      <button
        class="trigger"
        type="button"
        part="trigger"
        aria-haspopup="menu"
        aria-expanded=${this.open}
        @click=${this.toggleMenu}
        @focusin=${() => {
          this._triggerFocused = true;
          this.requestUpdate();
        }}
        @focusout=${() => {
          this._triggerFocused = false;
          this.requestUpdate();
        }}
        style=${styleMap(triggerStyle)}
      >
        <slot name="trigger"></slot>
      </button>
      <div
        class="content"
        part="content"
        popover="auto"
        role="menu"
        @toggle=${this._onPopoverToggle}
        style=${styleMap({
          ...tokens.webComponent.content,
          backgroundColor: tokens.content.backgroundColor,
          boxShadow: tokens.content.boxShadow,
          zIndex: `${tokens.content.zIndex}`,
        })}
      >
        <slot name="content"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-menu': GdMenu;
  }
}
