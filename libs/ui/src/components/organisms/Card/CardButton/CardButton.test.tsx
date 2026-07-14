import { expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { CardButton } from './CardButton';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<CardButton>Line 1</CardButton>);
    expect(container).toMatchSnapshot();
  });
  it('SHOULD call onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<CardButton onClick={handleClick}>Click Test</CardButton>);

    const button = screen.getByTestId(COMPONENT_NAME).firstChild;
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
