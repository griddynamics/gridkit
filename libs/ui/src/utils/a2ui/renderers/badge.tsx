import type { ReactNode } from 'react';
import { Badge } from '@components';
import type { A2UIComponent } from '../../../ai';
import {
  getMergedComponentStyles,
  getComponentText,
  getLeadingIconName,
  getTopLevelString,
  renderNamedIcon,
  getAttributeString,
} from '../helpers';

export const badgeRenderers = {
  badge: (component: A2UIComponent) => {
    const iconEndName = getTopLevelString(component, 'iconEnd');
    return (
      <Badge
        key={component.id}
        variant={component.variant as never}
        appearance={
          ((component.appearance as string | undefined) || getAttributeString(component, 'appearance')) as never
        }
        size={component.size as never}
        disabled={component.disabled}
        iconStart={renderNamedIcon(getLeadingIconName(component))}
        iconEnd={renderNamedIcon(iconEndName)}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        aria-label={component.ariaLabel}
      >
        {getComponentText(component)}
      </Badge>
    );
  },
};
