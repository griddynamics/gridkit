import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { chat } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from 'gd-design-core';
import '../../atoms/gd-button/gd-button';
import '../../atoms/gd-icon/gd-icon';
import { GdLayoutElement } from '../layout-element';

type ChatTokens = {
  webComponent: { host: ButtonCssBlock };
  wrapper: { default: ButtonCssBlock };
  content: { default: ButtonCssBlock; md: ButtonCssBlock; mdXl: ButtonCssBlock; xl: ButtonCssBlock };
  mainHeader: ButtonCssBlock;
  body: ButtonCssBlock;
  sidebar: { default: ButtonCssBlock; open: ButtonCssBlock; close: ButtonCssBlock };
  sidebarMinified: { default: ButtonCssBlock; open: ButtonCssBlock; close: ButtonCssBlock };
  sidebarWrapper: { default: ButtonCssBlock; open: ButtonCssBlock; close: ButtonCssBlock; md: ButtonCssBlock };
  sidebarContentWrapper: ButtonCssBlock;
  sidebarHeader: ButtonCssBlock;
  toggleButton: {
    default: ButtonCssBlock;
    open: ButtonCssBlock;
    attrs: { variant?: string };
  };
  toggleIcon: { name?: string; fill?: string; size?: string };
};

export interface ChatContainerToggleDetail {
  open: boolean;
}

@customElement('gd-chat-container')
export class GdChatContainer extends GdLayoutElement {
  @property({ type: Boolean, attribute: 'is-open', reflect: true }) isOpen = false;
  @property({ type: Boolean, attribute: 'show-sidebar-aside-control' }) showSidebarAsideControl = true;
  @property({ type: Boolean, attribute: 'show-sidebar-header-control' }) showSidebarHeaderControl = true;

  private _childrenObserver?: MutationObserver;

  connectedCallback() {
    super.connectedCallback();
    if (typeof MutationObserver !== 'undefined') {
      this._childrenObserver = new MutationObserver(() => this.requestUpdate());
      this._childrenObserver.observe(this, { childList: true });
    }
  }

