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
 * shadow root unmodified, same as any standard DOM element. `type="submit"`/`type="reset"` cannot
 * be a pure passthrough the way the React component's is, because the inner `<button>` sits in a
 * shadow tree that owns no `<form>`; `_onClick` reproduces that activation behaviour explicitly —
 * see its own doc comment for the mechanism and the one documented deviation.
 * `BoxCssComponentProps`'s generic
 * layout escape hatches (`margin`/`width`/`flex*`/etc, the real component's `boxStyles`/`styles`
 * array entries) are intentionally not reproduced as properties — that whole mechanism is
 * inline-style-based in the real component (`convertToInlineBoxStyles`), which would violate
 * this rewrite's no-inline-style constraint; a consumer can still size/position `<gd-button>`
 * from outside via ordinary host page CSS, since Shadow DOM never encapsulates a host element's
 * own box-model properties.
 */
/**
 * Content-keyed Constructable StyleSheet cache (CTORNDSD-646c).
 *
 * Before this existed, every instance owned its own `CSSStyleSheet` and called `replaceSync` on it,
 * so 300 buttons with identical props paid 300 sheet constructions and 300 CSS parses. Emotion, by
 * contrast, caches a generated class per unique style combination and reuses it. `FINDINGS.md`
 * Section 14 named that asymmetry as the hypothesis for Lit's slower mount and left it untested.
 *
 * This is the test: one shared, immutable sheet per unique CSS text, adopted by every instance that
 * resolves to that text. Buttons with different props/themes get different sheets, so correctness is
 * unchanged — only the duplicate work is removed.
 *
 * **Memory tradeoff, stated rather than hidden.** The map is keyed by full CSS text and never
 * evicted. For a design system this is bounded in practice: distinct texts = variants × states ×
 * themes actually in use, a few dozen at most. It is *not* bounded if a consumer assigns a fresh
 * per-instance theme object with different values to every element — that is the pathological case
 * where this cache is pure overhead, and it grows unboundedly. No real consumer does this (a theme
 * is an app- or brand-level object), but a bounded LRU would be the fix if one ever did.
 *
 * The sheets are never mutated after construction, which is what makes sharing safe: a `replaceSync`
 * on a shared sheet would affect every adopter.
 */
const SHARED_SHEETS = new Map<string, CSSStyleSheet>();

function sharedSheetFor(cssText: string): CSSStyleSheet {
  let sheet = SHARED_SHEETS.get(cssText);
  if (sheet === undefined) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    SHARED_SHEETS.set(cssText, sheet);
  }
  return sheet;
}

