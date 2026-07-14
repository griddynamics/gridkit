import { ReactNode } from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testUtils';

import { Select } from './Select';
import { SelectContextType, SelectRef } from './Select.types';
import { SelectContext } from './hooks';
import { COMPONENT_NAME } from './constants';

export const MockSelectProvider = ({
  children,
  value = {},
}: {
  children: ReactNode;
  value?: Partial<SelectContextType>;
}) => {
  const contextValue = {
    onSelect: vi.fn(),
    value: undefined,
    itemIdentifier: (selected: unknown, current: unknown) => selected === current,
    ...value,
  };

  return <SelectContext.Provider value={contextValue}>{children}</SelectContext.Provider>;
};

vi.mock('@hooks/useClickOutside', () => ({
  useClickOutside: vi.fn(),
}));

describe(COMPONENT_NAME, () => {
  const mockOnSelect = vi.fn();
  const mockOnChange = vi.fn();
  const mockItems = [
    { value: '1', name: 'Option 1' },
    { value: '2', name: 'Option 2' },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD render correctly', () => {
    render(
      <MockSelectProvider>
        <Select items={mockItems} onSelect={mockOnSelect} />
      </MockSelectProvider>
    );

    const selectButton = screen.getByText(/Select/i);
    expect(document.body.contains(selectButton)).toBe(true);
  });

  it('SHOULD open dropdown on click', () => {
    render(<Select items={mockItems} onSelect={mockOnSelect} />);

    const selectButton = screen.getByText(/Select/i);
    fireEvent.click(selectButton);

    const option1 = screen.getByText(/Option 1/i);
    expect(document.body.contains(option1)).toBe(true);
  });

  it('SHOULD close dropdown on second click', () => {
    render(<Select items={mockItems} onSelect={mockOnSelect} />);

    const selectButton = screen.getByText(/Select/i);
    fireEvent.click(selectButton);
    fireEvent.click(selectButton);

    expect(screen.queryByText(/Option 1/i)).toBeNull();
  });

  it('SHOULD call onSelect when an option is clicked', () => {
    render(<Select items={mockItems} onSelect={mockOnSelect} />);

    fireEvent.click(screen.getByText(/Select/i));
    fireEvent.click(screen.getByText(/Option 1/i));

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith({
      event: expect.any(Object),
      data: {
        value: '1',
        name: 'Option 1',
      },
    });
  });

  it('SHOULD call onChange when an option is clicked', () => {
    render(<Select items={mockItems} onChange={mockOnChange} />);

    fireEvent.click(screen.getByText(/Select/i));
    fireEvent.click(screen.getByText(/Option 1/i));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      value: '1',
      name: 'Option 1',
    });
  });

  it('SHOULD handle imperative methods correctly', () => {
    const ref = { current: null } as { current: SelectRef | null };
    render(<Select ref={ref} items={mockItems} onSelect={mockOnSelect} />);

    expect(ref.current).not.toBeNull();

    // Ensure state updates properly
    act(() => {
      ref.current?.open();
    });

    expect(screen.getByText(/Option 1/i)).toBeDefined();
    expect(document.body.contains(screen.getByText(/Option 1/i))).toBe(true);

    act(() => {
      ref.current?.close();
    });
    expect(screen.queryByText(/Option 1/i)).toBeNull();

    act(() => {
      ref.current?.toggle();
    });

    expect(screen.getByText(/Option 1/i)).toBeDefined();
  });

  it('SHOULD use itemStringifier to display selected value', () => {
    const customStringifier = (value) => `Custom: ${String(value.name)}`;

    render(
      <Select items={mockItems} onSelect={mockOnSelect} value={mockItems[0]} itemStringifier={customStringifier} />
    );

    expect(screen.getByText(/Custom: Option 1/i)).toBeDefined();
  });

  it('SHOULD update internal value when external value changes', () => {
    const { rerender } = render(<Select items={mockItems} onSelect={mockOnSelect} value={mockItems[0]} />);

    expect(screen.getByText(mockItems[0].name)).toBeDefined();

    rerender(<Select items={mockItems} onSelect={mockOnSelect} value={mockItems[1]} />);

    expect(screen.getByText(mockItems[1].name)).toBeDefined();
  });

  it('SHOULD provide correct context values to children', () => {
    let receivedContext: SelectContextType | undefined;

    render(
      <Select items={mockItems} onSelect={mockOnSelect} value={mockItems[0]}>
        <div>
          <SelectContext.Consumer>
            {(context) => {
              receivedContext = context;
              return <div>Test context</div>;
            }}
          </SelectContext.Consumer>
        </div>
      </Select>
    );

    fireEvent.click(screen.getByText(/1/i));

    expect(receivedContext).toBeDefined();
    expect(receivedContext?.value).toBe(mockItems[0]);
    expect(typeof receivedContext?.itemIdentifier).toBe('function');
    expect(typeof receivedContext?.onSelect).toBe('function');
  });
});
