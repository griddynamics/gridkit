import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import { icon } from 'gd-design-library/tokens';
import { iconCatalog } from 'gd-design-library/icons';
import { buttonCssBlockToText, get, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import type { GridKitIconName } from '../../../core/token-names';
import { GdLayoutElement } from '../../layout/layout-element';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/** SVG definition of an icon: its `viewBox` and the markup inside the `<svg>` element. Paths that should
 * follow the `fill` property use `fill="var(--gd-icon-fill)"`. */
export interface IconDefinition {
  viewBox: string;
  body: string;
}

const customIcons = new Map<string, IconDefinition>();

/** Register application-specific icons. They can then be rendered by `name` like the built-in ones and take
 * precedence over built-in icons with the same name. Register before the icons are rendered. */
export function registerCustomIcons(icons: Record<string, IconDefinition>) {
  for (const [name, definition] of Object.entries(icons)) customIcons.set(name, definition);
}

const iconBaseStyles: ButtonCssBlock = {
  // Reproduces the global reset for replaced elements, which does not reach a shadow root.
  boxSizing: 'border-box',
  borderWidth: 0,
  borderStyle: 'solid',
  display: 'block',
  verticalAlign: 'middle',
};

/**
 * SVG icon. Accepts the shared Box style properties (margin, padding, position, ...) which are applied to
 * the `<svg>` element, in addition to `size` (or exact `width`/`height`), `fill`, `fillSvg` and `styles`.
 */
@customElement('gd-icon')
export class GdIcon extends GdLayoutElement {
  @property({ type: String, reflect: true }) name: GridKitIconName | (string & {}) = 'star';
  @property({ type: Number, reflect: true }) override width = 18;
  @property({ type: Number, reflect: true }) override height = 18;
  @property({ type: String, reflect: true }) size?: IconSize;
  @property({ type: String, reflect: true }) fill = 'currentColor';
  @property({ type: String, attribute: 'fill-svg', reflect: true }) fillSvg = 'none';

  /** `width` and `height` size the icon itself, so they are not Box styles. */
  protected override get boxStyles(): ButtonCssBlock {
    const styles = { ...super.boxStyles };
    delete styles.width;
    delete styles.height;
    return styles;
  }

  render() {
    const definition: IconDefinition | undefined =
      customIcons.get(this.name) ?? iconCatalog[this.name as GridKitIconName];
    this.adoptStyles(
      [
        ':host { display: contents; }',
        definition ? buttonCssBlockToText('svg', iconBaseStyles) : '',
        buttonCssBlockToText('svg', this.boxStyles),
        buttonCssBlockToText('svg', this.styles),
      ].join('\n')
    );
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
