import { LitElement, html } from 'lit';
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Button } from '../../ui/src/components/atoms/Button/Button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ThemeProvider } from '../../ui/src/hooks/useTheme/useTheme';

/**
 * "Lit wraps React (shell only)" — Option A from the CTORNDSD-581 doc's comparison. A
 * Lit-authored custom element (real Shadow DOM via Lit's default `createRenderRoot`) whose
 * entire job is to mount the REAL `Button` from `libs/ui/src/components/atoms/Button/Button.tsx`
 * — same React + Emotion internals, no template rewrite — inside itself via `ReactDOM.createRoot`.
 * No shadow-scoped Emotion cache is configured here (this is the naive/default version of the
 * option, not a hardened one) — that is deliberate: the point of this harness is to test what
 * happens WITHOUT extra plumbing, since that plumbing was named "untested" in the doc rather
 * than assumed to work.
 *
 * Uses Lit's plain `static properties` API instead of TS decorators (`@customElement`,
 * `@property`) — this harness's TS pipeline (`tsconfig.harness.json`) doesn't run the same
 * legacy-decorator transform `src/**` gets via its own tsconfig, so decorator syntax here would
 * reach the browser un-transformed and fail to parse.
 */
export class GdButtonShell extends LitElement {
  static properties = {
    variant: { type: String },
  };

  declare variant: string;

  private _reactRoot?: Root;

  constructor() {
    super();
    this.variant = 'primary';
  }

  render() {
    return html`<div id="mount"></div>`;
  }

  firstUpdated() {
    const mount = this.renderRoot.querySelector('#mount') as HTMLDivElement;
    this._reactRoot = createRoot(mount);
    this._renderReact();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('variant') && this._reactRoot) {
      this._renderReact();
    }
  }

  private _renderReact() {
    flushSync(() => {
      this._reactRoot!.render(
        React.createElement(
          ThemeProvider,
          { isDefault: true },
          React.createElement(Button, { variant: this.variant as 'primary' | 'secondary' }, this.textContent)
        )
      );
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._reactRoot?.unmount();
  }
}

customElements.define('gd-button-shell', GdButtonShell);
