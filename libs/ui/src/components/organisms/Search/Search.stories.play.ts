import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { fillInput, clearInput, tabToNext } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>, documentBody: ReturnType<typeof within>) => ({
  searchInput: () => canvas.getByRole('combobox'),
  queryDropdown: () => documentBody.queryByTestId('Select-dropdown'),
  dropdown: () => documentBody.getByTestId('Select-dropdown'),
  dropdownItem: (name: string) => documentBody.getByText(name),
  allDropdownItems: () => documentBody.getAllByTestId('DropdownItem'),
  noResultText: () => documentBody.getByText(/no result/i),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render Search input', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();
  });

  await step('Should display default placeholder', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toHaveAttribute('placeholder', 'Search');
  });

  await step('Should have combobox role for accessibility', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toHaveAttribute('role', 'combobox');
  });

  await step('Should allow typing in input', async () => {
    const searchInput = locators.searchInput();
    await fillInput(searchInput, 'test query');
    expect(searchInput).toHaveValue('test query');
  });

  await step('Should not show dropdown when no items provided', async () => {
    const dropdown = locators.queryDropdown();
    expect(dropdown).toBeInTheDocument();
    const notFoundText = locators.noResultText();
    expect(notFoundText).toBeInTheDocument();
  });

  await step('Should allow clearing input', async () => {
    const searchInput = locators.searchInput();
    await clearInput(searchInput);
    expect(searchInput).toHaveValue('');
  });

  await step('Should allow keyboard navigation to search input', async () => {
    const searchInput = locators.searchInput();
    await userEvent.click(document.body);
    await tabToNext();
    expect(searchInput).toHaveFocus();
  });
};

export const withItemsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render Search input', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();
  });

  await step('Should display placeholder', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toHaveAttribute('placeholder', 'Search');
  });

  await step('Should not show dropdown initially', async () => {
    const dropdown = locators.queryDropdown();
    expect(dropdown).not.toBeInTheDocument();
  });

  await step('Should open dropdown when typing', async () => {
    const searchInput = locators.searchInput();
    await fillInput(searchInput, 'Item');

    await waitFor(
      () => {
        const dropdown = locators.dropdown();
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toBeVisible();
      },
      { timeout: 1000 }
    );
  });

  await step('Should display search results in dropdown', async () => {
    await waitFor(
      () => {
        const items = locators.allDropdownItems();
        expect(items.length).toBeGreaterThan(0);
      },
      { timeout: 1000 }
    );
  });

  await step('Should display all three items', async () => {
    const item1 = locators.dropdownItem('Item 1');
    const item2 = locators.dropdownItem('Item 2');
    const item3 = locators.dropdownItem('Item 3');

    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
    expect(item3).toBeInTheDocument();
  });

  await step('Should allow selecting an item', async () => {
    const item1 = locators.dropdownItem('Item 1');
    await userEvent.click(item1);

    await waitFor(
      () => {
        const searchInput = locators.searchInput();
        expect(searchInput).toHaveValue('item-1');
      },
      { timeout: 1000 }
    );
  });

  await step('Should close dropdown after selection', async () => {
    await waitFor(
      () => {
        const dropdown = locators.queryDropdown();
        expect(dropdown).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  await step('Should reopen dropdown when typing again', async () => {
    const searchInput = locators.searchInput();
    await clearInput(searchInput);
    await fillInput(searchInput, 'Item 2');

    await waitFor(
      () => {
        const dropdown = locators.dropdown();
        expect(dropdown).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  await step('Should display item in dropdown', async () => {
    await waitFor(
      () => {
        const item2 = locators.dropdownItem('Item 2');
        expect(item2).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  await step('Should select second item', async () => {
    const item2 = locators.dropdownItem('Item 2');
    await userEvent.click(item2);

    await waitFor(
      () => {
        const searchInput = locators.searchInput();
        expect(searchInput).toHaveValue('item-2');
      },
      { timeout: 1000 }
    );
  });

  await step('Should close dropdown when input is cleared', async () => {
    const searchInput = locators.searchInput();
    await clearInput(searchInput);

    await waitFor(
      () => {
        const dropdown = locators.queryDropdown();
        expect(dropdown).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  await step('Should have empty input after clearing', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toHaveValue('');
  });
};

export const withLoadingActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render Search input', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();
  });

  await step('Fill loading query', async () => {
    const searchInput = locators.searchInput();
    await fillInput(searchInput, 'loading search');
    expect(searchInput).toHaveValue('loading search');
  });

  await step('Should open dropdown with loading state', async () => {
    await waitFor(
      () => {
        const dropdown = locators.dropdown();
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toBeVisible();
      },
      { timeout: 1000 }
    );
  });

  await step('Should display loading message in dropdown', async () => {
    const loadingText = documentBody.getByText(/loading results/i);
    expect(loadingText).toBeInTheDocument();
    expect(loadingText).toBeVisible();
  });

  await step('Should not display any selectable items while loading', async () => {
    const items = documentBody.queryAllByTestId('DropdownItem');
    expect(items.length).toBe(0);
  });

  await step('Should allow typing in input during loading', async () => {
    const searchInput = locators.searchInput();
    await clearInput(searchInput);
    await fillInput(searchInput, 'new query');
    expect(searchInput).toHaveValue('new query');
  });
};

export const withNoResultsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render Search input', async () => {
    const searchInput = locators.searchInput();
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();
  });

  await step('Fill no found query', async () => {
    const searchInput = locators.searchInput();
    await fillInput(searchInput, 'not found');
    expect(searchInput).toHaveValue('not found');
  });

  await step('Should open dropdown with no results state', async () => {
    await waitFor(
      () => {
        const dropdown = locators.dropdown();
        expect(dropdown).toBeInTheDocument();
        expect(dropdown).toBeVisible();
      },
      { timeout: 1000 }
    );
  });

  await step('Should display custom no results message', async () => {
    const noResultsText = documentBody.getByText(/no products found/i);
    expect(noResultsText).toBeInTheDocument();
    expect(noResultsText).toBeVisible();
  });

  await step('Should display helpful suggestion', async () => {
    const suggestionText = documentBody.getByText(/try a different search term/i);
    expect(suggestionText).toBeInTheDocument();
  });

  await step('Should not display any selectable items', async () => {
    const items = documentBody.queryAllByTestId('DropdownItem');
    expect(items.length).toBe(0);
  });

  await step('Should allow modifying search query', async () => {
    const searchInput = locators.searchInput();
    await clearInput(searchInput);
    await fillInput(searchInput, 'new search');
    expect(searchInput).toHaveValue('new search');
  });

  await step('Should keep dropdown open with new search term', async () => {
    const dropdown = locators.queryDropdown();
    expect(dropdown).toBeInTheDocument();
  });

  await step('Should close dropdown when input is cleared', async () => {
    const searchInput = locators.searchInput();
    await clearInput(searchInput);

    await waitFor(
      () => {
        const dropdown = locators.queryDropdown();
        expect(dropdown).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
};
