#!/usr/bin/env node
/**
 * Prints the web-components demo map — which page proves which finding, and what each one needs.
 *
 * Run via `npm run demo:harness` (which prints this, then starts the dev server) or on its own with
 * `npm run demo:index`.
 *
 * Kept as a script rather than README prose so the URLs and prerequisites live next to the harness
 * they describe and cannot drift out of sync with the port numbers in package.json.
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const PORT = process.env.WC_DEMO_PORT ?? '5173';
const base = `http://localhost:${PORT}/harness`;

const b = (s) => `[1m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;
const green = (s) => `[32m${s}[0m`;
const yellow = (s) => `[33m${s}[0m`;

/** Artifacts some demos need. Checked so the output tells you what to run instead of failing later. */
const prereqs = {
  'dist/libs/ui/styles.css': 'npm run build:ui',
  'dist/libs/ui/tokens/index.js': 'npm run build:ui',
  'dist/libs/design-core/index.js': 'npm run build:design-core',
  'dist/libs/web-components/web-components.js': 'npm run build:web-components',
};

const missing = Object.entries(prereqs).filter(([p]) => !existsSync(join(REPO, p)));

const demos = [
  {
    page: 'form-participation-check.html',
    proves: 'Native <form> participation + CSS Parts crossing the shadow boundary',
    findings: '§17.1, §17.2',
    needs: null,
  },
  {
    page: 'shell-isolation-check.html',
    proves: 'The CTORNDSD-286 style collision, and that Shadow DOM blocks it both directions',
    findings: '§1, §15',
    needs: null,
  },
  {
    page: 'remaining-findings-repro.html',
    proves: 'Input cursor stability · Typography DOM-discoverability gap · Select popover dismissal',
    findings: '§4, §5, §6',
    needs: null,
  },
  {
    page: 'fidelity-check.html',
    proves: 'All 5 atoms rendered with the real theme, for side-by-side comparison with Storybook',
    findings: '§9, §16',
    needs: 'dist/libs/ui/styles.css',
  },
  {
    page: 'perf-check.html',
    proves: 'Mount/update speed: React vs native Lit vs Lit-wraps-React (auto-runs, ~30s)',
    findings: '§14, §18.1',
    needs: 'dist/libs/ui/styles.css',
  },
  {
    page: 'ssr-dsd-static.html',
    proves: 'Server-rendered Declarative Shadow DOM with ZERO client JavaScript',
    findings: '§2',
    needs: 'run `npm run check:web-components-ssr` first to generate it',
  },
  {
    page: 'ssr-dsd-hydrated.html',
    proves: 'The same markup hydrating without discarding the server-rendered DOM node',
    findings: '§2',
    needs: 'run `npm run check:web-components-ssr` first to generate it',
  },
];

console.log(`\n${b('GridKit web-components — demo map')}`);
console.log(dim('Findings references are sections of libs/web-components/FINDINGS.md\n'));

for (const d of demos) {
  console.log(`  ${b(green(d.page))}  ${dim(d.findings)}`);
  console.log(`    ${d.proves}`);
  console.log(`    ${dim(`${base}/${d.page}`)}`);
  if (d.needs) console.log(`    ${yellow('needs:')} ${d.needs}`);
  console.log();
}

console.log(`${b('Comparison baseline')}`);
console.log(`  Run ${b('npm run storybook')} in a second terminal (http://localhost:6006) to compare`);
console.log(`  the Lit atoms against the real React components.\n`);

console.log(`${b('Demos that are not pages')}`);
console.log(
  `  ${b('npm run demo:react19')}   React 19 interop — property assignment vs custom events   ${dim('§17.3')}`
);
console.log(
  `  ${b('npm run demo:next')}      Next.js SSR — no DSD emitted, client-only rendering      ${dim('§17.4')}`
);
console.log(`  ${b('npm run check:web-components-ssr')}    standalone SSR/DSD render        ${dim('§2')}`);
console.log(`  ${b('npm run check:web-components-size')}   bundle size + regression gate    ${dim('§3, §18.4')}`);
console.log(`  ${b('npm run test:web-components')}         45 browser tests incl. a11y      ${dim('§18.2, §18.3')}\n`);

if (missing.length > 0) {
  console.log(`${yellow(b('Some demos need a build first:'))}`);
  const cmds = [...new Set(missing.map(([, cmd]) => cmd))];
  for (const [p, cmd] of missing) console.log(`  ${yellow('missing')} ${p}  ${dim(`→ ${cmd}`)}`);
  console.log(`\n  Fix all of it with: ${b('npm run demo:setup')}`);
  console.log(dim(`  (or individually: ${cmds.join(' && ')})\n`));
} else {
  console.log(`${green('✓ All build prerequisites present — every demo above is ready to open.')}\n`);
}
