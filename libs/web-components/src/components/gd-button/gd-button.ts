import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import {
  resolveButtonRadius,
  resolveThemeTree,
  buttonCssBlockToText,
  get,
  type ButtonVariantName,
  type ButtonRoundedName,
  type ButtonTokenTree,
  type DesignCoreTheme,
} from 'gd-design-core';
import { button } from 'gd-design-library/tokens';

/** Mirrors `Button.types.ts`'s `ButtonStyledProps['$rounded']`. Button's own default is
 *  `rounded="none"` (`button.ts`'s `attrs.rounded: 'none'`), i.e. square corners. */
export type ButtonRounded = ButtonRoundedName;

/** Mirrors `libs/ui/src/types/button.ts`'s `ButtonTypes` string values. */
export type ButtonType = 'button' | 'submit' | 'reset';

/** Mirrors `libs/ui/src/types/button.ts`'s `ButtonRole` string values. */
export type ButtonRoleName = 'button' | 'link' | 'checkbox' | 'switch' | 'tab';

/**
 * Button port — DOM structure, class names, and CSS-composition layering mirror
 * `ButtonStyled.tsx` directly:
 *
 * ```
 * <button css={componentStyles} className={className}>     <button class="gd-button">
 *   <StartIconStyled>{iconStart}</StartIconStyled>    -->     <span class="gd-button__icon-start">
 *   <ContentStyled>{children}</ContentStyled>         -->     <span class="gd-button__content">
 *   <EndIconStyled>{iconEnd}</EndIconStyled>          -->     <span class="gd-button__icon-end">
 *   {isLoading && <Loader/>}                          -->     <span class="spinner">
 * ```
 *
 * Each of the three child spans is only rendered when its slot actually has assigned content
 * (`_hasIconStart`/`_hasContent`/`_hasIconEnd`, tracked via `slotchange`) — exactly like the
 * real component's `{iconStart ? <StartIconStyled>... : null}` conditionals — so an unused
 * icon slot doesn't consume a `gap` space the way an always-rendered empty element would.
 *
 * `componentStyles`'s array — `[get(themeButton,'default',{}), get(themeButton,$variant,{}),
 * boxStyles, icon?, fullWidth?, {borderRadius, focus-visible}, styles]` — is reproduced
 * *directly*, not hand-flattened, and not from a hand-copied mirror either: `render()` imports
 * the REAL `button` object straight from `gd-design-library/tokens` (the same file
 * `ButtonStyled.tsx` itself reads) and resolves every `(theme) => value` leaf with
 * `gd-design-core`'s generic `resolveThemeTree(button, theme)` — so any edit to
 * `libs/ui/src/tokens/button.ts` is picked up automatically, with no second copy of the data to
 * keep in sync. `buttonCssBlockToText(selector, block)` then compiles a resolved slice of it
 * into real CSS text — the same two-step "resolve a token slice by path, then compile it" the
 * real component does via `get(themeButton, path, {})` + Emotion's `css` prop, just done by hand
 * since Lit has no Emotion-equivalent compiler. `render()` picks each slice
 * by the exact same path a real consumer would (`tokens.default`, `tokens[this.variant]`,
 * `tokens.icon`, `tokens.fullWidth`, `tokens.content.default`, `tokens.startIcon.default`,
 * `tokens.endIcon.default`) and concatenates them in the same order the real array does, so
 * later blocks override earlier ones for the same property exactly like array-later Emotion
 * objects winning. `boxStyles`/consumer `styles` have no equivalent — see below for why.
 *
 * Styling mechanism: a per-instance `CSSStyleSheet` (Constructable Stylesheets), regenerated
 * and swapped in via `replaceSync()` whenever `theme`/`variant`/`rounded`/state changes — never
 * the `style="..."` attribute, never Lit's `styleMap`. Real CSS pseudo-classes (`:hover`,
 * `:active`, `:disabled`, `:focus-visible`) drive interaction states natively, straight from
 * `button.ts`'s own selector strings — the browser's own style engine owns state transitions,
 * exactly like the real component, not a JS approximation of it. `button.ts`'s
 * `'&:disabled, &:disabled *'` selector (note the trailing `*`) means the disabled-color rule
 * already targets every descendant, including the content/icon spans — so they mute to
 * `colors.text.disabled` via real CSS inheritance-through-selector, with no extra JS needed to
 * re-apply color to the label span the way a flattened, span-only model would require.
 * `transition` is additionally applied directly to `.gd-button__content`/`.gd-button__icon-*`,
 * since a CSS `transition` only animates an element's OWN computed-style changes — a child span
 * whose `color` merely inherits the button's animated color still needs its own `transition`
 * declaration to animate in step. Truly static, non-token structural CSS (`display`, `cursor`
 * mechanics, the loading-spinner keyframes) stays in Lit's normal shared `static styles`, since
 * it never varies per instance or theme.
 *
 * The focus ring matches the real component's actual mechanism — `getFocusStyles` in
 * `libs/ui/src/tokens/utils.ts` is a `::after` pseudo-element positioned with `inset: -4px`
 * and a real border, not an `outline` (the previous port's approximation) — it's the literal
 * `default['&:focus-visible']` value in the real `button` object, resolved here the same as
 * everything else via `resolveThemeTree`.
 *
 * Every variant/state/theme-driven value in `tokens` IS `libs/ui/src/tokens/button.ts`'s real
 * `button` export, resolved against `this.theme` — not a hand-copied mirror of it. `radius`
 * still comes from `gd-design-core`'s `resolveButtonRadius` (shared with React web/React
 * Native's flattened `resolveButtonVariantStyle`), since `borderRadius` is deliberately absent
 * from the real `button` object — the real component composes it as its own separate, later
 * array entry because it depends on the `rounded` prop, not on anything in `button.ts` itself;
 * reproduced the same way below. `fontFamily`/`fontSize` are likewise not part of the real
 * `button` object (the real component gets them from `Typography`, not `ButtonStyled`'s own
 * token slice) — `render()` reads them from the shared `font.*` theme tokens directly via `get()`.
 *
 * Mirrors `Button.tsx`'s props exactly, adapted to attribute/property equivalents where
 * React-specific concepts (event-handler props, `ReactNode` slots) don't apply 1:1:
 * `iconStart`/`iconEnd` are named slots (`icon-start`/`icon-end`) instead of `ReactNode` props;
 * `onClick` has no property equivalent — consumers use the native `click` event
 * (`el.addEventListener('click', ...)` or `el.onclick = ...`), which already bubbles out of the
 * shadow root unmodified, same as any standard DOM element. `BoxCssComponentProps`'s generic
 * layout escape hatches (`margin`/`width`/`flex*`/etc, the real component's `boxStyles`/`styles`
 * array entries) are intentionally not reproduced as properties — that whole mechanism is
 * inline-style-based in the real component (`convertToInlineBoxStyles`), which would violate
 * this rewrite's no-inline-style constraint; a consumer can still size/position `<gd-button>`
 * from outside via ordinary host page CSS, since Shadow DOM never encapsulates a host element's
 * own box-model properties.
 */
