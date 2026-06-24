import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => {
  const body = within(document.body);
  return {
    snackbar: () => body.queryByTestId('Snackbar'),
    btnShowSnackbar: () => canvas.getByRole('button', { name: /Show Snackbar/i }),
    btnRetry: () => canvas.getByRole('button', { name: /Retry/i }),
    btnCloseNotification: () => body.getByLabelText('Close notification'),
    textElement: (text: string | RegExp) => body.getByText(text),

    icon: (type: 'info' | 'success' | 'warning' | 'error') => body.getByTestId(`Icon-${type}`),
  };
};

export const basicSnackbarActions = async ({ canvasElement, step, args }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Trigger snackbar visibility', async () => {
    await userEvent.click(locators.btnShowSnackbar());
  });

  await shouldVerifyBaseSnackbarState(locators, step, args);

  await step('Should close snackbar by clicking the close button', async () => {
    await userEvent.click(locators.btnCloseNotification());
    await waitFor(() => expect(locators.snackbar()).not.toBeInTheDocument());
  });

  await step('Should close snackbar by clicking on the snackbar itself', async () => {
    await userEvent.click(locators.btnShowSnackbar());
    await waitFor(() => expect(locators.snackbar()).toBeVisible());

    await userEvent.click(locators.snackbar()!);
    await waitFor(() => expect(locators.snackbar()).not.toBeInTheDocument());
  });
};

export const defaultActions = async (context: StoryContext) => {
  const locators = getLocators(within(context.canvasElement));
  await shouldVerifyBaseSnackbarState(locators, context.step, context.args);

  await context.step('Should verify close button is present', async () => {
    expect(locators.btnCloseNotification()).toBeVisible();
  });
};

export const successActions = async (context: StoryContext) => {
  const { step, args } = context;
  const locators = getLocators(within(context.canvasElement));

  await shouldVerifyBaseSnackbarState(locators, step, { ...args, status: 'success' });

  await step('Should verify close button is present', async () => {
    expect(locators.btnCloseNotification()).toBeVisible();
  });

  await step('Wait till snackbar is closed', async () => {
    await waitFor(
      () => {
        const snackbar = locators.snackbar();
        expect(snackbar).not.toBeVisible();
        expect(snackbar).toHaveAttribute('aria-hidden', 'true');
      },
      { timeout: args['duration'] + 1000 }
    );
  });
};

export const errorActions = async (context: StoryContext) => {
  const locators = getLocators(within(context.canvasElement));
  await shouldVerifyBaseSnackbarState(locators, context.step, { ...context.args, status: 'error' });

  await context.step('Should verify close button is present', async () => {
    expect(locators.btnCloseNotification()).toBeVisible();
  });
};

export const warningActions = async (context: StoryContext) => {
  const locators = getLocators(within(context.canvasElement));
  await shouldVerifyBaseSnackbarState(locators, context.step, { ...context.args, status: 'warning' });

  await context.step('Should verify close button is present', async () => {
    expect(locators.btnCloseNotification()).toBeVisible();
  });
};

export const withActionAndColoredActions = async (context: StoryContext) => {
  const locators = getLocators(within(context.canvasElement));
  await shouldVerifyBaseSnackbarState(locators, context.step, { ...context.args, status: 'error' });

  await context.step('Should verify close button is present', async () => {
    expect(locators.btnCloseNotification()).toBeVisible();
  });

  await context.step('Should verify retry button is present', async () => {
    expect(locators.btnRetry()).toBeVisible();
  });
};

export const noAutoDismissActions = async (context: StoryContext) => {
  const locators = getLocators(within(context.canvasElement));
  await shouldVerifyBaseSnackbarState(locators, context.step, context.args);

  await context.step('Should verify close button is present', async () => {
    expect(locators.btnCloseNotification()).toBeVisible();
  });

  await context.step('Should NOT close snackbar by clicking on the snackbar itself', async () => {
    await userEvent.click(locators.snackbar()!);
    expect(locators.snackbar()).toBeVisible();
  });
};

const shouldVerifyBaseSnackbarState = async (locators: ReturnType<typeof getLocators>, step: any, args: any) => {
  await step('Should render and display snackbar with correct content', async () => {
    await waitFor(() => {
      expect(locators.snackbar()).toBeVisible();
      expect(locators.snackbar()).toHaveAttribute('role', 'alert');
      expect(locators.snackbar()).toHaveAttribute('aria-live', 'polite');
    });
  });

  await step('Should verify icon on the snackbar', async () => {
    const type = args['status'] || 'info';
    expect(locators.icon(type)).toBeVisible();
  });

  await step('Should verify title of the snackbar', async () => {
    expect(locators.textElement(args['title'])).toBeVisible();
    expect(locators.textElement(args['title'])).toHaveTextContent(args['title']);
  });

  await step('Should verify description of the snackbar', async () => {
    expect(locators.textElement(args['message'])).toBeVisible();
    expect(locators.textElement(args['message'])).toHaveTextContent(args['message']);
  });
};
