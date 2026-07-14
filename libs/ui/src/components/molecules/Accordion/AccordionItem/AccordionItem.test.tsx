import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';

import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';
import { AccordionHeader } from '../AccordionHeader';
import { AccordionContent } from '../AccordionContent';
import { ITEM_COMPONENT } from '../constants';

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

describe(ITEM_COMPONENT, () => {
  it('SHOULD set correct attributes for AccordionItem', () => {
    render(
      <Accordion>
        {accordionItems.map((item) => {
          return (
            <AccordionItem key={item.id} id={item.id}>
              <AccordionHeader>
                <h1>{item.title}</h1>
              </AccordionHeader>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );

    accordionItems.forEach((item) => {
      const accordionItem = screen.getByTestId(`${ITEM_COMPONENT}-${item.id}`);
      const attributes = {
        'data-open': accordionItem.getAttribute('data-open'),
        'data-value': accordionItem.getAttribute('data-value'),
      };
      const expectedAttributes = {
        'data-open': 'false',
        'data-value': item.id,
      };
      expect(attributes).toStrictEqual(expectedAttributes);
    });
  });

  it('SHOULD className properly', () => {
    const item = accordionItems[0];
    const expectedClassname = 'custom-item-classname';
    render(
      <Accordion>
        <AccordionItem className={expectedClassname} id={item.id}>
          <AccordionHeader>
            <h1>{item.title}</h1>
          </AccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const accordionItem = screen.getByTestId(`${ITEM_COMPONENT}-${item.id}`);
    expect(accordionItem.className).toContain(expectedClassname);
  });
});
