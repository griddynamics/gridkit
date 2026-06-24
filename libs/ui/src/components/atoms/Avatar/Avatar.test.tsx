import '@testing-library/jest-dom';
import '@testing-library/dom';
import { expect } from 'vitest';

import { render, screen } from '@testUtils';
import { Icon } from '@components';
import { colors } from '@tokens';
import { SizeVariant } from '@types';

import { BADGE_COMPONENT, COMPONENT_NAME, FALLBACK_COMPONENT } from './constants';
import { Avatar } from './Avatar';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Avatar sizeVariant={SizeVariant.Xl} fallbackComponent="DC" />);
    expect(container).toMatchSnapshot();
  });
  it('SHOULD render Avatar component', () => {
    render(<Avatar sizeVariant={SizeVariant.Xl} fallbackComponent="DC" />);
    const avatar = screen.getByTestId(COMPONENT_NAME);
    expect(avatar).toBeInTheDocument();
  });
  it('SHOULD render Fallback component if initials passed', () => {
    render(<Avatar sizeVariant={SizeVariant.Xl} fallbackComponent="DC" />);
    const fallbackComponent = screen.getByTestId(FALLBACK_COMPONENT);
    expect(fallbackComponent).toBeInTheDocument();
  });
  it('SHOULD render fallback content if no src passed', () => {
    render(<Avatar sizeVariant={SizeVariant.Xl} fallbackComponent="DC" />);
    const fallbackComponent = screen.getByTestId(FALLBACK_COMPONENT);
    expect(fallbackComponent).toHaveTextContent('DC');
  });
  it('SHOULD render fallback component if no src passed', () => {
    const fallbackId = 'CustomFallbackId';
    render(
      <Avatar
        sizeVariant={SizeVariant.Xl}
        fallbackComponent={
          <div data-testid={fallbackId}>
            <Icon name="person" width={20} height={20} fill="#646464" />
          </div>
        }
      />
    );
    const fallbackComponent = screen.getByTestId(fallbackId);
    expect(fallbackComponent).toBeInTheDocument();
  });
  it('SHOULD render badge', () => {
    render(<Avatar sizeVariant={SizeVariant.Xl} withBadge fallbackComponent="DC" />);
    const badgeComponent = screen.getByTestId(BADGE_COMPONENT);
    expect(badgeComponent).toBeInTheDocument();
  });

  it('SHOULD prefer theme tokens for avatar background and badge colors', () => {
    render(
      <Avatar
        sizeVariant={SizeVariant.Xl}
        fallbackComponent="DC"
        backgroundColor="bg.fill.info.primary.default"
        withBadge
        badgeColor="bg.fill.success.primary.default"
      />
    );

    const avatar = screen.getByTestId(COMPONENT_NAME);
    const imageWrapper = avatar.firstElementChild as HTMLElement;
    const badgeComponent = screen.getByTestId(BADGE_COMPONENT);

    expect(imageWrapper).toHaveStyle({ backgroundColor: colors.bg.fill.info.primary.default });
    expect(badgeComponent).toHaveStyle({ backgroundColor: colors.bg.fill.success.primary.default });
  });
});
