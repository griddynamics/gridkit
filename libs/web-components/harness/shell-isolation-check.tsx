import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { CacheProvider, Global, css } from '@emotion/react';
import createCache from '@emotion/cache';
import '../src/components/gd-button/gd-button';
import './gd-button-shell';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- ambient global JSX augmentation has no ES module equivalent
  namespace JSX {
    interface IntrinsicElements {
      'gd-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'gd-button-shell': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

/**
 * Re-runs the original Shadow DOM style-isolation reproduction (see FINDINGS.md Section 1) with
 * a THIRD probe added: `gd-button-shell`, the "Lit wraps React (shell only)" hybrid
 * (harness/gd-button-shell.ts). Question this answers, empirically rather than by reasoning
 * about it: does mounting the real React+Emotion Button inside a Lit custom element's (real)
 * Shadow Root actually isolate it from a page-level Emotion/global-CSS collision, the same way
 * the native Lit rebuild does — with NO extra shadow-scoped Emotion cache plumbing?
 */

function GlobalHostAppStyles() {
  return (
    <Global
      styles={css`
        button,
        input,
        label {
          all: unset !important;
          box-sizing: content-box !important;
          background-color: red !important;
          color: yellow !important;
          border: 4px dashed lime !important;
          font-size: 40px !important;
        }
      `}
    />
  );
}

const secondEmotionCache = createCache({ key: 'second-emotion-instance' });

function PlainEmotionButton() {
  return (
    <CacheProvider value={secondEmotionCache}>
      <button
        id="plain-emotion-btn"
        css={css`
          background-color: #171717;
          color: #fff;
          padding: 8px 16px;
          border-radius: 4px;
          border: none;
          font-size: 14px;
        `}
      >
        Plain Emotion Button (2nd Emotion instance, control)
      </button>
    </CacheProvider>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <GlobalHostAppStyles />
      <h1>Shell isolation check — "Lit wraps React" vs. the Shadow DOM style-isolation collision</h1>

      <section>
        <h2>1. Plain React+Emotion button (2nd Emotion instance, no Shadow DOM) — control</h2>
        <PlainEmotionButton />
      </section>

      <section>
        <h2>2. Native Lit gd-button (Shadow DOM, no React inside) — known-good reference</h2>
        <gd-button id="lit-btn">Lit Button</gd-button>
      </section>

      <section>
        <h2>
          3. gd-button-shell (Shadow DOM, real React+Emotion Button inside, no shadow-scoped cache) — the option under
          test
        </h2>
        <gd-button-shell id="shell-btn">Shell Button</gd-button-shell>
      </section>

      <pre id="verdict" style={{ background: '#eee', padding: 12, marginTop: 24, whiteSpace: 'pre-wrap' }}>
        computing…
      </pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

requestAnimationFrame(() => setTimeout(runAssertions, 150));

function runAssertions() {
  const plainBtn = document.getElementById('plain-emotion-btn');
  const litBtnHost = document.getElementById('lit-btn');
  const litBtnInner = litBtnHost?.shadowRoot?.querySelector('button') ?? null;
  const shellHost = document.getElementById('shell-btn');
  const shellInner = shellHost?.shadowRoot?.querySelector('button') ?? null;

  if (!plainBtn || !litBtnInner || !shellHost || !shellInner) {
    const text = 'FAIL: could not locate one or more probe elements — repro harness is broken, not a real result.';
    document.getElementById('verdict')!.textContent = text;
    console.error('[SHELL-ISOLATION-CHECK]', text);
    return;
  }

  const plainStyle = getComputedStyle(plainBtn);
  const litBtnStyle = getComputedStyle(litBtnInner);
  const shellStyle = getComputedStyle(shellInner);

  const RESET_RED = 'rgb(255, 0, 0)';
  const GRIDKIT_PRIMARY_BG = 'rgb(255, 184, 0)'; // real Button primary background, #FFB800 (defaultTheme)

  // Control: the global reset DID hit the plain Emotion button — proves the reset is real.
  const resetHitPlainEmotion = plainStyle.backgroundColor === RESET_RED || plainStyle.borderStyle === 'dashed';

  // Reference: confirms native Lit is unaffected, as already proven in the original repro.
  const resetLeakedIntoNativeLit = litBtnStyle.backgroundColor === RESET_RED || litBtnStyle.borderStyle === 'dashed';

  // The actual question: did the reset leak into the shell's shadow root?
  const resetLeakedIntoShell = shellStyle.backgroundColor === RESET_RED || shellStyle.borderStyle === 'dashed';

  // Separate, equally important question: does the shell's own real Button styling actually
  // apply at all, given no shadow-scoped Emotion cache was configured? Emotion's <style> tags
  // land in document.head (light DOM) by default — a real Shadow DOM boundary blocks the shadow
  // root's descendants from seeing THAT stylesheet, same mechanism that blocks the reset above.
  const shellRendersRealStyling = shellStyle.backgroundColor === GRIDKIT_PRIMARY_BG;

  const result = {
    'Global reset broke the plain Emotion button (control) — expect true': resetHitPlainEmotion,
    'Global reset leaked INTO native gd-button Shadow DOM — expect false (known-good reference)':
      resetLeakedIntoNativeLit,
    'Global reset leaked INTO gd-button-shell Shadow DOM — the question this test answers': resetLeakedIntoShell,
    "gd-button-shell's own real Button styling actually rendered (background matches #FFB800) — separate question":
      shellRendersRealStyling,
    shellComputedBackgroundColor: shellStyle.backgroundColor,
  };

  const text = JSON.stringify(result, null, 2);
  document.getElementById('verdict')!.textContent = text;
  console.log('SHELL_ISOLATION_RESULTS_JSON', JSON.stringify(result));
}
