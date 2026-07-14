import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Badge } from './';

describe(COMPONENT_NAME, () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('SHOULD match snapshot', () => {
    const { container } = render(<Badge className="test-badge-class">Badge Text</Badge>);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render badge with start icon', () => {
    render(<Badge iconStart={<i>Icon</i>}>Badge with Icon</Badge>);
    const startIcon = screen.getByTestId(`${COMPONENT_NAME}-icon-start`);
    expect(startIcon).toBeDefined();
  });

  it('SHOULD render badge with end icon', () => {
    render(<Badge iconEnd={<i>Icon</i>}>Badge with Icon</Badge>);
    const endIcon = screen.getByTestId(`${COMPONENT_NAME}-icon-end`);
    expect(endIcon).toBeDefined();
  });
});
