import type { ReactNode } from 'react';
import { Rating } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles } from '../helpers';

export const ratingRenderers = {
  rating: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const sizeMap = { xs: 'sm', sm: 'sm', md: 'md', lg: 'lg', xl: 'lg', xxl: 'lg' } as const;
    const size = component.size ? sizeMap[component.size] : undefined;
    const readOnly = component.readOnly ?? !component.actions?.length;
    return (
      <Rating
        key={component.id}
        value={typeof component.value === 'number' ? component.value : 0}
        defaultValue={
          typeof (component as A2UIComponent & { defaultValue?: unknown }).defaultValue === 'number'
            ? ((component as A2UIComponent & { defaultValue?: number }).defaultValue as number)
            : undefined
        }
        max={component.max}
        groupName={component.name}
        size={size}
        readOnly={readOnly}
        aria-label={component.ariaLabel}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        onChange={
          dispatchAction && component.actions?.length
            ? (value: number) => component.actions!.forEach((id) => dispatchAction(id, { value }))
            : undefined
        }
      />
    );
  },
};
