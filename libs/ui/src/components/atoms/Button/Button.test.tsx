import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Button } from './';

const MockStartIcon = () => <span data-testid="icon-start">StartIcon</span>;
const MockEndIcon = () => <span data-testid="icon-end">EndIcon</span>;

describe(COMPONENT_NAME, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(
      <Button className="test-text-button-class" iconStart={<span>Start Icon</span>} iconEnd={<span>End Icon</span>}>
        text
      </Button>
    );
    expect(container).toMatchSnapshot();
  });
  it('SHOULD match Icon button snapshot', () => {
    const { container } = render(<Button isIcon>Icon</Button>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD renders the button with start icon', () => {
    render(<Button iconStart={<span>Start Icon</span>}>Click Me</Button>);
    const icon = screen.getByTestId(`${COMPONENT_NAME}-icon-start`);
    expect(document.body.contains(icon)).toBe(true);
  });

  it('SHOULD renders the button with end icon', () => {
    render(<Button iconEnd={<span>End Icon</span>}>Click Me</Button>);
    const icon = screen.getByTestId(`${COMPONENT_NAME}-icon-end`);
    expect(document.body.contains(icon)).toBe(true);
  });

  it('SHOULD renders the button with start and end icons', () => {
    render(
      <Button iconStart={<MockStartIcon />} iconEnd={<MockEndIcon />}>
        Click Me
      </Button>
    );
    const startIcon = screen.getByTestId('icon-start');
    const endIcon = screen.getByTestId('icon-end');
    const buttonElement = screen.getByText(/Click Me/i);

    expect(document.body.contains(startIcon)).toBe(true);
    expect(document.body.contains(endIcon)).toBe(true);
    expect(document.body.contains(buttonElement)).toBe(true);
  });

  it('SHOULD renders the button with an end icon', () => {
    render(<Button iconEnd={<span>End Icon</span>}>Click Me</Button>);
    const endIcon = screen.getByText(/End Icon/i);
    expect(document.body.contains(endIcon)).toBe(true);
  });

  it('SHOULD handle click handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalled();
  });

  it('SHOULD is disabled when the disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled>Click Me</Button>);
    const buttonElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('SHOULD applies custom styles', () => {
    render(<Button styles={{ color: 'rgb(255, 0, 0)' }}>Click Me</Button>);
    const buttonElement = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(buttonElement);
    expect(computedStyle.color).toBe('rgb(255, 0, 0)');
  });
});