/** Test/diagnostic hook — how many distinct CSS texts have been constructed this session. */
export function __sharedSheetCacheSize(): number {
  return SHARED_SHEETS.size;
}

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

  private _adoptedSheet?: CSSStyleSheet;
  private _lastCssText = '';

  connectedCallback() {
    super.connectedCallback();
    // The dynamic sheet is adopted in render(), once its CSS text is known — see
    // `sharedSheetFor`. Nothing to do here; `static styles` is adopted by Lit itself.
  }

  private _onSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const hasNodes = slot.assignedNodes({ flatten: true }).length > 0;
    if (slot.name === 'icon-start') this._hasIconStart = hasNodes;
    else if (slot.name === 'icon-end') this._hasIconEnd = hasNodes;
    else this._hasContent = hasNodes;
  }

  /**
   * `type="submit"` / `type="reset"` activation behaviour, reproduced in JS because the platform
   * cannot do it here (CTORNDSD-646b).
   *
   * A submit/reset button's form owner is "the nearest ancestor `form` element **in its tree**".
   * The real `<button>` lives in this component's shadow root, and that tree contains no `<form>`
   * — so `innerButton.form` is `null` and a click, even a fully trusted one, submits nothing.
   * The React `Button` renders into the light DOM and gets all of this from the browser for free;
   * this method is what keeps the port's `type` prop from being decorative. Confirmed against a
   * trusted CDP click in `harness/form-participation-check.ts`, not a synthetic one — FINDINGS.md
   * Section 6 documents a false negative from exactly that shortcut.
   *
   * `this.closest('form')` is the faithful lookup precisely *because* it does not pierce shadow
   * boundaries: it walks this element's own tree, which is the same scoping rule the platform's
   * form-owner algorithm uses. A native `<button>` slotted into a component whose shadow root
   * holds the `<form>` has no form owner either.
   *
   * **Deferred to a task, and a microtask is NOT sufficient — measured, not assumed.** Native
   * activation behaviour runs *after* the click event finishes dispatching, which is what lets a
   * consumer's `preventDefault()` cancel the submission. This listener sits on the inner button —
   * the innermost node in the propagation path — so it always runs FIRST, and a synchronous read
   * of `event.defaultPrevented` would be `false` even when a host listener is about to set it.
   *
   * `queueMicrotask` looks like the fix and is a trap. Under a TRUSTED click the browser initiates
   * dispatch from native code, so the JS stack empties after each listener callback and a microtask
   * checkpoint runs *between* listeners — the microtask fires before the host listener and still
   * reads `false`. Under a synthetic `el.click()` the whole dispatch sits inside one JS stack frame,
   * no checkpoint occurs mid-dispatch, and the microtask correctly reads `true`. So a microtask
   * implementation passes a synthetic test and breaks for real users: the inverse of FINDINGS.md
   * Section 6's false negative, and the reason the spec for this uses `userEvent`. Verified
   * ordering, trusted click: `inner-listener → microtask(false) → host-listener → timeout(true)`.
   *
   * A task-queue deferral is therefore the smallest correct option — it resumes after the entire
   * dispatch, so `preventDefault()` from anywhere in the path (host, or any light-DOM ancestor)
   * cancels the submission, matching the React component. Form submission needs no transient user
   * activation, and one task is well inside the activation window regardless.
   *
   * `requestSubmit()` (not `submit()`) then runs interactive validation and fires a cancelable
   * `submit` event, matching a real submit button rather than bypassing the form's constraints.
   *
   * Known deviation: `event.submitter` is `null`, because `requestSubmit(submitter)` demands a
   * submit button already associated with the form and this one — by the very problem above —
   * is not. Nothing is lost in FormData terms: `ButtonProps` exposes no `name`/`value`, so a real
   * `<Button type="submit">` contributes no entry either.
   */
  private _onClick(event: MouseEvent) {
    if (this.type === 'button') return;
    // Defensive only: the browser does not dispatch click on a disabled button, and `isLoading`
    // sets `?disabled` too (see `isDisabled` in render()).
    if (this.disabled || this.isLoading) return;

    const form = this.closest('form');
    if (form === null) return;

    const type = this.type;
    setTimeout(() => {
      if (event.defaultPrevented) return;
      if (type === 'submit') form.requestSubmit();
      else form.reset();
    }, 0);
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
    // `shadowRoot` is null during server-side rendering (@lit-labs/ssr calls render() without ever
    // attaching one) and Constructable StyleSheets do not exist in Node at all — so this whole block
    // is client-only. Guarding it here rather than in connectedCallback because that is what SSR
    // skips: an unguarded `this.shadowRoot!` throws
    // "Cannot read properties of null (reading 'adoptedStyleSheets')" and takes the SSR render down
    // with it. Regression found by `npm run check:web-components-ssr`; see FINDINGS.md §18.7.
    const root = this.shadowRoot;
    if (root && (cssText !== this._lastCssText || this._adoptedSheet === undefined)) {
      this._lastCssText = cssText;
      const next = sharedSheetFor(cssText);
      if (next !== this._adoptedSheet) {
        // Swap which shared sheet this instance adopts. Never mutate the sheet itself — it is
        // shared with every other instance resolving to the same CSS text.
        const kept = root.adoptedStyleSheets.filter((s) => s !== this._adoptedSheet);
        root.adoptedStyleSheets = [...kept, next];
        this._adoptedSheet = next;
      }
    }

    // `part` attributes (CTORNDSD-646b) expose these internals to consumer CSS via
    // `gd-button::part(button)` etc. Note the part names are intentionally the short semantic role
    // (`content`, `icon-start`) rather than the internal class names (`gd-button__content`): the
    // classes are an implementation detail the dynamic stylesheet targets, while part names are a
    // public API and must stay stable even if the internal class naming changes.
    return html`
      <button
        part="button"
        type=${this.type}
        role=${this.role}
        tabindex=${this.tabIndex}
        ?disabled=${isDisabled}
        @click=${this._onClick}
        aria-busy=${this.isLoading || nothing}
        aria-label=${this.ariaLabel ?? nothing}
        aria-pressed=${this.ariaPressed ?? nothing}
      >
        ${this._hasIconStart
          ? html`<span class="gd-button__icon-start" part="icon-start"
              ><slot name="icon-start" @slotchange=${this._onSlotChange}></slot
            ></span>`
          : html`<slot name="icon-start" @slotchange=${this._onSlotChange}></slot>`}
        ${this._hasContent
          ? html`<span class="gd-button__content" part="content"><slot @slotchange=${this._onSlotChange}></slot></span>`
          : html`<slot @slotchange=${this._onSlotChange}></slot>`}
        ${this._hasIconEnd
          ? html`<span class="gd-button__icon-end" part="icon-end"
              ><slot name="icon-end" @slotchange=${this._onSlotChange}></slot
            ></span>`
          : html`<slot name="icon-end" @slotchange=${this._onSlotChange}></slot>`}
        ${this.isLoading ? html`<span class="spinner" part="spinner" aria-hidden="true"></span>` : nothing}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-button': GdButton;
  }
}
