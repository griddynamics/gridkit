import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdImage } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Partial<
  Pick<GdImage, 'as' | 'captionAs' | 'src' | 'alt' | 'width' | 'height' | 'caption' | 'placeholder' | 'objectFit'>
> &
  Record<string, unknown>;
const COMMON_ARGS: Args = {
  src: 'https://picsum.photos/150/150',
  alt: 'Test image',
  width: 150,
  height: 150,
  placeholder: 'Loading...',
  caption: 'Test Caption',
  objectFit: 'cover',
};
const meta = {
  title: 'Atoms/Image',
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Responsive image with loading, placeholder, fallback, caption, object-fit, click, load/error events, slots, and native figure semantics.',
      },
    },
  },
  args: {
    src: 'https://picsum.photos/300/300',
    alt: 'Sample image',
    width: 300,
    height: 300,
    objectFit: 'cover',
  },
  argTypes: sectionedArgTypes('Image', {}),
  render: (args: Args) => element('gd-image', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = { args: COMMON_ARGS };
export const WithCaption: Story = {
  args: { ...COMMON_ARGS, caption: 'This is a sample caption below the image.' },
};
export const WithPlaceholder: Story = {
  args: { ...COMMON_ARGS, placeholder: 'Loading image...' },
};
export const FallbackImage: Story = {
  name: 'Fallback Image',
  args: { ...COMMON_ARGS, src: undefined, caption: undefined },
  render: (args) => {
    const image = element('gd-image', args);
    const fallback = document.createElement('div');
    fallback.slot = 'fallback';
    fallback.setAttribute('role', 'alert');
    fallback.setAttribute('aria-live', 'assertive');
    fallback.style.cssText = 'display:inline-flex;align-items:center;gap:4px;width:max-content';
    const icon = element('gd-icon', { name: 'error', size: 'md', fill: 'icon.error' });
    const message = document.createElement('span');
    message.style.cssText = 'flex:1;font-family:"Fira Sans",sans-serif;font-weight:500;font-size:14px;line-height:20px';
    message.textContent = 'Fallback component';
    fallback.append(icon, message);
    image.append(fallback);
    return image;
  },
};
export const Clickable: Story = {
  args: { ...COMMON_ARGS, caption: 'Click me!' },
  render: (args) => {
    const image = element('gd-image', args);
    image.style.cursor = 'pointer';
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    return image;
  },
};
export const WithAsProp: Story = {
  args: { ...COMMON_ARGS, as: 'figure', caption: 'Image with semantic figure wrapper' },
  parameters: {
    docs: {
      description: {
        story: 'Custom Elements keep a stable gd-image host; the internal wrapper uses the semantic figure element.',
      },
    },
  },
};
export const WithCaptionAsProp: Story = {
  args: { ...COMMON_ARGS, caption: 'Image with custom caption element (p tag)', captionAs: 'p' },
  parameters: {
    docs: {
      description: {
        story: 'The native port always uses figcaption, the semantic default of the React captionAs prop.',
      },
    },
  },
};
export const WithAccessibility: Story = {
  args: { ...COMMON_ARGS, alt: 'Test image' },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('image'),
};
