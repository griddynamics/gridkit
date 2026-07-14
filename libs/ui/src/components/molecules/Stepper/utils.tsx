'use client';
import { get } from '@utils';
import { ContentViewProps, Icon } from '@components';

import { StepStatus, StepValidationStatus } from '@types';

export const getStepStatusIcon = ({ status, validationStatus, customView, isIconsView, theme }: ContentViewProps) => {
  const isError = validationStatus === StepValidationStatus.Error;
  const icons = get(theme, 'stepper.icons', {});
  switch (status) {
    case StepStatus.Complete:
      if (isError) return <Icon {...get(icons, 'error', { name: 'cross' })} />;
      return isIconsView ? <Icon {...get(icons, 'complete', { name: 'check' })} /> : customView;

    case StepStatus.Inactive:
      return isIconsView ? customView || <Icon {...get(icons, 'inactive', { name: 'check' })} /> : customView;

    case StepStatus.Active:
      if (isError) return <Icon {...get(icons, 'errorActive', { name: 'cross' })} />;

      return isIconsView ? customView || <Icon {...get(icons, 'active', { name: 'check' })} /> : customView;

    default:
      return customView;
  }
};
