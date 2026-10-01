import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { badge } from 'gd-design-library/tokens';
import { resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
export type BadgeAppearance = 'outline' | 'outlineFilledLight' | 'filled' | 'filledLight';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
type CssValues = Record<string, string | number>;
interface ResolvedBadgeTokens {
  default: CssValues;
  size: Record<BadgeSize, CssValues>;
  content: { default: CssValues };
  startIcon: { default: CssValues };
  endIcon: { default: CssValues };
  primary: Record<BadgeAppearance, { default: CssValues; disabled: CssValues }>;
  secondary: Record<BadgeAppearance, { default: CssValues; disabled: CssValues }>;
  tertiary: Record<BadgeAppearance, { default: CssValues; disabled: CssValues }>;
  quaternary: Record<BadgeAppearance, { default: CssValues; disabled: CssValues }>;
  quinary: Record<BadgeAppearance, { default: CssValues; disabled: CssValues }>;
}

@customElement('gd-badge')
export class GdBadge extends LitElement {
  @property({ type: String, reflect: true }) variant: BadgeVariant = 'primary';
  @property({ type: String, reflect: true }) appearance: BadgeAppearance = 'filled';
  @property({ type: String, reflect: true }) size: BadgeSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) styles: CssValues = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  render() {
    const tokens = resolveThemeTree(badge, this.theme) as unknown as ResolvedBadgeTokens;
    const appearance = tokens[this.variant][this.appearance];
    const root = {
      ...tokens.default,
      ...appearance.default,
      ...(this.disabled ? appearance.disabled : {}),
      ...tokens.size?.[this.size],
      ...this.styles,
    };
    return html`<span part="root" aria-disabled=${String(this.disabled)} style=${styleMap(root)}>
      <span part="icon-start" style=${styleMap(tokens.startIcon?.default ?? {})}><slot name="icon-start"></slot></span>
      <span part="content" style=${styleMap(tokens.content?.default ?? {})}><slot></slot></span>
      <span part="icon-end" style=${styleMap(tokens.endIcon?.default ?? {})}><slot name="icon-end"></slot></span>
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-badge': GdBadge;
  }
}
