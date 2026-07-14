#!/usr/bin/env node
/**
 * Phase 8: Real install + import test via Verdaccio (private registry).
 *
 * Catches publish-time bugs that none of the static phases can see:
 *   - missing files-field entries (file in dist but excluded from npm pack)
 *   - peer-dep mismatches that break install
 *   - exports-map paths that don't resolve under a real consumer
 *   - dist .cjs files that crash on require() in a clean Node context
 *
 * Algorithm:
 *   1. Spawn Verdaccio on a free port with a minimal anon-publish config
 *   2. npm publish dist/libs/ui → local registry
 *   3. Create a temp fixture dir with React + Emotion + the lib as deps
 *   4. npm install --registry=<local>
 *   5. node -e "import('gd-design-library')"  (ESM smoke test)
 *   6. node -e "require('gd-design-library')"  (CJS smoke test)
 *   7. Tear down Verdaccio + temp dirs
 *
 * Usage:
 *   node libs/ui/scripts/install-check.mjs
 *   node libs/ui/scripts/install-check.mjs --json
 *   node libs/ui/scripts/install-check.mjs --check       # exit 1 on any step failure
 *   node libs/ui/scripts/install-check.mjs --keep        # don't tear down (debug)
 */

import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawnSync, spawn } from 'child_process';
import { tmpdir } from 'os';
import net from 'net';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LIB_ROOT = resolve(__dirname, '..');
const DIST_ROOT = resolve(LIB_ROOT, '../../dist/libs/ui');
const OUTPUT_DIR = resolve(__dirname, 'output');

const WRITE_JSON = process.argv.includes('--json');
const CHECK_MODE = process.argv.includes('--check');
const KEEP = process.argv.includes('--keep');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║   gd-design-library  ·  Verdaccio Install Test  ║');
console.log('╚══════════════════════════════════════════════════╝\n');

const steps = [];
const log = (label, ok, detail = '') => {
  steps.push({ label, ok, detail });
  console.log(`  ${ok ? '✓' : '✗'} ${label.padEnd(38)} ${detail}`);
};

function bail(reason) {
  console.log(`\n  ✗ Aborting: ${reason}\n`);
  if (WRITE_JSON) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
    writeFileSync(
      resolve(OUTPUT_DIR, 'install-check-report.json'),
      JSON.stringify({ passed: false, error: reason, steps }, null, 2)
    );
  }
  if (CHECK_MODE) process.exit(1);
  process.exit(0);
}

if (!existsSync(resolve(DIST_ROOT, 'package.json'))) bail('dist/libs/ui/package.json missing — run `nx build ui`');

// ─── Pick a free port ─────────────────────────────────────────────────────────

async function findFreePort() {
  return new Promise((res) => {
    const s = net.createServer();
    s.listen(0, () => {
      const p = s.address().port;
      s.close(() => res(p));
    });
  });
}

const PORT = await findFreePort();
const REGISTRY = `http://localhost:${PORT}/`;

// ─── Workspaces ───────────────────────────────────────────────────────────────

const WORK = resolve(tmpdir(), `gd-ui-install-${Date.now()}`);
const VERDACCIO_DIR = resolve(WORK, 'verdaccio');
const FIXTURE_DIR = resolve(WORK, 'fixture');
mkdirSync(VERDACCIO_DIR, { recursive: true });
mkdirSync(resolve(VERDACCIO_DIR, 'storage'), { recursive: true });
mkdirSync(FIXTURE_DIR, { recursive: true });

const verdaccioConfig = `
storage: ${resolve(VERDACCIO_DIR, 'storage')}
listen: ${PORT}
auth:
  htpasswd:
    file: ${resolve(VERDACCIO_DIR, 'htpasswd')}
    max_users: 1000
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    timeout: 30s
    cache: true
packages:
  '@*/*':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
  '**':
    access: $anonymous
    publish: $anonymous
    proxy: npmjs
log: { type: stdout, format: pretty, level: warn }
`.trim();

const VERDACCIO_CONFIG_PATH = resolve(VERDACCIO_DIR, 'config.yaml');
writeFileSync(VERDACCIO_CONFIG_PATH, verdaccioConfig);

// ─── Spawn Verdaccio ──────────────────────────────────────────────────────────

console.log(`▶ Starting Verdaccio on ${REGISTRY}\n`);

const verdaccio = spawn('npx', ['verdaccio', '--config', VERDACCIO_CONFIG_PATH, '--listen', String(PORT)], {
  stdio: ['ignore', 'pipe', 'pipe'],
});

let serverReady = false;
const verdaccioOutput = [];
verdaccio.stdout.on('data', (d) => verdaccioOutput.push(String(d)));
verdaccio.stderr.on('data', (d) => verdaccioOutput.push(String(d)));

async function waitForReady(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const ok = await new Promise((res) => {
        const req = net.createConnection({ port: PORT, host: 'localhost' });
        req.on('connect', () => {
          req.end();
          res(true);
        });
        req.on('error', () => res(false));
      });
      if (ok) {
        serverReady = true;
        return true;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

// ─── Cleanup harness ──────────────────────────────────────────────────────────

let cleaned = false;
function cleanup() {
  if (cleaned || KEEP) return;
  cleaned = true;
  try {
    verdaccio.kill('SIGTERM');
  } catch {}
  try {
    rmSync(WORK, { recursive: true, force: true });
  } catch {}
}
process.on('exit', cleanup);
process.on('SIGINT', () => {
  cleanup();
  process.exit(130);
});

// ─── Run ──────────────────────────────────────────────────────────────────────

const ready = await waitForReady();
log('Verdaccio reachable', ready, ready ? `port ${PORT}` : `timeout: ${verdaccioOutput.join('').slice(-200)}`);
if (!ready) bail('verdaccio did not start in 30s');

// Bump version to avoid conflict with anything previously published.
// Prerelease format `<base>-installcheck.<ts>` is valid semver; we publish
// it under an explicit dist-tag so npm doesn't reject the upload.
const distPkgPath = resolve(DIST_ROOT, 'package.json');
const distPkg = JSON.parse(readFileSync(distPkgPath, 'utf-8'));
const originalVersion = distPkg.version;
const stampedVersion = `${originalVersion}-installcheck.${Date.now()}`;
distPkg.version = stampedVersion;
writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2));

