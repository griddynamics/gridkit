import type { ReactNode } from 'react';
import { Box, InlineNotification, Snackbar, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentStyles, getComponentPlacement, renderNamedIcon } from '../helpers';
import type { StyleValue } from '../types';

function getSnackbarPlacementStyles(placement?: string): Record<string, StyleValue> | undefined {
  switch (placement) {
    case 'top-left':
      return { position: 'fixed', top: '16px', left: '16px', zIndex: 1200 };
    case 'top-center':
      return { position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 1200 };
    case 'top-right':
      return { position: 'fixed', top: '16px', right: '16px', zIndex: 1200 };
    case 'bottom-left':
      return { position: 'fixed', bottom: '16px', left: '16px', zIndex: 1200 };
    case 'bottom-center':
      return { position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 1200 };
    case 'bottom-right':
    default:
      return { position: 'fixed', bottom: '16px', right: '16px', zIndex: 1200 };
  }
}

export const notificationRenderers = {
  'inline-notification': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <InlineNotification
      key={component.id}
      variant={component.variant as never}
      styles={getMergedComponentStyles(component)}
    >
      <>
        {component.label ? <Typography variant="strong">{component.label}</Typography> : null}
        {component.value ? <Typography>{String(component.value)}</Typography> : null}
        {renderChildren(component.children)}
      </>
    </InlineNotification>
  ),
  snackbar: (component: A2UIComponent) => {
    const snackbarNode = (
      <Snackbar
        key={component.id}
        title={component.label || 'Notification'}
        message={typeof component.value === 'string' ? component.value : undefined}
        variant={component.variant as never}
        duration={(component as A2UIComponent & { duration?: number | null }).duration}
        dismissOnClick={(component as A2UIComponent & { dismissOnClick?: boolean }).dismissOnClick}
        colored={(component as A2UIComponent & { colored?: boolean }).colored}
        isAnimated={(component as A2UIComponent & { isAnimated?: boolean }).isAnimated ?? true}
        icon={renderNamedIcon(component.icon)}
        styles={getComponentStyles(component.styling)}
      />
    );

    const placementStyles = getSnackbarPlacementStyles(getComponentPlacement(component));
    return placementStyles ? (
      <Box key={`${component.id}-wrapper`} styles={placementStyles}>
        {snackbarNode}
      </Box>
    ) : (
      snackbarNode
    );
  },
};
