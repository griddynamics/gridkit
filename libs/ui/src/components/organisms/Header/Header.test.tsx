import '@testing-library/jest-dom';

import { describe, it, vi } from 'vitest';
import { render, screen } from '@testUtils';
import { colors } from '@tokens';

import { Header } from './Header';
import { COMPONENT_NAME } from './constants';

vi.mock('@hooks/useMediaQuery', () => {
  return {
    useMediaQuery: vi.fn(() => true),
  };
});

describe('Header', () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Header showSearch={true} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD prefer theme tokens for bgColor', () => {
    render(<Header bgColor="bg.fill.info.primary.default" />);

    expect(screen.getByTestId(COMPONENT_NAME)).toHaveStyle({
      backgroundColor: colors.bg.fill.info.primary.default,
    });
  });
});
