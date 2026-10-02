import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
  static override styles = css`
    [part='root'] {
      box-sizing: border-box;
    }
  `;

  @property({ type: String, reflect: true }) variant: BadgeVariant = 'primary';
  @property({ type: String, reflect: true }) appearance: BadgeAppearance = 'filled';
  @property({ type: String, reflect: true }) size: BadgeSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) styles: CssValues = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  @state() private _hasIconStart = false;
  @state() private _hasIconEnd = false;

  private _onIconSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const hasContent = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === 'icon-start') this._hasIconStart = hasContent;
    if (slot.name === 'icon-end') this._hasIconEnd = hasContent;
  }

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
      ${this._hasIconStart
        ? html`<span part="icon-start" style=${styleMap(tokens.startIcon?.default ?? {})}
            ><slot name="icon-start" @slotchange=${this._onIconSlotChange}></slot
          ></span>`
        : html`<slot name="icon-start" @slotchange=${this._onIconSlotChange}></slot>`}
      <span part="content" style=${styleMap(tokens.content?.default ?? {})}><slot></slot></span>
      ${this._hasIconEnd
        ? html`<span part="icon-end" style=${styleMap(tokens.endIcon?.default ?? {})}
            ><slot name="icon-end" @slotchange=${this._onIconSlotChange}></slot
          ></span>`
        : html`<slot name="icon-end" @slotchange=${this._onIconSlotChange}></slot>`}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-badge': GdBadge;
  }
}
