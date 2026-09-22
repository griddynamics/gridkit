/**
 * CTORNDSD-646b — closes `FINDINGS.md` Section 7 and GO condition 3.
 *
 * Section 7 recorded React 19's behavior as "documented guidance, not an empirically re-confirmed
 * result in this environment", because the repo is pinned to React 18.3.1. This fixture answers
 * two separable questions against a real React 19 build:
 *
 *   Q1. Does React 19 assign non-primitive values (objects, arrays) to custom-element PROPERTIES
 *       rather than stringifying them into attributes? If yes, `theme={...}` works with no wrapper.
 *   Q2. Does React 19 auto-wire a custom event (`gd-change`) to an `onGdChange`-style JSX prop?
 *       Section 7 predicts NO — the native heuristic covers property/attribute assignment only.
 *
 * Q2 is the one that decides whether `@lit/react` stays necessary. Both are reported as measured
 * results, whichever way they land.
 */
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defaultTheme } from 'gd-design-library/tokens';
import '../../libs/web-components/src/index';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'gd-checkbox': Record<string, unknown>;
        'gd-input': Record<string, unknown>;
      }
    }
  }
}

type Results = Record<string, unknown>;

function Probe() {
  const checkboxRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLElement | null>(null);
  const [results, setResults] = useState<Results | null>(null);

  // Q2 counters. `onGdChange` is the camelCase prop a React consumer would *hope* works;
  // the addEventListener path is the known-good control.
  const jsxPropFires = useRef(0);
  const listenerFires = useRef(0);

  useEffect(() => {
    const el = checkboxRef.current;
    if (!el) return;
    const onChange = () => {
      listenerFires.current += 1;
    };
    el.addEventListener('gd-change', onChange);
    return () => el.removeEventListener('gd-change', onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const checkbox = checkboxRef.current as (HTMLElement & { theme?: unknown; checked?: unknown }) | null;
      const input = inputRef.current as (HTMLElement & { theme?: unknown; value?: unknown }) | null;
      if (!checkbox || !input) return;

      await Promise.all(
        [checkbox, input].map((el) => (el as unknown as { updateComplete?: Promise<unknown> }).updateComplete)
      );
      // let the components settle after their first render
      await new Promise((r) => setTimeout(r, 150));
      if (cancelled) return;

      // --- Q1: property vs attribute assignment ---------------------------------------
      const themeIsLiveObject = checkbox.theme === defaultTheme;
      const themeStringifiedIntoAttribute = checkbox.getAttribute('theme');
      const renderedBackground = (() => {
        const indicator = checkbox.shadowRoot?.querySelector('.indicator');
        return indicator ? getComputedStyle(indicator).backgroundColor : null;
      })();

      const propertyAssignment = {
        'Q1a. object prop reached the PROPERTY by reference (theme === defaultTheme)': themeIsLiveObject,
        'Q1b. object prop was NOT stringified into an attribute — expect null': themeStringifiedIntoAttribute,
        'Q1c. boolean-ish prop reached the property (checked)': checkbox.checked,
        'Q1d. string prop reached the property (value)': input.value,
        'Q1e. the theme actually rendered — indicator background': renderedBackground,
        'Q1f. theme rendered a REAL token colour, not a placeholder string':
          renderedBackground !== null && renderedBackground !== 'rgba(0, 0, 0, 0)',
      };

      // --- Q2: custom event → JSX callback prop --------------------------------------
      // Toggle via the inner input's own click, so the component's real change path runs.
      const innerInput = checkbox.shadowRoot?.querySelector('input') as HTMLInputElement | undefined;
      innerInput?.click();
      await new Promise((r) => setTimeout(r, 150));
      if (cancelled) return;

      const eventWiring = {
        'Q2a. addEventListener("gd-change") fired (control) — expect >0': listenerFires.current,
        'Q2b. onGdChange JSX prop fired — Section 7 predicts 0': jsxPropFires.current,
        'Q2c. onGdChange was stringified into an attribute instead?': checkbox.getAttribute('onGdChange'),
        'Q2d. lowercase ongdchange attribute?': checkbox.getAttribute('ongdchange'),
        VERDICT: jsxPropFires.current > 0 ? '@lit/react NOT needed for events' : '@lit/react STILL needed for events',
      };

      setResults({
        react: (await import('react')).version,
        propertyAssignment,
        eventWiring,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (results) {
      (window as unknown as { __react19Check: unknown }).__react19Check = results;
      console.log('__react19Check', results);
    }
  }, [results]);

  return (
    <>
      <fieldset>
        <legend>Direct custom-element usage in React 19 JSX — no @lit/react wrapper</legend>
        {/* theme is an OBJECT; checked is a boolean; onGdChange is the hoped-for callback prop */}
        <gd-checkbox
          ref={checkboxRef}
          theme={defaultTheme}
          checked={true}
          onGdChange={() => {
            jsxPropFires.current += 1;
          }}
        >
          Accept terms
        </gd-checkbox>
        <br />
        <br />
        <gd-input ref={inputRef} theme={defaultTheme} label="Email" value="typed-by-react" />
      </fieldset>

      <h2>Results</h2>
      <pre>{results ? JSON.stringify(results, null, 2) : 'running…'}</pre>
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Probe />
  </StrictMode>
);
