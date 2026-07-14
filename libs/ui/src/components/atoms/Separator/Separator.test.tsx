import '@testing-library/jest-dom';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testUtils';
import { colors } from '@tokens';

import { COMPONENT_NAME } from './constants';
import { Separator } from './Separator';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const props = {};
    const { container } = render(<Separator {...props} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD prefer theme tokens for separator and label colors', () => {
    render(<Separator label="OR" color="border.error" labelColor="text.warning" />);

    const separator = screen.getByTestId(COMPONENT_NAME);
    const [line] = separator.querySelectorAll('div');
    const label = screen.getByText('OR');

    expect(line).toHaveStyle({ borderTopColor: colors.border.error });
    expect(label).toHaveStyle({ color: colors.text.warning });
  });

  it('SHOULD keep vertical separator lines visible when rendering a centered label', () => {
    render(<Separator orientation="vertical" length="40px" label="OR" />);

    const separator = screen.getByTestId(COMPONENT_NAME);
    const lines = separator.querySelectorAll('div');

    expect(separator).toHaveStyle({ height: '40px' });
    expect(separator).toHaveStyle({ gap: '4px' });
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveStyle({ borderLeftStyle: 'solid', flex: '1' });
    expect(lines[1]).toHaveStyle({ borderLeftStyle: 'solid', flex: '1' });
  });

  it('SHOULD render the separator wrapper and line segments as span when requested', () => {
    render(<Separator as="span" label="OR" />);

    const separator = screen.getByTestId(COMPONENT_NAME);
    const lines = Array.from(separator.children).filter((element) => element.textContent !== 'OR');

    expect(separator.tagName).toBe('SPAN');
    expect(lines).toHaveLength(2);
    expect(lines[0]?.tagName).toBe('SPAN');
    expect(lines[1]?.tagName).toBe('SPAN');
  });
});
