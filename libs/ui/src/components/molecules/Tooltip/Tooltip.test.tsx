import { describe, it, expect } from 'vitest';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { render, screen, fireEvent, waitFor } from '@testUtils';

import Tooltip from './Tooltip';
import { COMPONENT_NAME } from './constants';

let user: UserEvent;

beforeEach(() => {
  user = userEvent.setup();
});
describe(`${COMPONENT_NAME} Component`, () => {
  it('SHOULD render tooltip content when mouse enters the element', async () => {
    const { container } = render(<Tooltip content="Tooltip content">Hover over me</Tooltip>);

    const tooltipTrigger = screen.getByText('Hover over me');
    fireEvent.mouseEnter(tooltipTrigger);

    await waitFor(() => {
      expect(screen.getByTestId(COMPONENT_NAME)).not.toBeNull();
    });

    expect(container).toMatchSnapshot();
  });

  it('SHOULD hides tooltip content when mouse leaves the element', async () => {
    render(<Tooltip content="Tooltip content">Hover over me</Tooltip>);

    const tooltipTrigger = screen.getByText('Hover over me');
    fireEvent.mouseEnter(tooltipTrigger);

    await waitFor(() => {
      expect(screen.getByTestId(COMPONENT_NAME)).not.toBeNull();
    });

    const tooltip = screen.getByTestId(COMPONENT_NAME);
    fireEvent.mouseLeave(tooltipTrigger);

    await waitFor(() => {
      expect(document.body.contains(tooltip)).not.toBe(true);
    });
  });

  it('SHOULD apply the correct class based on position prop', async () => {
    render(
      <Tooltip content="Tooltip content" position="bottom">
        Hover over me
      </Tooltip>
    );

    const tooltipTrigger = screen.getByText('Hover over me');
    fireEvent.mouseEnter(tooltipTrigger);

    await waitFor(() => {
      expect(screen.getByTestId(COMPONENT_NAME)).not.toBeNull();
    });

    const tooltip = screen.getByTestId(COMPONENT_NAME);
    expect(tooltip.classList.contains('tooltip-bottom')).toBe(true);
  });

  it('SHOULD respect the delay before showing the tooltip', async () => {
    render(
      <Tooltip content="Tooltip content" delay={500}>
        Hover over me
      </Tooltip>
    );

    const tooltipTrigger = screen.getByText('Hover over me');

    fireEvent.mouseEnter(tooltipTrigger);

    expect(screen.queryByTestId(COMPONENT_NAME)).toBeNull();

    await waitFor(
      () => {
        expect(screen.getByTestId(COMPONENT_NAME)).not.toBeNull();
      },
      { timeout: 1000 }
    );
  });

  it('SHOULD hide tooltip when Escape key is pressed', async () => {
    render(<Tooltip content="Tooltip content">Hover over me</Tooltip>);

    const tooltipTrigger = screen.getByText('Hover over me');
    fireEvent.mouseEnter(tooltipTrigger);

    await waitFor(() => {
      expect(screen.getByTestId(COMPONENT_NAME)).not.toBeNull();
    });

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByTestId(COMPONENT_NAME)).toBeNull();
    });
  });

  it('SHOULD hide tooltip when clicking outside', async () => {
    render(
      <>
        <Tooltip content="Tooltip content">Hover over me</Tooltip>
        <div data-testid="outside-element">Outside element</div>
      </>
    );

    const tooltipTrigger = screen.getByText('Hover over me');
    fireEvent.mouseEnter(tooltipTrigger);

    await waitFor(() => {
      expect(screen.getByTestId(COMPONENT_NAME)).not.toBeNull();
    });

    // Click outside
    const outsideElement = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outsideElement);

    await waitFor(() => {
      expect(screen.queryByTestId(COMPONENT_NAME)).toBeNull();
    });
  });
});
