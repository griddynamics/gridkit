import type { ReactNode } from 'react';
import { Button, Tooltip } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentText, getComponentPlacement, getNumberLikeValue } from '../helpers';

export const tooltipRenderers = {
  tooltip: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Tooltip
      key={component.id}
      id={component.id}
      content={(component as A2UIComponent & { content?: string }).content || getComponentText(component)}
      position={getComponentPlacement(component) as never}
      delay={(component as A2UIComponent & { delay?: number }).delay}
      gap={getNumberLikeValue((component as A2UIComponent & { gap?: string | number }).gap)}
      as={component.as as never}
      ariaLabel={component.ariaLabel}
      className={component.className}
      styles={getMergedComponentStyles(component)}
    >
      {renderChildren(component.children)[0] || <Button variant="text">{component.label || 'Info'}</Button>}
    </Tooltip>
  ),
};
