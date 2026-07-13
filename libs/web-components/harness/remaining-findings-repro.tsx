import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/components/gd-typography/gd-typography';
import { GdInput } from './GdInputReact';
import { GdSelect } from './GdSelectReact';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- ambient global JSX augmentation has no ES module equivalent
  namespace JSX {
    interface IntrinsicElements {
      'gd-typography': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        as?: string;
        variant?: string;
      };
    }
  }
}

/**
 * CTORNDSD-581 exit artifact — empirical repro harness for the three named sub-findings
 * that must not be assumed: Typography's light-DOM discoverability gap, Input's
 * cursor-jump risk under an async round-trip, and Select's popover-based interaction
 * (open/list/select/light-dismiss). Driven by chrome-devtools-mcp, not a unit test, since
 * the discoverability gap and cursor-jump risk are specifically about real browser
 * DOM/focus/selection behavior a jsdom unit test would not faithfully exercise.
 */
function TypographyDiscoverabilityProbe() {
  const runProbe = () => {
    const found = document.querySelector('h1');
    const result = { queryHFound: !!found, foundIsGdTypography: found === null };
    document.getElementById('typography-probe-result')!.textContent = JSON.stringify(result);
  };

  return (
    <section>
      <h3>A. Typography discoverability gap</h3>
      <gd-typography as="h1" variant="h1">
        I am rendered as an h1 inside Shadow DOM
      </gd-typography>
      <div>
        <button id="typography-probe-btn" onClick={runProbe}>
          Run document.querySelector('h1') probe
        </button>
      </div>
      <pre id="typography-probe-result">not run yet</pre>
    </section>
  );
}

/** Simulates an async round-trip lag (e.g. a server-echo/validation response) landing after
 *  the user has already kept typing — the classic scenario where a controlled value over a
 *  custom-element boundary risks jumping the cursor if the round-trip clobbers `.value`. */
function InputCursorJumpProbe() {
  const [value, setValue] = useState('');
  const [roundTrips, setRoundTrips] = useState(0);

  return (
    <section>
      <h3>B. Input cursor-jump repro (300ms async round-trip)</h3>
      <GdInput
        id="cursor-jump-input"
        value={value}
        onGdInput={(e: Event) => {
          const nextValue = (e as CustomEvent<{ value: string }>).detail.value;
          setTimeout(() => {
            setValue(nextValue);
            setRoundTrips((n) => n + 1);
          }, 300);
        }}
      />
      <pre id="cursor-jump-roundtrips">{roundTrips}</pre>
    </section>
  );
}

function SelectPopoverProbe() {
  const items = [
    { name: 'Alpha', value: 'a' },
    { name: 'Beta', value: 'b' },
    { name: 'Gamma', value: 'c' },
  ];
  const [value, setValue] = useState<{ name: string; value: string } | null>(null);

  return (
    <section>
      <h3>C. Select popover interaction</h3>
      <GdSelect
        id="popover-select"
        items={items}
        value={value}
        onGdChange={(e: Event) =>
          setValue((e as CustomEvent<{ value: { name: string; value: string } | null }>).detail.value)
        }
      />
      <pre id="select-result">{JSON.stringify(value)}</pre>
    </section>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Remaining findings repro — CTORNDSD-581</div>
      <TypographyDiscoverabilityProbe />
      <InputCursorJumpProbe />
      <SelectPopoverProbe />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
