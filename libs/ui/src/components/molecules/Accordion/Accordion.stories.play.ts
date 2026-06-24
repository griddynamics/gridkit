import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { ACCORDION_ITEMS } from './constants';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  item: (id: string) => canvas.getByTestId(`AccordionItem-${id}`),
  header: (id: string) => canvas.getByTestId(`AccordionHeader-${id}`),
  content: (id: string) => canvas.queryByTestId(`AccordionContent-${id}`),
  openedItems: () => canvas.getByTestId('Opened-items'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyBaseHeaders(locators, step);

  await step('Verify initial collapsed state', async () => {
    for (const item of ACCORDION_ITEMS) {
      await expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  await step('Should expand and collapse item on click', async () => {
    for (const item of ACCORDION_ITEMS) {
      await userEvent.click(locators.header(item.id));
      await waitFor(() => {
        expect(locators.content(item.id)).toBeVisible();
        expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'true');
      });

      await userEvent.click(locators.header(item.id));
      await waitFor(() => expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'false'));
    }
  });

  await step('Should close previously opened item when opening a new one', async () => {
    const [item1, item2] = ACCORDION_ITEMS;

    await userEvent.click(locators.header(item1.id));
    await waitFor(() => expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'true'));

    await userEvent.click(locators.header(item2.id));
    await waitFor(() => {
      expect(locators.header(item2.id)).toHaveAttribute('aria-expanded', 'true');
      expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'false');
    });
  });

  await step('Should have correct ARIA links between header and content', async () => {
    const item = ACCORDION_ITEMS[0];
    await userEvent.click(locators.header(item.id));

    await waitFor(() => {
      const header = locators.header(item.id);
      const content = locators.content(item.id);
      expect(content).not.toBeNull();
      expect(header).toHaveAttribute('aria-controls', content!.getAttribute('id'));
      expect(content).toHaveAttribute('role', 'region');
      expect(content).toHaveAttribute('aria-labelledby', header.getAttribute('id'));
    });

    await userEvent.click(locators.header(item.id));
  });

  await step('Should allow keyboard navigation with Tab and Enter', async () => {
    await userEvent.click(document.body);
    for (const item of ACCORDION_ITEMS) {
      await userEvent.tab();
      await expect(locators.header(item.id)).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'true'));
    }
  });
};

export const allowMultipleExpandWithIconActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyBaseHeaders(locators, step);

  await step('Should keep multiple items expanded simultaneously', async () => {
    for (const item of ACCORDION_ITEMS) {
      await userEvent.click(locators.header(item.id));
      await waitFor(() => expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'true'));
    }

    await waitFor(() => {
      for (const item of ACCORDION_ITEMS) {
        expect(locators.content(item.id)).toBeVisible();
      }
    });

    for (const item of ACCORDION_ITEMS) {
      await userEvent.click(locators.header(item.id));
      await waitFor(() => expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'false'));
    }
  });
};

export const defaultExpandedActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const [item1, item2, item3] = ACCORDION_ITEMS;

  await shouldVerifyBaseHeaders(locators, step);

  await step('Should have default expanded items', async () => {
    await expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'true');
    await expect(locators.header(item2.id)).toHaveAttribute('aria-expanded', 'true');
    await expect(locators.header(item3.id)).toHaveAttribute('aria-expanded', 'false');
  });

  await step('Should still allow toggling items interactively', async () => {
    await userEvent.click(locators.header(item1.id));
    await waitFor(() => expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'false'));

    await userEvent.click(locators.header(item3.id));
    await waitFor(() => expect(locators.header(item3.id)).toHaveAttribute('aria-expanded', 'true'));
  });
};

export const asInlineActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const item1 = ACCORDION_ITEMS[0];

  await step('Verify initial state', async () => {
    await expect(locators.header(item1.id)).toHaveTextContent('Title 1');
    await expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'false');
  });

  await step('Should expand and collapse item on click', async () => {
    await userEvent.click(locators.header(item1.id));
    await waitFor(() => expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'true'));

    await userEvent.click(locators.header(item1.id));
    await waitFor(() => expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'false'));
  });
};

export const withOnChangeActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const [item1, item2] = ACCORDION_ITEMS;

  await shouldVerifyBaseHeaders(locators, step);

  await step('Should call onChange and update UI when items are toggled', async () => {
    expect(locators.openedItems()).toHaveTextContent('Opened items: None');

    await userEvent.click(locators.header(item1.id));
    await waitFor(() => {
      expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'true');
      expect(locators.openedItems()).toHaveTextContent(`Opened items: ${item1.id}`);
    });

    await userEvent.click(locators.header(item2.id));
    await waitFor(() => {
      expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'false');
      expect(locators.header(item2.id)).toHaveAttribute('aria-expanded', 'true');
    });

    await userEvent.click(locators.header(item2.id));
    await waitFor(() => {
      expect(locators.header(item2.id)).toHaveAttribute('aria-expanded', 'false');
    });
  });
};

export const controlledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const [item1, item2, item3] = ACCORDION_ITEMS;

  await shouldVerifyBaseHeaders(locators, step);

  await step('Should correctly define default value', async () => {
    await expect(locators.header(item1.id)).toHaveAttribute('aria-expanded', 'true');
    await expect(locators.header(item2.id)).toHaveAttribute('aria-expanded', 'false');
    await expect(locators.header(item3.id)).toHaveAttribute('aria-expanded', 'false');
  });

  await step('Should correctly update UI when items are toggled', async () => {
    for (const item of [item2, item3]) {
      await userEvent.click(locators.header(item.id));
    }
    await waitFor(() => {
      for (const item of ACCORDION_ITEMS) {
        expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'true');
      }
      expect(locators.openedItems()).toHaveTextContent(`Opened items: ${item1.id}, ${item2.id}, ${item3.id}`);
    });
  });

  await step('Should close all items when all items are toggled', async () => {
    for (const item of ACCORDION_ITEMS) {
      await userEvent.click(locators.header(item.id));
    }
    await waitFor(() => {
      for (const item of ACCORDION_ITEMS) {
        expect(locators.header(item.id)).toHaveAttribute('aria-expanded', 'false');
      }
      expect(locators.openedItems()).toHaveTextContent('Opened items: None');
    });
  });
};

const shouldVerifyBaseHeaders = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should render all accordion headers correctly', async () => {
    for (const item of ACCORDION_ITEMS) {
      await expect(locators.item(item.id)).toBeVisible();
      await expect(locators.header(item.id)).toHaveTextContent(item.title);
    }
  });
};
