import { describe, it, expect } from 'vitest';

import { render, screen } from '@testUtils';
import { WrapperVariant } from '@types';

import { COMPONENT_NAME } from './constants';
import { Wrapper } from '.';

describe(COMPONENT_NAME, () => {
  it('SHOULD match snapshot', () => {
    const { container } = render(<Wrapper variant={WrapperVariant.Section} classNames="wrapper-custom-class" />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match snapshot & render correctly with children', () => {
    const { container } = render(<Wrapper variant={WrapperVariant.Section}>Hello World</Wrapper>);

    const childElement = screen.getByText(/Hello World/i);
    expect(document.body.contains(childElement)).toBe(true);
    expect(container).toMatchSnapshot();
  });
});
