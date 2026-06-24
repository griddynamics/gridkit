import type { ReactNode } from 'react';
import { Counter } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getAttributeNumber } from '../helpers';

export const counterRenderers = {
  counter: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Counter
      key={component.id}
      initial={(component as A2UIComponent & { initial?: number }).initial ?? getAttributeNumber(component, 'initial')}
      min={component.min ?? getAttributeNumber(component, 'min')}
      max={component.max ?? getAttributeNumber(component, 'max')}
      isDisabled={component.disabled}
      styles={getMergedComponentStyles(component)}
      onCounterChange={
        dispatchAction && component.actions?.length
          ? (qty: number) => component.actions!.forEach((id) => dispatchAction(id, { qty }))
          : undefined
      }
    />
  ),
};
