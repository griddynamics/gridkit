import type { ReactNode } from 'react';
import { Separator } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles, getAttributeString } from '../helpers';

const SEPARATOR_ORIENTATIONS = new Set(['horizontal', 'vertical']);
const SEPARATOR_VARIANTS = new Set(['solid', 'dashed', 'dotted']);

function getSeparatorOrientation(component: A2UIComponent) {
  if (component.orientation && SEPARATOR_ORIENTATIONS.has(component.orientation)) {
    return component.orientation;
  }

  if (component.variant && SEPARATOR_ORIENTATIONS.has(component.variant)) {
    return component.variant as 'horizontal' | 'vertical';
  }

  return undefined;
}

function getSeparatorVariant(component: A2UIComponent) {
  if (component.variant && SEPARATOR_VARIANTS.has(component.variant)) {
    return component.variant as 'solid' | 'dashed' | 'dotted';
  }

  return undefined;
}

function getSeparatorLength(component: A2UIComponent) {
  const explicitLength = (component.length as string | undefined) || getAttributeString(component, 'length');
  if (explicitLength) {
    return explicitLength;
  }

  const orientation = getSeparatorOrientation(component);
  const derivedLength =
    orientation === 'vertical'
      ? component.height || component.styling?.height
      : component.width || component.styling?.width;

  if (typeof derivedLength === 'number') {
    return `${derivedLength}px`;
  }

  return typeof derivedLength === 'string' ? derivedLength : undefined;
}

export const separatorRenderers = {
  separator: (component: A2UIComponent) => (
    <Separator
      key={component.id}
      as={component.as as 'div' | 'hr' | 'span' | undefined}
      orientation={getSeparatorOrientation(component) as never}
      variant={getSeparatorVariant(component) as never}
      length={getSeparatorLength(component) as never}
      label={component.label}
      size={component.size as never}
      color={component.color}
      labelColor={component.labelColor}
      labelPosition={component.labelPosition as never}
      aria-label={component.ariaLabel}
      className={component.className}
      styles={getComponentStyles(component.styling)}
    />
  ),
};
