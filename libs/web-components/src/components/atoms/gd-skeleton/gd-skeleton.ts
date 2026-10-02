import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { animations, resolveThemeColor, skeleton } from 'gd-design-library/tokens';
import {
  buttonCssBlockToText,
  get,
  keyframesCssBlockToText,
  resolveThemeTree,
  type ButtonCssBlock,
  type DesignCoreTheme,
} from 'gd-design-core';

type SkeletonVariant = 'rounded' | 'rectangular' | 'circular';
type CssBlock = ButtonCssBlock;

@customElement('gd-skeleton')
export class GdSkeleton extends LitElement {
  @property({ type: String, reflect: true }) variant: SkeletonVariant = 'rounded';
  @property({ type: String, reflect: true }) width?: string;
  @property({ type: String, reflect: true }) height?: string;
  @property({ type: String, attribute: 'background-color', reflect: true }) backgroundColor?: string;
  @property({ type: String, attribute: 'animation-name' }) animationName: string | null = 'blinkKeyframes';
  @property({ type: String, attribute: 'animation-props' }) animationProps = '2000ms ease-in-out 500ms infinite';
  @property({ attribute: false }) styles: CssBlock = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  render() {
    const skeletonTokens = get(this.theme, 'skeleton', skeleton) as typeof skeleton;
    const animationTokens = get(this.theme, 'animations', animations) as typeof animations;
    const tokens = resolveThemeTree(skeletonTokens, this.theme) as unknown as Record<string, CssBlock>;
    const resolvedAnimations = resolveThemeTree(animationTokens, this.theme) as unknown as Record<string, CssBlock>;
    const themeFrames = this.animationName ? resolvedAnimations[this.animationName] : undefined;
    const animationCssName = themeFrames ? 'gd-skeleton-animation' : this.animationName;
    const dimensions: CssBlock = {
      ...(this.width ? { width: this.width } : {}),
      ...(this.height ? { height: this.height } : {}),
    };
    const resolvedBackground = this.backgroundColor
      ? resolveThemeColor(this.theme.colors as never, this.backgroundColor)
      : undefined;
    const background: CssBlock = resolvedBackground ? { backgroundColor: resolvedBackground } : {};
    const cssText = [
      buttonCssBlockToText('.skeleton', tokens.default),
      buttonCssBlockToText('.skeleton', tokens[this.variant]),
      buttonCssBlockToText('.skeleton', dimensions),
      buttonCssBlockToText('.skeleton', background),
      animationCssName
        ? buttonCssBlockToText('.skeleton', { animation: `${animationCssName} ${this.animationProps}` })
        : '',
      buttonCssBlockToText('.skeleton', this.styles),
      keyframesCssBlockToText('gd-skeleton-animation', themeFrames),
    ].join('\n');
    if (this.shadowRoot && typeof CSSStyleSheet !== 'undefined') {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(cssText);
      this.shadowRoot.adoptedStyleSheets = [sheet];
    }
    return html`<span class="skeleton" part="skeleton"><slot></slot></span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-skeleton': GdSkeleton;
  }
}
