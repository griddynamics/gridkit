import { cp, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const host = resolve(root, 'libs/ui/storybook-static');
const child = resolve(root, 'libs/web-components/storybook-static');
await Promise.all([access(`${host}/index.json`), access(`${child}/index.json`)]);
await cp(child, `${host}/web-components`, { recursive: true });
console.log(`Combined Storybook artifact: ${host}`);
