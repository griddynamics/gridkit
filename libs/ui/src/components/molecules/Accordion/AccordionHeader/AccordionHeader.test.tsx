import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';
import { Typography } from '@components';
import { TypographyVariant } from '@types';

import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';
import { AccordionHeader } from '../AccordionHeader';
import { AccordionContent } from '../AccordionContent';
import { HEADER_COMPONENT } from '../constants';

const accordionItems = [
  {
    id: 'item1',
    title: 'Title 1',
    content: 'Content 1',
  },
  {
    id: 'item2',
    title: 'Title 2',
    content: 'Content 2',
  },
  {
    id: 'item3',
    title: 'Title 3',
    content: 'Content 3',
  },
];

describe(HEADER_COMPONENT, () => {
  it('SHOULD set correct attributes for AccordionHeader', () => {
    render(
      <Accordion>
        {accordionItems.map((item) => {
          return (
            <AccordionItem key={item.id} id={item.id}>
              <AccordionHeader>
                <Typography variant={TypographyVariant.H1}>{item.title}</Typography>
              </AccordionHeader>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );

    accordionItems.forEach((item) => {
      const accordionHeader = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
      const attributes = {
        id: accordionHeader.getAttribute('id'),
        'aria-expanded': accordionHeader.getAttribute('aria-expanded'),
        'aria-controls': accordionHeader.getAttribute('aria-controls'),
      };
      const expectedAttributes = {
        id: `accordion-header-${item.id}`,
        'aria-expanded': 'false',
        'aria-controls': `accordion-panel-${item.id}`,
      };
      expect(attributes).toStrictEqual(expectedAttributes);
    });
  });

  it('SHOULD className properly', () => {
    const item = accordionItems[0];
    const expectedClassname = 'custom-item-classname';
    render(
      <Accordion>
        <AccordionItem id={item.id}>
          <AccordionHeader className={expectedClassname}>
            <Typography variant={TypographyVariant.H1}>{item.title}</Typography>
          </AccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const accordionItem = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
    expect(accordionItem.className).toContain(expectedClassname);
  });
});
