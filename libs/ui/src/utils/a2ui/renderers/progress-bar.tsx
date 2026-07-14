import type { ReactNode } from 'react';
import { Column, ProgressBar, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles } from '../helpers';

export const progressBarRenderers = {
  'progress-bar': (component: A2UIComponent) => {
    const progressNode = (
      <ProgressBar
        key={component.label ? `${component.id}-bar` : component.id}
        value={typeof component.value === 'number' ? component.value : undefined}
        indeterminate={component.indeterminate}
        showPercentage={(component as A2UIComponent & { showPercentage?: boolean }).showPercentage}
        fillColor={(component as A2UIComponent & { fillColor?: string }).fillColor}
        backgroundColor={component.backgroundColor}
        aria-label={component.ariaLabel}
        styles={getComponentStyles(component.styling)}
      />
    );

    if (!component.label) {
      return progressNode;
    }

    return (
      <Column key={component.id} gap="8px">
        <Typography>{component.label}</Typography>
        {progressNode}
      </Column>
    );
  },
};
