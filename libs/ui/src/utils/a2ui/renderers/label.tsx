import type { ReactNode } from 'react';
import { Label } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentText, getAttributeString } from '../helpers';

export const labelRenderers = {
  label: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Label
      key={component.id}
      htmlFor={component.htmlFor || getAttributeString(component, 'for') || getAttributeString(component, 'htmlFor')}
      ariaLabel={component.ariaLabel}
      styles={getMergedComponentStyles(component)}
    >
      {component.children?.length ? renderChildren(component.children) : null}
      {getComponentText(component)}
    </Label>
  ),
};
