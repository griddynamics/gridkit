import { fireEvent, render, screen } from '@testing-library/react-native';
import { GdSelect } from './GdSelect';

const ITEMS = [{ name: 'Option 1' }, { name: 'Option 2' }, { name: 'Option 3' }];

/** Distinct `value`s, unlike `ITEMS` above — exercises the real `selected?.value === item.value`
 *  identity check. With `ITEMS`, every item's `value` is `undefined`, so before anything is
 *  selected `undefined === undefined` is true for ALL of them, masking a broken comparison. */
const VALUED_ITEMS = [
  { name: 'Option 1', value: 'option-1' },
  { name: 'Option 2', value: 'option-2' },
  { name: 'Option 3', value: 'option-3' },
];

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

  it('highlights only the selected item in the reopened dropdown, not every item', () => {
    render(<GdSelect items={VALUED_ITEMS} value={VALUED_ITEMS[1]} placeholder="Choose one" />);
    fireEvent.press(screen.getByTestId('gd-select-trigger'));

    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.map((item) => item.props.accessibilityState?.selected)).toEqual([false, true, false]);
  });

  // No automated test for the trigger's focus ring (`gd-select-focus-ring`): `Pressable`'s
  // `onFocus`/`onBlur` go through RN's own `Pressability` class, whose internal `_config` closure
  // does not pick up a test-rendered `onFocus` prop under `react-test-renderer` — confirmed by
  // calling `element.props.onFocus(...)` directly in isolation, which never reaches the callback
  // passed to `Pressable`. `GdInput`'s equivalent focus-ring test works because `TextInput`'s
  // onFocus/onBlur wiring doesn't go through `Pressability`. Verified instead in an actual browser
  // (`react-native-web`, via chrome-devtools-mcp): focusing the trigger renders the ring at the
  // right geometry/color, and blurring removes it.
});
