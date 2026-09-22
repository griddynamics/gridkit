import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { ActivityIndicator, Pressable, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { GdButton } from './GdButton';
import { FIRA_SANS_FACES } from '../../utils/toFontFamily';

type FlatStyle = ViewStyle & TextStyle;

/** Pressable's `style` is a `({ pressed }) => ViewStyle[]` function, so the host node carries an
 *  array rather than a plain object. Flatten before asserting. */
const flat = (style: unknown): FlatStyle => (StyleSheet.flatten(style as never) ?? {}) as FlatStyle;
const styleOf = (node: { props: { style?: unknown } }): FlatStyle => flat(node.props.style);

describe('GdButton', () => {
  it('renders its children as the button label', () => {
    render(<GdButton>Submit</GdButton>);
    expect(screen.getByText('Submit')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('fires onPress when pressed', () => {
    const onPress = jest.fn();
    render(<GdButton onPress={onPress}>Submit</GdButton>);

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire onPress when disabled, and reports it to assistive tech', () => {
    const onPress = jest.fn();
    render(
      <GdButton disabled onPress={onPress}>
        Submit
      </GdButton>
    );

    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toMatchObject({ disabled: true });

    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('swaps the label for a spinner while loading, and blocks presses', () => {
    const onPress = jest.fn();
    render(
      <GdButton isLoading onPress={onPress}>
        Submit
      </GdButton>
    );

    // `isLoading` implies disabled — a button mid-request must not accept a second press.
    expect(screen.queryByText('Submit')).toBeNull();
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({ busy: true, disabled: true });

    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies the resolved primary variant container color', () => {
    render(<GdButton variant="primary">Submit</GdButton>);
    expect(styleOf(screen.getByRole('button')).backgroundColor).toBe('#FFB800');
  });

  it('applies the disabled container color over the variant color', () => {
    render(
      <GdButton variant="primary" disabled>
        Submit
      </GdButton>
    );
    expect(styleOf(screen.getByRole('button')).backgroundColor).toBe('#E5E5E5');
  });

  it('swaps to the active container color while pressed', () => {
    // Pressable's pressed state lives inside RN's Pressability responder machinery, which
    // `fireEvent` does not drive — so exercise the `({ pressed }) => style` function directly.
    // That function is the part this component actually owns.
    render(<GdButton variant="primary">Submit</GdButton>);
    const styleFn = screen.UNSAFE_getByType(Pressable).props.style;

    expect(flat(styleFn({ pressed: false })).backgroundColor).toBe('#FFB800');
    expect(flat(styleFn({ pressed: true })).backgroundColor).toBe('#FF8700');
  });

  it('does not apply the active color while disabled', () => {
    render(
      <GdButton variant="primary" disabled>
        Submit
      </GdButton>
    );
    const styleFn = screen.UNSAFE_getByType(Pressable).props.style;

    expect(flat(styleFn({ pressed: true })).backgroundColor).toBe('#E5E5E5');
  });

  it("splits the resolver's two-value CSS padding shorthand into RN's separate axes", () => {
    // `resolved.padding` is the string '8px 16px'; RN has no shorthand padding string.
    render(<GdButton>Submit</GdButton>);
    const style = styleOf(screen.getByRole('button'));

    expect(style.paddingVertical).toBe(8);
    expect(style.paddingHorizontal).toBe(16);
  });

  it('converts a CSS px-string borderWidth to the number RN requires', () => {
    // The seeded type bug: `container.borderWidth` is '1px', not 1. Outlined is the variant that
    // actually carries one.
    render(<GdButton variant="outlined">Submit</GdButton>);
    const style = styleOf(screen.getByRole('button'));

    expect(style.borderWidth).toBe(1);
    expect(typeof style.borderWidth).toBe('number');
    expect(style.borderColor).toBe('#000000');
  });

  it('renders the label with a loadable font face, never a CSS font stack', () => {
    // Regression guard for the CTORNDSD-590 font defect: the resolver returns
    // '"Fira Sans", sans-serif', which matches no native family. The button label uses the
    // medium (500) face, per `resolved.label.fontWeight`.
    render(<GdButton>Submit</GdButton>);
    const labelStyle = styleOf(screen.getByText('Submit'));

    expect(labelStyle.fontFamily).toBe(FIRA_SANS_FACES[500]);
    expect(labelStyle.fontFamily).not.toContain(',');
    expect(labelStyle.fontWeight).toBe('500');
    expect(labelStyle.fontSize).toBe(16);
    expect(labelStyle.color).toBe('#000000');
  });

  it('shows a focus ring on focus and removes it on blur', () => {
    // `fireEvent(node, 'focus')` does not reach Pressable's forwarded handler under RNTL, so
    // invoke the prop the component supplied.
    render(<GdButton>Submit</GdButton>);

    expect(screen.queryByTestId('gd-button-focus-ring')).toBeNull();

    act(() => screen.UNSAFE_getByType(Pressable).props.onFocus());
    expect(screen.getByTestId('gd-button-focus-ring')).toBeTruthy();

    act(() => screen.UNSAFE_getByType(Pressable).props.onBlur());
    expect(screen.queryByTestId('gd-button-focus-ring')).toBeNull();
  });

  it('honours a theme override instead of the resolver fallback', () => {
    render(
      <GdButton variant="primary" theme={{ colors: { bg: { fill: { primary: '#123456' } } } }}>
        Submit
      </GdButton>
    );
    expect(styleOf(screen.getByRole('button')).backgroundColor).toBe('#123456');
  });
});
