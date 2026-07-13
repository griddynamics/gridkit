import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  resolveButtonVariantStyle,
  resolveButtonRadius,
  type ButtonVariantName,
  type ButtonRoundedName,
  type DesignCoreTheme,
} from 'gd-design-core';

/** Button's own default is `rounded="none"` (`button.ts` `attrs.rounded: 'none'`), i.e.
 *  square corners, not rounded. Radius scale itself is resolved from `theme` dynamically via
 *  `resolveButtonRadius` (`gd-design-core`), not hardcoded here — same as the real component. */
export type ButtonRounded = ButtonRoundedName;

/**
 * CTORNDSD-581 Button port (per the implementation plan's Migration Example) — the platform's smoke test.
 * Consumes gd-design-core's `resolveButtonVariantStyle` for the same token-resolved values the
 * React and React Native adapters use, mapping its state-keyed style objects (`container`,
 * `containerHover`, `containerActive`, `containerDisabled`) onto host `@state` flags instead of
 * CSS pseudo-classes, since the resolver is deliberately pseudo-selector-free (see gd-design-core's
 * README). A real theme should be supplied via the `theme` property; falls back to
 * `resolveButtonVariantStyle`'s own hardcoded defaults when omitted, so this renders standalone.
 *
 * Visual-fidelity fixes (found while comparing against the real Storybook Button): the real
 * component has no keyboard `:focus-visible` treatment via JS hover state — it's a native
 * `&:focus-visible` CSS rule (`getFocusStyles`, an inset -4px detached ring), approximated here
 * with `outline` + `outline-offset` (a native CSS mechanism built for exactly this, not just a
 * loose guess). `isLoading` renders a `Loader` sibling in the real component, not an opacity
 * change — approximated here with a small inline spinner since `Loader` isn't one of the 5
 * ported atoms.
 */
@customElement('gd-button')
export class GdButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      border-style: solid;
      border-width: 0;
      border-color: transparent;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
    }
    button[disabled] {
      cursor: default;
    }
    button:focus-visible {
      outline: 2px solid;
      outline-offset: 4px;
    }
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 9999px;
      animation: gd-button-spin 0.6s linear infinite;
    }
    @keyframes gd-button-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String }) variant: ButtonVariantName = 'primary';
  @property({ type: String }) rounded: ButtonRounded = 'none';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) isLoading = false;
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  @state() private _hovered = false;
  @state() private _pressed = false;

  render() {
    const resolved = resolveButtonVariantStyle(this.theme, this.variant);
    const isDisabled = this.disabled || this.isLoading;
    const focusColor = (this.theme.colors as { border?: { focus?: string } } | undefined)?.border?.focus ?? '#0069B4';
    const radius = resolveButtonRadius(this.theme, this.rounded);

    const containerStyle = {
      borderRadius: radius,
      // Real `button.ts` has no explicit fontFamily/fontSize of its own — the real `<button>`
      // inherits both from the host app's global reset. Set explicitly here (not just
      // `font-family: inherit` in static CSS) so a standalone `gd-button` renders correctly
      // regardless of ambient page context, instead of silently falling through to a native
      // `<button>`'s own UA-default form-control font.
      fontFamily: `${resolved.fontFamily}`,
      fontSize: `${resolved.fontSize}`,
      fontWeight: `${resolved.label.fontWeight}`,
      gap: `${resolved.gap}`,
      padding: resolved.padding,
      ...resolved.container,
      ...(this._hovered && !isDisabled ? resolved.containerHover : {}),
      ...(this._pressed && !isDisabled ? resolved.containerActive : {}),
      ...(isDisabled ? resolved.containerDisabled : {}),
      outlineColor: focusColor,
    };
    // The real component's `color` is set once on the `<button>` itself and inherits down to
    // its content span (which sets no `color` of its own) — so a hover/active/disabled color
    // change is a single source of truth there. This span sets its own explicit `color`
    // instead of inheriting, so it must reuse the SAME merged `containerStyle.color`
    // (not `resolved.label.color`, which is base-variant-only and would otherwise silently
    // ignore every hover/active/disabled color change computed above).
    // `button.content.default` (libs/ui/src/tokens/button.ts) — static, non-token structural
    // values (not resolved via theme in the real component either), matching `ContentStyled`'s
    // layout so multi-line/icon+text content centers the same way as the real component
    // instead of a bare inline span.
    const labelStyle = {
      color: containerStyle.color,
      fontWeight: resolved.label.fontWeight,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minWidth: '0',
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
        <span style=${styleMap(labelStyle)}><slot></slot></span>
        <slot name="icon-end"></slot>
        ${this.isLoading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-button': GdButton;
  }
}
