'use client';

/**
 * CLIENT component. Importing the element modules here is what actually registers
 * `<gd-button>` / `<gd-typography>` in `customElements`, upgrading the tags the SERVER component
 * above already streamed into the HTML.
 *
 * The `'use client'` directive is mandatory, not stylistic: the module graph defines
 * `class ... extends LitElement`, and `LitElement extends HTMLElement`, which does not exist in
 * Node. The server-side probe on the page above captures exactly what happens without it.
 */
import { useEffect, useState } from 'react';
import { defaultTheme } from 'gd-design-library/tokens';
import 'gd-design-web';

export default function ClientIsland() {
  const [results, setResults] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    (async () => {
      await customElements.whenDefined('gd-button');
      await customElements.whenDefined('gd-typography');

      // Theme must be a real object — the components resolve the real token files, whose own
      // fallbacks are debug placeholder strings (FINDINGS.md Sections 13, 16).
      document.querySelectorAll<HTMLElement & { theme?: unknown }>('gd-button, gd-typography').forEach((el) => {
        el.theme = defaultTheme;
      });

      const button = document.getElementById('server-button') as
        | (HTMLElement & { updateComplete?: Promise<unknown> })
        | null;
      await button?.updateComplete;
      await new Promise((r) => setTimeout(r, 150));

      const inner = button?.shadowRoot?.querySelector('button');
      const heading = document.getElementById('server-typography');

      const measured = {
        'element upgraded after hydration (shadowRoot exists)': !!button?.shadowRoot,
        'server-streamed text survived into the upgraded element': inner?.textContent?.trim() ?? null,
        'rendered background is the real token colour': inner ? getComputedStyle(inner).backgroundColor : null,
        'heading upgraded too': !!heading?.shadowRoot,
        'light-DOM h2 findable? (Section 5 gap, now under Next)': !!document.querySelector('h2'),
      };

      setResults(measured);
      (window as unknown as { __nextCheck: unknown }).__nextCheck = measured;
      console.log('__nextCheck', measured);
    })();
  }, []);

  return (
    <fieldset>
      <legend>3. Client island — registration + hydration measurements</legend>
      <pre id="client-results">{results ? JSON.stringify(results, null, 2) : 'running…'}</pre>
    </fieldset>
  );
}
