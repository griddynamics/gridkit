import { within, expect, userEvent, fn } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  textarea: () => canvas.getByTestId('Textarea'),
  wrapper: () => canvas.getByTestId('Textarea-wrapper'),
  queryWrapper: () => canvas.queryByTestId('Textarea-wrapper'),
  counter: () => canvas.getByTestId('Textarea-counter'),
});

export const defaultActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render textarea without wrapper, enabled and not read-only', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).not.toBeDisabled();
    expect(locators.textarea()).not.toHaveAttribute('readonly');
    expect(locators.queryWrapper()).not.toBeInTheDocument();
  });

  await step('Should call onChange when typing into the textarea', async () => {
    (args['onChange'] as ReturnType<typeof fn>)?.mockClear();
    await userEvent.clear(locators.textarea());
    await userEvent.type(locators.textarea(), 'Hello');
    expect(args['onChange']).toHaveBeenCalled();
    expect(locators.textarea()).toHaveValue('Hello');
  });

  await step('Should focus textarea on keyboard Tab navigation', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.textarea()).toHaveFocus();
  });
};

export const disabledActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render a disabled textarea with default value', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).toBeDisabled();
    expect(locators.textarea()).toHaveValue('This is a disabled value');
  });
};

export const readOnlyActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render a read-only textarea that is not disabled', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).toHaveAttribute('readonly');
    expect(locators.textarea()).not.toBeDisabled();
  });

  await step('Should display the read-only content', async () => {
    expect(locators.textarea()).toHaveValue('This text cannot be changed');
  });
};

export const maxCharactersActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render wrapper and counter showing 0/100', async () => {
    expect(locators.wrapper()).toBeInTheDocument();
    expect(locators.counter()).toBeInTheDocument();
    expect(locators.counter()).toHaveTextContent('0/100');
  });

  await step('Should render textarea inside the wrapper as enabled', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).not.toBeDisabled();
    expect(locators.textarea()).not.toHaveAttribute('readonly');
  });

  await step('Should focus textarea on keyboard Tab navigation', async () => {
    await userEvent.click(document.body);
    await userEvent.tab();
    expect(locators.textarea()).toHaveFocus();
  });
};

export const autoFocusActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render textarea with focus applied on mount', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).toHaveFocus();
  });
};

export const controlledEraseOnEnterActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with the initial controlled value', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).toHaveValue('This is a controlled textarea, initially 1 row');
  });

  await step('Should clear the textarea value when Enter is pressed', async () => {
    await userEvent.click(locators.textarea());
    await userEvent.keyboard('{Enter}');
    expect(locators.textarea()).toHaveValue('');
  });
};

export const withCharLimitActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render textarea with maxLength of 50', async () => {
    expect(locators.textarea()).toBeInTheDocument();
    expect(locators.textarea()).toHaveAttribute('maxlength', '50');
    expect(locators.textarea()).not.toBeDisabled();
  });

  await step('Should accept exactly 50 characters', async () => {
    await userEvent.click(locators.textarea());
    await userEvent.type(locators.textarea(), 'a'.repeat(50));
    expect(locators.textarea()).toHaveValue('a'.repeat(50));
    expect((locators.textarea() as HTMLTextAreaElement).value.length).toBe(50);
  });

  await step('Should not exceed the 50-character limit when more characters are typed', async () => {
    await userEvent.type(locators.textarea(), 'extra text beyond limit');
    expect((locators.textarea() as HTMLTextAreaElement).value.length).toBe(50);
  });

  await step('Should clear the textarea after limit verification', async () => {
    await userEvent.clear(locators.textarea());
    expect(locators.textarea()).toHaveValue('');
  });
};
