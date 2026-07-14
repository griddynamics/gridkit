import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { DROPDOWN_ITEMS_LIST } from './constants';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  dropdownWrapper: () => canvas.getByTestId('Dropdown'),
  items: () => canvas.getAllByTestId('DropdownItem'),
  checkboxes: () => canvas.getAllByRole('checkbox'),
  labels: () => canvas.getAllByTestId('Label'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldRenderBaseDropdown(locators, step);

  await step('Should render all dropdown items with correct text and attributes', async () => {
    const items = locators.items();
    await expect(items).toHaveLength(DROPDOWN_ITEMS_LIST.length);

    for (const [index, item] of items.entries()) {
      await expect(item).toBeVisible();
      await expect(item).toHaveTextContent(DROPDOWN_ITEMS_LIST[index].name);
      await expect(item).toHaveAttribute('tabindex', '0');
    }
  });

  await step('Should support keyboard navigation via Tab', async () => {
    await userEvent.click(document.body);

    for (const item of locators.items()) {
      await userEvent.tab();
      await expect(item).toHaveFocus();
    }
  });
};

export const withCheckboxItemsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render dropdown with checkbox items', async () => {
    await expect(locators.dropdownWrapper()).toBeVisible();

    const items = locators.items();
    const checkboxes = locators.checkboxes();

    await expect(items).toHaveLength(DROPDOWN_ITEMS_LIST.length);
    await expect(checkboxes).toHaveLength(DROPDOWN_ITEMS_LIST.length);

    for (const [index, checkbox] of checkboxes.entries()) {
      await expect(checkbox).toBeVisible();
      await expect(checkbox).not.toBeChecked();
      await expect(locators.labels()[index]).toHaveTextContent(DROPDOWN_ITEMS_LIST[index].name);
    }
  });

  await step('Should toggle checkbox state on click', async () => {
    for (const checkbox of locators.checkboxes()) {
      await userEvent.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());

      await userEvent.click(checkbox);
      await waitFor(() => expect(checkbox).not.toBeChecked());
    }
  });

  await step('Should support keyboard navigation and toggle via Space', async () => {
    await userEvent.click(document.body);

    const MAX_TAB_ATTEMPTS = 15;
    for (const checkbox of locators.checkboxes()) {
      let count = 0;
      while (document.activeElement !== checkbox && count++ < MAX_TAB_ATTEMPTS) {
        await userEvent.tab();
      }

      await expect(checkbox).toHaveFocus();

      await userEvent.keyboard(' ');
      await waitFor(() => expect(checkbox).toBeChecked());

      await userEvent.keyboard(' ');
      await waitFor(() => expect(checkbox).not.toBeChecked());
    }
  });
};

const shouldRenderBaseDropdown = async (locators: ReturnType<typeof getLocators>, step: StoryContext['step']) => {
  await step('Should render the dropdown wrapper', async () => {
    await expect(locators.dropdownWrapper()).toBeVisible();
  });
};
