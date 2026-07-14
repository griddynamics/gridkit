import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testUtils';

import { COMPONENT_NAME } from './constants';
import { Image } from './Image';
import type { ImageProps } from './Image.types';

describe('Image component', () => {
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
    const { container } = render(<Image {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('SHOULD render placeholder initially when loading', () => {
    render(<Image {...defaultProps} />);
    const placeholder = screen.getByTestId(`${COMPONENT_NAME}-placeholder`);

    expect(placeholder).not.toBeNull();
    expect(placeholder.textContent).toBe('Loading...');
  });

  it('SHOULD remove placeholder after image loads', () => {
    render(<Image {...defaultProps} />);
    const image = screen.getByTestId(COMPONENT_NAME);
    fireEvent.load(image);

    const placeholder = screen.queryByTestId(`${COMPONENT_NAME}-placeholder`);
    expect(placeholder).toBeNull();
  });

  it('SHOULD remove placeholder on error and show fallback in case it defined', () => {
    render(<Image {...defaultProps} fallbackComponent="fallback" />);
    const image = screen.getByTestId(COMPONENT_NAME);
    fireEvent.error(image);

    const placeholder = screen.queryByTestId(`${COMPONENT_NAME}-placeholder`);
    expect(placeholder).toBeNull();
    expect(screen.getByText('fallback')).toBeDefined();
  });

  it('SHOULD show fallback in case it defined on null/undefined src', () => {
    render(<Image {...defaultProps} src={undefined} fallbackComponent="fallback" />);
    expect(screen.getByText('fallback')).toBeDefined();
  });

  it('SHOULD render caption when provided', () => {
    render(<Image {...defaultProps} />);
    const caption = screen.getByTestId(`${COMPONENT_NAME}-caption`);

    expect(caption).not.toBeNull();
    expect(caption.textContent).toBe('Test Caption');
  });

  it('SHOULD call onClick when image is clicked', () => {
    render(<Image {...defaultProps} />);
    const image = screen.getByTestId(COMPONENT_NAME);
    fireEvent.click(image);

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('SHOULD renders image with correct attributes', () => {
    render(<Image {...defaultProps} />);
    const image = screen.getByTestId(COMPONENT_NAME);

    expect(image.getAttribute('src')).toBe(defaultProps.src);
    expect(image.getAttribute('alt')).toBe(defaultProps.alt);
    expect(image.getAttribute('width')).toBe(`${defaultProps.width}`);
    expect(image.getAttribute('height')).toBe(`${defaultProps.height}`);
  });
});
