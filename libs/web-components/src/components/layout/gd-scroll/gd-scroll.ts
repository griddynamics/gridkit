import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import { scroll } from 'gd-design-library/tokens';
import { buttonCssBlockToText, cssPropertyValueToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

export type ScrollbarVisibility = 'auto' | 'hidden' | 'visible';
type ScrollDirection = 'vertical' | 'horizontal';
type ResolvedScrollTokens = {
  container: { default: ButtonCssBlock };
  content: { default: ButtonCssBlock; horizontalHidden: ButtonCssBlock };
  scrollbars: { default: ButtonCssBlock };
  scrollbar: Record<'default' | ScrollDirection | 'autoHide' | 'autoHideScrolling', ButtonCssBlock>;
  thumb: Record<'default' | ScrollDirection | 'autoHide' | 'autoHideScrolling', ButtonCssBlock>;
};

const AUTO_HIDE_MS = 1000;
const OVERFLOW_MEASUREMENT_MS = 300;
const toKebabCase = (property: string) => property.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

@customElement('gd-scroll')
export class GdScroll extends GdThemedElement {
  @property({ type: String, reflect: true }) vertical: ScrollbarVisibility = 'auto';
  @property({ type: String, reflect: true }) horizontal: ScrollbarVisibility = 'auto';
  @property({ type: Boolean, attribute: 'auto-hide', reflect: true }) autoHide = false;
  @property({ attribute: false }) styles: ButtonCssBlock = {};

  @state() private _showVertical = false;
  @state() private _showHorizontal = false;
  @state() private _isScrolling = false;

  @query('slot') private _slot!: HTMLSlotElement;

  private _resizeObserver?: ResizeObserver;
  private _measureInterval?: ReturnType<typeof setInterval>;
  private _scrollTimeout?: ReturnType<typeof setTimeout>;
  private _drag?: { direction: ScrollDirection; offset: number };
  private _ruleSheet?: CSSStyleSheet;
  private _ruleText = '';
  private _managedHostStyles = new Map<string, string>();

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('scroll', this._onScroll, { passive: true });
    if (this.hasUpdated) this._startMeasurement();
  }

  disconnectedCallback() {
    this.removeEventListener('scroll', this._onScroll);
    this._resizeObserver?.disconnect();
    if (this._measureInterval !== undefined) clearInterval(this._measureInterval);
    this._measureInterval = undefined;
    if (this._scrollTimeout !== undefined) clearTimeout(this._scrollTimeout);
    this._removeDragListeners();
    super.disconnectedCallback();
  }

  protected firstUpdated() {
    this._resizeObserver = new ResizeObserver(() => this.refresh());
    this._resizeObserver.observe(this);
    this._observeSlottedContent();
    this._startMeasurement();
  }

  protected updated() {
    this._applyHostStyles();
    this._applyTokenStyles();
  }

  /** Re-measures overflow and thumb geometry after imperative content changes. */
  refresh() {
    const verticalOverflow = Math.ceil((this.clientHeight / this.scrollHeight) * 100) < 100;
    const horizontalOverflow = Math.ceil((this.clientWidth / this.scrollWidth) * 100) < 100;
    this._showVertical = this._isVisible(this.vertical, verticalOverflow);
    this._showHorizontal = this._isVisible(this.horizontal, horizontalOverflow);
  }

  private _startMeasurement() {
    if (this._measureInterval !== undefined) return;
    this._measureInterval = setInterval(() => this.refresh(), OVERFLOW_MEASUREMENT_MS);
  }

  private _isVisible(mode: ScrollbarVisibility, overflow: boolean) {
    if (mode === 'visible') return true;
    if (mode === 'hidden') return false;
    return overflow;
  }

  private _onSlotChange = () => {
    this._observeSlottedContent();
    this.refresh();
  };

  private _observeSlottedContent() {
    if (!this._resizeObserver || !this._slot) return;
    this._resizeObserver.disconnect();
    this._resizeObserver.observe(this);
    for (const element of this._slot.assignedElements({ flatten: true })) this._resizeObserver.observe(element);
  }

  private _onScroll = () => {
    this.requestUpdate();
    this.refresh();
    if (!this.autoHide) return;
    this._isScrolling = true;
    if (this._scrollTimeout !== undefined) clearTimeout(this._scrollTimeout);
    this._scrollTimeout = setTimeout(() => {
      this._isScrolling = false;
    }, AUTO_HIDE_MS);
  };

  private _thumbGeometry(direction: ScrollDirection): Record<string, string> {
    const viewport = direction === 'vertical' ? this.clientHeight : this.clientWidth;
    const extent = direction === 'vertical' ? this.scrollHeight : this.scrollWidth;
    const offset = direction === 'vertical' ? this.scrollTop : this.scrollLeft;
    if (
      !Number.isFinite(viewport) ||
      !Number.isFinite(extent) ||
      !Number.isFinite(offset) ||
      viewport <= 0 ||
      extent <= viewport
    ) {
      return direction === 'vertical' ? { top: '0%', height: '100%' } : { left: '0%', width: '100%' };
    }

    const view = Math.ceil((viewport / extent) * 100) / 100;
    const scrolled = offset / (extent - viewport);
    const minimumCompensation = (viewport * viewport) / extent > 24 ? 0 : 24 / viewport;
    const position = scrolled * (1 - (minimumCompensation || view));
    return direction === 'vertical'
      ? { top: `${position * 100}%`, height: `${view * 100}%` }
      : { left: `${position * 100}%`, width: `${view * 100}%` };
  }

  private _onPointerDown(event: PointerEvent, direction: ScrollDirection) {
    const thumb = event.currentTarget as HTMLElement;
    const rect = thumb.getBoundingClientRect();
    const offset =
      direction === 'vertical' ? (event.clientY - rect.top) / rect.height : (event.clientX - rect.left) / rect.width;
    this._drag = { direction, offset };
    event.preventDefault();
    event.stopPropagation();
    document.addEventListener('pointermove', this._onPointerMove);
    document.addEventListener('pointerup', this._onPointerUp, { once: true });
  }

  private _onPointerMove = (event: PointerEvent) => {
    if (!this._drag) return;
    const track = this.shadowRoot?.querySelector<HTMLElement>(`[data-direction="${this._drag.direction}"]`);
    const thumb = track?.querySelector<HTMLElement>('[part~="thumb"]');
    if (!track || !thumb) return;
    const rect = track.getBoundingClientRect();
    const trackSize = this._drag.direction === 'vertical' ? rect.height : rect.width;
    const thumbSize = this._drag.direction === 'vertical' ? thumb.offsetHeight : thumb.offsetWidth;
    const pointer = this._drag.direction === 'vertical' ? event.clientY - rect.top : event.clientX - rect.left;
    const travel = Math.max(trackSize - thumbSize, 1);
    const ratio = Math.max(0, Math.min(1, (pointer - thumbSize * this._drag.offset) / travel));
    if (this._drag.direction === 'vertical') this.scrollTop = ratio * (this.scrollHeight - this.clientHeight);
    else this.scrollLeft = ratio * (this.scrollWidth - this.clientWidth);
  };

  private _onPointerUp = () => {
    this._removeDragListeners();
  };

  private _removeDragListeners() {
    this._drag = undefined;
    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);
  }

  private _applyTokenStyles() {
    if (!this.shadowRoot || typeof CSSStyleSheet === 'undefined') return;
    const tokens = resolveThemeTree(scroll, this.theme) as unknown as ResolvedScrollTokens;
    const scrollbarCss = (direction: ScrollDirection) =>
      [
        buttonCssBlockToText(`[part~="${direction}-scrollbar"]`, tokens.scrollbar.default),
        buttonCssBlockToText(`[part~="${direction}-scrollbar"]`, tokens.scrollbar[direction]),
        this.autoHide ? buttonCssBlockToText(`[part~="${direction}-scrollbar"]`, tokens.scrollbar.autoHide) : '',
        this.autoHide && this._isScrolling
          ? buttonCssBlockToText(`[part~="${direction}-scrollbar"]`, tokens.scrollbar.autoHideScrolling)
          : '',
      ].join('\n');
    const thumbCss = (direction: ScrollDirection) =>
      [
        buttonCssBlockToText(`[part~="${direction}-thumb"]`, tokens.thumb.default),
        buttonCssBlockToText(`[part~="${direction}-thumb"]`, tokens.thumb[direction]),
        this.autoHide ? buttonCssBlockToText(`[part~="${direction}-thumb"]`, tokens.thumb.autoHide) : '',
        this.autoHide && this._isScrolling
          ? buttonCssBlockToText(`[part~="${direction}-thumb"]`, tokens.thumb.autoHideScrolling)
          : '',
      ].join('\n');
    const cssText = [
      buttonCssBlockToText(':host', tokens.container.default),
      buttonCssBlockToText(':host', this.styles),
      buttonCssBlockToText('[part="content"]', tokens.content.default),
      this.horizontal === 'hidden' ? buttonCssBlockToText('[part="content"]', tokens.content.horizontalHidden) : '',
      buttonCssBlockToText('[part="scrollbars"]', tokens.scrollbars.default),
      scrollbarCss('vertical'),
      scrollbarCss('horizontal'),
      thumbCss('vertical'),
      thumbCss('horizontal'),
    ].join('\n');
    if (cssText === this._ruleText) return;
    this._ruleText = cssText;
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(cssText);
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets.filter((candidate) => candidate !== this._ruleSheet),
      sheet,
    ];
    this._ruleSheet = sheet;
  }

  /**
   * Shadow-host rules intentionally lose to document rules that target the custom element.
   * Mirror flat consumer `styles` declarations inline so they retain the same precedence as
   * React/Emotion's generated class over the GridKit global reset. Existing native inline
   * declarations still win, matching React's `style` prop over its `styles` prop.
   */
  private _applyHostStyles() {
    for (const [property, value] of this._managedHostStyles) {
      if (this.style.getPropertyValue(property) === value) this.style.removeProperty(property);
    }
    this._managedHostStyles.clear();

    for (const [property, value] of Object.entries(this.styles)) {
      if (typeof value === 'object' || value === undefined) continue;
      const cssProperty = toKebabCase(property);
      if (this.style.getPropertyValue(cssProperty)) continue;
      const cssValue = cssPropertyValueToText(property, value);
      this.style.setProperty(cssProperty, cssValue);
      this._managedHostStyles.set(cssProperty, cssValue);
    }
  }

  render() {
    const showVertical = this.vertical === 'visible' || (this.vertical === 'auto' && this._showVertical);
    const showHorizontal = this.horizontal === 'visible' || (this.horizontal === 'auto' && this._showHorizontal);
    return html`
      <div part="scrollbars" aria-hidden="true">
        ${showVertical
          ? html`<div part="scrollbar vertical-scrollbar" data-direction="vertical">
              <div
                part="thumb vertical-thumb"
                style=${styleMap(this._thumbGeometry('vertical'))}
                @pointerdown=${(event: PointerEvent) => this._onPointerDown(event, 'vertical')}
              ></div>
            </div>`
          : null}
        ${showHorizontal
          ? html`<div part="scrollbar horizontal-scrollbar" data-direction="horizontal">
              <div
                part="thumb horizontal-thumb"
                style=${styleMap(this._thumbGeometry('horizontal'))}
                @pointerdown=${(event: PointerEvent) => this._onPointerDown(event, 'horizontal')}
              ></div>
            </div>`
          : null}
      </div>
      <div part="content"><slot @slotchange=${this._onSlotChange}></slot></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-scroll': GdScroll;
  }
}