  disconnectedCallback() {
    this._childrenObserver?.disconnect();
    super.disconnectedCallback();
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  toggle() {
    this._setOpen(!this.isOpen, true);
  }

  private _setOpen(open: boolean, notify: boolean) {
    if (this.isOpen === open) return;
    this.isOpen = open;
    if (notify) {
      this.dispatchEvent(
        new CustomEvent<ChatContainerToggleDetail>('gd-toggle-sidebar', {
          detail: { open },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private _hasSlot(name: string) {
    // @lit-labs/ssr renders the element class without a browser HTMLElement
    // prototype, so light-DOM querying is unavailable during DSD generation.
    // Render every named slot server-side; the hydrated browser render restores
    // the same conditional wrappers as the React implementation.
    if (typeof this.querySelector !== 'function') return true;
    return Boolean(this.querySelector(`:scope > [slot="${name}"]`));
  }

  private _onSidebarWrapperClick(event: MouseEvent) {
    const medium = String((this.theme.values?.screenMedium as string | undefined) ?? '768px');
    if (
      event.target === event.currentTarget &&
      this.isOpen &&
      typeof matchMedia !== 'undefined' &&
      matchMedia(`(max-width: ${medium})`).matches
    ) {
      this._setOpen(false, true);
    }
  }

  private _adoptChatStyles(tokens: ChatTokens) {
    const md = String((this.theme.breakpoints as Record<string, unknown> | undefined)?.md ?? '768px');
    const xl = String((this.theme.breakpoints as Record<string, unknown> | undefined)?.xl ?? '1280px');
    const media = (query: string, selector: string, block: ButtonCssBlock) => {
      const rule = buttonCssBlockToText(selector, block);
      return rule ? `@media ${query} {\n${rule}}\n` : '';
    };
    this.adoptStyles(
      [
        buttonCssBlockToText(':host', tokens.webComponent.host),
        buttonCssBlockToText(':host', tokens.wrapper.default),
        buttonCssBlockToText(':host', this.boxStyles),
        buttonCssBlockToText(':host', this.styles),
        buttonCssBlockToText('[part="sidebar-wrapper"]', tokens.sidebarWrapper.default),
        buttonCssBlockToText(
          '[part="sidebar-wrapper"]',
          this.isOpen ? tokens.sidebarWrapper.open : tokens.sidebarWrapper.close
        ),
        buttonCssBlockToText('[part="sidebar"]', tokens.sidebar.default),
        buttonCssBlockToText('[part="sidebar"]', this.isOpen ? tokens.sidebar.open : tokens.sidebar.close),
        buttonCssBlockToText('[part="sidebar-minified"]', tokens.sidebarMinified.default),
        buttonCssBlockToText(
          '[part="sidebar-minified"]',
          this.isOpen ? tokens.sidebarMinified.close : tokens.sidebarMinified.open
        ),
        buttonCssBlockToText('[part="sidebar-header"]', tokens.sidebarHeader),
        buttonCssBlockToText('[part="sidebar-content"]', tokens.sidebarContentWrapper),
        buttonCssBlockToText('[part="body"]', tokens.body),
        buttonCssBlockToText('[part="main-header"]', tokens.mainHeader),
        buttonCssBlockToText('[part="content"]', tokens.content.default),
        media(`(max-width: ${md})`, '[part="sidebar-wrapper"]', tokens.sidebarWrapper.md),
        media(`(max-width: ${md})`, '[part="content"]', tokens.content.md),
        media(`(min-width: ${md}) and (max-width: ${xl})`, '[part="content"]', tokens.content.mdXl),
        media(`(min-width: ${xl})`, '[part="content"]', tokens.content.xl),
      ].join('\n')
    );
  }

  private _toggleButton(tokens: ChatTokens, mode: 'open' | 'close') {
    const close = mode === 'close';
    const styles = { ...tokens.toggleButton.default, ...(close ? tokens.toggleButton.open : {}) };
    return html`<gd-button
      part="toggle-button ${mode}-button"
      variant=${tokens.toggleButton.attrs.variant ?? 'text'}
      .isIcon=${true}
      .styles=${styles}
      .theme=${this.theme}
      aria-label=${`Toggle sidebar - ${mode}`}
      @click=${this.toggle}
    >
      <gd-icon
        name=${tokens.toggleIcon.name ?? 'arrowRight'}
        size=${tokens.toggleIcon.size ?? 'lg'}
        fill=${tokens.toggleIcon.fill ?? 'icon.black'}
        .theme=${this.theme}
      ></gd-icon>
    </gd-button>`;
  }

  render() {
    const tokens = resolveThemeTree(chat, this.theme) as unknown as ChatTokens;
    this._adoptChatStyles(tokens);
    const hasSidebarHeader = this._hasSlot('sidebar-header');
    const hasSidebarMinified = this._hasSlot('sidebar-minified');
    const hasHeader = this._hasSlot('header');

    return html`
      <div part="sidebar-wrapper" data-testid="ChatContainer-sidebar-wrapper" @click=${this._onSidebarWrapperClick}>
        <aside
          part="sidebar"
          data-testid="ChatContainer-sidebar"
          aria-label="Sidebar content"
          @click=${(event: MouseEvent) => event.stopPropagation()}
        >
          ${hasSidebarHeader
            ? html`<header part="sidebar-header" data-testid="ChatContainer-sidebar-header">
                ${this.showSidebarAsideControl ? this._toggleButton(tokens, 'close') : null}
                <slot name="sidebar-header"></slot>
              </header>`
            : null}
          <div part="sidebar-content"><slot name="sidebar"></slot></div>
        </aside>
      </div>

      ${hasSidebarMinified
        ? html`<aside
            part="sidebar-minified"
            data-testid="ChatContainer-sidebar-minified"
            aria-label="Sidebar minified content"
          >
            <slot name="sidebar-minified"></slot>
          </aside>`
        : null}

      <div part="body" data-testid="ChatContainer-body">
        ${hasHeader
          ? html`<header part="main-header" data-testid="ChatContainer-main-header">
              ${!this.isOpen && this.showSidebarHeaderControl ? this._toggleButton(tokens, 'open') : null}
              <slot name="header"></slot>
            </header>`
          : null}
        <main part="content" data-testid="ChatContainer-content"><slot></slot></main>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-chat-container': GdChatContainer;
  }

  interface HTMLElementEventMap {
    'gd-toggle-sidebar': CustomEvent<ChatContainerToggleDetail>;
  }
}
