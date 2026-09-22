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
  const { out, hasButtonDSD, hasTypographyDSD, staticHtmlPath, hydratedHtmlPath } = await mod.runSsrDsdCheck();

  console.log('--- SSR output ---\n' + out + '\n------------------\n');
  console.log('DSD present for gd-button:     ', hasButtonDSD);
  console.log('DSD present for gd-typography: ', hasTypographyDSD);
  console.log(`\nWrote no-JS static DSD reproduction → ${staticHtmlPath}`);
  console.log(`Wrote hydration reproduction → ${hydratedHtmlPath}`);

  if (!hasButtonDSD || !hasTypographyDSD) {
    console.error('\nFAIL: expected DSD template wrapper missing for one or both components.');
    process.exitCode = 1;
  }
} finally {
  await server.close();
}
