import { vitest } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Toggle } from '.';

describe(COMPONENT_NAME, () => {
  const items = ['Option 1', 'Option 2', 'Option 3'];
  const onValueChange = vitest.fn();

  beforeEach(() => {
    onValueChange.mockClear();
  });

  it('SHOULD renders all toggle items', () => {
    const { container } = render(<Toggle items={items} value={items[0]} onValueChange={onValueChange} />);

    expect(container).toMatchSnapshot();
    items.forEach((item) => {
      expect(document.body.textContent).toContain(item);
    });
  });

  it('SHOULD call onValueChange when an item is clicked', () => {
    render(<Toggle items={items} value={items[0]} onValueChange={onValueChange} />);
    const option = screen.getByText(items[1]);
    fireEvent.click(option);
    expect(onValueChange).toHaveBeenCalledWith(items[1]);
  });

  it('SHOULD do not trigger onValueChange when disabled', () => {
    render(<Toggle items={items} value={items[0]} onValueChange={onValueChange} disabled={true} />);
    const option = screen.getByText(items[1]);
    fireEvent.click(option);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('SHOULD render custom item content if provided', () => {
    render(
      <Toggle
        items={items}
        value={items[0]}
        onValueChange={onValueChange}
        disabled={true}
        renderItemContent={(item) => `Custom ${item}`}
      />
    );
    expect(document.body.textContent).toContain(`Custom ${items[0]}`);
  });
});
