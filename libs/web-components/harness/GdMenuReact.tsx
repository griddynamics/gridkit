import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdMenu as GdMenuElement } from '../src/components/molecules/gd-menu/gd-menu';

export const GdMenu = createComponent({
  tagName: 'gd-menu',
  elementClass: GdMenuElement,
  react: React,
  events: { onGdChange: 'gd-change' },
});
