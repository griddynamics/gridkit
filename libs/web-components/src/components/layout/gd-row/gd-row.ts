import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import { row } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdLayoutElement } from '../layout-element';

export type RowAlign = 'start' | 'center' | 'end' | 'stretch' | 'flex-start' | 'flex-end';
export type RowJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'flex-start'
  | 'flex-end'
  | 'space-between'
  | 'space-around';

type RowTokens = {
  default: ButtonCssBlock;
  webComponent: {
    host: ButtonCssBlock;
    default: ButtonCssBlock;
    reversed: ButtonCssBlock;
    noWrap: ButtonCssBlock;
    align: Record<'start' | 'center' | 'end' | 'stretch', ButtonCssBlock>;
    justify: Record<'start' | 'center' | 'end' | 'between' | 'around', ButtonCssBlock>;
  };
};

const alignKey = (value: RowAlign) => {
  if (value === 'end' || value === 'flex-end') return 'end';
  if (value === 'center') return 'center';
  if (value === 'stretch') return 'stretch';
  return 'start';
};

const justifyKey = (value: RowJustify) => {
  if (value === 'end' || value === 'flex-end') return 'end';
  if (value === 'center') return 'center';
  if (value === 'between' || value === 'space-between') return 'between';
  if (value === 'around' || value === 'space-around') return 'around';
  return 'start';
};

@customElement('gd-row')
export class GdRow extends GdLayoutElement {
  @property({ type: String, reflect: true }) as: keyof HTMLElementTagNameMap = 'div';
  @property({ type: String, reflect: true }) align: RowAlign = 'stretch';
  @property({ type: String, reflect: true }) justify: RowJustify = 'start';
  @property({ reflect: true }) gutter: number | string = 0;
  @property({ type: Boolean, attribute: 'is-wrap' }) isWrap = true;
  @property({ type: Boolean, attribute: 'is-reversed', reflect: true }) isReversed = false;

  render() {
    const tokens = resolveThemeTree(row, this.theme) as unknown as RowTokens;
    const gap = typeof this.gutter === 'number' ? `${this.gutter}px` : this.gutter || '0px';
    this.adoptStyles(
      [
        buttonCssBlockToText(':host', tokens.webComponent.host),
        buttonCssBlockToText('[part="root"]', tokens.default),
        buttonCssBlockToText('[part="root"]', tokens.webComponent.default),
        this.isReversed ? buttonCssBlockToText('[part="root"]', tokens.webComponent.reversed) : '',
        !this.isWrap ? buttonCssBlockToText('[part="root"]', tokens.webComponent.noWrap) : '',
        buttonCssBlockToText('[part="root"]', tokens.webComponent.align[alignKey(this.align)]),
        buttonCssBlockToText('[part="root"]', tokens.webComponent.justify[justifyKey(this.justify)]),
        buttonCssBlockToText('[part="root"]', { gap }),
        buttonCssBlockToText('[part="root"]', this.boxStyles),
        buttonCssBlockToText('[part="root"]', this.styles),
      ].join('\n')
    );
    const tag = unsafeStatic(this.as || 'div');
    return html`<${tag} part="root" data-testid="Row"><slot></slot></${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-row': GdRow;
  }
}
