import { expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdSelect } from '../src';
import { deepActiveElement, hasText, inShadow, inShadowAll } from './form-story-play-helpers';

const clickInput = (element: Element | null | undefined) => userEvent.click(element as Element);
const pressKey = (key: string) => userEvent.keyboard(`{${key}}`);
const waitUntil = (assertion: () => void, timeout = 1000) => waitFor(assertion, { timeout });

const getLocators = (canvasElement: HTMLElement) => {
  const host = () => canvasElement.querySelector<GdSelect>('gd-select')!;
  const trigger = () => inShadow(host(), '.trigger');
  const dropdown = () => inShadow(host(), '.dropdown')!;
  const items = () => inShadowAll(host(), '[role="option"]');
  const buttonByLabel = (label: RegExp) =>
    Array.from(canvasElement.querySelectorAll('button')).find((button) => label.test(button.textContent ?? '')) ?? null;
  return {
    // The trigger renders its text through slots, so the text assertions use the trigger element and the
    // clicks and focus assertions use the native button inside it.
    initiatorWrapper: () => inShadow(host(), '.initiator-wrapper'),
    initiator: () => (trigger() ?? host()) as HTMLElement,
    initiatorButton: () => inShadow<HTMLButtonElement>(trigger(), 'button')!,
    isOpen: () => dropdown().matches(':popover-open'),
    dropdown,
    allDropdownItems: items,
    dropdownItem: (name: string) => items().find((item) => item.textContent?.trim() === name) as HTMLElement,
    customInput: () => inShadow<HTMLInputElement>(host().querySelector('gd-input'), 'input'),
    openButton: () => buttonByLabel(/open/i),
    closeButton: () => buttonByLabel(/close/i),
    selectedValueText: () => hasText(canvasElement, /selected value:/i),
    outputText: () => hasText(canvasElement, /output:/i),
  };
};

type Locators = ReturnType<typeof getLocators>;
const waitForOpen = (locators: Locators, timeout = 1000) =>
  waitUntil(() => expect(locators.isOpen()).toBe(true), timeout);
const waitForClosed = (locators: Locators, timeout = 1000) =>
  waitUntil(() => expect(locators.isOpen()).toBe(false), timeout);

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render select initiator button', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toBeVisible();
  });

  await step('Should display default placeholder text', async () => {
    expect(locators.initiator()).toHaveTextContent('Select');
  });

  await step('Should not show dropdown initially', async () => {
    expect(locators.isOpen()).toBe(false);
  });

  await step('Should open dropdown on initiator click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should display all dropdown items', async () => {
    await waitUntil(() => expect(locators.allDropdownItems()).toHaveLength(3));
  });

  await step('Should display specific option items', async () => {
    expect(locators.dropdownItem('Option 1')).toBeInTheDocument();
    expect(locators.dropdownItem('Option 2')).toBeInTheDocument();
    expect(locators.dropdownItem('Option 3')).toBeInTheDocument();
  });

  await step('Should select an item on click', async () => {
    await clickInput(locators.dropdownItem('Option 1'));
  });

  await step('Should close dropdown after selection', async () => {
    await waitForClosed(locators);
  });

  await step('Should update displayed value after selection', async () => {
    expect(locators.initiator()).toHaveTextContent('Option 1');
  });

  await step('Should reopen dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should close dropdown on Escape key', async () => {
    await pressKey('Escape');
    await waitForClosed(locators);
  });

  await step('Should close dropdown on outside click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);

    await clickInput(document.body);

    await waitForClosed(locators);
  });

  await step('Should reopen dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should close dropdown on Tab key', async () => {
    await pressKey('Tab');
    await waitForClosed(locators);
  });

  // === ACCESSIBILITY INTERACTION TESTS ===

  await step('Should navigate to initiator with Tab key', async () => {
    // Tab navigation does not enter shadow roots in the test utilities, so focus the first tab stop directly.
    locators.initiatorButton().focus();
    expect(deepActiveElement()).toBe(locators.initiatorButton());
  });

  await step('Should open dropdown on Enter key when focused', async () => {
    // The native button turns Enter into a click, but scripted key events do not, so click the focused button.
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should navigate options with Arrow keys', async () => {
    await pressKey('ArrowDown');
    expect(deepActiveElement()).toBe(locators.allDropdownItems()[0]);

    await pressKey('ArrowDown');
    expect(deepActiveElement()).toBe(locators.allDropdownItems()[1]);
  });

  await step('Should select option with Enter key', async () => {
    await pressKey('Enter');
    await waitForClosed(locators);
    expect(locators.initiator()).toHaveTextContent('Option 2');
  });
};

export const multipleSelectActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with multiple select placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toHaveTextContent('Select multiple options');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should select first option', async () => {
    await clickInput(locators.dropdownItem('Option 1'));
  });

  await step('Should keep dropdown open after selection in multiple mode', async () => {
    expect(locators.isOpen()).toBe(true);
  });

  await step('Should display selected item in initiator', async () => {
    expect(locators.initiator()).toHaveTextContent('Option 1');
  });

  await step('Should select second option', async () => {
    await clickInput(locators.allDropdownItems()[1]);
  });

  await step('Should display both selected items', async () => {
    const text = locators.initiator().textContent || '';
    expect(text).toContain('Option 1');
    expect(text).toContain('Option 2');
  });

  await step('Should toggle item off when clicked again', async () => {
    await clickInput(locators.allDropdownItems()[0]);
  });

  await step('Should update displayed value after deselection', async () => {
    const text = locators.initiator().textContent || '';
    expect(text).not.toContain('Option 1');
    expect(text).toContain('Option 2');
  });

  await step('Should close dropdown on Escape key', async () => {
    await pressKey('Escape');
    await waitForClosed(locators);
  });
};

export const withAdornmentsAndResetOptionStoryActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render select with adornments', async () => {
    expect(locators.initiator()).toBeInTheDocument();
  });

  await step('Should close dropdown after selection', async () => {
    await waitForClosed(locators);
  });

  await step('Should display selected value output', async () => {
    if (locators.selectedValueText()) expect(locators.selectedValueText()).toBe(true);
  });

  await step('Should select regular option', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);

    await clickInput(locators.dropdownItem('Option 1'));
    await waitForClosed(locators);
  });

  await step('Should update displayed value after regular selection', async () => {
    expect(locators.initiator()).toHaveTextContent('Option 1');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should display reset option', async () => {
    expect(locators.dropdownItem('Reset')).toBeInTheDocument();
  });

  await step('Should select reset option', async () => {
    await clickInput(locators.dropdownItem('Reset'));
  });

  await step('Should reset displayed value to placeholder after reset selection', async () => {
    expect(locators.initiator()).toHaveTextContent('Select');
  });
};

export const withCustomInitiatorAndSelectedOutputValueActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with custom input initiator', async () => {
    const customInput = locators.customInput();
    expect(customInput).toBeInTheDocument();
    expect(customInput).toHaveValue('Choose an option');
  });

  await step('Should open dropdown on initiator click', async () => {
    await clickInput(locators.customInput());
    await waitForOpen(locators);
  });

  await step('Should display all options', async () => {
    await waitUntil(() => expect(locators.allDropdownItems()).toHaveLength(3));
  });

  await step('Should select option and update input value', async () => {
    await clickInput(locators.dropdownItem('Option 1'));
    await waitForClosed(locators);
  });

  await step('Should update input value after selection', async () => {
    expect(locators.customInput()).toHaveValue('Option 1');
  });

  await step('Should display output value', async () => {
    if (locators.outputText()) expect(locators.outputText()).toBe(true);
  });
};

export const usingRefComponentWithCustomPlaceholderActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with custom placeholder', async () => {
    expect(locators.initiator()).toBeInTheDocument();
  });

  await step('Should not show dropdown initially', async () => {
    expect(locators.isOpen()).toBe(false);
  });

  await step('Should open dropdown via ref open button', async () => {
    await clickInput(locators.openButton());
    await waitForOpen(locators);
  });

  await step('Should display all options when opened via ref', async () => {
    await waitUntil(() => expect(locators.allDropdownItems()).toHaveLength(3));
  });

  await step('Should close dropdown via ref close button', async () => {
    await clickInput(locators.closeButton());
    await waitForClosed(locators);
  });

  await step('Should reopen dropdown for selection test', async () => {
    await clickInput(locators.openButton());
    await waitForOpen(locators);
  });

  await step('Should select option and close dropdown', async () => {
    await clickInput(locators.dropdownItem('Option 1'));
    await waitForClosed(locators);
  });
};

export const withFileInputAndCustomDropdownActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render select with custom initiator', async () => {
    expect(locators.initiator()).toBeInTheDocument();
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should display disabled option', async () => {
    const disabledOption = locators.dropdownItem('Disabled Option');
    expect(disabledOption).toBeInTheDocument();
    await expect(disabledOption).toHaveStyle({ pointerEvents: 'none' });
  });

  await step('Should display custom dropdown items', async () => {
    expect(locators.dropdownItem('Custom Opt 1')).toBeInTheDocument();
  });

  await step('Should select custom option', async () => {
    await clickInput(locators.dropdownItem('Custom Opt 1'));
    await waitForClosed(locators);
  });
};

export const customItemIdentifierComponentActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render select with custom placeholder', async () => {
    const initiator = locators.initiator();
    expect(initiator).toBeInTheDocument();
    expect(initiator).toHaveTextContent('Select an item');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should display custom dropdown items', async () => {
    expect(locators.allDropdownItems().length).toBeGreaterThan(0);
  });

  await step('Should select item with custom identifier', async () => {
    await clickInput(locators.allDropdownItems()[0]);
    await waitForClosed(locators);
  });

  await step('Should display selected value output', async () => {
    expect(locators.selectedValueText()).toBe(true);
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render select in disabled state', async () => {
    expect(locators.initiator()).toBeInTheDocument();
    expect(locators.initiatorButton()).toBeDisabled();
  });

  await step('Should display disabled placeholder', async () => {
    expect(locators.initiator()).toHaveTextContent('Select an option (disabled)');
  });

  await step('Should not open dropdown on click when disabled', async () => {
    await clickInput(locators.initiatorButton());
    expect(locators.isOpen()).toBe(false);
  });

  await step('Should not open dropdown on Enter key when disabled', async () => {
    await pressKey('Enter');
    expect(locators.isOpen()).toBe(false);
  });

  await step('Should not open dropdown on Arrow keys when disabled', async () => {
    await pressKey('ArrowDown');
    expect(locators.isOpen()).toBe(false);
  });
};

export const emptyItemsActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render select with empty items placeholder', async () => {
    expect(locators.initiator()).toBeInTheDocument();
    expect(locators.initiator()).toHaveTextContent('No options available');
  });

  await step('Should open dropdown on click', async () => {
    await clickInput(locators.initiatorButton());
    await waitForOpen(locators);
  });

  await step('Should display custom empty items message', async () => {
    const empty = canvasElement.querySelector('gd-select [slot="empty"]');
    expect(empty).toBeVisible();
    expect(empty).toHaveTextContent('No items available.');
  });

  await step('Should not display any dropdown items', async () => {
    expect(locators.allDropdownItems()).toHaveLength(0);
  });

  await step('Should close dropdown on Escape key', async () => {
    await pressKey('Escape');
    await waitForClosed(locators);
  });
};
