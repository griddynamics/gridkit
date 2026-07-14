import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@testUtils';
import { LinkVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import { Link } from './Link';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(
      <Link ariaLabel="test-label" className="test-text-label-class" href="//www.dummy.net">
        Link
      </Link>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match variant Secondary snapshot', () => {
    const { container } = render(
      <Link variant={LinkVariant.Secondary} ariaLabel="test-label" className="test-text-label-class" onClick={vi.fn()}>
        Button Link
      </Link>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD applies custom styles', () => {
    render(<Link styles={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>Label</Link>);
    const link = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(link);
    expect(computedStyle.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('SHOULD size the link to its content so underline does not stretch across the container', () => {
    render(<Link href="/dashboard">Go to Dashboard</Link>);

    const link = screen.getByTestId(COMPONENT_NAME);

    expect(link).toHaveStyle({
      alignSelf: 'flex-start',
      display: 'inline-flex',
      width: 'fit-content',
    });
  });

  it('SHOULD handle internal link click', () => {
    const handleClick = vi.fn();
    render(<Link onClick={handleClick}>Internal Link</Link>);
    const link = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(link);
    expect(handleClick).toHaveBeenCalled();
  });

  it('SHOULD NOT handle click for disabled link', () => {
    const handleClick = vi.fn();
    render(
      <Link onClick={handleClick} disabled>
        Internal Link
      </Link>
    );
    const link = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(link);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
