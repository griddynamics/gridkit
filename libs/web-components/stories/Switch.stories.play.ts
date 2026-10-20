import { expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { Mock } from 'storybook/test';
import type { GdSwitch } from '../src';
import { deepActiveElement, inShadow } from './form-story-play-helpers';

const getLocators = (canvasElement: HTMLElement) => {
  const host = () => canvasElement.querySelector<GdSwitch>('gd-switch')!;
  return {
    wrapper: () => inShadow(host(), '[part="wrapper"]'),
    checkbox: () => inShadow<HTMLInputElement>(host(), 'input[part="input"]')!,
    label: () => inShadow(host(), '[part="label"]'),
  };
};

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render wrapper, label, and unchecked checkbox', async () => {
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.label()).toBeInTheDocument();
    expect(locators.checkbox()).not.toBeChecked();
    expect(locators.checkbox()).not.toBeDisabled();
  });

  await step('Should call onValueChange with true and check the switch on click', async () => {
    (args['onValueChange'] as Mock | undefined)?.mockClear();
    await userEvent.click(locators.checkbox());
    expect(args['onValueChange']).toHaveBeenCalledWith(true);
    expect(locators.checkbox()).toBeChecked();
  });

  await step('Should call onValueChange with false and uncheck the switch on second click', async () => {
    (args['onValueChange'] as Mock | undefined)?.mockClear();
    await userEvent.click(locators.checkbox());
    expect(args['onValueChange']).toHaveBeenCalledWith(false);
    expect(locators.checkbox()).not.toBeChecked();
  });

  await step('Should focus and toggle checkbox via keyboard navigation (Tab & Space)', async () => {
    await userEvent.click(document.body);

    // Tab navigation does not enter shadow roots in the test utilities, so focus the first tab stop directly.
    locators.checkbox().focus();
    expect(deepActiveElement()).toBe(locators.checkbox());

    await userEvent.keyboard('[Space]');
    expect(locators.checkbox()).toBeChecked();

    await userEvent.keyboard('[Space]');
    expect(locators.checkbox()).not.toBeChecked();
  });
};

export const checkedActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render initially checked', async () => {
    expect(locators.checkbox()).toBeChecked();
    expect(locators.checkbox()).not.toBeDisabled();
  });

  await step('Should call onValueChange with false when toggled off', async () => {
    (args['onValueChange'] as Mock | undefined)?.mockClear();
    await userEvent.click(locators.checkbox());
    expect(args['onValueChange']).toHaveBeenCalledWith(false);
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with a disabled and unchecked checkbox', async () => {
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.checkbox()).toBeDisabled();
    expect(locators.checkbox()).not.toBeChecked();
  });
};

export const controlledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with initial unchecked state', async () => {
    expect(locators.checkbox()).not.toBeChecked();
  });

  await step('Should apply checked state after controlled delay', async () => {
    await userEvent.click(locators.checkbox());
    await waitFor(
      () => {
        expect(locators.checkbox()).toBeChecked();
      },
      { timeout: 2000 }
    );
  });
};

export const uncontrolledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with initial unchecked state', async () => {
    expect(locators.checkbox()).not.toBeChecked();
  });

  await step('Should toggle to checked on click', async () => {
    await userEvent.click(locators.checkbox());
    expect(locators.checkbox()).toBeChecked();
  });

  await step('Should toggle back to unchecked on second click', async () => {
    await userEvent.click(locators.checkbox());
    expect(locators.checkbox()).not.toBeChecked();
  });
};

export const withLoadingActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with initial unchecked and enabled state', async () => {
    expect(locators.checkbox()).not.toBeChecked();
    expect(locators.checkbox()).not.toBeDisabled();
  });

  await step('Should disable the switch immediately while loading', async () => {
    await userEvent.click(locators.checkbox());
    await waitFor(() => expect(locators.checkbox()).toBeDisabled());
  });

  await step('Should complete loading and apply the checked state', async () => {
    await waitFor(
      () => {
        expect(locators.checkbox()).not.toBeDisabled();
      },
      { timeout: 4000 }
    );
    expect(locators.checkbox()).toBeChecked();
  });
};
