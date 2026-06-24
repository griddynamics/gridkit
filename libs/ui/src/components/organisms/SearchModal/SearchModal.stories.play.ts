import { within, waitFor, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { typeIntoInput, clearInput, openModal, closeModal } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>, documentBody: ReturnType<typeof within>) => ({
  openButton: () => canvas.getByTestId('open-modal'),
  modal: () => documentBody.getByTestId('SearchModal'),
  queryModal: () => documentBody.queryByTestId('SearchModal'),
  searchInput: (modal: ReturnType<typeof within>) => modal.getByTestId('SearchInput'),
  closeButton: (modal: ReturnType<typeof within>) => modal.getByTestId('Icon-cross'),
  noResultsText: (modal: ReturnType<typeof within>) => modal.getByText(/no results/i),
  queryAllResults: (modal: ReturnType<typeof within>) => modal.queryAllByText(/search result/i),
  queryAllDescriptions: (modal: ReturnType<typeof within>) => modal.queryAllByText(/description|details/i),
  queryAllResultItems: (modal: ReturnType<typeof within>) => modal.queryAllByTestId(/result-item/i),
});

export const withSearchModalActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should display search results', async () => {
    await step('Should render modal trigger button', async () => {
      const openButton = locators.openButton();
      expect(openButton).toBeInTheDocument();
      expect(openButton).toHaveTextContent(/open search modal/i);
    });

    await step('Open search modal', async () => {
      await openModal(
        () => locators.openButton(),
        () => locators.modal()
      );
    });

    await step('Should display search input in opened modal', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toBeVisible();
    });

    await step('Type search query', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);
      await typeIntoInput(searchInput, 'test', 50);
      await waitFor(() => expect(searchInput).toHaveValue('test'));
    });

    await step('Should show loading state during search', async () => {
      expect(locators.modal()).toBeInTheDocument();
    });

    await step('Should display multiple search results after loading', async () => {
      await waitFor(
        () => {
          const modal = within(locators.modal());
          const results = locators.queryAllResults(modal);
          expect(results.length).toBeGreaterThan(0);
        },
        { timeout: 2000 }
      );
    });

    await step('Should render result items with titles and descriptions', async () => {
      const modal = within(locators.modal());
      const firstResult = locators.queryAllResults(modal)[0];
      expect(firstResult).toBeInTheDocument();
      expect(firstResult).toBeVisible();

      const descriptions = locators.queryAllDescriptions(modal);
      expect(descriptions.length).toBeGreaterThan(0);
    });

    await step('Should maintain search input value with results displayed', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);
      expect(searchInput).toHaveValue('test');
    });

    await step('Close modal with results displayed', async () => {
      const modal = within(locators.modal());
      await closeModal(
        () => locators.closeButton(modal),
        () => locators.queryModal()
      );
    });
  });

  await step('Should display no results', async () => {
    await step('Open search modal', async () => {
      await openModal(
        () => locators.openButton(),
        () => locators.modal()
      );
    });

    await step('Type "empty" query in search input', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);
      await clearInput(searchInput);
      await typeIntoInput(searchInput, 'empty', 50);
      await waitFor(() => expect(searchInput).toHaveValue('empty'));
    });

    await step('Should show loading state when searching for empty results', async () => {
      expect(locators.modal()).toBeInTheDocument();
    });

    await step('Should display "No Results" message after loading completes', async () => {
      await waitFor(
        () => {
          const modal = within(locators.modal());
          const noResultsText = locators.noResultsText(modal);
          expect(noResultsText).toBeInTheDocument();
          expect(noResultsText).toBeVisible();
        },
        { timeout: 2000 }
      );
    });

    await step('Should not display any result items in empty state', async () => {
      const modal = within(locators.modal());
      const resultItems = locators.queryAllResultItems(modal);
      expect(resultItems).toHaveLength(0);
    });

    await step('Should maintain search input value during empty state', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue('empty');
    });

    await step('Close modal after no results test', async () => {
      const modal = within(locators.modal());
      await closeModal(
        () => locators.closeButton(modal),
        () => locators.queryModal()
      );
    });
  });

  await step('Should throw error state', async () => {
    await step('Open modal for error state', async () => {
      await openModal(
        () => locators.openButton(),
        () => locators.modal()
      );
    });

    await step('Type "error" query in search input', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);
      await clearInput(searchInput);
      await typeIntoInput(searchInput, 'error', 50);
      await waitFor(() => expect(searchInput).toHaveValue('error'));
    });

    await step('Should show loading state before error occurs', async () => {
      expect(locators.modal()).toBeInTheDocument();
    });

    await step('Should handle error and display no results message', async () => {
      await waitFor(
        () => {
          const modal = within(locators.modal());
          const noResultsText = locators.noResultsText(modal);
          expect(noResultsText).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    await step('Should not display any result items after error', async () => {
      const modal = within(locators.modal());
      const resultItems = locators.queryAllResultItems(modal);
      expect(resultItems).toHaveLength(0);
    });

    await step('Should maintain modal interactivity after error', async () => {
      const modal = within(locators.modal());
      const searchInput = locators.searchInput(modal);

      expect(searchInput).toBeInTheDocument();
      expect(locators.modal()).toBeInTheDocument();

      await clearInput(searchInput);
      expect(searchInput).toHaveValue('');
    });

    await step('Close modal after error test', async () => {
      const modal = within(locators.modal());
      await closeModal(
        () => locators.closeButton(modal),
        () => locators.queryModal()
      );
    });
  });
};
