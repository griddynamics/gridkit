import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdSelect as GdSelectElement } from '../src/components/gd-select/gd-select';

/**
 * React consumption harness for `gd-select` — object/array props (`items`, `value`) pass
 * through as JS properties (React 19 native heuristic, or `@lit/react`'s own property
 * pass-through for React 18); `gd-change` still needs the `events` mapping below.
 */
export const GdSelect = createComponent({
  tagName: 'gd-select',
  elementClass: GdSelectElement,
  react: React,
  events: { onGdChange: 'gd-change' },
});
