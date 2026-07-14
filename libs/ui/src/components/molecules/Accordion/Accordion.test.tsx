import { describe, it, expect, vi, expectTypeOf } from 'vitest';
import { fireEvent, render, screen } from '@testUtils';
import { take } from '@utils';

import { Accordion } from './Accordion';
import { AccordionItem } from './AccordionItem';
import { AccordionHeader } from './AccordionHeader';
import { AccordionContent } from './AccordionContent';
import {
  COMPONENT_NAME,
  CONTENT_COMPONENT,
  CONTEXT_ERROR_MESSAGE,
  HEADER_COMPONENT,
  ITEM_COMPONENT,
} from './constants';
import { useAccordion } from './hooks';
import { AccordionContextType } from './Accordion.types';

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

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(
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
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render Accordion Header', () => {
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
      const accordionHeader = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
      expect(document.body.contains(accordionHeader)).toBe(true);
    });
  });
  it('SHOULD render Accordion Content', () => {
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
      expect(document.body.contains(accordionContent)).toBe(true);
    });
  });

  it('SHOULD set aria-expanded correctly when defaultValue is passed', () => {
    const defaultValue = accordionItems[1];
    render(
      <Accordion defaultValue={[defaultValue.id]}>
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
      const accordionHeader = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
      const isItemDefaultOpened = defaultValue.id === item.id;
      expect(accordionHeader.getAttribute('aria-expanded') === 'true').toBe(isItemDefaultOpened);
    });
  });

  it('SHOULD throw an error if useAccordion Hook is used outside Accordion component', () => {
    const TestComponent = () => {
      useAccordion();
      return <div>Test component</div>;
    };
    expect(() => render(<TestComponent />)).toThrowError(CONTEXT_ERROR_MESSAGE);
  });

  it('SHOULD provide context openedItems value', () => {
    let accordionContext;
    const HeaderComponent = ({ title }: { title: string }) => {
      accordionContext = useAccordion() as AccordionContextType;
      return <h1>{title}</h1>;
    };

    const accordionItem = accordionItems[0];
    render(
      <Accordion>
        <AccordionItem id={accordionItem.id}>
          <AccordionHeader>
            <HeaderComponent title={accordionItem.title} />
          </AccordionHeader>
          <AccordionContent>{accordionItem.content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const typedContext: AccordionContextType = accordionContext;
    expect(typedContext.openedItems).toStrictEqual([]);
  });

  it('SHOULD provide context toggleItem function', () => {
    let accordionContext;
    const HeaderComponent = ({ title }: { title: string }) => {
      accordionContext = useAccordion() as AccordionContextType;
      return <h1>{title}</h1>;
    };

    const accordionItem = accordionItems[0];
    render(
      <Accordion>
        <AccordionItem id={accordionItem.id}>
          <AccordionHeader>
            <HeaderComponent title={accordionItem.title} />
          </AccordionHeader>
          <AccordionContent>{accordionItem.content}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const typedContext: AccordionContextType = accordionContext;
    expectTypeOf(typedContext.toggleItem).toBeFunction();
  });

  it('SHOULD call onChange when toggle item in controlled Accordion', () => {
    const onChange = vi.fn();
    render(
      <Accordion onChange={onChange} value={[]}>
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
      const header = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
      fireEvent.click(header);
      expect(onChange).toHaveBeenCalledWith([item.id]);
    });
  });

  it('SHOULD handle item close', () => {
    render(
      <Accordion allowMultipleExpand>
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

    const header1 = screen.getByTestId(`${HEADER_COMPONENT}-${accordionItems[0].id}`);
    const header2 = screen.getByTestId(`${HEADER_COMPONENT}-${accordionItems[1].id}`);

    const parseOpenedItems = () => {
      return accordionItems.filter((item) => {
        const accordionHeader = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
        const accordionItem = screen.getByTestId(`${ITEM_COMPONENT}-${item.id}`);

        const isHeaderOpened = accordionHeader.getAttribute('aria-expanded') === 'true';
        const isContentOpened = accordionItem.getAttribute('data-open') === 'true';
        return isHeaderOpened && isContentOpened;
      });
    };

    fireEvent.click(header1);
    fireEvent.click(header2);
    fireEvent.click(header2);
    expect(parseOpenedItems()).toEqual(take(accordionItems, 1));
  });

  it('SHOULD handle multiple open items', () => {
    render(
      <Accordion allowMultipleExpand>
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

    const header1 = screen.getByTestId(`${HEADER_COMPONENT}-${accordionItems[0].id}`);
    const header2 = screen.getByTestId(`${HEADER_COMPONENT}-${accordionItems[1].id}`);
    const header3 = screen.getByTestId(`${HEADER_COMPONENT}-${accordionItems[2].id}`);

    const parseOpenedItems = () => {
      return accordionItems.filter((item) => {
        const accordionHeader = screen.getByTestId(`${HEADER_COMPONENT}-${item.id}`);
        const accordionItem = screen.getByTestId(`${ITEM_COMPONENT}-${item.id}`);

        const isHeaderOpened = accordionHeader.getAttribute('aria-expanded') === 'true';
        const isContentOpened = accordionItem.getAttribute('data-open') === 'true';
        return isHeaderOpened && isContentOpened;
      });
    };

    fireEvent.click(header1);
    fireEvent.click(header2);
    fireEvent.click(header3);
    expect(parseOpenedItems()).toEqual(accordionItems);
  });
});
