import { render, screen } from '@testing-library/react-native';
import { GdTypography } from './GdTypography';

describe('GdTypography', () => {
  it('renders its children text', () => {
    render(<GdTypography variant="p">Hello world</GdTypography>);
    expect(screen.getByText('Hello world')).toBeTruthy();
  });

  it('omits inherit-valued style fields for the span variant instead of passing the literal "inherit"', () => {
    render(<GdTypography variant="span">Inherited</GdTypography>);
    const style = screen.getByText('Inherited').props.style;
    expect(style.fontSize).toBeUndefined();
    expect(style.fontWeight).toBeUndefined();
    expect(style.lineHeight).toBeUndefined();
  });

  it('resolves numeric fontSize/lineHeight for a heading variant, not a CSS px-string', () => {
    render(<GdTypography variant="h1">Heading</GdTypography>);
    const style = screen.getByText('Heading').props.style;
    expect(style.fontSize).toBe(48);
    expect(style.lineHeight).toBe(56);
    expect(typeof style.fontSize).toBe('number');
  });

  it("maps textDecoration to RN's textDecorationLine", () => {
    render(
      <GdTypography variant="p" styleVariant="underline">
        Underlined
      </GdTypography>
    );
    expect(screen.getByText('Underlined').props.style.textDecorationLine).toBe('underline');
  });

  it('overlays multiple styleVariants in order', () => {
    render(
      <GdTypography variant="p" styleVariant={['bold', 'uppercase']}>
        Loud
      </GdTypography>
    );
    const style = screen.getByText('Loud').props.style;
    expect(style.fontWeight).toBe('700');
    expect(style.textTransform).toBe('uppercase');
  });
});
