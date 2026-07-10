import type { ReactNode } from 'react';
import { Icon } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles, getComponentText, getAttributeString } from '../helpers';

export const iconRenderers = {
  icon: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Icon
      key={component.id}
      name={(component.icon || getAttributeString(component, 'name') || getComponentText(component)) as never}
      size={(component.size || getAttributeString(component, 'size')) as never}
      width={component.width != null ? (component.width as never) : undefined}
      height={component.height != null ? (component.height as never) : undefined}
      fill={component.fill || getAttributeString(component, 'fill')}
      fillSvg={component.fillSvg || getAttributeString(component, 'fillSvg')}
      className={component.className}
      tabIndex={component.tabIndex}
      aria-label={component.ariaLabel}
      styles={getComponentStyles(component.styling)}
      onClick={
        dispatchAction && component.actions?.length
          ? () => component.actions!.forEach((id) => dispatchAction(id))
          : undefined
      }
    />
  ),
};
