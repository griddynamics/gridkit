import { ReactNode } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { SelectContext } from '../../atoms/Select/hooks';
import { DropdownContext } from '../Dropdown/hooks';
import { SelectContextType } from '../../atoms/Select/Select.types';
import { COMPONENT_NAME } from './constants';
import { DropdownItem } from './DropdownItem';

vi.mock('../Dropdown/hooks', async () => {
  const actual = await vi.importActual<any>('../Dropdown/hooks');
  return {
    ...actual,
    useDropdownContext: vi.fn(() => ({
      onSelect: vi.fn(),
    })),
    DropdownContext: actual.DropdownContext,
  };
});

vi.mock('../../atoms/Select/Select', async () => {
  const actual = await vi.importActual<any>('../../atoms/Select/Select');
  return {
    ...actual,
    useSelectContext: () => ({
      value: undefined,
      itemIdentifier: (selected: unknown, current: unknown) => selected === current,
    }),
    SelectContext: actual.SelectContext,
  };
});

vi.mock('./StyledDropdownItem', () => ({
  StyledDropdownItem: vi.fn(({ children, ...props }) => (
    <div data-testid="styled-dropdown-item" {...props}>
      {children}
    </div>
  )),
}));

describe('DropdownItem', () => {
  const mockOnSelect = vi.fn();
  const mockValue = 'testValue';
  const mockName = 'testName';

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: ReactNode, contextValue: Partial<SelectContextType> = {}) => {
    return render(
      <SelectContext.Provider
        value={{
          value: undefined,
          itemIdentifier: (selected, current) => selected.value === current.value,
          ...contextValue,
        }}
      >
        {ui}
      </SelectContext.Provider>
    );
  };

  it('SHOULD render correctly', () => {
    const { container } = renderWithProviders(
      <DropdownItem value={mockValue} name={mockName}>
        Item
      </DropdownItem>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD call onSelect when clicked', () => {
    renderWithProviders(
      <DropdownItem value={mockValue} name={mockName} onSelect={mockOnSelect}>
        Item
      </DropdownItem>
    );

    fireEvent.click(screen.getByText('Item'));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      event: expect.any(Object),
      data: { value: mockValue, name: mockName },
    });
  });

  it('SHOULD do not call onDropdownSelect if undefined and falls back to onSelect', () => {
    render(
      <DropdownContext.Provider value={{ onSelect: undefined }}>
        <SelectContext.Provider
          value={{
            value: undefined,
            itemIdentifier: (selected: unknown, current: unknown) => selected === current,
          }}
        >
          <DropdownItem value={mockValue} name={mockName} onSelect={mockOnSelect}>
            Item
          </DropdownItem>
        </SelectContext.Provider>
      </DropdownContext.Provider>
    );

    fireEvent.click(screen.getByText('Item'));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      event: expect.any(Object),
      data: {
        value: mockValue,
        name: mockName,
      },
    });
  });

  it('SHOULD NOT call onSelect when disabled item is clicked', () => {
    renderWithProviders(
      <DropdownItem value={mockValue} name={mockName} onSelect={mockOnSelect} disabled>
        Item
      </DropdownItem>
    );

    fireEvent.click(screen.getByText('Item'));

    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('SHOULD add have negative tab index in case item disabled', () => {
    renderWithProviders(
      <DropdownItem value={mockValue} name={mockName} disabled>
        Item
      </DropdownItem>
    );

    const element = screen.getByTestId(COMPONENT_NAME);

    expect(element.getAttribute('tabIndex')).toBe('-1');
  });

  it('SHOULD add active class when item is selected', () => {
    renderWithProviders(
      <DropdownItem value={mockValue} name={mockName}>
        Item
      </DropdownItem>,
      { value: { name: mockValue, value: mockValue } }
    );

    const element = screen.getByTestId(COMPONENT_NAME);

    expect(element.className).toContain('active');
  });

  it('SHOULD use itemIdentifier to determine if item is active', () => {
    const customIdentifier = vi.fn((selected, current) => selected.value === current.value);

    renderWithProviders(
      <DropdownItem value={mockValue} name={mockName}>
        Item
      </DropdownItem>,
      {
        value: { name: mockName, value: mockValue },
        itemIdentifier: customIdentifier,
      }
    );

    const element = screen.getByTestId(COMPONENT_NAME);

    expect(element.className).toContain('active');
    expect(customIdentifier).toHaveBeenCalledWith(
      { name: mockName, value: mockValue },
      { name: mockName, value: mockValue }
    );
  });
});
