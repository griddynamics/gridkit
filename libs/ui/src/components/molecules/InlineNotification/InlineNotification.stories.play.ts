import { within, expect } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  wrapper: () => canvas.getByTestId('InlineNotification'),
  component: () => canvas.getByTestId('InlineNotificationComponent'),
  icon: (type: string) => canvas.getByTestId(`Icon-${type}`),
});

export const infoInlineNotificationActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyA11y(step, locators.wrapper, 'status', 'polite');
  await shouldVerifyContent(step, locators.component, args['children']);

  await step('Should render the corresponding info icon', async () => {
    await expect(locators.icon('info')).toBeVisible();
  });
};

export const successInlineNotificationActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyA11y(step, locators.wrapper, 'status', 'polite');
  await shouldVerifyContent(step, locators.component, args['children']);

  await step('Should render the corresponding success icon', async () => {
    await expect(locators.icon('success')).toBeVisible();
  });
};

export const warningInlineNotificationActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyA11y(step, locators.wrapper, 'alert', 'assertive');
  await shouldVerifyContent(step, locators.component, args['children']);

  await step('Should render the corresponding warning icon', async () => {
    await expect(locators.icon('warning')).toBeVisible();
  });
};

export const errorInlineNotificationActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyA11y(step, locators.wrapper, 'alert', 'assertive');
  await shouldVerifyContent(step, locators.component, args['children']);

  await step('Should render the corresponding error icon', async () => {
    await expect(locators.icon('error')).toBeVisible();
  });
};

export const defaultInlineNotificationActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await shouldVerifyA11y(step, locators.wrapper, 'status', 'polite');
  await shouldVerifyContent(step, locators.component, args['children']);
};

export const withCustomContentActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);
  const expectedItems = [
    'Check your email for the instructions',
    'Update outdated information',
    'Contact your administrator',
  ];

  await shouldVerifyA11y(step, locators.wrapper, 'status', 'polite');

  await step('Should render custom title typography', async () => {
    const title = canvas.getByText('Actions Required!');
    await expect(title).toBeVisible();
    expect(title.tagName.toLowerCase()).toBe('span');
  });

  await step('Should render the unordered list with correct items and dot icons', async () => {
    await expect(canvas.getByTestId('List')).toBeVisible();

    const listItems = canvas.getAllByRole('listitem');
    await expect(listItems).toHaveLength(expectedItems.length);

    for (const [index, expectedText] of expectedItems.entries()) {
      const listItem = listItems[index];
      await expect(listItem).toBeVisible();
      await expect(listItem).toHaveTextContent(expectedText);
      await expect(within(listItem).getByTestId('Icon-dot')).toBeVisible();
    }
  });
};

const shouldVerifyA11y = async (step: StoryContext['step'], locator: () => HTMLElement, role: string, live: string) => {
  await step('Should render wrapper with correct accessibility attributes', async () => {
    await expect(locator()).toBeVisible();
    await expect(locator()).toHaveAttribute('role', role);
    await expect(locator()).toHaveAttribute('aria-live', live);
  });
};

const shouldVerifyContent = async (step: StoryContext['step'], locator: () => HTMLElement, expectedText: string) => {
  await step('Should display the correct text content', async () => {
    await expect(locator()).toBeVisible();
    await expect(locator()).toHaveTextContent(expectedText);
  });
};
