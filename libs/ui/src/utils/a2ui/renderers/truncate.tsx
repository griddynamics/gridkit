import type { ReactNode } from 'react';
import { Truncate } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentText, getAttributeNumber } from '../helpers';

export const truncateRenderers = {
  truncate: (component: A2UIComponent) => (
    <Truncate
      key={component.id}
      lines={
        component.lines || getAttributeNumber(component, 'maxLines') || getAttributeNumber(component, 'lines') || 1
      }
      styles={getMergedComponentStyles(component)}
    >
      {getComponentText(component)}
    </Truncate>
  ),
};
