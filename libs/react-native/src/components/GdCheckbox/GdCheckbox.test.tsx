import { fireEvent, render, screen } from '@testing-library/react-native';
import { GdCheckbox } from './GdCheckbox';

describe('GdCheckbox', () => {
  it('renders unchecked by default and toggles to checked on press (uncontrolled)', () => {
    const onValueChange = jest.fn();
    render(<GdCheckbox onValueChange={onValueChange}>Accept</GdCheckbox>);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.props.accessibilityState).toMatchObject({ checked: false });

    fireEvent.press(checkbox);
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle its own displayed state when controlled — parent must re-pass checked', () => {
    const onValueChange = jest.fn();
    render(
      <GdCheckbox checked={false} onValueChange={onValueChange}>
        Accept
      </GdCheckbox>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.press(checkbox);

    expect(onValueChange).toHaveBeenCalledWith(true);
    // Controlled: the prop is still `false`, so the store's synced value stays false too.
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it('reflects an external controlled checked=true prop', () => {
    render(<GdCheckbox checked={true}>Accept</GdCheckbox>);
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe(true);
  });

  it('reports accessibilityState.checked as "mixed" when indeterminate, regardless of checked', () => {
    render(
      <GdCheckbox checked={false} indeterminate>
        Accept
      </GdCheckbox>
    );
    expect(screen.getByRole('checkbox').props.accessibilityState.checked).toBe('mixed');
  });

  it('does not fire onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    render(
      <GdCheckbox disabled onValueChange={onValueChange}>
        Accept
      </GdCheckbox>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(checkbox);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders the children label text', () => {
    render(<GdCheckbox>Accept terms</GdCheckbox>);
    expect(screen.getByText('Accept terms')).toBeTruthy();
  });
});
