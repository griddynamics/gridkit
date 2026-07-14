import type { ReactNode } from 'react';
import { Accordion, Typography } from '@components';
import { AccordionContent, AccordionHeader, AccordionItem } from '@components/molecules/Accordion';
import type { A2UIComponent } from '../../../ai';
import type { DispatchAction } from '../types';
import { getMergedComponentStyles, getComponentText, renderNamedIcon } from '../helpers';

export const accordionRenderers = {
  accordion: (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <Accordion
      key={component.id}
      allowMultipleExpand={component.allowMultipleExpand}
      withoutSeparator={(component as A2UIComponent & { withoutSeparator?: boolean }).withoutSeparator}
      isInline={(component as A2UIComponent & { isInline?: boolean }).isInline}
      value={
        Array.isArray(component.value)
          ? component.value.filter((item): item is string => typeof item === 'string')
          : undefined
      }
      defaultValue={
        Array.isArray((component as A2UIComponent & { defaultValue?: unknown }).defaultValue)
          ? (component as A2UIComponent & { defaultValue?: unknown[] }).defaultValue!.filter(
              (item): item is string => typeof item === 'string'
            )
          : undefined
      }
    >
      {renderChildren(component.children)}
    </Accordion>
  ),
  'accordion-item': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <AccordionItem key={component.id} id={component.id} styles={getMergedComponentStyles(component)}>
      {renderChildren(component.children)}
    </AccordionItem>
  ),
  'accordion-header': (component: A2UIComponent) => (
    <AccordionHeader
      key={component.id}
      expandIcon={renderNamedIcon(component.icon)}
      styles={getMergedComponentStyles(component)}
    >
      {getComponentText(component) || component.id}
    </AccordionHeader>
  ),
  'accordion-content': (component: A2UIComponent, renderChildren: (children?: A2UIComponent[]) => ReactNode[]) => (
    <AccordionContent key={component.id} styles={getMergedComponentStyles(component)}>
      {component.label ? <Typography>{component.label}</Typography> : null}
      {typeof component.value === 'string' || typeof component.value === 'number' ? (
        <Typography>{String(component.value)}</Typography>
      ) : null}
      {renderChildren(component.children)}
    </AccordionContent>
  ),
};
