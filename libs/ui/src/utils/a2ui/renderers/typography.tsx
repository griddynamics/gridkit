import type { ReactNode } from 'react';
import { Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles, getComponentText } from '../helpers';

export const typographyRenderers = {
  typography: (component: A2UIComponent) => (
    <Typography
      key={component.id}
      variant={component.variant as never}
      as={component.as as never}
      size={component.size as never}
      align={(component.align || component.styling?.textAlign) as never}
      color={component.color || component.styling?.color}
      styleVariant={component.styleVariant as never}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getComponentStyles(component.styling)}
    >
      {getComponentText(component)}
    </Typography>
  ),
};
