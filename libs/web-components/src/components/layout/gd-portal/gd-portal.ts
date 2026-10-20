import { html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { wrapper } from 'gd-design-library/tokens';
import { buttonCssBlockToText, resolveThemeTree, type ButtonCssBlock } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';

export type PortalWrapperVariant = 'inline' | 'section' | 'fullPage';
export type PortalStyles = Record<string, string | number>;

type PortalTarget = Element | DocumentFragment;
type WrapperTokens = Record<'default' | PortalWrapperVariant, ButtonCssBlock>;

const portalAttributes = new Set(['wrapper-variant', 'with-wrapper', 'blocks-scroll', 'wrapper-view']);
let portalId = 0;
const scrollLocks = new WeakMap<Document, { count: number; previousOverflow: string }>();

/**
 * Native counterpart of React Portal. Light-DOM children are moved, not cloned,
 * so element identity and native listeners are preserved across targets.
 */
@customElement('gd-portal')
export class GdPortal extends GdThemedElement {
  @property({ attribute: false }) container: PortalTarget | null = null;
  @property({ type: String, attribute: 'wrapper-variant', reflect: true })
  wrapperVariant: PortalWrapperVariant = 'fullPage';
  @property({ type: Boolean, attribute: 'with-wrapper' }) withWrapper = true;
  @property({ type: Boolean, attribute: 'blocks-scroll', reflect: true }) blocksScroll = false;
  @property({ type: String, attribute: 'wrapper-view' }) WrapperView: keyof HTMLElementTagNameMap = 'div';
  @property({ attribute: false }) styles: PortalStyles = {};

  /** The generated semantic wrapper, or null when `withWrapper` is false. */
  get portalRoot(): HTMLElement | null {
    return this._wrapper;
  }

  private readonly _portalId = String(++portalId);
  private _portalNodes: Node[] = [];
  private _wrapper: HTMLElement | null = null;
  private _styleElement: HTMLStyleElement | null = null;
  private _startMarker: Comment | null = null;
  private _endMarker: Comment | null = null;
  private _mountedTarget: PortalTarget | null = null;
  private _observer?: MutationObserver;
  private _ownsScrollLock = false;
  private _lockDocument: Document | null = null;

  connectedCallback() {
    super.connectedCallback();
    this._observer = new MutationObserver((records) => this._onMutations(records));
    this._observer.observe(this, { attributes: true, childList: true });
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = undefined;
    this._teardownPortal();
    this._releaseScrollLock();
    super.disconnectedCallback();
  }

  protected updated(changed: PropertyValues<this>) {
    const structuralChange =
      changed.has('container') || changed.has('withWrapper') || changed.has('WrapperView') || !this._mountedTarget;
    if (structuralChange) this._mountPortal();
    else {
      this._syncWrapperAttributes();
      this._syncWrapperStyles();
    }
    this._syncScrollLock();
  }

  private _target(): PortalTarget | null {
    const target = this.container ?? (typeof document === 'undefined' ? null : document.body);
    if (!target || target === this || (target instanceof Node && this.contains(target))) return null;
    return target;
  }

  private _mountPortal() {
    this._teardownPortal();
    const target = this._target();
    if (!target) return;

    this._portalNodes = Array.from(this.childNodes);
    this._mountedTarget = target;
    if (this.withWrapper) {
      const tag = /^[a-z][a-z0-9-]*$/.test(this.WrapperView) ? this.WrapperView : 'div';
      this._wrapper = document.createElement(tag);
      this._wrapper.dataset.gdPortalWrapper = this._portalId;
      this._styleElement = document.createElement('style');
      this._styleElement.dataset.gdPortalStyle = this._portalId;
      target.append(this._styleElement, this._wrapper);
      this._syncWrapperAttributes();
      this._syncWrapperStyles();
      this._wrapper.append(...this._portalNodes);
      return;
    }

    this._startMarker = document.createComment(`gd-portal:${this._portalId}:start`);
    this._endMarker = document.createComment(`gd-portal:${this._portalId}:end`);
    target.append(this._startMarker, ...this._portalNodes, this._endMarker);
  }

  private _teardownPortal() {
    // Always reclaim owned nodes. A plain DocumentFragment can be consumed after mount, which
    // reparents its markers and children into another element and makes `_mountedTarget` empty.
    for (const node of this._portalNodes) this.append(node);
    this._wrapper?.remove();
    this._styleElement?.remove();
    this._startMarker?.remove();
    this._endMarker?.remove();
    this._portalNodes = [];
    this._wrapper = null;
    this._styleElement = null;
    this._startMarker = null;
    this._endMarker = null;
    this._mountedTarget = null;
  }

  private _onMutations(records: MutationRecord[]) {
    if (records.some((record) => record.type === 'attributes')) {
      this._syncWrapperAttributes();
      this._syncWrapperStyles();
    }
    const additions = records.flatMap((record) => Array.from(record.addedNodes));
    for (const node of additions) {
      if (this._portalNodes.includes(node)) continue;
      this._portalNodes.push(node);
      if (this._wrapper) this._wrapper.append(node);
      else if (this._endMarker?.parentNode) this._endMarker.parentNode.insertBefore(node, this._endMarker);
    }
  }

  private _syncWrapperAttributes() {
    if (!this._wrapper) return;
    for (const attribute of Array.from(this._wrapper.attributes)) {
      if (attribute.name !== 'data-gd-portal-wrapper') this._wrapper.removeAttribute(attribute.name);
    }
    for (const attribute of Array.from(this.attributes)) {
      if (!portalAttributes.has(attribute.name)) this._wrapper.setAttribute(attribute.name, attribute.value);
    }
    this._wrapper.dataset.gdPortalWrapper = this._portalId;
  }

  private _syncWrapperStyles() {
    if (!this._styleElement) return;
    const tokens = resolveThemeTree(wrapper, this.theme) as unknown as WrapperTokens;
    const selector = `[data-gd-portal-wrapper="${this._portalId}"]`;
    this._styleElement.textContent = [
      buttonCssBlockToText(selector, tokens.default),
      buttonCssBlockToText(selector, tokens[this.wrapperVariant] ?? tokens.fullPage),
      buttonCssBlockToText(selector, this.styles as ButtonCssBlock),
    ].join('\n');
  }

  private _syncScrollLock() {
    if (typeof document === 'undefined') return;
    if (this.blocksScroll) {
      if (this._ownsScrollLock) return;
      const ownerDocument = this.ownerDocument;
      const existing = scrollLocks.get(ownerDocument);
      if (existing) existing.count += 1;
      else {
        scrollLocks.set(ownerDocument, { count: 1, previousOverflow: ownerDocument.body.style.overflow });
        ownerDocument.body.style.overflow = 'hidden';
      }
      this._lockDocument = ownerDocument;
      this._ownsScrollLock = true;
      return;
    }
    this._releaseScrollLock();
  }

  private _releaseScrollLock() {
    if (!this._ownsScrollLock || !this._lockDocument) return;
    const lock = scrollLocks.get(this._lockDocument);
    if (lock) {
      lock.count -= 1;
      if (lock.count === 0) {
        this._lockDocument.body.style.overflow = lock.previousOverflow;
        scrollLocks.delete(this._lockDocument);
      }
    }
    this._ownsScrollLock = false;
    this._lockDocument = null;
  }

  render() {
    return html`<slot hidden></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'gd-portal': GdPortal;
  }
}
