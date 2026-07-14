import { describe, expect, it } from 'vitest';
import { render, screen } from '@testUtils';

import { FlexContainer } from './FlexContainer';
import { COMPONENT_NAME } from './constants';

describe(COMPONENT_NAME, () => {
  it('SHOULD renders children correctly', () => {
    const { container } = render(
      <FlexContainer>
        <p>Test Content</p>
      </FlexContainer>
    );
    expect(container).toMatchSnapshot();
  });

  it('SHOULD merges custom className correctly', () => {
    render(<FlexContainer className="custom-class" />);
    const div = screen.getByTestId(COMPONENT_NAME) as HTMLDivElement;
    expect(div.className.includes('custom-class')).toBe(true);
  });

  it('SHOULD allows custom inline styles', () => {
    render(<FlexContainer styles={{ backgroundColor: 'rgb(255, 0, 0)' }} />);
    const element = screen.getByTestId(COMPONENT_NAME);
    const computedStyle = window.getComputedStyle(element);
    expect(computedStyle.backgroundColor).toBe('rgb(255, 0, 0)');
  });
});
