import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import * as path from 'path';

/**
 * CTORNDSD-646c — the first automated test setup for this package, which previously had zero tests.
 *
 * **Real browser, not jsdom, and this is not a preference.** These components depend on three
 * mechanisms jsdom does not implement reliably: Constructable StyleSheets
 * (`shadowRoot.adoptedStyleSheets` + `replaceSync`), the `popover` attribute and its native
 * light-dismiss algorithm, and Declarative Shadow DOM. The repo's existing `unit` project is
 * jsdom-based and therefore cannot host these tests at all.
 *
 * Browser mode with the Playwright provider also gives **trusted** input via
 * `@vitest/browser/context`'s `userEvent`, which matters: `FINDINGS.md` Section 6 documents a
 * concrete false negative from synthetic `element.click()` — the browser's popover light-dismiss
 * algorithm ignores untrusted events entirely, so a suite built on synthetic events would encode
 * that wrong result permanently.
 *
 * Aliases mirror `vite.config.ts`'s serve-mode aliases so tests resolve the REAL token source
 * rather than a built artifact.
 */
const uiSrc = path.resolve(__dirname, '../ui/src');

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/web-components-test',
  resolve: {
    alias: {
      // The main vite.config.ts gets this from `nxViteTsPaths()`; this config resolves it
      // explicitly so the test project does not depend on the Nx tsconfig-paths plugin.
      'gd-design-core': path.resolve(__dirname, '../design-core/src/index.ts'),
      'gd-design-library/tokens': path.join(uiSrc, 'tokens/index.ts'),
      '@utils': path.join(uiSrc, 'utils'),
      '@types': path.join(uiSrc, 'types'),
      '@constants': path.join(uiSrc, 'constants'),
      '@hooks': path.join(uiSrc, 'hooks'),
      '@tokens': path.join(uiSrc, 'tokens'),
      '@components': path.join(uiSrc, 'components'),
      '@assets': path.join(uiSrc, 'assets'),
    },
  },
  test: {
    name: 'web-components',
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
