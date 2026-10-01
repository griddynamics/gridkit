import { LitElement, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { inputfile } from 'gd-design-library/tokens';
import { resolveThemeTree, type DesignCoreTheme } from 'gd-design-core';
import '../gd-button/gd-button';

export interface GdInputFileChangeDetail {
  files: Array<{ name: string; size: number; type: string }>;
}

@customElement('gd-input-file')
export class GdInputFile extends LitElement {
  @property({ type: String, reflect: true }) accept?: string;
  @property({ type: String, reflect: true }) capture?: 'user' | 'environment';
  @property({ type: Boolean, reflect: true }) multiple = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, attribute: 'is-icon', reflect: true }) isIcon = false;
  @property({ type: String, attribute: 'button-variant' }) buttonVariant = 'outlined';
  @property({ attribute: false }) styles: Record<string, string | number> = {};
  @property({ attribute: false }) theme: DesignCoreTheme = {};
  @query('input') input!: HTMLInputElement;

  private _change() {
    const files = Array.from(this.input.files ?? []).map(({ name, size, type }) => ({ name, size, type }));
    this.dispatchEvent(
      new CustomEvent<GdInputFileChangeDetail>('gd-change', { detail: { files }, bubbles: true, composed: true })
    );
  }
  render() {
    const tokens = resolveThemeTree(inputfile, this.theme) as unknown as {
      default: Record<string, string | number>;
      input: Record<string, string | number>;
    };
    return html`<div part="root" style=${styleMap({ ...tokens.default, ...this.styles })}>
      <gd-button
        .theme=${this.theme}
        variant=${this.buttonVariant}
        .isIcon=${this.isIcon}
        ?disabled=${this.disabled}
        @click=${() => this.input?.click()}
        ><slot>Browse Files</slot></gd-button
      >
      <input
        part="input"
        type="file"
        style=${styleMap(tokens.input)}
        accept=${this.accept ?? ''}
        capture=${this.capture ?? undefined}
        ?multiple=${this.multiple}
        ?disabled=${this.disabled}
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
