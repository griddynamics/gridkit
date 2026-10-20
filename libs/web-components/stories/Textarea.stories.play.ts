import { expect, userEvent, waitFor, fn } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdTextarea } from '../src';

const getLocators = (canvasElement: HTMLElement) => {
  const host = () => canvasElement.querySelector<GdTextarea>('gd-textarea')!;
  const shadow = <T extends HTMLElement>(selector: string) => host().shadowRoot!.querySelector<T>(selector);
  return {
    host,
    textarea: () => shadow<HTMLTextAreaElement>('textarea')!,
    wrapper: () => shadow('[part="wrapper"]')!,
    queryWrapper: () => shadow('[part="wrapper"]'),
    counter: () => shadow('[part="counter"]')!,
  };
};

/** Focus the native control the way Tab does: its content is selected. The simulated Tab key of the test library
 * only walks the light DOM, so it cannot reach controls inside a shadow root. */
const tabTo = async (textarea: HTMLTextAreaElement) => {
  await userEvent.click(document.body);
  textarea.focus();
  textarea.select();
};

/** Replace the content of the control through simulated key presses (the library cannot focus into shadow roots). */
const replaceValue = async (textarea: HTMLTextAreaElement, text: string) => {
  textarea.focus();
  await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
  await userEvent.keyboard(text);
};

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render textarea without wrapper, enabled and not read-only', async () => {
    await waitFor(() => expect(locators.textarea()).toBeInTheDocument());
    expect(locators.textarea()).not.toBeDisabled();
    expect(locators.textarea()).not.toHaveAttribute('readonly');
    expect(locators.queryWrapper()).toBeNull();
  });

  await step('Should call the change handler when typing into the textarea', async () => {
    (args['onChange'] as ReturnType<typeof fn>)?.mockClear();
    await replaceValue(locators.textarea(), 'Hello');
    expect(args['onChange']).toHaveBeenCalled();
    expect(locators.textarea()).toHaveValue('Hello');
  });

  await step('Should focus textarea on keyboard Tab navigation', async () => {
    await tabTo(locators.textarea());
    expect(locators.host().shadowRoot!.activeElement).toBe(locators.textarea());
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render a disabled textarea with default value', async () => {
    await waitFor(() => expect(locators.textarea()).toBeInTheDocument());
    expect(locators.textarea()).toBeDisabled();
    await waitFor(() => expect(locators.textarea()).toHaveValue('This is a disabled value'));
  });
};

export const readOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render a read-only textarea that is not disabled', async () => {
    await waitFor(() => expect(locators.textarea()).toBeInTheDocument());
    expect(locators.textarea()).toHaveAttribute('readonly');
    expect(locators.textarea()).not.toBeDisabled();
  });

  await step('Should display the read-only content', async () => {
    await waitFor(() => expect(locators.textarea()).toHaveValue('This text cannot be changed'));
  });
};

export const maxCharactersActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render wrapper and counter showing 0/100', async () => {
    await waitFor(() => expect(locators.wrapper()).toBeInTheDocument());
    expect(locators.counter()).toBeInTheDocument();
    expect(locators.counter()).toHaveTextContent('0/100');
  });

  await step('Should render textarea inside the wrapper as enabled', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).not.toBeDisabled();
    expect(locators.textarea()).not.toHaveAttribute('readonly');
  });

  await step('Should focus textarea on keyboard Tab navigation', async () => {
    await tabTo(locators.textarea());
    expect(locators.host().shadowRoot!.activeElement).toBe(locators.textarea());
  });
};

export const autoFocusActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render textarea with focus applied on mount', async () => {
    await waitFor(() => expect(locators.textarea()).toBeInTheDocument());
    expect(locators.host().shadowRoot!.activeElement).toBe(locators.textarea());
  });
};

export const controlledEraseOnEnterActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with the initial controlled value', async () => {
    await waitFor(() => expect(locators.textarea()).toBeInTheDocument());
    await waitFor(() => expect(locators.textarea()).toHaveValue('This is a controlled textarea, initially 1 row'));
  });

  await step('Should clear the textarea value when Enter is pressed', async () => {
    locators.textarea().focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(locators.textarea()).toHaveValue(''));
  });
};

export const withCharLimitActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render textarea with maxLength of 50', async () => {
    await waitFor(() => expect(locators.textarea()).toBeInTheDocument());
    expect(locators.textarea()).toHaveAttribute('maxlength', '50');
    expect(locators.textarea()).not.toBeDisabled();
  });

  await step('Should accept exactly 50 characters', async () => {
    locators.textarea().focus();
    await userEvent.keyboard('a'.repeat(50));
    expect(locators.textarea()).toHaveValue('a'.repeat(50));
    expect(locators.textarea().value.length).toBe(50);
  });

  await step('Should not exceed the 50-character limit when more characters are typed', async () => {
    await userEvent.keyboard('extra text beyond limit');
    expect(locators.textarea().value.length).toBe(50);
  });

  await step('Should clear the textarea after limit verification', async () => {
    await userEvent.keyboard('{Control>}a{/Control}{Backspace}');
    expect(locators.textarea()).toHaveValue('');
  });
};
