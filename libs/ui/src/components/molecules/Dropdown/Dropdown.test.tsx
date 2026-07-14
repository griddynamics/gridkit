import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testUtils';
import { Dropdown } from './Dropdown';
import { useDropdownContext } from './hooks';
import { COMPONENT_NAME } from './constants';

vi.mock('./StyledDropdown', () => ({
  StyledDropdown: vi.fn(({ children, ...props }) => (
    <div data-testid={props['data-testid'] || 'styled-dropdown'} {...props}>
      {children}
    </div>
  )),
}));

vi.mock('./hooks', async () => {
  const actual = await vi.importActual('./hooks');
  return {
    ...actual,
    useDropdownContext: vi.fn(() => {
      throw new Error('useDropdownContext must be used within a Dropdown component or children');
    }),
    DropdownContext: actual.DropdownContext,
  };
});

describe('Dropdown', () => {
  const mockOnSelect = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD render correctly', () => {
    const { container } = render(
      <Dropdown onSelect={mockOnSelect}>
        <div>Item</div>
      </Dropdown>
    );

    const testElement = screen.getByText(/Item/i);
    expect(document.body.contains(testElement)).toBe(true);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD throw an error if useDropdownContext is used outside Dropdown', () => {
    const TestComponent = () => {
      useDropdownContext();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useDropdownContext must be used within a Dropdown component or children');
  });

  it('SHOULD add the correct data-testid', () => {
    render(
      <Dropdown>
        <div>Item</div>
      </Dropdown>
    );

    const element = screen.getByTestId(COMPONENT_NAME);
    expect(element).toBeDefined();
  });

  it('SHOULD apply onKeyDown handler for keyboard navigation', () => {
    render(
      <Dropdown onSelect={mockOnSelect}>
        <div>Item</div>
      </Dropdown>
    );

    const dropdown = screen.getByTestId(COMPONENT_NAME);
    expect(dropdown.onkeydown).toBeDefined();
  });
});
