// eslint-disable-next-line @nx/enforce-module-boundaries
import '../../../dist/libs/ui/styles.css';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { defaultTheme } from 'gd-design-library/tokens';
// Harness-only direct source imports (same convention/eslint-disable as fidelity-check.tsx's
// CSS import above) — this is the ONLY way to render the real React+Emotion Button/ThemeProvider
// inside this package pre-build; there is no dev-serve alias for the full `gd-design-library`
// package specifier, only for `gd-design-library/tokens` (see vite.config.ts).
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Button } from '../../ui/src/components/atoms/Button/Button';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { ThemeProvider } from '../../ui/src/hooks/useTheme/useTheme';
import '../src/components/gd-button/gd-button';
import './gd-button-shell';

/**
 * Raw, honest render-speed check (not part of the original spike scope; the
 * spike measured bundle size only, see FINDINGS.md Section 3). This harness answers a narrower,
 * different question: how long does it take to mount/update N real instances of each Button,
 * in a real browser, batched the same way on both sides?
 *
 * Three-way, as of the doc's "Lit wraps React (shell only)" addition: native Lit (`gd-button`,
 * own template, no React inside), plain React (`Button`, the baseline), and `gd-button-shell`
 * (a Lit-authored custom element that just mounts the real React `Button` inside itself —
 * see `gd-button-shell.ts`).
 *
 * Deliberately "raw": in-page performance.now() deltas around a single flushSync/updateComplete
 * batch, median of a handful of trials to blunt JIT/GC noise, no isolated-DOM harness runner, no
 * statistical rigor beyond that. Treat results as an order-of-magnitude signal, not a benchmark
 * suite result.
 */

const N = 300;
const TRIALS = 5;

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

type GdButtonEl = HTMLElement & { variant: string; theme: unknown; updateComplete: Promise<boolean> };

async function measureLitMount(): Promise<number> {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  const t0 = performance.now();
  const frag = document.createDocumentFragment();
  const els: GdButtonEl[] = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('gd-button') as unknown as GdButtonEl;
    el.variant = 'primary';
    el.theme = defaultTheme;
    el.textContent = `Button ${i}`;
    els.push(el);
    frag.appendChild(el);
  }
  container.appendChild(frag);
  await Promise.all(els.map((el) => el.updateComplete));
  const elapsed = performance.now() - t0;

  document.body.removeChild(container);
  return elapsed;
}

async function measureLitUpdate(): Promise<number> {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  const els: GdButtonEl[] = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('gd-button') as unknown as GdButtonEl;
    el.variant = 'primary';
    el.theme = defaultTheme;
    el.textContent = `Button ${i}`;
    els.push(el);
    container.appendChild(el);
  }
  await Promise.all(els.map((el) => el.updateComplete));

  const t0 = performance.now();
  els.forEach((el) => {
    el.variant = 'secondary';
  });
  await Promise.all(els.map((el) => el.updateComplete));
  const elapsed = performance.now() - t0;

  document.body.removeChild(container);
  return elapsed;
}

type ShellEl = HTMLElement & { variant: string; updateComplete: Promise<boolean> };

async function measureShellMount(): Promise<number> {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  const t0 = performance.now();
  const frag = document.createDocumentFragment();
  const els: ShellEl[] = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('gd-button-shell') as unknown as ShellEl;
    el.variant = 'primary';
    el.textContent = `Button ${i}`;
    els.push(el);
    frag.appendChild(el);
  }
  container.appendChild(frag);
  await Promise.all(els.map((el) => el.updateComplete));
  const elapsed = performance.now() - t0;

  document.body.removeChild(container);
  return elapsed;
}

async function measureShellUpdate(): Promise<number> {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);

  const els: ShellEl[] = [];
  for (let i = 0; i < N; i++) {
    const el = document.createElement('gd-button-shell') as unknown as ShellEl;
    el.variant = 'primary';
    el.textContent = `Button ${i}`;
    els.push(el);
    container.appendChild(el);
  }
  await Promise.all(els.map((el) => el.updateComplete));

  const t0 = performance.now();
  els.forEach((el) => {
    el.variant = 'secondary';
  });
  await Promise.all(els.map((el) => el.updateComplete));
  const elapsed = performance.now() - t0;

  document.body.removeChild(container);
  return elapsed;
}

function measureReactMount(): number {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);
  const root = createRoot(container);

  const t0 = performance.now();
  flushSync(() => {
    root.render(
      <ThemeProvider isDefault>
        <div>
          {Array.from({ length: N }).map((_, i) => (
            <Button key={i} variant="primary">
              Button {i}
            </Button>
          ))}
        </div>
      </ThemeProvider>
    );
  });
  const elapsed = performance.now() - t0;

  root.unmount();
  document.body.removeChild(container);
  return elapsed;
}

function measureReactUpdate(): number {
  const container = document.createElement('div');
  container.style.display = 'none';
  document.body.appendChild(container);
  const root = createRoot(container);
  let setVariant: (v: string) => void = () => undefined;

  function Harness() {
    const [variant, setV] = React.useState('primary');
    setVariant = setV;
    return (
      <ThemeProvider isDefault>
        <div>
          {Array.from({ length: N }).map((_, i) => (
            <Button key={i} variant={variant as 'primary' | 'secondary'}>
              Button {i}
            </Button>
          ))}
        </div>
      </ThemeProvider>
    );
  }

  flushSync(() => root.render(<Harness />));
  const t0 = performance.now();
  flushSync(() => setVariant('secondary'));
  const elapsed = performance.now() - t0;

  root.unmount();
  document.body.removeChild(container);
  return elapsed;
}

async function run() {
  const litMount: number[] = [];
  const litUpdate: number[] = [];
  const reactMount: number[] = [];
  const reactUpdate: number[] = [];
  const shellMount: number[] = [];
  const shellUpdate: number[] = [];

  for (let i = 0; i < TRIALS; i++) {
    reactMount.push(measureReactMount());
    litMount.push(await measureLitMount());
    shellMount.push(await measureShellMount());
    reactUpdate.push(measureReactUpdate());
    litUpdate.push(await measureLitUpdate());
    shellUpdate.push(await measureShellUpdate());
  }

  const results = {
    n: N,
    trials: TRIALS,
    litMountMsMedian: median(litMount),
    reactMountMsMedian: median(reactMount),
    shellMountMsMedian: median(shellMount),
    litUpdateMsMedian: median(litUpdate),
    reactUpdateMsMedian: median(reactUpdate),
    shellUpdateMsMedian: median(shellUpdate),
    litMountRawMs: litMount,
    reactMountRawMs: reactMount,
    shellMountRawMs: shellMount,
    litUpdateRawMs: litUpdate,
    reactUpdateRawMs: reactUpdate,
    shellUpdateRawMs: shellUpdate,
  };

  (window as unknown as { __PERF_RESULTS__: unknown }).__PERF_RESULTS__ = results;
  const rootEl = document.getElementById('root')!;
  rootEl.textContent = 'DONE ' + JSON.stringify(results);

  console.log('PERF_RESULTS_JSON', JSON.stringify(results));
}

run();
