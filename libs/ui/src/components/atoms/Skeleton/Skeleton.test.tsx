import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';
import { colors } from '@tokens';

import { COMPONENT_NAME } from './constants';
import { Skeleton } from './Skeleton';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Skeleton className="skeleton-custom-class" />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match snapshot & render correctly with children', () => {
    const customText = 'Custom text';
    const { container } = render(<Skeleton>{customText}</Skeleton>);

    const childElement = screen.getByText(new RegExp(`${customText}`, 'i'));
    expect(document.body.contains(childElement)).toBe(true);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD resolve theme-aware background colors and forward rest props', () => {
    render(
      <Skeleton
        variant="rectangular"
        width="120px"
        height="40px"
        backgroundColor="theme.palette.success.main"
        animationName={null}
        aria-label="Loading skeleton"
        data-state="loading"
      />
    );

    const skeleton = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(skeleton);

    expect(skeleton).toHaveAttribute('aria-label', 'Loading skeleton');
    expect(skeleton).toHaveAttribute('data-state', 'loading');
    expect(skeleton).toHaveStyle({ backgroundColor: colors.bg.fill.success.primary.default });
    expect(computedStyle.borderRadius).toBe('0px');
    expect(computedStyle.animationName).toBe('');
  });
});