@customElement('gd-button')
export class GdButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
    }
    button:disabled {
      cursor: default;
    }
    /* The real focus indicator is the ::after ring built in _buildCssText (matching
       getFocusStyles' inset -4px + real border) — reset the browser's own default
       :focus-visible outline so it isn't ALSO visible as a second, redundant ring. */
    button:focus-visible {
      outline: none;
    }
    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: 9999px;
      animation: gd-button-spin 0.6s linear infinite;
    }
    @keyframes gd-button-spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String }) variant: ButtonVariantName = 'primary';
  @property({ type: String }) rounded: ButtonRounded = 'none';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean }) isLoading = false;
  @property({ type: Boolean }) isIcon = false;
  @property({ type: Boolean }) fullWidth = false;
  @property({ type: String }) type: ButtonType = 'button';
  @property({ type: String }) role: ButtonRoleName = 'button';
  @property({ type: Number }) tabIndex = 0;
  @property({ type: String, attribute: 'aria-label' }) ariaLabel: string | null = null;
  /** ARIAMixin's real, platform type is `string | null` (`'true' | 'false' | 'mixed' | null`),
   *  not boolean — matching it here (rather than the real component's React-convenience
   *  `boolean` prop, which JSX/React coerces to a string attribute automatically) avoids
   *  overriding `HTMLElement`'s own native `ariaPressed` accessor with an incompatible type. */
  @property({ type: String, attribute: 'aria-pressed' }) ariaPressed: string | null = null;
  @property({ type: String }) justifyContent?: string;
  @property({ attribute: false }) theme: DesignCoreTheme = {};

  /** Tracks whether each named/default slot actually has assigned content — mirrors
   *  `Button.tsx`'s `{iconStart ? <StartIconStyled>... : null}` conditionals, which a bare
   *  always-rendered `<slot>` can't reproduce (an empty slot still occupies a `gap` track). */
  @state() private _hasIconStart = false;
  @state() private _hasContent = false;
  @state() private _hasIconEnd = false;

  private readonly _dynamicSheet = new CSSStyleSheet();
  private _lastCssText = '';

  connectedCallback() {
    super.connectedCallback();
    const sheets = this.shadowRoot!.adoptedStyleSheets;
    if (!sheets.includes(this._dynamicSheet)) {
      this.shadowRoot!.adoptedStyleSheets = [...sheets, this._dynamicSheet];
    }
  }

  private _onSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const hasNodes = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === 'icon-start') this._hasIconStart = hasNodes;
    else if (slot.name === 'icon-end') this._hasIconEnd = hasNodes;
    else this._hasContent = hasNodes;
  }

  /**
   * `[get(themeButton,'default',{}), get(themeButton,$variant,{}), boxStyles, icon?,
   * fullWidth?, {borderRadius, focus-visible}, styles]`, reproduced block-for-block: each
   * `tokens.*` lookup below is the same path a real consumer would read, compiled to CSS text
   * via `buttonCssBlockToText` instead of Emotion. `tokens.default.transition` is re-applied to
   * the child spans too (see the class doc above for why a shared `transition` value needs
   * restating per element, not just on `button`).
   */
  private _buildCssText(tokens: ButtonTokenTree, radius: string): string {
    const variantTokens = tokens[this.variant] ?? tokens.primary;

    return [
      buttonCssBlockToText('button', tokens.default),
      buttonCssBlockToText('button', variantTokens),
      this.isIcon ? buttonCssBlockToText('button', tokens.icon) : '',
      this.fullWidth ? buttonCssBlockToText('button', tokens.fullWidth) : '',
      buttonCssBlockToText('button', {
        borderRadius: radius,
        '&:focus-visible::after': { borderRadius: radius },
      }),
      buttonCssBlockToText('.gd-button__content', tokens.content.default),
      this.justifyContent ? buttonCssBlockToText('.gd-button__content', { justifyContent: this.justifyContent }) : '',
      buttonCssBlockToText('.gd-button__icon-start', tokens.startIcon.default),
      buttonCssBlockToText('.gd-button__icon-end', tokens.endIcon.default),
      buttonCssBlockToText('.gd-button__content, .gd-button__icon-start, .gd-button__icon-end', {
        transition: tokens.default.transition,
      }),
    ].join('\n');
  }

  render() {
    const resolvedTree = resolveThemeTree(button, this.theme) as unknown as ButtonTokenTree;
    const tokens: ButtonTokenTree = {
      ...resolvedTree,
      default: {
        ...resolvedTree.default,
        fontFamily: get(this.theme, 'font.family', '"Fira Sans", sans-serif'),
        fontSize: get(this.theme, 'font.size.p', '16px'),
      },
    };
    const radius = resolveButtonRadius(this.theme, this.rounded);
    const isDisabled = this.disabled || this.isLoading;

    const cssText = this._buildCssText(tokens, radius);
    if (cssText !== this._lastCssText) {
      this._lastCssText = cssText;
      this._dynamicSheet.replaceSync(cssText);
    }

    return html`
      <button
        type=${this.type}
        role=${this.role}
        tabindex=${this.tabIndex}
        ?disabled=${isDisabled}
        aria-busy=${this.isLoading || nothing}
        aria-label=${this.ariaLabel ?? nothing}
        aria-pressed=${this.ariaPressed ?? nothing}
      >
        ${this._hasIconStart
          ? html`<span class="gd-button__icon-start"
              ><slot name="icon-start" @slotchange=${this._onSlotChange}></slot
            ></span>`
          : html`<slot name="icon-start" @slotchange=${this._onSlotChange}></slot>`}
        ${this._hasContent
          ? html`<span class="gd-button__content"><slot @slotchange=${this._onSlotChange}></slot></span>`
          : html`<slot @slotchange=${this._onSlotChange}></slot>`}
        ${this._hasIconEnd
          ? html`<span class="gd-button__icon-end"
              ><slot name="icon-end" @slotchange=${this._onSlotChange}></slot
            ></span>`
          : html`<slot name="icon-end" @slotchange=${this._onSlotChange}></slot>`}
        ${this.isLoading ? html`<span class="spinner" aria-hidden="true"></span>` : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-button': GdButton;
  }
}
