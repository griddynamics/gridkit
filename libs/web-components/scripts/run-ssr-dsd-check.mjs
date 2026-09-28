#!/usr/bin/env node
/**
 * Runner for ssr-dsd-render.ts — boots a Vite SSR module graph (reusing this package's own
 * vite.config.ts, so `gd-design-core` resolves via nxViteTsPaths() exactly as it does in
 * real dev/build) and invokes the render check.
 *
 * Usage: node libs/web-components/scripts/run-ssr-dsd-check.mjs
 */
import { createServer } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');

const server = await createServer({
  configFile: resolve(PACKAGE_ROOT, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
});

try {
  const mod = await server.ssrLoadModule(resolve(__dirname, 'ssr-dsd-render.ts'));
  const { out, dsdByTag, staticHtmlPath, hydratedHtmlPath } = await mod.runSsrDsdCheck();

  console.log('--- SSR output ---\n' + out + '\n------------------\n');
  for (const [tag, present] of Object.entries(dsdByTag)) console.log(`DSD present for ${tag}:`, present);
  console.log(`\nWrote no-JS static DSD reproduction → ${staticHtmlPath}`);
  console.log(`Wrote hydration reproduction → ${hydratedHtmlPath}`);

  if (Object.values(dsdByTag).some((present) => !present)) {
    console.error('\nFAIL: expected DSD template wrapper missing for one or more components.');
    process.exitCode = 1;
  }
} finally {
  await server.close();
}
