import type { ReactNode } from 'react';
import { Link } from '@components';
import type { A2UIComponent } from '../../../ai';
import { isSafeA2UIUrl } from '../../../ai';
import { getMergedComponentStyles, getComponentText, getAttributeString } from '../helpers';

function getSafeLinkHref(component: A2UIComponent) {
  const href = (component.href as string | undefined) || getAttributeString(component, 'href');
  return isSafeA2UIUrl(href) ? href : undefined;
}

export const linkRenderers = {
  link: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Link
      key={component.id}
      href={getSafeLinkHref(component)}
      target={((component.target as string | undefined) || getAttributeString(component, 'target')) as never}
      rel={(component.rel as string | undefined) || getAttributeString(component, 'rel')}
      variant={component.variant as never}
      size={component.size === 'sm' || component.size === 'md' || component.size === 'lg' ? component.size : undefined}
      underline={(component.underline as 'default' | 'highlight' | 'none' | undefined) || undefined}
      color={(component.color || component.styling?.color) as never}
      disabled={component.disabled}
      cursor={component.cursor as never}
      role={component.role as string | undefined}
      ariaLabel={component.ariaLabel}
      tabindex={component.tabIndex}
      styles={getMergedComponentStyles(component)}
      onClick={
        dispatchAction && component.actions?.length
          ? () => component.actions!.forEach((id) => dispatchAction(id))
          : undefined
      }
    >
      {getComponentText(component)}
    </Link>
  ),
};
