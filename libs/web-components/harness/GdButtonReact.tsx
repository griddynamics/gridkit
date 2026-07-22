import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdButton as GdButtonElement } from '../src/components/gd-button/gd-button';

/**
 * React consumption harness  Scope — proves `gd-button` is usable from React via
 * `@lit/react`'s `createComponent()` (React 18 path). React 19 can also consume `<gd-button>` directly
 * as a native custom element without this wrapper; both paths are named in the plan's Migration Example.
 */
export const GdButton = createComponent({
  tagName: 'gd-button',
  elementClass: GdButtonElement,
  react: React,
});
