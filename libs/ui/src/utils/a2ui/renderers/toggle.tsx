import type { ReactNode } from 'react';
import { Toggle } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getToggleItems } from '../helpers';

export const toggleRenderers = {
  toggle: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Toggle
      key={component.id}
      items={getToggleItems(component)}
      value={component.value}
      disabled={component.disabled}
      styles={getMergedComponentStyles(component)}
      onValueChange={
        dispatchAction && component.actions?.length
          ? (value: unknown) => component.actions!.forEach((id) => dispatchAction(id, { value }))
          : undefined
      }
    />
  ),
};
