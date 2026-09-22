import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdCheckbox as GdCheckboxElement } from '../src/components/gd-checkbox/gd-checkbox';

/**
 * React consumption harness for `gd-checkbox` — the React-19-scope nuance from the Migration
 * Example applies here: React can assign `checked`/`indeterminate` as JS properties
 * natively, but the `gd-change` CustomEvent still needs `@lit/react`'s `events` mapping (or manual
 * `addEventListener`) to reach an `onGdChange`-style callback prop, regardless of React version.
 */
export const GdCheckbox = createComponent({
  tagName: 'gd-checkbox',
  elementClass: GdCheckboxElement,
  react: React,
  events: { onGdChange: 'gd-change' },
});
