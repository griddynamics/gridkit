import type { ReactNode } from 'react';
import { Breadcrumbs, Link, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getAttributeString, renderNamedIcon, getOptionLikeItems } from '../helpers';

function getBreadcrumbSeparatorNode(component: A2UIComponent) {
  const separatorIcon =
    (component as A2UIComponent & { separatorIcon?: string }).separatorIcon ||
    getAttributeString(component, 'separatorIcon');
  if (separatorIcon) {
    return renderNamedIcon(separatorIcon);
  }

  const separatorText =
    (component as A2UIComponent & { separator?: string }).separator ||
    getAttributeString(component, 'separator') ||
    '/';

  return <Typography as="span">{separatorText}</Typography>;
}

export const breadcrumbsRenderers = {
  breadcrumbs: (component: A2UIComponent) => (
    <Breadcrumbs
      key={component.id}
      separator={getBreadcrumbSeparatorNode(component)}
      itemStart={renderNamedIcon(component.icon)}
      itemEnd={renderNamedIcon(component.iconEnd)}
      separatorAfterLastItem={
        (component as A2UIComponent & { separatorAfterLastItem?: boolean }).separatorAfterLastItem
      }
      bordered={(component as A2UIComponent & { bordered?: boolean }).bordered}
      ariaLabel={component.ariaLabel}
      items={getOptionLikeItems(component).map((option) =>
        option.href ? (
          <Link key={`${component.id}-${option.label}`} href={option.href} disabled={option.disabled}>
            {option.label}
          </Link>
        ) : (
          <Typography key={`${component.id}-${option.label}`}>{option.label}</Typography>
        )
      )}
      styles={getMergedComponentStyles(component)}
    />
  ),
};
