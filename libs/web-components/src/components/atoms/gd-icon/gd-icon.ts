import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from 'gd-design-library/tokens';
import { get, iconCatalog, resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

@customElement('gd-icon')
export class GdIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      line-height: 0;
      vertical-align: middle;
    }
    svg {
      display: block;
      flex: none;
    }
  `;

  @property({ type: String, reflect: true }) name = 'star';
  @property({ type: Number, reflect: true }) width = 18;
  @property({ type: Number, reflect: true }) height = 18;
  @property({ type: String, reflect: true }) size?: IconSize;
  @property({ type: String, reflect: true }) fill = 'currentColor';
  @property({ type: String, attribute: 'fill-svg', reflect: true }) fillSvg = 'none';
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  render() {
    const definition = (iconCatalog as Record<string, { viewBox: string; body: string }>)[this.name];
    if (!definition) return html``;
    const tokens = resolveThemeTree(icon, this.theme) as { size: Record<IconSize, { width: number; height: number }> };
    const dimensions = this.size ? tokens.size[this.size] : { width: this.width, height: this.height };
    const fill = get(this.theme, `colors.${this.fill}`, this.fill) as string;
    const fillSvg = get(this.theme, `colors.${this.fillSvg}`, this.fillSvg) as string;
    return html`<svg
      part="svg"
      role=${this.getAttribute('aria-label') ? 'img' : 'presentation'}
      aria-hidden=${this.getAttribute('aria-label') ? 'false' : 'true'}
      viewBox=${definition.viewBox}
      width=${dimensions.width}
      height=${dimensions.height}
      fill=${fillSvg}
      style=${styleMap({ '--gd-icon-fill': fill, '--gd-icon-fill-svg': fillSvg })}
    >
      ${unsafeSVG(definition.body)}
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-icon': GdIcon;
  }
}
