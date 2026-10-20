import { expect, fn, userEvent, waitFor } from 'storybook/test';
import type { StoryContext } from '@storybook/web-components-vite';
import type { GdCounter } from '../src';

const getLocators = (canvasElement: HTMLElement) => {
  const counter = () => canvasElement.querySelector<GdCounter>('gd-counter')!;
  const part = (name: string) => counter().shadowRoot!.querySelector<HTMLElement>(`[part="${name}"]`)!;
  return {
    counter,
    decrementButton: () => part('decrement'),
    incrementButton: () => part('increment'),
    inputHost: () => part('input'),
    input: () => part('input').shadowRoot!.querySelector<HTMLInputElement>('input')!,
    minusIcon: () => part('decrement-icon'),
    plusIcon: () => part('increment-icon'),
  };
};

/** `document.activeElement`, descending through shadow roots. */
const deepActiveElement = () => {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
};

// `userEvent.clear` requires `document.activeElement` to be the input itself, which is never true behind
// shadow roots, so the text is selected with a triple click and replaced through the keyboard instead.
const clearInput = async (input: HTMLInputElement) => {
  await userEvent.tripleClick(input);
  await userEvent.keyboard('{Backspace}');
};

const fillInput = async (input: HTMLInputElement, value: string) => {
  await clearInput(input);
  await userEvent.keyboard(value);
};

/** Keyboard tabbing does not cross shadow roots in the test environment, so focus is moved to the next stop directly. */
const focusStop = (element: HTMLElement) => {
  const target = element.shadowRoot?.querySelector<HTMLElement>('button, input') ?? element;
  target.focus();
  return target;
};

export const defaultActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render counter component', async () => {
    const counter = locators.counter();
    expect(counter).toBeInTheDocument();
    expect(counter).toBeVisible();
  });

  await step('Should render with initial value 1', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue(1);
  });

  await step('Should render decrement button with minus icon', async () => {
    expect(locators.decrementButton()).toBeInTheDocument();
    expect(locators.minusIcon()).toBeInTheDocument();
  });

  await step('Should render increment button with plus icon', async () => {
    expect(locators.incrementButton()).toBeInTheDocument();
    expect(locators.plusIcon()).toBeInTheDocument();
  });

  await step('Should disable decrement button at minimum value', async () => {
    expect(locators.decrementButton()).toBeDisabled();
  });

  await step('Should increment counter to 2 on increment button click', async () => {
    await userEvent.click(locators.incrementButton());
    expect(locators.input()).toHaveValue(2);
  });

  await step('Should enable decrement button after incrementing', async () => {
    expect(locators.decrementButton()).not.toBeDisabled();
  });

  await step('Should increment counter to 3', async () => {
    await userEvent.click(locators.incrementButton());
    expect(locators.input()).toHaveValue(3);
  });

  await step('Should decrement counter to 2 on decrement button click', async () => {
    await userEvent.click(locators.decrementButton());
    expect(locators.input()).toHaveValue(2);
  });

  await step('Should allow typing numeric values', async () => {
    await fillInput(locators.input(), '25');
    expect(locators.input()).toHaveValue(25);
  });

  await step('Should validate and accept numeric value on blur', async () => {
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(25);
    });
  });

  await step('Should reject non-numeric input', async () => {
    await clearInput(locators.input());
    await userEvent.keyboard('abc');

    expect(locators.input()).toHaveValue(null);
  });

  await step('Should restore previous value when empty on blur', async () => {
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(25);
    });
  });

  await step('Should allow keyboard navigation with Tab', async () => {
    await userEvent.click(document.body);
    expect(focusStop(locators.decrementButton())).toBe(deepActiveElement());
    expect(focusStop(locators.inputHost())).toBe(deepActiveElement());
    expect(focusStop(locators.incrementButton())).toBe(deepActiveElement());
  });
};

