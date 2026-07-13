import { LitElement, css, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { literal, html as staticHtml, type StaticValue } from 'lit/static-html.js';
import { styleMap } from 'lit/directives/style-map.js';
import {
  resolveTypographyStyle,
  type TypographyVariantName,
  type TypographyStyleVariantName,
  type DesignCoreTheme,
} from 'gd-design-core';

/**
 * CTORNDSD-581 Typography port (per the implementation plan's Migration Example). Uses
 * `lit/static-html.js` because standard Lit `html` cannot parameterize a tag name — the
 * closest equivalent to React's `Component = $as || $variant || 'span'` polymorphism
 * renders a variable *internal* tag inside the shadow root, which is a materially
 * different guarantee than the React original.
 *
 * First-class finding (semantic/discoverability gap, not just implementation cost):
 * `document.querySelector('h1')` will never match `<gd-typography as="h1">` — it matches
 * `gd-typography`, with an inner `<h1>` inside its shadow root. Evergreen browsers
 * correctly flatten shadow content into the accessibility tree, but any code that queries
 * by light-DOM tag name (host app, browser extension, older assistive tech, testing-library
 * selectors like `getByRole` traversal shortcuts, `document.querySelector`) will not find it
 * the way it would a real `<h1>`. This is structural, not cosmetic — the same conclusion
 * CTORNDSD-590's independent React Native research reached for the same component (RN's
 * `Text` has no tag concept at all).
 */
@customElement('gd-typography')
export class GdTypography extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
  `;

  @property({ type: String }) variant: TypographyVariantName = 'span';
  @property({ type: String }) as: keyof HTMLElementTagNameMap = 'span';
  @property({ attribute: 'style-variant' }) styleVariant?: TypographyStyleVariantName | TypographyStyleVariantName[];
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  private static readonly TAG_MAP: Partial<Record<keyof HTMLElementTagNameMap, StaticValue>> = {
    span: literal`span`,
    p: literal`p`,
    div: literal`div`,
    label: literal`label`,
    h1: literal`h1`,
    h2: literal`h2`,
    h3: literal`h3`,
    h4: literal`h4`,
    h5: literal`h5`,
    h6: literal`h6`,
    header: literal`header`,
    small: literal`small`,
    code: literal`code`,
    kbd: literal`kbd`,
  };

  willUpdate(changed: PropertyValues<this>) {
    if (!changed.has('as') && changed.has('variant') && !this.hasAttribute('as')) {
      // Mirrors the React original's `$as || $variant || 'span'` fallback: when no
      // explicit `as` is set, the DOM tag tracks `variant` for the variants that map
      // to a real HTML tag (h1-h6, p); everything else stays `span`.
      const variantTag = (GdTypography.TAG_MAP as Record<string, StaticValue>)[this.variant] ? this.variant : 'span';
      this.as = variantTag as keyof HTMLElementTagNameMap;
    }
  }

  render() {
    const resolved = resolveTypographyStyle(this.theme, this.variant, this.styleVariant);
    const tag = GdTypography.TAG_MAP[this.as] ?? literal`span`;

    const style = {
      fontFamily: `${resolved.fontFamily}`,
      ...(resolved.fontSize !== undefined ? { fontSize: `${resolved.fontSize}` } : {}),
      ...(resolved.fontWeight !== undefined ? { fontWeight: `${resolved.fontWeight}` } : {}),
      ...(resolved.lineHeight !== undefined ? { lineHeight: `${resolved.lineHeight}` } : {}),
      ...(resolved.fontStyle ? { fontStyle: resolved.fontStyle } : {}),
      ...(resolved.textTransform ? { textTransform: resolved.textTransform } : {}),
      ...(resolved.textDecoration ? { textDecoration: resolved.textDecoration } : {}),
      ...(resolved.marginTop !== undefined ? { marginTop: resolved.marginTop } : {}),
      ...(resolved.marginBottom !== undefined ? { marginBottom: resolved.marginBottom } : {}),
    };

    return staticHtml`<${tag} style=${styleMap(style)}><slot></slot></${tag}>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-typography': GdTypography;
  }
}
