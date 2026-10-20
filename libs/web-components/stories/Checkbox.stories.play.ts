import { expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { Mock } from 'storybook/test';
import type { GdCheckbox } from '../src';
import { hasText, inShadow } from './form-story-play-helpers';

const getLocators = (canvasElement: HTMLElement) => {
  const hosts = () => Array.from(canvasElement.querySelectorAll<GdCheckbox>('gd-checkbox'));
  const host = () => hosts()[0];
  return {
    checkbox: () => inShadow<HTMLInputElement>(host(), 'input[part="input"]')!,
    checkboxWrapper: () => inShadow(host(), '[part="label"]')!,
    checkboxLabel: () => host(),
    checkboxIndicator: () => inShadow(host(), '[part="indicator"]'),
    allCheckboxes: () => hosts().map((item) => inShadow<HTMLInputElement>(item, 'input[part="input"]')!),
    allCheckboxWrappers: () => hosts().map((item) => inShadow(item, '[part="label"]')!),
    allCheckboxLabels: () => hosts(),
  };
};

export const defaultActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the checkbox wrapper, input, indicator, and label', async () => {
    expect(locators.checkboxWrapper()).toBeInTheDocument();
    expect(locators.checkbox()).toBeInTheDocument();
    expect(locators.checkboxIndicator()).toBeInTheDocument();
    expect(locators.checkboxLabel()).toHaveTextContent('Accept terms');
  });

  await step('Should render unchecked initially', async () => {
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'false');
  });

  await step('Should check the checkbox on click and call onValueChange with true', async () => {
    await userEvent.click(locators.checkboxWrapper());
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'true');
    expect(args['onValueChange']).toHaveBeenCalledWith(true);
  });

  await step('Should uncheck the checkbox on click and call onValueChange with false', async () => {
    (args['onValueChange'] as Mock).mockClear();
    await userEvent.click(locators.checkboxWrapper());
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'false');
    expect(args['onValueChange']).toHaveBeenCalledWith(false);
  });

  await step('Should toggle the checkbox via Space key when focused', async () => {
    await userEvent.click(document.body);
    // Tab navigation does not enter shadow roots in the test utilities, so focus the first tab stop directly.
    locators.checkbox().focus();
    await userEvent.keyboard('[Space]');
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'true');
  });
};

export const controlledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the controlled checkbox and status text', async () => {
    expect(locators.checkboxWrapper()).toBeInTheDocument();
    expect(locators.checkboxLabel()).toHaveTextContent('Controlled Checkbox');
    expect(hasText(canvasElement, 'Current state: Unchecked')).toBe(true);
  });

  await step('Should display unchecked state initially', async () => {
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'false');
  });

  await step('Should update to checked state and reflect in status text on click', async () => {
    await userEvent.click(locators.checkboxWrapper());
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'true');
    expect(hasText(canvasElement, 'Current state: Checked')).toBe(true);
  });

  await step('Should update back to unchecked state and reflect in status text on click', async () => {
    await userEvent.click(locators.checkboxWrapper());
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'false');
    expect(hasText(canvasElement, 'Current state: Unchecked')).toBe(true);
  });
};

export const indeterminateActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render the checkbox with label', async () => {
    expect(locators.checkboxWrapper()).toBeInTheDocument();
    expect(locators.checkboxLabel()).toHaveTextContent('Select all');
  });

  await step('Should have aria-checked="mixed" for indeterminate state', async () => {
    expect(locators.checkbox()).toHaveAttribute('aria-checked', 'mixed');
  });

  await step('Should render the indicator in indeterminate state', async () => {
    expect(locators.checkboxIndicator()).toBeInTheDocument();
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render all 3 disabled checkboxes', async () => {
    expect(locators.allCheckboxes()).toHaveLength(3);
    expect(locators.allCheckboxes()[0]).toBeDisabled();
    expect(locators.allCheckboxes()[1]).toBeDisabled();
    expect(locators.allCheckboxes()[2]).toBeDisabled();
  });

  await step('Should display correct aria-checked for each disabled state', async () => {
    expect(locators.allCheckboxes()[0]).toHaveAttribute('aria-checked', 'false');
    expect(locators.allCheckboxes()[1]).toHaveAttribute('aria-checked', 'true');
    expect(locators.allCheckboxes()[2]).toHaveAttribute('aria-checked', 'mixed');
  });

  await step('Should not change unchecked state when clicking a disabled checkbox', async () => {
    await userEvent.click(locators.allCheckboxWrappers()[0]);
    expect(locators.allCheckboxes()[0]).toHaveAttribute('aria-checked', 'false');
  });

  await step('Should not change checked state when clicking a disabled checkbox', async () => {
    await userEvent.click(locators.allCheckboxWrappers()[1]);
    expect(locators.allCheckboxes()[1]).toHaveAttribute('aria-checked', 'true');
  });
};

export const sizesActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render both size variant checkboxes', async () => {
    expect(locators.allCheckboxes()).toHaveLength(2);
    expect(locators.allCheckboxWrappers()).toHaveLength(2);
  });

  await step('Should render correct labels for each size', async () => {
    expect(locators.allCheckboxLabels()[0]).toHaveTextContent('Small checkbox');
    expect(locators.allCheckboxLabels()[1]).toHaveTextContent('Medium checkbox');
  });

  await step('Should toggle the small checkbox on click', async () => {
    await userEvent.click(locators.allCheckboxWrappers()[0]);
    expect(locators.allCheckboxes()[0]).toHaveAttribute('aria-checked', 'true');
    expect(locators.allCheckboxes()[1]).toHaveAttribute('aria-checked', 'false');
  });

  await step('Should toggle the medium checkbox on click', async () => {
    await userEvent.click(locators.allCheckboxWrappers()[1]);
    expect(locators.allCheckboxes()[1]).toHaveAttribute('aria-checked', 'true');
  });
};
