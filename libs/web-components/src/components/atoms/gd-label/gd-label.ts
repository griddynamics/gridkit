import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { label } from 'gd-design-library/tokens';
import { get, resolveThemeTree } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

@customElement('gd-label')
export class GdLabel extends GdThemedElement {
  // The `label` is the root of the source Label: the host must not add a box (or a line box) of its own.
  static styles = css`
    :host {
      display: contents;
    }
  `;

  @property({ type: String, attribute: 'for', reflect: true }) htmlFor?: string;
  /** Gap between the label children; defaults to the `xs` spacing token like the source component. */
  @property({ type: String, reflect: true }) gap?: string;
  /** Accessible label of the rendered label element. */
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
  @property({ attribute: false }) styles: Record<string, string | number> = {};
  render() {
    const tokens = resolveThemeTree(label, this.theme) as { default: Record<string, string | number> };
    const gap = this.gap ?? (get(this.theme, 'spacing.xs', undefined) as string | undefined) ?? '4px';
    // `box-sizing` and the border reset come from the global reset of the source package, which does not reach
    // a shadow root.
    const style = {
      boxSizing: 'border-box',
      borderWidth: 0,
      borderStyle: 'solid',
      ...tokens.default,
      gap,
      ...this.styles,
    };
    return html`<label
      part="label"
      for=${this.htmlFor || nothing}
      aria-label=${this.ariaLabel ?? nothing}
      data-testid="Label"
      style=${styleMap(style)}
      ><slot></slot
    ></label>`;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-label': GdLabel;
  }
}
