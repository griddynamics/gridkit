import type { ReactNode } from 'react';
import { Switch } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles } from '../helpers';

const LABEL_POSITIONS = new Set<string>(['left', 'right']);

function getCheckboxChecked(component: A2UIComponent) {
  if (typeof component.checked === 'boolean') {
    return component.checked;
  }

  return typeof component.value === 'boolean' ? component.value : undefined;
}

export const switchRenderers = {
  switch: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    // label prop is LabelPosition ('left'|'right'). Text content comes from value.
    // labelSide kept as a legacy fallback.
    const labelPos =
      (typeof component.label === 'string' && LABEL_POSITIONS.has(component.label)
        ? (component.label as 'left' | 'right')
        : undefined) ??
      (component.labelSide as 'left' | 'right' | undefined) ??
      'right';

    const text = typeof component.value === 'string' ? component.value : undefined;

    return (
      <Switch
        key={component.id}
        checked={getCheckboxChecked(component)}
        disabled={component.disabled}
        isLoading={component.isLoading}
        name={component.name}
        label={labelPos}
        aria-label={component.ariaLabel}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        onValueChange={
          dispatchAction && component.actions?.length
            ? (checked: boolean) => component.actions!.forEach((id) => dispatchAction(id, { checked, value: checked }))
            : undefined
        }
      >
        {text}
      </Switch>
    );
  },
};
