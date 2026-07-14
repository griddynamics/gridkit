import { vi } from 'vitest';
import { render, screen } from '@testUtils';

import { SnackbarManager } from './SnackbarManager';
import { COMPONENT_SNACKBAR_MANAGER_NAME } from './constants';

// Mock the useTheme hook
vi.mock('@hooks', async () => {
  const actual = await vi.importActual('@hooks');
  return {
    ...actual,
    useTheme: () => ({
      theme: {
        snackbar: {},
      },
    }),
  };
});

describe(COMPONENT_SNACKBAR_MANAGER_NAME, () => {
  it('SHOULD render without crashing', () => {
    const { container } = render(<SnackbarManager />);
    expect(screen.queryByTestId(COMPONENT_SNACKBAR_MANAGER_NAME)).toBeNull();

    expect(container).toMatchSnapshot();
  });
});
