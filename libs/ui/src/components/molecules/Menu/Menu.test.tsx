import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { Menu } from './Menu';
import { COMPONENT_NAME } from './constants';
import { DropdownItem } from '../DropdownItem';

describe(COMPONENT_NAME, () => {
  const mockOnSelect = vi.fn();
  const mockContent = (
    <>
      <DropdownItem name="Menu 1" value="1" data-testid="menu-item" />
      <DropdownItem name="Menu 2" value="2" data-testid="menu-item" />
    </>
  );

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD render trigger (children)', () => {
    render(
      <Menu content={mockContent}>
        <span>Open menu</span>
      </Menu>
    );
    expect(screen.getByText(/Open menu/i)).toBeDefined();
  });

  it('SHOULD open menu on trigger click', () => {
    render(
      <Menu content={mockContent}>
        <span>Open menu</span>
      </Menu>
    );
    fireEvent.click(screen.getByText(/Open menu/i));
    expect(screen.getByText(/Menu 1/i)).toBeDefined();
    expect(screen.getByText(/Menu 2/i)).toBeDefined();
  });

  it('SHOULD close menu on second trigger click', () => {
    render(
      <Menu content={mockContent}>
        <span>Open menu</span>
      </Menu>
    );
    const trigger = screen.getByText(/Open menu/i);
    fireEvent.click(trigger);
    expect(screen.getByText(/Menu 1/i)).toBeDefined();
    fireEvent.click(trigger);
    expect(screen.queryByText(/Menu 1/i)).toBeNull();
  });

  it('SHOULD call onSelect and close menu when item is clicked', () => {
    render(
      <Menu content={<DropdownItem value="1" name="Menu 1" data-testid="menu-item" />} onSelect={mockOnSelect}>
        <span>Open menu</span>
      </Menu>
    );
    fireEvent.click(screen.getByText(/Open menu/i));
    const item = screen.getByText(/Menu 1/i);
    fireEvent.click(item);
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      event: expect.any(Object),
      data: { value: '1', name: 'Menu 1' },
    });
    expect(screen.queryByText(/Menu 1/i)).toBeNull();
  });

  it('SHOULD close menu on click outside', () => {
    render(
      <div>
        <Menu content={mockContent}>
          <span>Open menu</span>
        </Menu>
        <span data-testid="outside">Outside</span>
      </div>
    );
    fireEvent.click(screen.getByText(/Open menu/i));
    expect(screen.getByText(/Menu 1/i)).toBeDefined();
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText(/Menu 1/i)).toBeNull();
  });

  it('SHOULD close menu on Escape key', () => {
    render(
      <Menu content={mockContent}>
        <span>Open menu</span>
      </Menu>
    );
    fireEvent.click(screen.getByText(/Open menu/i));
    expect(screen.getByText(/Menu 1/i)).toBeDefined();
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText(/Menu 1/i)).toBeNull();
  });
});
