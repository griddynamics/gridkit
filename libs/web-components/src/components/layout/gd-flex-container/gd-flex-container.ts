import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { flexContainer } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdLayoutElement } from '../layout-element';

type FlexContainerTokens = {
  default: ButtonCssBlock;
  webComponent: { host: ButtonCssBlock; default: ButtonCssBlock };
};

@customElement('gd-flex-container')
export class GdFlexContainer extends GdLayoutElement {
  render() {
    const tokens = resolveThemeTree(flexContainer, this.theme) as unknown as FlexContainerTokens;
    this.adoptStyles(
      [
        buttonCssBlockToText(':host', tokens.webComponent.host),
        buttonCssBlockToText('[part="root"]', tokens.default),
        buttonCssBlockToText('[part="root"]', tokens.webComponent.default),
        buttonCssBlockToText('[part="root"]', this.boxStyles),
        buttonCssBlockToText('[part="root"]', this.styles),
      ].join('\n')
    );
    return html`<div part="root" data-testid="FlexContainer"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-flex-container': GdFlexContainer;
  }
}
