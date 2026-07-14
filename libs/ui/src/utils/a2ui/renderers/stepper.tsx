import type { ReactNode } from 'react';
import { Icon, Stepper } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getOptionLikeItems } from '../helpers';

export const stepperRenderers = {
  stepper: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const options = getOptionLikeItems(component);
    return (
      <Stepper
        key={component.id}
        activeStep={typeof component.value === 'number' ? component.value : 0}
        isIconsView={(component as A2UIComponent & { isIconsView?: boolean }).isIconsView}
        steps={options.map((option) => ({
          label: option.label,
          validationStatus: option.validationStatus as never,
          customView: option.icon ? <Icon name={option.icon as never} /> : undefined,
        }))}
        styles={getMergedComponentStyles(component)}
        onStepClick={
          dispatchAction && component.actions?.length
            ? (index, status) => {
                const option = options[index];
                component.actions!.forEach((id) =>
                  dispatchAction(id, { index, status, value: option?.value, label: option?.label })
                );
              }
            : undefined
        }
      />
    );
  },
};
