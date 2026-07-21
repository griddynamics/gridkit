import type { ReactNode } from 'react';
import { RadioGroup } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getRadioOptions } from '../helpers';

export const radioGroupRenderers = {
  'radio-group': (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <RadioGroup
      key={component.id}
      options={getRadioOptions(component)}
      value={typeof component.value === 'string' ? component.value : undefined}
      defaultValue={
        typeof (component as A2UIComponent & { defaultValue?: unknown }).defaultValue === 'string'
          ? ((component as A2UIComponent & { defaultValue?: string }).defaultValue as string)
          : undefined
      }
      variant={component.variant as never}
      size={component.size === 'sm' || component.size === 'md' ? component.size : undefined}
      gutter={component.gutter}
      gridColumns={(component as A2UIComponent & { gridColumns?: number | string }).gridColumns}
      gridRows={(component as A2UIComponent & { gridRows?: number | string }).gridRows}
      gridColumnGutter={(component as A2UIComponent & { gridColumnGutter?: number | string }).gridColumnGutter}
      gridRowGutter={(component as A2UIComponent & { gridRowGutter?: number | string }).gridRowGutter}
      wrapItems={(component as A2UIComponent & { wrapItems?: boolean }).wrapItems}
      align={component.align as never}
      justify={component.justify as never}
      itemWidth={(component as A2UIComponent & { itemWidth?: string }).itemWidth}
      itemHeight={(component as A2UIComponent & { itemHeight?: string }).itemHeight}
      name={component.name}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getMergedComponentStyles(component)}
      onChange={
        dispatchAction && component.actions?.length
          ? (value: string) => component.actions!.forEach((id) => dispatchAction(id, { value }))
          : undefined
      }
    />
  ),
};
