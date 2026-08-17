import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdInput as GdInputElement } from '../src/components/gd-input/gd-input';

/**
 * React consumption harness for `gd-input` — the cursor-jump repro harness (see
 * gd-input.spec.ts / FINDINGS.md) drives this wrapper with a React state round-trip
 * (`value={value} onGdInput={(e) => setValue(e.detail.value)}`) under rapid typing to
 * exercise the activeElement guard against a real async state-update gap, not just a
 * synchronous unit test.
 */
export const GdInput = createComponent({
  tagName: 'gd-input',
  elementClass: GdInputElement,
  react: React,
  events: { onGdInput: 'gd-input' },
});
