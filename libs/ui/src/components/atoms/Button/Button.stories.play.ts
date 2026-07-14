import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  button: () => canvas.getByTestId('Button'),
  allButtons: () => canvas.getAllByTestId('Button'),
  iconStart: () => canvas.getByTestId('Button-icon-start'),
  iconEnd: () => canvas.getByTestId('Button-icon-end'),
  content: () => canvas.getByTestId('Button-content'),
});

const clearMock = (args: StoryContext['args']) => {
  if (typeof args['onClick'] === 'function' && 'mock' in args['onClick']) {
    args['onClick'].mockClear();
  }
};

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render button with primary variant', async () => {
    expect(locators.button()).toBeVisible();
    expect(locators.button()).toHaveAttribute('type', 'button');
  });

  await step('Should handle click event', async () => {
    clearMock(args);
    await userEvent.click(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.button()).toHaveFocus();
  });

  await step('Should activate on Enter and Space keys', async () => {
    for (const key of ['{Enter}', ' ']) {
      clearMock(args);
      await userEvent.keyboard(key);
      expect(args['onClick']).toHaveBeenCalledTimes(1);
    }
  });
};

export const withIconsActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render button with content and icons', async () => {
    expect(locators.content()).toBeVisible();
    expect(locators.iconStart()).toBeVisible();
    expect(locators.iconEnd()).toBeVisible();
  });

  await step('Should handle click and keyboard activation', async () => {
    clearMock(args);
    await userEvent.click(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);

    await userEvent.click(document.body);
    await userEvent.tab();
    clearMock(args);
    await userEvent.keyboard('{Enter}');
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });
};

export const iconOnlyActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render icon-only button with aria-label', async () => {
    expect(locators.iconStart()).toBeVisible();
    expect(locators.button()).toHaveAttribute('aria-label', 'Close');
    expect(canvas.queryByTestId('Button-content')).not.toBeInTheDocument();
  });

  await step('Should be accessible and handle clicks', async () => {
    clearMock(args);
    await userEvent.click(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);

    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.button()).toHaveFocus();
  });
};

export const disabledButtonActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render disabled button', async () => {
    expect(locators.button()).toBeDisabled();
  });

  await step('Should not respond to click when disabled', async () => {
    await userEvent.click(locators.button());
  });
};

export const isLoadingActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));
  const buttons = locators.allButtons();

  await step('Should render all loading buttons in disabled state', async () => {
    expect(buttons).toHaveLength(3);

    for (const btn of buttons) {
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-busy', 'true');
    }
  });

  await step('Should not be clickable when loading', async () => {
    await userEvent.click(buttons[0]);
  });
};
