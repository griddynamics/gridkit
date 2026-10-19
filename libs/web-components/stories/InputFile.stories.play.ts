import { expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdInputFile } from '../src';

const getLocators = (canvasElement: HTMLElement) => {
  const host = () => canvasElement.querySelector<GdInputFile>('gd-input-file')!;
  const button = () => host().shadowRoot!.querySelector('gd-button')!.shadowRoot!.querySelector('button')!;
  return {
    host,
    wrapper: () => host().shadowRoot!.querySelector<HTMLElement>('[part="root"]')!,
    button,
    fileInput: () => host().shadowRoot!.querySelector<HTMLInputElement>('input[type="file"]')!,
    iconAttachmentIcon: () => host().querySelector<HTMLElement>('gd-icon[name="attachment"]'),
  };
};

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

/** Rendered label: the assigned nodes of the default slot, falling back to the slot's own content. */
const labelText = (host: GdInputFile) =>
  host
    .shadowRoot!.querySelector('slot')!
    .assignedNodes({ flatten: true })
    .map((node) => node.textContent)
    .join('')
    .trim();

const ready = (canvasElement: HTMLElement) => waitFor(() => expect(getLocators(canvasElement).button()).toBeVisible());

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render initial components with default label', async () => {
    await ready(canvasElement);
    expect(locators.wrapper()).toBeVisible();
    await waitFor(() => expect(labelText(locators.host())).toMatch(/browse files/i));
  });

  await step('Should fire the click handler when button is clicked', async () => {
    clearMock(args, 'onClick');
    await clickWithoutDialog(locators.button());
    expect(args['onClick']).toHaveBeenCalledTimes(1);
  });

  await step('Should fire the change handler when a file is uploaded', async () => {
    clearMock(args, 'onChange');
    const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    await userEvent.upload(locators.fileInput(), mockFile);
    expect(args['onChange']).toHaveBeenCalledTimes(1);
  });

  await step('Should support keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    locators.button().focus();
    expect(locators.button().getRootNode()).toBeInstanceOf(ShadowRoot);
    expect((locators.button().getRootNode() as ShadowRoot).activeElement).toBe(locators.button());
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render wrapper with button in disabled state', async () => {
    await ready(canvasElement);
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.button()).toBeDisabled();
  });

  await step('Should not receive keyboard focus when disabled', async () => {
    await userEvent.click(document.body);
    locators.button().focus();
    expect((locators.button().getRootNode() as ShadowRoot).activeElement).not.toBe(locators.button());
  });
};

export const multipleActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render button with default label', async () => {
    await ready(canvasElement);
    await waitFor(() => expect(labelText(locators.host())).toMatch(/browse files/i));
  });

  await step('Should set multiple attribute on hidden file input', async () => {
    expect(locators.fileInput()).toHaveAttribute('multiple');
  });
};

export const withAcceptActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render button with default label', async () => {
    await ready(canvasElement);
    await waitFor(() => expect(labelText(locators.host())).toMatch(/browse files/i));
  });

  await step('Should set accept attribute on hidden file input', async () => {
    expect(locators.fileInput()).toHaveAttribute('accept', 'image/*');
  });
};

export const iconLabelActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render button containing the attachment icon', async () => {
    await ready(canvasElement);
    expect(locators.iconAttachmentIcon()).toBeInTheDocument();
  });
};
