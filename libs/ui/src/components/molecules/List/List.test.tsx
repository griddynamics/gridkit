import { expect, it } from 'vitest';
import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { List } from '.';

describe(COMPONENT_NAME, () => {
  const items = ['Item 1', 'Item 2', 'Item 3'];

  it('SHOULD match snapshot', () => {
    const { container } = render(<List items={items} />);
    items.forEach((item) => {
      expect(document.body.contains(screen.getByText(item))).toBe(true);
    });
    expect(container).toMatchSnapshot();
  });

  it('applies custom styles correctly', () => {
    const customStyles = { color: 'rgb(255, 0, 0)' };
    render(<List items={items} styles={customStyles} />);
    const element = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(element);

    expect(computedStyle.color).toBe('rgb(255, 0, 0)');
  });

  it('SHOULD does not render when items array is empty', () => {
    const { container } = render(<List items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
