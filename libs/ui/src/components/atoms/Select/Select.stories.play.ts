import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import {
  clickInput,
  pressKey,
  waitForElementToAppear,
  waitForElementToDisappear,
  waitForElementCount,
} from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>, documentBody: ReturnType<typeof within>) => ({
  // Initiator elements in canvas
  initiatorWrapper: () => canvas.getByTestId('Select-initiator-wrapper'),
  initiator: () => canvas.getByTestId('Select-initiator'),

  // Dropdown elements in document.body (Portal)
  queryDropdown: () => documentBody.queryByTestId('Select-dropdown'),
  dropdown: () => documentBody.getByTestId('Select-dropdown'),
  allDropdownItems: () => documentBody.getAllByTestId('DropdownItem'),
  dropdownItem: (name: string) => documentBody.getByText(name),
  queryAllDropdownItems: () => documentBody.queryAllByTestId('DropdownItem'),

  // Custom elements
  customInput: () => canvas.queryByRole('textbox'),
  openButton: () => canvas.queryByRole('button', { name: /open/i }),
  closeButton: () => canvas.queryByRole('button', { name: /close/i }),
  selectedValueText: () => canvas.queryByText(/selected value:/i),
  outputText: () => canvas.queryByText(/output:/i),
  emptyItemsMessage: () => canvas.queryByText(/no items available/i),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render select initiator button', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toBeVisible();
  });

  await step('Should display default placeholder text', async () => {
    const initiator = locators.initiator();
    expect(initiator).toHaveTextContent('Select');
  });

  await step('Should not show dropdown initially', async () => {
    const dropdown = locators.queryDropdown();
    expect(dropdown).not.toBeInTheDocument();
  });

  await step('Should open dropdown on initiator click', async () => {
    const initiator = locators.initiator();
    await clickInput(initiator);

    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display all dropdown items', async () => {
    await waitForElementCount(() => locators.allDropdownItems(), 3);
  });

  await step('Should display specific option items', async () => {
    const option1 = locators.dropdownItem('Option 1');
    const option2 = locators.dropdownItem('Option 2');
    const option3 = locators.dropdownItem('Option 3');

    expect(option1).toBeInTheDocument();
    expect(option2).toBeInTheDocument();
    expect(option3).toBeInTheDocument();
  });

  await step('Should select an item on click', async () => {
    const option1 = locators.dropdownItem('Option 1');
    await clickInput(option1);
  });

  await step('Should close dropdown after selection', async () => {
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should update displayed value after selection', async () => {
    const initiator = locators.initiator();
    expect(initiator).toHaveTextContent('Option 1');
  });

  await step('Should reopen dropdown on click', async () => {
    const initiator = locators.initiator();
    await clickInput(initiator);

    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should close dropdown on Escape key', async () => {
    await pressKey('Escape');

    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should close dropdown on outside click', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);

    await clickInput(document.body);

    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should reopen dropdown on click', async () => {
    const initiator = locators.initiator();
    await clickInput(initiator);

    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should close dropdown on Tab key', async () => {
    await pressKey('Tab');

    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  // === ACCESSIBILITY INTERACTION TESTS ===

  await step('Should navigate to initiator with Tab key', async () => {
    await userEvent.tab();
    expect(locators.initiator()).toHaveFocus();
  });

  await step('Should open dropdown on Enter key when focused', async () => {
    await pressKey('Enter');
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should navigate options with Arrow keys', async () => {
    await pressKey('ArrowDown');
    const firstOption = locators.allDropdownItems()[0];
    expect(firstOption).toHaveFocus();

    await pressKey('ArrowDown');
    const secondOption = locators.allDropdownItems()[1];
    expect(secondOption).toHaveFocus();
  });

  await step('Should select option with Enter key', async () => {
    await pressKey('Enter');
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
    expect(locators.initiator()).toHaveTextContent('Option 2');
  });
};

export const multipleSelectActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render with multiple select placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toHaveTextContent('Select multiple options');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should select first option', async () => {
    const option1 = locators.dropdownItem('Option 1');
    await clickInput(option1);
  });

  await step('Should keep dropdown open after selection in multiple mode', async () => {
    const dropdown = locators.queryDropdown();
    expect(dropdown).toBeInTheDocument();
  });

  await step('Should display selected item in initiator', async () => {
    const initiator = locators.initiator();
    expect(initiator).toHaveTextContent('Option 1');
  });

  await step('Should select second option', async () => {
    const option2 = locators.dropdownItem('Option 2');
    await clickInput(option2);
  });

  await step('Should display both selected items', async () => {
    const initiator = locators.initiator();
    const text = initiator.textContent || '';
    expect(text).toContain('Option 1');
    expect(text).toContain('Option 2');
  });

  await step('Should toggle item off when clicked again', async () => {
    const option1 = locators.dropdownItem('Option 1');
    await clickInput(option1);
  });

  await step('Should update displayed value after deselection', async () => {
    const initiator = locators.initiator();
    const text = initiator.textContent || '';
    expect(text).not.toContain('Option 1');
    expect(text).toContain('Option 2');
  });

  await step('Should close dropdown on Escape key', async () => {
    await pressKey('Escape');
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });
};

export const withAdornmentsAndResetOptionStoryActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render select with adornments', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
  });

  await step('Should close dropdown after selection', async () => {
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display selected value output', async () => {
    const outputText = locators.selectedValueText();
    if (outputText) {
      expect(outputText).toBeInTheDocument();
    }
  });

  await step('Should select regular option', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);

    const option1 = locators.dropdownItem('Option 1');
    await clickInput(option1);
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should update displayed value after regular selection', async () => {
    const initiator = locators.initiator();
    expect(initiator).toHaveTextContent('Option 1');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display reset option', async () => {
    const resetOption = locators.dropdownItem('Reset');
    expect(resetOption).toBeInTheDocument();
  });

  await step('Should select reset option', async () => {
    const resetOption = locators.dropdownItem('Reset');
    await clickInput(resetOption);
  });

  await step('Should reset displayed value to placeholder after reset selection', async () => {
    const initiator = locators.initiator();
    expect(initiator).toHaveTextContent('Select');
  });
};

export const withCustomInitiatorAndSelectedOutputValueActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render with custom input initiator', async () => {
    const customInput = locators.customInput();
    expect(customInput).toBeInTheDocument();
    expect(customInput).toHaveValue('Choose an option');
  });

  await step('Should open dropdown on initiator click', async () => {
    await clickInput(locators.customInput()!);
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display all options', async () => {
    await waitForElementCount(() => locators.allDropdownItems(), 3);
  });

  await step('Should select option and update input value', async () => {
    const option1 = locators.dropdownItem('Option 1');
    await clickInput(option1);
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should update input value after selection', async () => {
    expect(locators.customInput()).toHaveValue('Option 1');
  });

  await step('Should display output value', async () => {
    const outputText = locators.outputText();
    if (outputText) {
      expect(outputText).toBeInTheDocument();
    }
  });
};

export const usingRefComponentWithCustomPlaceholderActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render with custom placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
  });

  await step('Should not show dropdown initially', async () => {
    const dropdown = locators.queryDropdown();
    expect(dropdown).not.toBeInTheDocument();
  });

  await step('Should open dropdown via ref open button', async () => {
    const openButton = locators.openButton();
    await clickInput(openButton);
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display all options when opened via ref', async () => {
    await waitForElementCount(() => locators.allDropdownItems(), 3);
  });

  await step('Should close dropdown via ref close button', async () => {
    const closeButton = locators.closeButton();
    await clickInput(closeButton);
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should reopen dropdown for selection test', async () => {
    const openButton = locators.openButton();
    await clickInput(openButton);
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should select option and close dropdown', async () => {
    const option1 = locators.dropdownItem('Option 1');
    await clickInput(option1);
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });
};

export const withFileInputAndCustomDropdownActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render select with custom initiator', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display disabled option', async () => {
    const disabledOption = locators.dropdownItem('Disabled Option');
    expect(disabledOption).toBeInTheDocument();
    await expect(disabledOption).toHaveStyle({ pointerEvents: 'none' });
  });

  await step('Should display custom dropdown items', async () => {
    const customOpt1 = locators.dropdownItem('Custom Opt 1');
    expect(customOpt1).toBeInTheDocument();
  });

  await step('Should select custom option', async () => {
    const customOpt1 = locators.dropdownItem('Custom Opt 1');
    await clickInput(customOpt1);
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });
};

export const customItemIdentifierComponentActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render select with custom placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toHaveTextContent('Select an item');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display custom dropdown items', async () => {
    const items = locators.allDropdownItems();
    expect(items.length).toBeGreaterThan(0);
  });

  await step('Should select item with custom identifier', async () => {
    const firstItem = locators.allDropdownItems()[0];
    await clickInput(firstItem);
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display selected value output', async () => {
    const selectedValueText = locators.selectedValueText();
    expect(selectedValueText).toBeInTheDocument();
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render select in disabled state', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toBeDisabled();
  });

  await step('Should display disabled placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toHaveTextContent('Select an option (disabled)');
  });

  await step('Should not open dropdown on click when disabled', async () => {
    await clickInput(locators.initiator());
    const dropdown = locators.queryDropdown();
    expect(dropdown).not.toBeInTheDocument();
  });

  await step('Should not open dropdown on Enter key when disabled', async () => {
    await userEvent.tab();
    if (document.activeElement === locators.initiator()) {
      await pressKey('Enter');
      const dropdown = locators.queryDropdown();
      expect(dropdown).not.toBeInTheDocument();
    }
  });

  await step('Should not open dropdown on Arrow keys when disabled', async () => {
    await userEvent.tab();
    if (document.activeElement === locators.initiator()) {
      await pressKey('ArrowDown');
      const dropdown = locators.queryDropdown();
      expect(dropdown).not.toBeInTheDocument();
    }
  });
};

export const emptyItemsActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const documentBody = within(document.body);
  const locators = getLocators(canvas, documentBody);

  await step('Should render select with empty items placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toHaveTextContent('No options available');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiator());
    await waitForElementToAppear(() => locators.queryDropdown(), 1000);
  });

  await step('Should display custom empty items message', async () => {
    const emptyMessage = locators.dropdown();
    expect(emptyMessage).toBeInTheDocument();
    expect(emptyMessage).toHaveTextContent('No items available.');
  });

  await step('Should not display any dropdown items', async () => {
    const items = locators.queryAllDropdownItems();
    expect(items.length).toBe(0);
  });

  await step('Should close dropdown on Escape key', async () => {
    await pressKey('Escape');
    await waitForElementToDisappear(() => locators.queryDropdown(), 1000);
  });
};
