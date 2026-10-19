import { css, html, nothing } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { inputfile } from 'gd-design-library/tokens';
import { cssPropertyValueToText, resolveThemeTree } from '../../../core';
import { GdThemedElement } from '../../../core/themed-element';
import '../gd-button/gd-button';
import type { GdButton } from '../gd-button/gd-button';

export interface GdInputFileChangeDetail {
  files: Array<{ name: string; size: number; type: string }>;
}

/** Properties of the inner `gd-button` that `buttonProps` may override. */
export type GdInputFileButtonProps = Partial<
  Pick<
    GdButton,
    'variant' | 'rounded' | 'disabled' | 'isIcon' | 'fullWidth' | 'type' | 'role' | 'tabIndex' | 'ariaPressed'
  > & { ariaLabel: string | null; styles: Record<string, string | number> }
>;

@customElement('gd-input-file')
export class GdInputFile extends GdThemedElement {
  /** The wrapper is the layout box; the host adds none, like the bare wrapper element it mirrors. */
  static styles = css`
    :host {
      display: contents;
    }
    :where(*, ::before, ::after) {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
    }
  `;

  @property({ type: String, reflect: true }) accept?: string;
  @property({ type: String, reflect: true }) capture?: 'user' | 'environment';
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: 'is-icon', reflect: true }) isIcon = false;
  @property({ type: String, attribute: 'button-variant' }) buttonVariant = 'outlined';
  /** Extra properties forwarded to the inner `gd-button`; they win over `buttonVariant`, `isIcon` and `disabled`. */
  @property({ attribute: false }) buttonProps: GdInputFileButtonProps = {};
  /** Accessible name of the native input; defaults to the `aria-label` attribute, then the label text. */
  @property({ type: String, attribute: 'input-aria-label' }) inputAriaLabel?: string;
  @property({ attribute: false }) styles: Record<string, string | number> = {};
  @query('input') input!: HTMLInputElement;
  @query('gd-button') private button!: GdButton;

  private _change() {
    const files = Array.from(this.input.files ?? []).map(({ name, size, type }) => ({ name, size, type }));
    this.dispatchEvent(
      new CustomEvent<GdInputFileChangeDetail>('gd-change', { detail: { files }, bubbles: true, composed: true })
    );
  }
  private _click() {
    if (this.disabled) return;
    this.input?.click();
    this.dispatchEvent(new CustomEvent('gd-click', { bubbles: true, composed: true }));
  }
  /** Whether label content is slotted. Light-DOM children do not exist during server rendering, which keeps the fallback. */
  private get _hasLabel() {
    return (this.childNodes?.length ?? 0) > 0;
  }
  /** Text of a string label becomes the native input's name, like a text-only default slot. */
  private get _labelText() {
    const slotted = Array.from(this.childNodes ?? []);
    if (!slotted.length) return 'Browse Files';
    return slotted.every((node) => node.nodeType === Node.TEXT_NODE) ? this.textContent?.trim() : undefined;
  }
  protected updated() {
    // `buttonProps` is spread last, like the source component spreads it after the explicit props.
    if (this.button)
      Object.assign(this.button, {
        variant: this.buttonVariant,
        isIcon: this.isIcon,
        disabled: this.disabled,
        ...this.buttonProps,
      });
  }
  render() {
    const tokens = resolveThemeTree(inputfile, this.theme) as unknown as {
      default: Record<string, string | number>;
      input: Record<string, string | number>;
    };
    const inline = (block: Record<string, string | number>) =>
      Object.fromEntries(Object.entries(block).map(([name, value]) => [name, cssPropertyValueToText(name, value)]));
    return html`<div part="root" style=${styleMap(inline({ ...tokens.default, ...this.styles }))}>
      <gd-button .theme=${this.theme} @click=${this._click}
        ><slot @slotchange=${() => this.requestUpdate()}>${this._hasLabel ? nothing : 'Browse Files'}</slot></gd-button
      >
      <input
        part="input"
        type="file"
        style=${styleMap(inline(tokens.input))}
        accept=${this.accept || nothing}
        capture=${this.capture ?? nothing}
        ?multiple=${this.multiple}
        ?disabled=${this.disabled}
        aria-label=${this.inputAriaLabel ?? this.getAttribute('aria-label') ?? this._labelText ?? nothing}
        @change=${this._change}
      />
    </div>`;
  }
  open() {
    if (!this.disabled) this.input.click();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'gd-input-file': GdInputFile;
  }
}
