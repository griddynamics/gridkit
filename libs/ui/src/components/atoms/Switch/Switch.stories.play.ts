import { within, expect, userEvent, fn, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  wrapper: () => canvas.getByTestId('Switch-wrapper'),
  checkbox: () => canvas.getByRole('checkbox'),
  label: () => canvas.getByTestId('Switch-label'),
  queryLabel: () => canvas.queryByTestId('Switch-label'),
});

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render wrapper, label, and unchecked checkbox', async () => {
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.label()).toBeInTheDocument();
    expect(locators.checkbox()).not.toBeChecked();
    expect(locators.checkbox()).not.toBeDisabled();
  });

  await step('Should call onValueChange with true and check the switch on click', async () => {
    (args['onValueChange'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.click(locators.checkbox());
    expect(args['onValueChange']).toHaveBeenCalledWith(true);
    expect(locators.checkbox()).toBeChecked();
  });

  await step('Should call onValueChange with false and uncheck the switch on second click', async () => {
    (args['onValueChange'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.click(locators.checkbox());
    expect(args['onValueChange']).toHaveBeenCalledWith(false);
    expect(locators.checkbox()).not.toBeChecked();
  });

  await step('Should focus and toggle checkbox via keyboard navigation (Tab & Space)', async () => {
    await userEvent.click(document.body);

    await userEvent.tab();
    expect(locators.checkbox()).toHaveFocus();

    await userEvent.keyboard('[Space]');
    expect(locators.checkbox()).toBeChecked();

    await userEvent.keyboard('[Space]');
    expect(locators.checkbox()).not.toBeChecked();
  });
};

export const checkedActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render initially checked', async () => {
    expect(locators.checkbox()).toBeChecked();
    expect(locators.checkbox()).not.toBeDisabled();
  });

  await step('Should call onValueChange with false when toggled off', async () => {
    (args['onValueChange'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.click(locators.checkbox());
    expect(args['onValueChange']).toHaveBeenCalledWith(false);
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with a disabled and unchecked checkbox', async () => {
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.checkbox()).toBeDisabled();
    expect(locators.checkbox()).not.toBeChecked();
  });
};

export const controlledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

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
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

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
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with initial unchecked and enabled state', async () => {
    expect(locators.checkbox()).not.toBeChecked();
    expect(locators.checkbox()).not.toBeDisabled();
  });

  await step('Should disable the switch immediately while loading', async () => {
    await userEvent.click(locators.checkbox());
    expect(locators.checkbox()).toBeDisabled();
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
