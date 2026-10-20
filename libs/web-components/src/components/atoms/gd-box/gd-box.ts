import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { box } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree } from '../../../core';
import { GdLayoutElement } from '../../layout/layout-element';

export type BoxVariant = 'horizontal' | 'vertical';
type CssValues = Record<string, string | number>;
interface ResolvedBoxTokens {
  default: CssValues;
  vertical: { default: CssValues; bordered: CssValues; highlighted: CssValues };
  horizontal: { default: CssValues; bordered: CssValues; highlighted: CssValues };
  shadowHover: CssValues;
}

/**
 * Flexible layout container. Accepts the shared Box style properties (width, padding, gap, ...) in
 * addition to `variant`, `isBordered`, `isHighlighted`, `withShadowHover` and `styles`.
 * The internal root is the focus target (`tabIndex`, default 0) so focus styles apply to the box.
 */
@customElement('gd-box')
export class GdBox extends GdLayoutElement {
  @property({ type: String, reflect: true }) variant: BoxVariant = 'vertical';
  @property({ type: Boolean, attribute: 'is-bordered', reflect: true }) isBordered = false;
  @property({ type: Boolean, attribute: 'is-highlighted', reflect: true }) isHighlighted = false;
  @property({ type: Boolean, attribute: 'with-shadow-hover', reflect: true }) withShadowHover = false;
  @property({ type: Number }) override tabIndex = 0;

  render() {
    const tokens = resolveThemeTree(box, this.theme) as unknown as ResolvedBoxTokens;
    const variant = tokens[this.variant];
    const cssText = [
      // The host is transparent so the root takes part in the parent layout exactly like the root of a
      // regular element, and the global reset (`box-sizing`, `border`) reaches the shadow root.
      ':host { display: contents; }',
      buttonCssBlockToText('[part="root"]', { boxSizing: 'border-box', borderWidth: 0, borderStyle: 'solid' }),
      buttonCssBlockToText('[part="root"]', tokens.default),
      buttonCssBlockToText('[part="root"]', variant.default),
      this.withShadowHover ? buttonCssBlockToText('[part="root"]', tokens.shadowHover) : '',
      this.isBordered ? buttonCssBlockToText('[part="root"]', variant.bordered) : '',
      this.isHighlighted ? buttonCssBlockToText('[part="root"]', variant.highlighted) : '',
      buttonCssBlockToText('[part="root"]', this.boxStyles),
      buttonCssBlockToText('[part="root"]', this.styles),
    ].join('\n');
    this.adoptStyles(cssText);
    return html`<div part="root" tabindex=${this.tabIndex} data-testid="Box"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-box': GdBox;
  }
}
