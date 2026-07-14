import { expect, vi } from 'vitest';
import { render } from '@testUtils';

import { ImageProps } from '@components';

import { COMPONENT_NAME } from './constants';
import { CardImage } from './CardImage';

describe(COMPONENT_NAME, () => {
  const defaultProps: ImageProps = {
    id: 'test-image',
    src: 'https://picsum.photos/150/150',
    alt: 'Test image',
    width: 150,
    height: 150,
    className: 'custom-class',
    placeholder: 'Loading...',
    caption: 'Test Caption',
    onClick: vi.fn(),
    objectFit: 'cover',
  };

  it('SHOULD match snapshot', () => {
    const { container } = render(<CardImage {...defaultProps}>Children</CardImage>);
    expect(container).toMatchSnapshot();
  });
});
