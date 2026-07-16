import { fireEvent, render, screen } from '@testing-library/react-native';
import { GdSelect } from './GdSelect';

const ITEMS = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];

describe('GdSelect', () => {
  it('renders the placeholder when no value is selected', () => {
    render(<GdSelect items={ITEMS} placeholder="Choose one" />);
    expect(screen.getByText('Choose one')).toBeTruthy();
  });

  it('opens the dropdown and lists items on trigger press', () => {
    render(<GdSelect items={ITEMS} placeholder="Choose one" />);
    fireEvent.press(screen.getByTestId('gd-select-trigger'));

    expect(screen.getByText('Option 1')).toBeTruthy();
    expect(screen.getByText('Option 2')).toBeTruthy();
    expect(screen.getByText('Option 3')).toBeTruthy();
  });

  it('selects an item, calling onValueChange and closing the dropdown', () => {
    const onValueChange = jest.fn();
    render(<GdSelect items={ITEMS} placeholder="Choose one" onValueChange={onValueChange} />);
    fireEvent.press(screen.getByTestId('gd-select-trigger'));

    fireEvent.press(screen.getByText('Option 2'));

    expect(onValueChange).toHaveBeenCalledWith({ name: 'Option 2' });
  });

  it('does not open the dropdown when disabled', () => {
    render(<GdSelect items={ITEMS} disabled placeholder="Choose one" />);
    fireEvent.press(screen.getByTestId('gd-select-trigger'));
    expect(screen.queryByText('Option 1')).toBeNull();
  });

  it("displays the selected value's name in the trigger", () => {
    render(<GdSelect items={ITEMS} value={{ name: 'Option 3' }} />);
    expect(screen.getByText('Option 3')).toBeTruthy();
  });
});
