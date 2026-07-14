import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Label } from './';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Label className="test-text-label-class">{COMPONENT_NAME}</Label>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD renders the label with children', () => {
    render(<Label>Label</Label>);
    const labelElement = screen.getByText(/Label/i);
    expect(document.body.contains(labelElement)).toBe(true);
  });

  it('SHOULD applies custom styles', () => {
    render(<Label styles={{ backgroundColor: 'rgb(255, 0, 0)' }}>Label</Label>);
    const labelElement = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(labelElement);
    expect(computedStyle.backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('SHOULD calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Label onClick={handleClick}>Click Me</Label>);
    const labelElement = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(labelElement);
    expect(handleClick).toHaveBeenCalled();
  });
});