// Auth: create a token via npm-cli-style npmrc
const npmrcPath = resolve(FIXTURE_DIR, '.npmrc');
writeFileSync(npmrcPath, `registry=${REGISTRY}\n//localhost:${PORT}/:_authToken=fake-token\n`);

const env = { ...process.env, npm_config_registry: REGISTRY };

// 1. Publish (under explicit dist-tag because the version is a prerelease)
const pub = spawnSync('npm', ['publish', '--registry', REGISTRY, '--userconfig', npmrcPath, '--tag', 'installcheck'], {
  cwd: DIST_ROOT,
  encoding: 'utf-8',
  env,
  timeout: 60_000,
});
const publishOk = pub.status === 0;
log('npm publish to local registry', publishOk, publishOk ? `v${stampedVersion}` : (pub.stderr ?? '').slice(-200));

// Restore dist package.json to its original version (so re-runs don't see the stamp)
distPkg.version = originalVersion;
writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2));

if (!publishOk) bail('npm publish failed');

// 2. Fixture package.json
writeFileSync(
  resolve(FIXTURE_DIR, 'package.json'),
  JSON.stringify(
    {
      name: 'install-check-fixture',
      version: '1.0.0',
      private: true,
      type: 'module',
      dependencies: {
        'gd-design-library': stampedVersion,
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        '@emotion/react': '^11.0.0',
        '@emotion/styled': '^11.0.0',
      },
    },
    null,
    2
  )
);

// 3. npm install
const inst = spawnSync(
  'npm',
  ['install', '--registry', REGISTRY, '--userconfig', npmrcPath, '--no-audit', '--no-fund'],
  { cwd: FIXTURE_DIR, encoding: 'utf-8', env, timeout: 180_000 }
);
const installOk = inst.status === 0;
log(
  'npm install in fixture',
  installOk,
  installOk ? 'fixture/node_modules ready' : (inst.stderr ?? '').slice(-200).replace(/\n/g, ' ')
);
if (!installOk) bail('install failed');

// 4. ESM smoke test
const esmCheck = spawnSync(
  'node',
  [
    '-e',
    `import('gd-design-library').then(m => { const k = Object.keys(m).length; if (k < 50) throw new Error('too few exports: ' + k); console.log(k); }).catch(e => { console.error(e.message); process.exit(1); })`,
  ],
  { cwd: FIXTURE_DIR, encoding: 'utf-8', timeout: 30_000 }
);
const esmOk = esmCheck.status === 0;
const esmExports = esmOk ? Number((esmCheck.stdout ?? '').trim()) : null;
log('ESM `import("gd-design-library")`', esmOk, esmOk ? `${esmExports} named exports` : (esmCheck.stderr ?? '').trim());

// 5. CJS smoke test
const cjsCheck = spawnSync(
  'node',
  [
    '-e',
    `try { const m = require('gd-design-library'); const k = Object.keys(m).length; if (k < 50) throw new Error('too few exports: ' + k); console.log(k); } catch(e) { console.error(e.message); process.exit(1); }`,
  ],
  { cwd: FIXTURE_DIR, encoding: 'utf-8', timeout: 30_000 }
);
const cjsOk = cjsCheck.status === 0;
const cjsExports = cjsOk ? Number((cjsCheck.stdout ?? '').trim()) : null;
log(
  'CJS `require("gd-design-library")`',
  cjsOk,
  cjsOk ? `${cjsExports} named exports` : (cjsCheck.stderr ?? '').trim()
);

// 6. Subpath check — exports['./ai'] resolves through the `require` condition
const subpath = spawnSync(
  'node',
  [
    '-e',
    `try { const m = require('gd-design-library/ai'); console.log(Object.keys(m).length); } catch(e) { console.error(e.message); process.exit(1); }`,
  ],
  { cwd: FIXTURE_DIR, encoding: 'utf-8', timeout: 30_000 }
);
const subOk = subpath.status === 0;
log(
  'CJS `require("gd-design-library/ai")`',
  subOk,
  subOk ? `${(subpath.stdout ?? '').trim()} exports` : (subpath.stderr ?? '').trim()
);

// ─── Done ─────────────────────────────────────────────────────────────────────

const allPassed = steps.every((s) => s.ok);
console.log('\n── Summary ─────────────────────────────────────────');
console.log(`  Steps run    : ${steps.length}`);
console.log(`  Steps failed : ${steps.filter((s) => !s.ok).length}`);

if (WRITE_JSON) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(
    resolve(OUTPUT_DIR, 'install-check-report.json'),
    JSON.stringify(
      {
        passed: allPassed,
        registry: REGISTRY,
        publishedVersion: stampedVersion,
        esmExports,
        cjsExports,
        steps,
      },
      null,
      2
    )
  );
  console.log(`  JSON written → scripts/output/install-check-report.json`);
}

console.log('\n' + (allPassed ? '✓ Install check passed.' : '✗ Install check failed.') + '\n');

cleanup();
if (CHECK_MODE && !allPassed) process.exit(1);
