import { describe, expect, vi } from 'vitest';
import { render, screen } from '@testUtils';
import { SnackbarVariant } from '@types';

import { Snackbar } from './Snackbar';
import { COMPONENT_NAME } from './constants';

describe(`${COMPONENT_NAME}`, () => {
  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('SHOULD render the snackbar with correct message and title', () => {
    const { container } = render(
      <Snackbar id="test" title="Test Title" message="This is a test message" onClose={mockOnClose} />
    );

    const snackbarElement = screen.getByText(/Test Title/i);
    expect(document.body.contains(snackbarElement)).toBe(true);
    const snackbarMessageElement = screen.getByText(/This is a test message/i);
    expect(document.body.contains(snackbarMessageElement)).toBe(true);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render the correct variant icons', () => {
    const { rerender } = render(
      <Snackbar id="test" title="Test" message="Info Message" variant={SnackbarVariant.Info} />
    );
    const snackbarInfoElement = screen.getByText(/Info Message/i);
    expect(document.body.contains(snackbarInfoElement)).toBe(true);

    rerender(<Snackbar id="test" title="Test" message="Success Message" variant={SnackbarVariant.Success} />);
    const snackbarSuccessElement = screen.getByText(/Success Message/i);
    expect(document.body.contains(snackbarSuccessElement)).toBe(true);
  });

  it('SHOULD render a custom icon when provided', () => {
    render(
      <Snackbar id="test" title="Custom Icon" message="With icon" icon={<span data-testid="custom-icon">🔔</span>} />
    );

    const customIconElement = screen.getByTestId(/custom-icon/i);
    expect(document.body.contains(customIconElement)).toBe(true);
  });

  it('SHOULD render action button when provided', () => {
    render(
      <Snackbar
        id="test"
        title="Action Test"
        message="With action"
        action={<button data-testid="action-btn">Retry</button>}
      />
    );

    const actionButtonElement = screen.getByTestId(/action-btn/i);
    expect(document.body.contains(actionButtonElement)).toBe(true);
  });
});
