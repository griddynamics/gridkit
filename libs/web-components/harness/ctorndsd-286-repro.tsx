import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { CacheProvider, Global, css } from '@emotion/react';
import createCache from '@emotion/cache';
import '../src/components/gd-button/gd-button';
import '../src/components/gd-checkbox/gd-checkbox';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- ambient global JSX augmentation has no ES module equivalent
  namespace JSX {
    interface IntrinsicElements {
      'gd-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
      'gd-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

/**
 * CTORNDSD-581 exit artifact — CTORNDSD-286 reproduction. Loads a host-app-style global
 * Emotion reset (simulating a Next.js app / a second Emotion consumer such as Material UI's
 * CssBaseline) alongside a *second, independent* Emotion instance rendering a plain
 * React+Emotion button, plus the Lit-wrapped `gd-button`/`gd-checkbox`. Emotion instances
 * share the document `<head>`/global CSS cascade by design — a second cache does NOT provide
 * isolation, which is exactly the CTORNDSD-286 failure mode. Shadow DOM is a structurally
 * different mechanism (a separate style-resolution boundary, not just a separate stylesheet
 * registry), so the pass condition is: the global reset visibly breaks the plain-Emotion
 * button (proving the reset is real and the bug reproduces) while leaving the Lit components'
 * internals untouched in both directions.
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
        Plain Emotion Button (2nd Emotion instance)
      </button>
    </CacheProvider>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <GlobalHostAppStyles />
      <h1>CTORNDSD-286 Shadow DOM repro</h1>

      <section>
        <h2>1. Plain React+Emotion button (2nd Emotion instance, no Shadow DOM)</h2>
        <PlainEmotionButton />
      </section>

      <section>
        <h2>2. Lit gd-button (Shadow DOM)</h2>
        <gd-button id="lit-btn">Lit Button</gd-button>
      </section>

      <section>
        <h2>3. Lit gd-checkbox (Shadow DOM)</h2>
        <gd-checkbox id="lit-checkbox">Lit Checkbox</gd-checkbox>
      </section>

      <pre id="verdict" style={{ background: '#eee', padding: 12, marginTop: 24, whiteSpace: 'pre-wrap' }}>
        computing…
      </pre>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

requestAnimationFrame(() => setTimeout(runAssertions, 50));

function runAssertions() {
  const plainBtn = document.getElementById('plain-emotion-btn');
  const litBtnHost = document.getElementById('lit-btn');
  const litBtnInner = litBtnHost?.shadowRoot?.querySelector('button') ?? null;
  const litCheckboxHost = document.getElementById('lit-checkbox');
  const litCheckboxInner = litCheckboxHost?.shadowRoot?.querySelector('label') ?? null;

  if (!plainBtn || !litBtnInner || !litCheckboxInner) {
    const text = 'FAIL: could not locate one or more probe elements — repro harness is broken, not a real result.';
    document.getElementById('verdict')!.textContent = text;
    console.error('[CTORNDSD-286-REPRO]', text);
    return;
  }

  const plainStyle = getComputedStyle(plainBtn);
  const litBtnStyle = getComputedStyle(litBtnInner);
  const litCheckboxStyle = getComputedStyle(litCheckboxInner);

  const RESET_RED = 'rgb(255, 0, 0)';
  const GRIDKIT_DARK = 'rgb(23, 23, 23)'; // gd-button's own primary background (#171717)

  // Direction 1 (control): the global reset DID hit the plain Emotion button — proves the
  // reset is real/active and that a second Emotion cache provides no isolation whatsoever.
  const resetHitPlainEmotion = plainStyle.backgroundColor === RESET_RED || plainStyle.borderStyle === 'dashed';

  // Direction 1 (real test): did the SAME global reset leak INTO the Lit Shadow DOM internals?
  const resetLeakedIntoLitButton = litBtnStyle.backgroundColor === RESET_RED || litBtnStyle.borderStyle === 'dashed';
  const resetLeakedIntoLitCheckbox =
    litCheckboxStyle.backgroundColor === RESET_RED || litCheckboxStyle.borderStyle === 'dashed';

  // Direction 2: did the Lit button's own internal background leak OUT onto the page/plain button?
  const litStylesLeakedOut = plainStyle.backgroundColor === GRIDKIT_DARK;

  const pass =
    resetHitPlainEmotion === true &&
    resetLeakedIntoLitButton === false &&
    resetLeakedIntoLitCheckbox === false &&
    litStylesLeakedOut === false;

  const result = {
    pass,
    'Global reset broke the plain Emotion button (2nd instance) — expect true, reproduces CTORNDSD-286':
      resetHitPlainEmotion,
    'Global reset leaked INTO gd-button Shadow DOM — expect false': resetLeakedIntoLitButton,
    'Global reset leaked INTO gd-checkbox Shadow DOM — expect false': resetLeakedIntoLitCheckbox,
    "Lit's own styles leaked OUT to the page — expect false": litStylesLeakedOut,
  };

  const text = JSON.stringify(result, null, 2);
  document.getElementById('verdict')!.textContent = text;
  console.log('[CTORNDSD-286-REPRO]', text);
}
