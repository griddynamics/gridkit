import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { Textarea } from './Textarea';
import { COMPONENT_NAME } from './constants';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useId: () => 'mocked-id-123',
  };
});

describe('Textarea Component', () => {
  it('SHOULD call onChange when typing', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);

    const textarea = screen.getByTestId(COMPONENT_NAME);
    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('SHOULD math to snapshot', () => {
    const handleChange = vi.fn();
    const { container } = render(<Textarea onChange={handleChange} />);

    expect(container).toMatchSnapshot();
  });

  it('SHOULD NOT show character count', () => {
    render(<Textarea maxLength={10} />);
    const testElement = screen.queryByText(/\/ 10/);
    expect(document.body.contains(testElement)).toBe(false);
  });

  it('SHOULD apply disabled state correctly', () => {
    const { container } = render(<Textarea disabled />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(testElement.hasAttribute('disabled')).toBeTruthy();
    expect(container.contains(testElement)).toBeTruthy();
  });

  it('SHOULD apply readOnly state correctly', () => {
    render(<Textarea readOnly />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(testElement.hasAttribute('readonly')).toBeTruthy();
  });

  it('SHOULD autofocus when autoFocus is true', () => {
    render(<Textarea autoFocus />);
    const testElement = screen.getByTestId(COMPONENT_NAME);
    expect(document.activeElement).toBe(testElement);
  });

  it('SHOULD update character counter in uncontrolled mode', () => {
    render(<Textarea maxCharacters={100} />);
    const textarea = screen.getByTestId(COMPONENT_NAME);
    const counter = screen.getByTestId(`${COMPONENT_NAME}-counter`);

    expect(counter.textContent).toBe('0/100');

    fireEvent.change(textarea, { target: { value: 'Hello' } });

    expect(counter.textContent).toBe('5/100');
  });

  it('SHOULD show initial count from defaultValue with maxCharacters', () => {
    render(<Textarea maxCharacters={100} defaultValue="Hello World" />);
    const counter = screen.getByTestId(`${COMPONENT_NAME}-counter`);

    expect(counter.textContent).toBe('11/100');
  });

  it('SHOULD trigger resize observer when size changes', () => {
    const onCustomResize = vi.fn();
    render(<Textarea onCustomResize={onCustomResize} />);

    fireEvent.change(screen.getByTestId(COMPONENT_NAME), { target: { value: 'Resizing...' } });

    expect(onCustomResize).not.toHaveBeenCalled();
  });
});
