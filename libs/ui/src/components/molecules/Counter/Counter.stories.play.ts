import { within, expect, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/react-vite';
import { fillInput, clearInput, tabToNext } from '@playUtils';

const getLocators = (canvas: ReturnType<typeof within>) => ({
  counter: () => canvas.getByTestId('Counter'),
  decrementButton: () => canvas.getByTestId('Counter-button-decrease'),
  incrementButton: () => canvas.getByTestId('Counter-button-increase'),
  input: () => canvas.getByTestId('Counter-input'),
  minusIcon: () => canvas.getByTestId('Icon-minus'),
  plusIcon: () => canvas.getByTestId('Icon-plus'),
});

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render counter component', async () => {
    const counter = locators.counter();
    expect(counter).toBeInTheDocument();
    expect(counter).toBeVisible();
  });

  await step('Should render with initial value 1', async () => {
    const input = locators.input();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1);
  });

  await step('Should render decrement button with minus icon', async () => {
    const decrementButton = locators.decrementButton();
    const minusIcon = locators.minusIcon();

    expect(decrementButton).toBeInTheDocument();
    expect(minusIcon).toBeInTheDocument();
  });

  await step('Should render increment button with plus icon', async () => {
    const incrementButton = locators.incrementButton();
    const plusIcon = locators.plusIcon();

    expect(incrementButton).toBeInTheDocument();
    expect(plusIcon).toBeInTheDocument();
  });

  await step('Should disable decrement button at minimum value', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).toBeDisabled();
  });

  await step('Should increment counter to 2 on increment button click', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(2);
  });

  await step('Should enable decrement button after incrementing', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).not.toBeDisabled();
  });

  await step('Should increment counter to 3', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(3);
  });

  await step('Should decrement counter to 2 on decrement button click', async () => {
    const decrementButton = locators.decrementButton();
    const input = locators.input();

    await userEvent.click(decrementButton);
    expect(input).toHaveValue(2);
  });

  await step('Should allow typing numeric values', async () => {
    const input = locators.input();
    await fillInput(input, '25');
    expect(input).toHaveValue(25);
  });

  await step('Should validate and accept numeric value on blur', async () => {
    const input = locators.input();
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(25);
    });
  });

  await step('Should reject non-numeric input', async () => {
    const input = locators.input();
    await clearInput(input);
    await userEvent.type(input, 'abc');

    expect(input).toHaveValue(null);
  });

  await step('Should restore previous value when empty on blur', async () => {
    const input = locators.input();
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(25);
    });
  });

  await step('Should allow keyboard navigation with Tab', async () => {
    const decrementButton = locators.decrementButton();
    const input = locators.input();
    const incrementButton = locators.incrementButton();

    await userEvent.click(document.body);
    await tabToNext();
    expect(decrementButton).toHaveFocus();

    await tabToNext();
    expect(input).toHaveFocus();

    await tabToNext();
    expect(incrementButton).toHaveFocus();
  });
};

export const adjustedMaxValue5Actions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with initial value 1', async () => {
    const input = locators.input();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(1);
  });

  await step('Should increment to 2', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(2);
  });

  await step('Should increment to 3', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(3);
  });

  await step('Should increment to 4', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(4);
  });

  await step('Should increment to maximum value 5', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(5);
  });

  await step('Should disable increment button at maximum value', async () => {
    const incrementButton = locators.incrementButton();
    expect(incrementButton).toBeDisabled();
  });

  await step('Should still allow decrement from maximum', async () => {
    const decrementButton = locators.decrementButton();
    const input = locators.input();

    expect(decrementButton).not.toBeDisabled();
    await userEvent.click(decrementButton);
    expect(input).toHaveValue(4);
  });

  await step('Should clamp typed value above max to max on blur', async () => {
    const input = locators.input();
    await fillInput(input, '100');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(5);
    });
  });

  await step('Should disable increment button after clamping to max', async () => {
    const incrementButton = locators.incrementButton();
    expect(incrementButton).toBeDisabled();
  });
};

export const adjustedMinValue3Actions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with initial minimum value 3', async () => {
    const input = locators.input();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(3);
  });

  await step('Should disable decrement button at minimum value', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).toBeDisabled();
  });

  await step('Should allow increment from minimum', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    expect(incrementButton).not.toBeDisabled();
    await userEvent.click(incrementButton);
    expect(input).toHaveValue(4);
  });

  await step('Should enable decrement button after incrementing', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).not.toBeDisabled();
  });

  await step('Should decrement back to minimum value 3', async () => {
    const decrementButton = locators.decrementButton();
    const input = locators.input();

    await userEvent.click(decrementButton);
    expect(input).toHaveValue(3);
  });

  await step('Should disable decrement button at minimum again', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).toBeDisabled();
  });

  await step('Should clamp typed value below min to min on blur', async () => {
    const input = locators.input();
    await fillInput(input, '1');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(3);
    });
  });
};

export const adjustedMin2MaxValue10Actions = async ({ canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with initial value 2 (minimum)', async () => {
    const input = locators.input();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(2);
  });

  await step('Should disable decrement button at minimum value 2', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).toBeDisabled();
  });

  await step('Should increment from 2 to 3', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(3);
  });

  await step('Should allow typing value within range', async () => {
    const input = locators.input();
    await fillInput(input, '7');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(7);
    });
  });

  await step('Should increment to maximum value 10', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    await userEvent.click(incrementButton);
    expect(input).toHaveValue(10);
  });

  await step('Should disable increment button at maximum value 10', async () => {
    const incrementButton = locators.incrementButton();
    expect(incrementButton).toBeDisabled();
  });

  await step('Should clamp typed value above max to 10 on blur', async () => {
    const input = locators.input();
    await fillInput(input, '50');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(10);
    });
  });

  await step('Should clamp typed value below min to 2 on blur', async () => {
    const input = locators.input();
    await fillInput(input, '1');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(2);
    });
  });

  await step('Should disable decrement button after clamping to min', async () => {
    const decrementButton = locators.decrementButton();
    expect(decrementButton).toBeDisabled();
  });
};

export const withExternalCounterChangeHandlerActions = async ({ args, canvasElement, step }: StoryContext) => {
  const canvas = within(canvasElement);
  const locators = getLocators(canvas);

  await step('Should render with initial value 3', async () => {
    const input = locators.input();
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(3);
  });

  await step('Should call onCounterChange when incrementing', async () => {
    const incrementButton = locators.incrementButton();
    const input = locators.input();

    await userEvent.click(incrementButton);
    expect(input).toHaveValue(4);

    await waitFor(() => {
      expect(args['onCounterChange']).toHaveBeenCalledWith(4);
    });
  });

  await step('Should call onCounterChange when decrementing', async () => {
    const decrementButton = locators.decrementButton();
    const input = locators.input();

    await userEvent.click(decrementButton);
    expect(input).toHaveValue(3);

    await waitFor(() => {
      expect(args['onCounterChange']).toHaveBeenCalledWith(3);
    });
  });

  await step('Should call onCounterChange when typing valid value', async () => {
    const input = locators.input();
    await fillInput(input, '10');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(10);
      expect(args['onCounterChange']).toHaveBeenCalledWith(10);
    });
  });

  await step('Should call onCounterChange with clamped value when typing invalid range', async () => {
    const input = locators.input();
    await fillInput(input, '0');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(input).toHaveValue(1);
      expect(args['onCounterChange']).toHaveBeenCalledWith(1);
    });
  });
};
