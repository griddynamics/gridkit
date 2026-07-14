'use client';
import { Children, isValidElement, cloneElement, type ReactElement } from 'react';
import { useTheme } from '@hooks';

import { AccordionBaseProps } from '../Accordion.types';
import { useAccordion } from '../hooks';
import { ITEM_COMPONENT } from '../constants';
import { AccordionItemStyled } from '../AccordionStyled';

export const AccordionItem = ({ children, id, styles = {}, ...rest }: AccordionBaseProps) => {
  const { openedItems, withoutSeparator, isInline } = useAccordion();
  const { theme } = useTheme();
  const isOpen = id && openedItems.includes(id);
  return (
    <AccordionItemStyled
      data-testid={`${ITEM_COMPONENT}-${id}`}
      data-open={isOpen}
      data-value={id}
      theme={theme}
      $withoutSeparator={withoutSeparator}
      $isInline={isInline}
      $isOpen={!!isOpen}
      styles={styles}
      {...rest}
    >
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return null;
        return cloneElement(child as ReactElement, { id, isOpen });
      })}
    </AccordionItemStyled>
  );
};