export const adjustedMaxValue5Actions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with initial value 1', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue(1);
  });

  for (const value of [2, 3, 4, 5]) {
    await step(value === 5 ? 'Should increment to maximum value 5' : `Should increment to ${value}`, async () => {
      await userEvent.click(locators.incrementButton());
      expect(locators.input()).toHaveValue(value);
    });
  }

  await step('Should disable increment button at maximum value', async () => {
    expect(locators.incrementButton()).toBeDisabled();
  });

  await step('Should still allow decrement from maximum', async () => {
    expect(locators.decrementButton()).not.toBeDisabled();
    await userEvent.click(locators.decrementButton());
    expect(locators.input()).toHaveValue(4);
  });

  await step('Should clamp typed value above max to max on blur', async () => {
    await fillInput(locators.input(), '100');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(5);
    });
  });

  await step('Should disable increment button after clamping to max', async () => {
    expect(locators.incrementButton()).toBeDisabled();
  });
};

export const adjustedMinValue3Actions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with initial minimum value 3', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue(3);
  });

  await step('Should disable decrement button at minimum value', async () => {
    expect(locators.decrementButton()).toBeDisabled();
  });

  await step('Should allow increment from minimum', async () => {
    expect(locators.incrementButton()).not.toBeDisabled();
    await userEvent.click(locators.incrementButton());
    expect(locators.input()).toHaveValue(4);
  });

  await step('Should enable decrement button after incrementing', async () => {
    expect(locators.decrementButton()).not.toBeDisabled();
  });

  await step('Should decrement back to minimum value 3', async () => {
    await userEvent.click(locators.decrementButton());
    expect(locators.input()).toHaveValue(3);
  });

  await step('Should disable decrement button at minimum again', async () => {
    expect(locators.decrementButton()).toBeDisabled();
  });

  await step('Should clamp typed value below min to min on blur', async () => {
    await fillInput(locators.input(), '1');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(3);
    });
  });
};

export const adjustedMin2MaxValue10Actions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);

  await step('Should render with initial value 2 (minimum)', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue(2);
  });

  await step('Should disable decrement button at minimum value 2', async () => {
    expect(locators.decrementButton()).toBeDisabled();
  });

  await step('Should increment from 2 to 3', async () => {
    await userEvent.click(locators.incrementButton());
    expect(locators.input()).toHaveValue(3);
  });

  await step('Should allow typing value within range', async () => {
    await fillInput(locators.input(), '7');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(7);
    });
  });

  await step('Should increment to maximum value 10', async () => {
    await userEvent.click(locators.incrementButton());
    await userEvent.click(locators.incrementButton());
    await userEvent.click(locators.incrementButton());
    expect(locators.input()).toHaveValue(10);
  });

  await step('Should disable increment button at maximum value 10', async () => {
    expect(locators.incrementButton()).toBeDisabled();
  });

  await step('Should clamp typed value above max to 10 on blur', async () => {
    await fillInput(locators.input(), '50');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(10);
    });
  });

  await step('Should clamp typed value below min to 2 on blur', async () => {
    await fillInput(locators.input(), '1');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(2);
    });
  });

  await step('Should disable decrement button after clamping to min', async () => {
    expect(locators.decrementButton()).toBeDisabled();
  });
};

export const withExternalCounterChangeHandlerActions = async ({ canvasElement, step }: StoryContext) => {
  const locators = getLocators(canvasElement);
  const onCounterChange = fn();
  locators
    .counter()
    .addEventListener('gd-change', (event) => onCounterChange((event as CustomEvent<{ value: number }>).detail.value));

  await step('Should render with initial value 3', async () => {
    expect(locators.input()).toBeInTheDocument();
    expect(locators.input()).toHaveValue(3);
  });

  await step('Should emit gd-change when incrementing', async () => {
    await userEvent.click(locators.incrementButton());
    expect(locators.input()).toHaveValue(4);

    await waitFor(() => {
      expect(onCounterChange).toHaveBeenCalledWith(4);
    });
  });

  await step('Should emit gd-change when decrementing', async () => {
    await userEvent.click(locators.decrementButton());
    expect(locators.input()).toHaveValue(3);

    await waitFor(() => {
      expect(onCounterChange).toHaveBeenCalledWith(3);
    });
  });

  await step('Should emit gd-change when typing valid value', async () => {
    await fillInput(locators.input(), '10');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(10);
      expect(onCounterChange).toHaveBeenCalledWith(10);
    });
  });

  await step('Should emit gd-change with clamped value when typing invalid range', async () => {
    await fillInput(locators.input(), '0');
    await userEvent.click(document.body);

    await waitFor(() => {
      expect(locators.input()).toHaveValue(1);
      expect(onCounterChange).toHaveBeenCalledWith(1);
    });
  });
};
