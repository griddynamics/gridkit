import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';

import { pick } from '@utils';

import { Accordion } from '../Accordion';
import { AccordionItem } from '../AccordionItem';
import { AccordionHeader } from '../AccordionHeader';
import { AccordionContent } from '../AccordionContent';
import { CONTENT_COMPONENT } from '../constants';

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

describe(CONTENT_COMPONENT, () => {
  it('SHOULD set correct attributes for AccordionContent', () => {
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
      const accordionContent = screen.getByTestId(`${CONTENT_COMPONENT}-${item.id}`);
      const attributes = {
        id: accordionContent.getAttribute('id'),
        'aria-labelledby': accordionContent.getAttribute('aria-labelledby'),
      };
      const expectedAttributes = {
        id: `accordion-panel-${item.id}`,
        'aria-labelledby': `accordion-header-${item.id}`,
      };
      expect(attributes).toStrictEqual(expectedAttributes);
    });
  });

  it('SHOULD pass styles properly', () => {
    const item = accordionItems[0];
    const expectedStyle = { backgroundColor: 'rgb(255, 0, 0)', height: '100px', width: '100px' };
    render(
      <Accordion>
        <AccordionItem id={item.id}>
          <AccordionHeader>
            <h1>{item.title}</h1>
          </AccordionHeader>
          <AccordionContent styles={expectedStyle}>{item.content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const accordionContent = screen.getByTestId(`${CONTENT_COMPONENT}-${item.id}`);
    const computedStyles = pick(getComputedStyle(accordionContent), ['backgroundColor', 'height', 'width']);
    expect(computedStyles).toStrictEqual(expectedStyle);
  });

  it('SHOULD className properly', () => {
    const item = accordionItems[0];
    const expectedClassname = 'custom-item-classname';
    render(
      <Accordion>
        <AccordionItem id={item.id}>
          <AccordionHeader>
            <h1>{item.title}</h1>
          </AccordionHeader>
          <AccordionContent className={expectedClassname}>{item.content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const accordionContent = screen.getByTestId(`${CONTENT_COMPONENT}-${item.id}`);
    expect(accordionContent.className).toContain(expectedClassname);
  });
});
