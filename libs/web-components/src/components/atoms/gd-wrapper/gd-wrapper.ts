import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { wrapper } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdLayoutElement } from '../../layout/layout-element';

type WrapperVariant = 'inline' | 'section' | 'fullPage';

/**
 * Minimal layout wrapper. Accepts the shared Box style properties (display, position, width, padding, ...) in
 * addition to `variant`, `as` and `styles`; they are applied after the variant tokens, like in the source
 * component.
 */
@customElement('gd-wrapper')
export class GdWrapper extends GdLayoutElement {
  @property({ type: String, reflect: true }) variant: WrapperVariant = 'inline';
  @property({ type: String, reflect: true }) as: keyof HTMLElementTagNameMap = 'div';
  render() {
    const t = resolveThemeTree(wrapper, this.theme) as unknown as Record<string, ButtonCssBlock>;
    this.adoptStyles(
      [
        // The wrapper element is the root of the source Wrapper: the host must not add a box of its own.
        ':host { display: contents; }',
        // The global reset of the source package (`box-sizing`, `border`) does not reach a shadow root.
        buttonCssBlockToText('.wrapper', { boxSizing: 'border-box', borderWidth: 0, borderStyle: 'solid' }),
        buttonCssBlockToText('.wrapper', t.default),
        buttonCssBlockToText('.wrapper', t[this.variant]),
        buttonCssBlockToText('.wrapper', this.boxStyles),
        buttonCssBlockToText('.wrapper', this.styles as ButtonCssBlock),
      ].join('\n')
    );
    const tag = unsafeStatic(this.as);
    return html`<${tag} class="wrapper" part="wrapper" data-testid="wrapper"><slot></slot></${tag}>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-wrapper': GdWrapper;
  }
}
