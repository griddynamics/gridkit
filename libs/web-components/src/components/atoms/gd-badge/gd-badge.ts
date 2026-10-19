import { html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { badge } from 'gd-design-library/tokens';
import { resolveThemeTree } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

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
export class GdBadge extends GdThemedElement {
  static styles = css`
    /* The badge root (an inline-flex span) takes part in the parent layout directly, like the root of the
       source component. An inline host would wrap it in a line box and add a strut. */
    :host {
      display: contents;
    }
    /* The global reset (box-sizing, border) does not reach a shadow root. */
    [part='root'] {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
    }
  `;

  @property({ type: String, reflect: true }) variant: BadgeVariant = 'primary';
  @property({ type: String, reflect: true }) appearance: BadgeAppearance = 'filled';
  @property({ type: String, reflect: true }) size: BadgeSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ attribute: false }) styles: CssValues = {};

  /** Icon wrappers only exist when something is slotted into them, so empty slots add no flex `gap`. */
  @state() private _hasIconStart = false;
  @state() private _hasIconEnd = false;

  private _onSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const hasNodes = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === 'icon-start') this._hasIconStart = hasNodes;
    else this._hasIconEnd = hasNodes;
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
            ><slot name="icon-start" @slotchange=${this._onSlotChange}></slot
          ></span>`
        : html`<slot name="icon-start" @slotchange=${this._onSlotChange}></slot>`}
      <span part="content" style=${styleMap(tokens.content?.default ?? {})}><slot></slot></span>
      ${this._hasIconEnd
        ? html`<span part="icon-end" style=${styleMap(tokens.endIcon?.default ?? {})}
            ><slot name="icon-end" @slotchange=${this._onSlotChange}></slot
          ></span>`
        : html`<slot name="icon-end" @slotchange=${this._onSlotChange}></slot>`}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-badge': GdBadge;
  }
}
