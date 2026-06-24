import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testUtils';
import { InputVariantType } from '@types';

import { COMPONENT_NAME } from './constants';
import { Input } from './';

describe(COMPONENT_NAME, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<Input />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD handle input changes', () => {
    const NEW_VALUE = 'new value';
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const inputElement: HTMLInputElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.change(inputElement, { target: { value: NEW_VALUE } });

    expect(handleChange).toHaveBeenCalled();
    expect(inputElement.value).toBe(NEW_VALUE);
  });

  it('SHOULD handle checkbox check on click', () => {
    const handleChange = vi.fn();
    render(<Input variant={InputVariantType.Checkbox} onClick={handleChange} />);

    const inputElement: HTMLInputElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(inputElement);

    expect(handleChange).toHaveBeenCalled();
    expect(inputElement.checked).toBe(true);
  });

  it('SHOULD NOT handle disabled checkbox check on click', () => {
    const handleChange = vi.fn();
    render(<Input disabled={true} variant={InputVariantType.Checkbox} onClick={handleChange} />);

    const inputElement: HTMLInputElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(inputElement);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('SHOULD handle radio check on click', () => {
    const handleChange = vi.fn();
    render(<Input variant={InputVariantType.Radio} onClick={handleChange} />);

    const inputElement: HTMLInputElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(inputElement);

    expect(handleChange).toHaveBeenCalled();
    expect(inputElement.checked).toBe(true);
  });

  it('SHOULD NOT handle disabled radio check on click', () => {
    const handleChange = vi.fn();
    render(<Input disabled={true} variant={InputVariantType.Radio} onClick={handleChange} />);

    const inputElement: HTMLInputElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(inputElement);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('SHOULD debounce onKeyDown callback if debounceCallbackTime is provided', async () => {
    const handleKeyDown = vi.fn();
    const DEBOUNCE_TIME = 200;

    render(<Input onKeyDown={handleKeyDown} debounceCallbackTime={DEBOUNCE_TIME} />);

    const inputElement: HTMLInputElement = screen.getByTestId(COMPONENT_NAME);

    fireEvent.keyDown(inputElement, { key: 'Enter' });
    fireEvent.keyDown(inputElement, { key: 'Enter' });
    fireEvent.keyDown(inputElement, { key: 'Enter' });

    // Immediately after, should not be called yet (debounced)
    expect(handleKeyDown).not.toHaveBeenCalled();

    // Fast-forward timers by debounce time
    vi.advanceTimersByTime(DEBOUNCE_TIME);

    // Now, debounced function should be called once
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it('SHOULD render start adornments WHEN provided', () => {
    const START_ADORNMENT = 'Start';

    render(<Input adornmentStart={START_ADORNMENT} />);
    const endIcon = screen.getByText(START_ADORNMENT);
    expect(document.body.contains(endIcon)).toBe(true);
  });

  it('SHOULD render end adornments WHEN provided', () => {
    const END_ADORNMENT = 'End';

    render(<Input adornmentEnd={END_ADORNMENT} />);
    const endIcon = screen.getByText(END_ADORNMENT);
    expect(document.body.contains(endIcon)).toBe(true);
  });

  it('SHOULD render label WHEN provided', () => {
    const LABEL_TEXT = 'Test Label';
    render(<Input label={LABEL_TEXT} />);

    const labelElement = screen.getByText(LABEL_TEXT);
    expect(document.body.contains(labelElement)).toBe(true);
  });

  it('SHOULD render helper text WHEN provided', () => {
    const HELPER_TEXT = 'Helper Text';
    render(<Input helperText={HELPER_TEXT} />);

    const helperElement = screen.getByText(HELPER_TEXT);
    expect(document.body.contains(helperElement)).toBe(true);
  });

  it('SHOULD render both adornments with correct positioning', () => {
    const START_ADORNMENT = 'Start';
    const END_ADORNMENT = 'End';

    const { container } = render(<Input adornmentStart={START_ADORNMENT} adornmentEnd={END_ADORNMENT} />);

    const startElement = screen.getByText(START_ADORNMENT);
    const endElement = screen.getByText(END_ADORNMENT);

    expect(document.body.contains(startElement)).toBe(true);
    expect(document.body.contains(endElement)).toBe(true);
    expect(container.innerHTML.indexOf(START_ADORNMENT)).toBeLessThan(container.innerHTML.indexOf(END_ADORNMENT));
  });
});
