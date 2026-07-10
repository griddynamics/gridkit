import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { resolveButtonVariantStyle, type ButtonVariantName, type DesignCoreTheme } from 'gd-design-core';

/**
 * CTORNDSD-581 Button port (per the spike plan's Migration Example) — the platform's smoke test.
 * Consumes gd-design-core's `resolveButtonVariantStyle` for the same token-resolved values the
 * React and React Native adapters use, mapping its state-keyed style objects (`container`,
 * `containerHover`, `containerActive`, `containerDisabled`) onto host `@state` flags instead of
 * CSS pseudo-classes, since the resolver is deliberately pseudo-selector-free (see gd-design-core's
 * README). A real theme should be supplied via the `theme` property; falls back to
 * `resolveButtonVariantStyle`'s own hardcoded defaults when omitted, so this renders standalone.
 */
@customElement('gd-button')
export class GdButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      font-family: inherit;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
    }
    button[disabled] {
      cursor: default;
    }
  `;

  @property({ type: String }) variant: ButtonVariantName = 'primary';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) isLoading = false;
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @state() private _hovered = false;
  @state() private _pressed = false;

  render() {
    const resolved = resolveButtonVariantStyle(this.theme, this.variant);
    const isDisabled = this.disabled || this.isLoading;

    const containerStyle = {
      ...resolved.container,
      ...(this._hovered && !isDisabled ? resolved.containerHover : {}),
      ...(this._pressed && !isDisabled ? resolved.containerActive : {}),
      ...(isDisabled ? resolved.containerDisabled : {}),
    };

    return html`
      <button
        ?disabled=${isDisabled}
        style=${styleMap(containerStyle)}
        aria-busy=${this.isLoading || nothing}
        @mouseenter=${() => (this._hovered = true)}
        @mouseleave=${() => {
          this._hovered = false;
          this._pressed = false;
        }}
        @mousedown=${() => (this._pressed = true)}
        @mouseup=${() => (this._pressed = false)}
      >
        <slot name="icon-start"></slot>
        <span style=${styleMap(resolved.label)}><slot></slot></span>
        <slot name="icon-end"></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-button': GdButton;
  }
}
