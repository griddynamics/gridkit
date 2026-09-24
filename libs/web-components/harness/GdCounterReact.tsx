import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdCounter as GdCounterElement } from '../src/components/molecules/gd-counter/gd-counter';

export const GdCounter = createComponent({
  tagName: 'gd-counter',
  elementClass: GdCounterElement,
  react: React,
  events: { onGdChange: 'gd-change' },
});
