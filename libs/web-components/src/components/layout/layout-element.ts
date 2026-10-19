import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import type { ButtonCssBlock, DesignCoreTheme } from 'gd-design-core';

export type BoxStyleValue = string | number;
export type LayoutStyles = Record<string, string | number>;

const boxStyleProperties = [
  'display',
  'overflow',
  'border',
  'minWidth',
  'width',
  'maxWidth',
  'minHeight',
  'height',
  'maxHeight',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'zIndex',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'flexDirection',
  'justifyContent',
  'justifySelf',
  'alignItems',
  'alignSelf',
  'alignContent',
  'flexWrap',
  'flex',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'order',
  'gap',
] as const;

type BoxStyleProperty = (typeof boxStyleProperties)[number];
const unitlessProperties = new Set<BoxStyleProperty>(['zIndex', 'flexGrow', 'flexShrink', 'order']);

/** Shared implementation of the React BoxCssComponentProps contract. */
export abstract class GdLayoutElement extends LitElement {
  @property({ type: String, reflect: true }) display?: BoxStyleValue;
  @property({ type: String, reflect: true }) overflow?: BoxStyleValue;
  @property({ type: String, reflect: true }) border?: BoxStyleValue;
  @property({ type: String, attribute: 'min-width', reflect: true }) minWidth?: BoxStyleValue;
  @property({ type: String, reflect: true }) width?: BoxStyleValue;
  @property({ type: String, attribute: 'max-width', reflect: true }) maxWidth?: BoxStyleValue;
  @property({ type: String, attribute: 'min-height', reflect: true }) minHeight?: BoxStyleValue;
  @property({ type: String, reflect: true }) height?: BoxStyleValue;
  @property({ type: String, attribute: 'max-height', reflect: true }) maxHeight?: BoxStyleValue;
  @property({ type: String, reflect: true }) margin?: BoxStyleValue;
  @property({ type: String, attribute: 'margin-top', reflect: true }) marginTop?: BoxStyleValue;
  @property({ type: String, attribute: 'margin-right', reflect: true }) marginRight?: BoxStyleValue;
  @property({ type: String, attribute: 'margin-bottom', reflect: true }) marginBottom?: BoxStyleValue;
  @property({ type: String, attribute: 'margin-left', reflect: true }) marginLeft?: BoxStyleValue;
  @property({ type: String, reflect: true }) padding?: BoxStyleValue;
  @property({ type: String, attribute: 'padding-top', reflect: true }) paddingTop?: BoxStyleValue;
  @property({ type: String, attribute: 'padding-right', reflect: true }) paddingRight?: BoxStyleValue;
  @property({ type: String, attribute: 'padding-bottom', reflect: true }) paddingBottom?: BoxStyleValue;
  @property({ type: String, attribute: 'padding-left', reflect: true }) paddingLeft?: BoxStyleValue;
  @property({ type: String, attribute: 'z-index', reflect: true }) zIndex?: BoxStyleValue;
  @property({ type: String, reflect: true }) position?: BoxStyleValue;
  @property({ type: String, reflect: true }) top?: BoxStyleValue;
  @property({ type: String, reflect: true }) right?: BoxStyleValue;
  @property({ type: String, reflect: true }) bottom?: BoxStyleValue;
  @property({ type: String, reflect: true }) left?: BoxStyleValue;
  @property({ type: String, attribute: 'flex-direction', reflect: true }) flexDirection?: BoxStyleValue;
  @property({ type: String, attribute: 'justify-content', reflect: true }) justifyContent?: BoxStyleValue;
  @property({ type: String, attribute: 'justify-self', reflect: true }) justifySelf?: BoxStyleValue;
  @property({ type: String, attribute: 'align-items', reflect: true }) alignItems?: BoxStyleValue;
  @property({ type: String, attribute: 'align-self', reflect: true }) alignSelf?: BoxStyleValue;
  @property({ type: String, attribute: 'align-content', reflect: true }) alignContent?: BoxStyleValue;
  @property({ type: String, attribute: 'flex-wrap', reflect: true }) flexWrap?: BoxStyleValue;
  @property({ type: String, reflect: true }) flex?: BoxStyleValue;
  @property({ type: String, attribute: 'flex-grow', reflect: true }) flexGrow?: BoxStyleValue;
  @property({ type: String, attribute: 'flex-shrink', reflect: true }) flexShrink?: BoxStyleValue;
  @property({ type: String, attribute: 'flex-basis', reflect: true }) flexBasis?: BoxStyleValue;
  @property({ type: String, reflect: true }) order?: BoxStyleValue;
  @property({ type: String, reflect: true }) gap?: BoxStyleValue;
  @property({ attribute: false }) styles: LayoutStyles = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  protected get boxStyles(): ButtonCssBlock {
    const styles: LayoutStyles = {};
    for (const propertyName of boxStyleProperties) {
      const value = this[propertyName];
      if (value === undefined || value === '') continue;
      styles[propertyName] = typeof value === 'number' && !unitlessProperties.has(propertyName) ? `${value}px` : value;
    }
    return styles as ButtonCssBlock;
  }

  protected adoptStyles(cssText: string) {
    if (!this.shadowRoot || typeof CSSStyleSheet === 'undefined') return;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
}
