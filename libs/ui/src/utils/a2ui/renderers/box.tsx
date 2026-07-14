import type { ReactNode } from 'react';
import { Box, Typography } from '@components';
import type { A2UIComponent } from '../../../ai';
import { getMergedComponentStyles, getComponentText } from '../helpers';

export const boxRenderers = {
  box: (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const text = getComponentText(component);

    return (
      <Box
        key={component.id}
        variant={component.variant === 'horizontal' || component.variant === 'vertical' ? component.variant : undefined}
        isBordered={component.isBordered}
        isHighlighted={component.isHighlighted}
        withShadowHover={component.withShadowHover}
        tabIndex={component.tabIndex}
        className={component.className}
        styles={getMergedComponentStyles(component)}
        onClick={component.actions?.length ? () => component.actions!.forEach((id) => dispatchAction?.(id)) : undefined}
      >
        {renderChildren(component.children)}
        {!component.children?.length && text ? <Typography>{text}</Typography> : null}
      </Box>
    );
  },
};
