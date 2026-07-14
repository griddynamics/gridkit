import { expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME, MIN_INITIAL_QTY, INITIAL_QTY } from './constants';
import { Counter } from './Counter';

describe(COMPONENT_NAME, () => {
  const MAX_INITIAL_QTY = 10;

  const defaultProps = {
    min: MIN_INITIAL_QTY,
    max: MAX_INITIAL_QTY,
    initial: INITIAL_QTY,
    onCounterChange: vi.fn(),
  };

  it('SHOULD match snapshot', () => {
    const { container } = render(<Counter {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render the Counter component with the initial value', () => {
    const initialValue = 10;
    render(<Counter initial={initialValue} />);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
    expect(input.value).toBe(String(initialValue));
  });

  it('SHOULD increment counter value when increment button is clicked', () => {
    render(<Counter />);
    const incrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);

    fireEvent.click(incrementButton);
    expect(input.value).toBe('2');
  });

  it('SHOULD NOT increment counter value beyond the max limit', () => {
    const maxValue = 10;
    render(<Counter initial={maxValue} max={maxValue} />);
    const incrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);

    fireEvent.click(incrementButton);
    expect(input.value).toBe(String(maxValue));
  });

  it('SHOULD decrement counter value when decrement button is clicked', () => {
    const maxValue = 10;
    render(<Counter initial={maxValue} max={maxValue} />);
    const decrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-decrease`);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);

    fireEvent.click(decrementButton);
    expect(input.value).toBe(String(maxValue - 1));
  });

  it('SHOULD NOT decrement counter value below the min limit', () => {
    render(<Counter />);
    const decrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-decrease`);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);

    fireEvent.click(decrementButton);
    expect(input.value).toBe(String(1));
  });

  it('SHOULD disable the increment button when counter reaches max limit', () => {
    const maxValue = 10;
    render(<Counter initial={maxValue} max={maxValue} />);
    const incrementButton: HTMLButtonElement = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
    expect(incrementButton.disabled).toBe(true);
  });

  it('SHOULD disable the decrement button when counter reaches min limit', () => {
    render(<Counter />);
    const incrementButton: HTMLButtonElement = screen.getByTestId(`${COMPONENT_NAME}-button-decrease`);
    expect(incrementButton.disabled).toBe(true);
  });

  it('SHOULD update counter value when input is changed to a valid value and blurred', () => {
    const inputValue = '10';
    render(<Counter />);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
    fireEvent.change(input, { target: { value: inputValue } });
    fireEvent.blur(input);

    expect(input.value).toBe(inputValue);
  });

  it('SHOULD clamp input value to max when value exceeds max limit and blurred', () => {
    const inputValue = '10';
    render(<Counter max={+inputValue} />);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
    fireEvent.change(input, { target: { value: inputValue } });
    fireEvent.blur(input);

    expect(input.value).toBe(inputValue);
  });

  it('SHOULD clamp input value to min when value is less than min limit and blurred', () => {
    render(<Counter />);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);

    expect(input.value).toBe('1');
  });

  it('SHOULD reset input value to last valid counter value when invalid input is entered and blurred', () => {
    const inputValue = 10;
    render(<Counter initial={inputValue} />);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    expect(input.value).toBe(String(inputValue));
  });

  it('SHOULD call onCounterChange callback with correct values when counter changes', () => {
    const onCounterChange = vi.fn();
    render(<Counter onCounterChange={onCounterChange} />);

    const incrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
    fireEvent.click(incrementButton);

    expect(onCounterChange).toHaveBeenCalled();
  });

  it('SHOULD allow clearing input but reset to the last valid value on blur', () => {
    const inputValue = 10;
    render(<Counter initial={inputValue} />);
    const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(input.value).toBe(String(inputValue));
  });

  describe('when disabled', () => {
    it('SHOULD disable the input field when isDisabled is true', () => {
      render(<Counter isDisabled={true} initial={5} />);
      const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);
      expect(input.disabled).toBe(true);
    });

    it('SHOULD disable the increment button when isDisabled is true', () => {
      render(<Counter isDisabled={true} initial={5} />);
      const incrementButton: HTMLButtonElement = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
      expect(incrementButton.disabled).toBe(true);
    });

    it('SHOULD disable the decrement button when isDisabled is true', () => {
      render(<Counter isDisabled={true} initial={5} />);
      const decrementButton: HTMLButtonElement = screen.getByTestId(`${COMPONENT_NAME}-button-decrease`);
      expect(decrementButton.disabled).toBe(true);
    });

    it('SHOULD NOT increment counter value when increment button is clicked and isDisabled is true', () => {
      const initialValue = 5;
      render(<Counter isDisabled={true} initial={initialValue} />);
      const incrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
      const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);

      fireEvent.click(incrementButton);
      expect(input.value).toBe(String(initialValue));
    });

    it('SHOULD NOT decrement counter value when decrement button is clicked and isDisabled is true', () => {
      const initialValue = 5;
      render(<Counter isDisabled={true} initial={initialValue} />);
      const decrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-decrease`);
      const input: HTMLInputElement = screen.getByTestId(`${COMPONENT_NAME}-input`);

      fireEvent.click(decrementButton);
      expect(input.value).toBe(String(initialValue));
    });

    it('SHOULD call onCounterChange callback only once on init when buttons are clicked and isDisabled is true', () => {
      const onCounterChange = vi.fn();
      render(<Counter isDisabled={true} onCounterChange={onCounterChange} initial={5} />);

      const incrementButton = screen.getByTestId(`${COMPONENT_NAME}-button-increase`);
      fireEvent.click(incrementButton);

      expect(onCounterChange).toHaveBeenCalledTimes(1);
    });
  });
});
