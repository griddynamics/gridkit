import { describe, it, expect } from 'vitest';
import { render, screen } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Loader } from '.';

describe(COMPONENT_NAME, () => {
  it('SHOULD match default snapshot', () => {
    const { container } = render(<Loader />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match Dots snapshot', () => {
    const { container } = render(<Loader name="dots" />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD match snapshot & render correctly with children', () => {
    const customLoaderText = 'Custom loader';
    const { container } = render(<Loader className="loader-custom-class">{customLoaderText}</Loader>);

    const childElement = screen.getByText(new RegExp(`${customLoaderText}`, 'i'));
    expect(document.body.contains(childElement)).toBe(true);
    expect(container).toMatchSnapshot();
  });
});
