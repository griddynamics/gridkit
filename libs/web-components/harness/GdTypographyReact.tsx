import { createComponent } from '@lit/react';
import * as React from 'react';
import { GdTypography as GdTypographyElement } from '../src/components/gd-typography/gd-typography';

/**
 * React consumption harness for `gd-typography`. No custom events to map — Typography is
 * purely presentational, so this wrapper only exists to give React a typed component
 * reference; unlike Checkbox/Input/Select, there is no `events` mapping here.
 */
export const GdTypography = createComponent({
  tagName: 'gd-typography',
  elementClass: GdTypographyElement,
  react: React,
});
