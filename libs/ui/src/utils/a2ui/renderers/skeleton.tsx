import type { ReactNode } from 'react';
import { Skeleton } from '@components';
import type { A2UIComponent } from '../../../ai';
import { sanitizeA2UIAttributes } from '../../../ai';
import { getComponentStyles, getLegacyStyles } from '../helpers';

function getSkeletonStyleOverrides(component: A2UIComponent) {
  const styles = component.styling || getLegacyStyles(component);

  if (!styles) {
    return undefined;
  }

  const { backgroundColor: _backgroundColor, ...restStyles } = styles;

  return Object.keys(restStyles).length > 0 ? getComponentStyles(restStyles) : undefined;
}

function getSkeletonDimension(value?: string | number) {
  if (typeof value === 'number') {
    return `${value}px`;
  }

  return typeof value === 'string' ? value : undefined;
}

function getSkeletonBackgroundColor(component: A2UIComponent) {
  return component.backgroundColor || component.styling?.backgroundColor || getLegacyStyles(component)?.backgroundColor;
}

export const skeletonRenderers = {
  skeleton: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Skeleton
      key={component.id}
      variant={component.variant as never}
      width={
        getSkeletonDimension(component.width) ||
        getSkeletonDimension(component.styling?.width) ||
        getSkeletonDimension(getLegacyStyles(component)?.width)
      }
      height={
        getSkeletonDimension(component.height) ||
        getSkeletonDimension(component.styling?.height) ||
        getSkeletonDimension(getLegacyStyles(component)?.height)
      }
      backgroundColor={getSkeletonBackgroundColor(component)}
      animationName={component.animationName}
      animationProps={component.animationProps}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getSkeletonStyleOverrides(component)}
      {...sanitizeA2UIAttributes(component.attributes)}
    >
      {renderChildren(component.children)}
    </Skeleton>
  ),
};
