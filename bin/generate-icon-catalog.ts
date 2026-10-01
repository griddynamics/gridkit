import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import React, { createElement } from 'react';
import { IconsList } from '../libs/ui/src/components/atoms/Icon/constants';

Object.assign(globalThis, { React });

const catalog = Object.fromEntries(
  Object.entries(IconsList).map(([name, Component]) => {
    const markup = renderToStaticMarkup(
      createElement(Component, { fill: 'var(--gd-icon-fill)', fillSvg: 'var(--gd-icon-fill-svg)' })
    );
    const match = markup.match(/^<svg\b([^>]*)>([\s\S]*)<\/svg>$/);
    if (!match) throw new Error(`Icon ${name} did not render one SVG root.`);
    const viewBox = match[1].match(/viewBox="([^"]+)"/)?.[1];
    if (!viewBox) throw new Error(`Icon ${name} has no viewBox.`);
    return [name, { viewBox, body: match[2] }];
  })
);

const output =
  `// Generated from GridKit SVG assets by bin/generate-icon-catalog.ts.\n` +
  `// Edit the source SVG and regenerate; React and Web Components consume this catalog.\n` +
  `export const iconCatalog = ${JSON.stringify(catalog, null, 2)} as const;\n\n` +
  `export type GridKitIconName = keyof typeof iconCatalog;\n`;

writeFileSync(resolve(import.meta.dirname, '../libs/design-core/src/icons/catalog.ts'), output);
