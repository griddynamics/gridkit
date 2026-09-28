import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

// Serve the exact combined artifact. --url also checks the common dev command.
const root = fileURLToPath(new URL('../../libs/ui/storybook-static/', import.meta.url));
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};
let server;
let base = process.argv[process.argv.indexOf('--url') + 1];
if (!process.argv.includes('--url')) {
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      let file = resolve(root, `.${pathname}`);
      if (file !== resolve(root) && !file.startsWith(resolve(root) + sep)) throw new Error('Invalid path');
      try {
        if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      } catch {
        if (/^\/(docs|story)\//.test(pathname)) file = resolve(root, 'index.html');
        else throw new Error('Not found');
      }
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((ready) => server.listen(0, '127.0.0.1', ready));
  base = `http://127.0.0.1:${server.address().port}`;
}

let browser;
try {
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);
  page.setDefaultNavigationTimeout(30000);
  const errors = [];
  const navigationUrls = [];
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      navigationUrls.push(new URL(request.url()));
  });
  page.on('pageerror', (error) => errors.push(error.message));
  const docs = () => page.frameLocator('#storybook-preview-iframe');
  await page.goto(`${base}/?path=/docs/introduction-welcome--docs&globals=theme:light#intro`);
  await page.waitForURL((url) => url.searchParams.get('path') === '/docs/react-introduction-welcome--docs');
  await docs()
    .getByRole('heading', { name: /Welcome to GridKit/ })
    .waitFor();
  assert.equal(new URL(page.url()).hash, '#intro');
  // The redirect preserves globals; Storybook may then discard globals that
  // this catalog has not declared (there is no global theme toolbar yet).
  assert.ok(
    navigationUrls.some(
      (url) =>
        url.searchParams.get('path') === '/docs/react-introduction-welcome--docs' &&
        url.searchParams.get('globals') === 'theme:light'
    )
  );

  await page.goto(`${base}/docs/introduction-welcome--docs#intro`);
  await page.waitForURL((url) => url.searchParams.get('path') === '/docs/react-introduction-welcome--docs');
  await docs()
    .getByRole('heading', { name: /Welcome to GridKit/ })
    .waitFor();

  await page.goto(`${base}/?path=/docs/react-introduction-getting-started--docs`);
  const themeLink = docs().getByRole('link', { name: 'Theme Tokens Usage Guide', exact: true });
  await themeLink.click();
  await page.waitForURL((url) => url.searchParams.get('path') === '/docs/react-introduction-theme-tokens-usage--docs');

  await page.goto(`${base}/?path=/docs/react-introduction-ai-integration-overview--docs`);
  await docs().getByRole('heading', { name: 'AI Integration', exact: true }).waitFor();

  // Composition must load the child's own native renderer, not a React wrapper.
  await page.goto(`${base}/?path=/story/web-components_introduction-overview--overview`);
  const nativeFrame = page.frameLocator('#storybook-ref-web-components');
  await nativeFrame.getByRole('heading', { name: 'GridKit Web Components', exact: true }).waitFor();

  await page.goto(`${base}/iframe.html?id=atoms-button--default&viewMode=story&args=size:sm`);
  await page.waitForURL((url) => url.searchParams.get('id') === 'react-atoms-button--default');
  await page.getByRole('button').first().waitFor();
  assert.equal(new URL(page.url()).searchParams.get('args'), 'size:sm');
  assert.deepEqual(errors, [], 'Storybook should not raise browser runtime errors');
  console.log(
    'Storybook smoke checks passed: React docs, AI docs, internal links, composition, and legacy manager/iframe routes.'
  );
} finally {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
}
