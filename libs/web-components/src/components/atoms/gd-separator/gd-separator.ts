import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { separator, resolveThemeColor } from 'gd-design-library/tokens';
import { buttonCssBlockToText, get, resolveThemeTree, type ButtonCssBlock, type DesignCoreTheme } from 'gd-design-core';
import '../gd-typography/gd-typography';

type SeparatorOrientation = 'horizontal' | 'vertical';
type SeparatorVariant = 'solid' | 'dashed' | 'dotted';
type SeparatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type SeparatorLabelPosition = 'start' | 'center' | 'end';
type SeparatorTag = 'div' | 'hr' | 'span';
type CssBlock = ButtonCssBlock;

const labelTypography: Record<SeparatorSize, { variant: string; as: string }> = {
  xs: { variant: 'caption', as: 'span' },
  sm: { variant: 'body2', as: 'span' },
  md: { variant: 'body1', as: 'span' },
  lg: { variant: 'h6', as: 'h6' },
  xl: { variant: 'h5', as: 'h5' },
  xxl: { variant: 'h4', as: 'h4' },
};

@customElement('gd-separator')
export class GdSeparator extends LitElement {
  @property({ type: String, reflect: true }) orientation: SeparatorOrientation = 'horizontal';
  @property({ type: String, reflect: true }) length?: string;
  @property({ type: String, reflect: true }) color?: string;
  @property({ type: String, reflect: true }) size: SeparatorSize = 'sm';
  @property({ type: String, reflect: true }) variant: SeparatorVariant = 'solid';
  @property({ type: String, reflect: true }) as: SeparatorTag = 'div';
  @property({ type: String, reflect: true }) label?: string;
  @property({ type: String, attribute: 'label-position', reflect: true }) labelPosition: SeparatorLabelPosition =
    'center';
  @property({ type: String, attribute: 'label-color', reflect: true }) labelColor?: string;
  @property({ attribute: false }) styles: CssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  private line() {
    const tag = unsafeStatic(this.as === 'hr' ? 'hr' : this.as);
    return staticHtml`<${tag} class="line" part="line"></${tag}>`;
  }

  private labelNode() {
    if (!this.label) return null;
    const typography = labelTypography[this.size];
    return html`<gd-typography
      part="label"
      variant=${typography.variant}
      as=${typography.as}
      color=${this.labelColor ?? 'text.caption'}
      .theme=${this.theme}
      >${this.label}</gd-typography
    >`;
  }

  render() {
    const tokens = resolveThemeTree(separator, this.theme) as unknown as {
      default: CssBlock;
      horizontal: CssBlock;
      vertical: CssBlock;
      line: { default: CssBlock; horizontal: CssBlock; vertical: CssBlock };
      label: { default: CssBlock };
    };
    const lineColor = resolveThemeColor(this.theme.colors as never, this.color ?? 'border.default');
    const thickness = get(this.theme, `values.separator.thickness.${this.size}`, '1px');
    const borderSide = this.orientation === 'horizontal' ? 'borderTop' : 'borderLeft';
    const lengthStyle = this.length ? { [this.orientation === 'horizontal' ? 'width' : 'height']: this.length } : {};
    const cssText = [
      buttonCssBlockToText('.separator', tokens.default),
      buttonCssBlockToText('.separator', tokens[this.orientation]),
      buttonCssBlockToText('.separator', lengthStyle),
      buttonCssBlockToText('.separator', this.styles),
      buttonCssBlockToText('.line', tokens.line.default),
      buttonCssBlockToText('.line', tokens.line[this.orientation]),
      buttonCssBlockToText('.line', { [borderSide]: `${thickness} ${this.variant} ${lineColor}` }),
      buttonCssBlockToText('gd-typography', tokens.label.default),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }

    const hasLabel = Boolean(this.label);
    const wrapperTag = unsafeStatic(this.as === 'hr' && hasLabel ? 'div' : this.as);
    const first = this.line();
    const label = this.labelNode();
    return staticHtml`<${wrapperTag} class="separator" part="separator">
      ${hasLabel && this.labelPosition === 'start' ? label : null}
      ${first}
      ${hasLabel && this.labelPosition === 'center' ? html`${label}${this.line()}` : null}
      ${hasLabel && this.labelPosition === 'end' ? label : null}
    </${wrapperTag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-separator': GdSeparator;
  }
}
