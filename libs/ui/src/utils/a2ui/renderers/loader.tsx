import type { ReactNode } from 'react';
import { Loader } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getComponentStyles, getAttributeString, getAttributeBoolean } from '../helpers';

export const loaderRenderers = {
  loader: (component: A2UIComponent) => (
    <Loader
      key={component.id}
      name={((component.name as string | undefined) || getAttributeString(component, 'name')) as never}
      variant={component.variant as never}
      rounded={((component.rounded as string | undefined) || getAttributeString(component, 'rounded')) as never}
      size={component.size as never}
      animationProps={component.animationProps}
      withWrapper={
        (component.withWrapper as boolean | undefined) ?? getAttributeBoolean(component, 'withWrapper') ?? true
      }
      styles={getComponentStyles(component.styling)}
    />
  ),
};
