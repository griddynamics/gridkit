import { fireEvent, render, screen } from '@testing-library/react-native';
import { GdInput } from './GdInput';

describe('GdInput', () => {
  it('updates the displayed value as the user types (uncontrolled)', () => {
    render(<GdInput placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    fireEvent.changeText(input, 'hello');
    expect(input.props.value).toBe('hello');
  });

  it('dispatches onValueChange immediately when no debounceCallbackTime is set', () => {
    const onValueChange = jest.fn();
    render(<GdInput onValueChange={onValueChange} placeholder="Type here" />);

    fireEvent.changeText(screen.getByPlaceholderText('Type here'), 'a');
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('debounces onValueChange when debounceCallbackTime is set', () => {
    jest.useFakeTimers();
    const onValueChange = jest.fn();
    render(<GdInput onValueChange={onValueChange} debounceCallbackTime={300} placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');

    fireEvent.changeText(input, 'h');
    fireEvent.changeText(input, 'he');
    fireEvent.changeText(input, 'hel');

    // The displayed value updates on every keystroke...
    expect(input.props.value).toBe('hel');
    // ...but the debounced dispatch hasn't fired yet.
    expect(onValueChange).not.toHaveBeenCalled();

    jest.advanceTimersByTime(300);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('hel');
    jest.useRealTimers();
  });

  it(
    'cursor-jump guard: drops an external controlled value update while the field is focused, ' +
      "reconciling only on blur (mirrors the Lit port's activeElement guard — see FINDINGS.md " +
      'for why this is an automated approximation, not an on-device-verified result)',
    () => {
      const { rerender } = render(<GdInput value="initial" />);
      const input = screen.getByDisplayValue('initial');

      fireEvent(input, 'focus');
      // Simulates an external/async re-render supplying a new controlled `value` while the
      // user is still actively focused on the field.
      rerender(<GdInput value="external-update" />);
      expect(screen.getByDisplayValue('initial')).toBeTruthy();

      fireEvent(input, 'blur');
      expect(screen.getByDisplayValue('external-update')).toBeTruthy();
    }
  );

  it('applies an external controlled value update immediately when the field is NOT focused', () => {
    const { rerender } = render(<GdInput value="initial" />);
    rerender(<GdInput value="updated" />);
    expect(screen.getByDisplayValue('updated')).toBeTruthy();
  });

  it('renders label and helperText when provided', () => {
    render(<GdInput label="Email" helperText="We will never share it" />);
    expect(screen.getByText('Email')).toBeTruthy();
    expect(screen.getByText('We will never share it')).toBeTruthy();
  });

  it('is not editable when disabled', () => {
    render(<GdInput disabled placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here').props.editable).toBe(false);
  });
});
