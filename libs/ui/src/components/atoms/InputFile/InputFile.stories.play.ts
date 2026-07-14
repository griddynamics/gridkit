import { within, expect, userEvent } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  wrapper: () => canvas.getByTestId('InputFile'),
  button: () => canvas.getByTestId('Button'),
  fileInput: () => canvas.getByTestId('InputFile').querySelector('input[type="file"]') as HTMLInputElement,
  iconAttachmentIcon: () => canvas.getByTestId('Icon-attachment'),
});

const clearMock = (args: StoryContext['args'], name: string) => {
  if (args[name]?.mock) args[name].mockClear();
};

const clickWithoutDialog = async (element: HTMLElement) => {
  const originalClick = HTMLInputElement.prototype.click;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  HTMLInputElement.prototype.click = () => {};
  try {
    await userEvent.click(element);
  } finally {
    HTMLInputElement.prototype.click = originalClick;
  }
};

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(within(canvasElement));

  await step('Should render initial components with default label', async () => {
    expect(locators.wrapper()).toBeVisible();
    expect(locators.button()).toHaveTextContent(/browse files/i);
  });

  await step('Should fire onClick when button is clicked', async () => {
    clearMock(args, 'onClick');
    await clickWithoutDialog(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });

  await step('Should fire onChange when a file is uploaded', async () => {
    clearMock(args, 'onChange');
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    await userEvent.upload(locators.fileInput(), mockFile);
    expect(args['onChange']).toHaveBeenCalledTimes(1);
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.button()).toHaveFocus();
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render wrapper with button in disabled state', async () => {
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.button()).toBeDisabled();
  });

  await step('Should not receive keyboard focus when disabled', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.button()).not.toHaveFocus();
  });
};

export const multipleActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render button with default label', async () => {
    expect(locators.button()).toBeInTheDocument();
    expect(locators.button()).toHaveTextContent(/browse files/i);
  });

  await step('Should set multiple attribute on hidden file input', async () => {
    expect(locators.fileInput()).toHaveAttribute('multiple');
  });
};

export const withAcceptActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render button with default label', async () => {
    expect(locators.button()).toBeInTheDocument();
    expect(locators.button()).toHaveTextContent(/browse files/i);
  });

  await step('Should set accept attribute on hidden file input', async () => {
    expect(locators.fileInput()).toHaveAttribute('accept', 'image/*');
  });
};

export const iconLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render button containing the attachment icon', async () => {
    expect(locators.button()).toBeInTheDocument();
    expect(locators.iconAttachmentIcon()).toBeInTheDocument();
  });
};
