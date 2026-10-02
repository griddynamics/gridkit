import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdImage } from '../src';
import { defaultTokenViewer, element, portrait, sectionedArgTypes } from './helpers';

type Args = Pick<GdImage, 'src' | 'alt' | 'width' | 'height' | 'caption' | 'objectFit'>;
const meta = {
  title: 'Atoms/Image',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Responsive image matching React Image loading, placeholder, fallback, caption, object-fit, click, load/error events, and accessibility behavior. Slots replace React node props; native figure/figcaption semantics replace polymorphic wrapper props.',
      },
    },
  },
  args: { src: portrait, alt: 'Portrait', width: 160, height: 160, caption: '', objectFit: 'cover' },
  argTypes: sectionedArgTypes('Image', {
    src: { description: 'Image source URL', control: 'text' },
    alt: { description: 'Accessible image alternative text', control: 'text' },
    width: { description: 'Rendered image width in pixels', control: 'number' },
    height: { description: 'Rendered image height in pixels', control: 'number' },
    caption: { description: 'Optional visible image caption', control: 'text' },
    objectFit: {
      description: 'Native object-fit behavior',
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
  }),
  render: (args: Args) => element('gd-image', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = {};
export const WithCaption: Story = { args: { caption: 'Ada Lovelace' } };
export const WithPlaceholder: Story = {
  render: (args) => {
    const image = element('gd-image', { ...args, src: 'data:image/png;base64,' });
    const placeholder = document.createElement('span');
    placeholder.slot = 'placeholder';
    placeholder.textContent = 'Loading…';
    image.append(placeholder);
    return image;
  },
};
export const FallbackImage: Story = {
  render: (args) => {
    const image = element('gd-image', { ...args, src: '' });
    const fallback = document.createElement('span');
    fallback.slot = 'fallback';
    fallback.textContent = 'Image unavailable';
    image.append(fallback);
    return image;
  },
};
export const Clickable: Story = {
  render: (args) => {
    const image = element('gd-image', args);
    image.style.cursor = 'pointer';
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    return image;
  },
};
export const WithAsProp: Story = {
  ...Default,
  parameters: {
    docs: {
      description: {
        story: 'Custom Elements keep a stable gd-image host; the internal wrapper uses the semantic figure element.',
      },
    },
  },
};
export const WithCaptionAsProp: Story = {
  args: { caption: 'Semantic figcaption' },
  parameters: {
    docs: {
      description: {
        story: 'The native port always uses figcaption, the semantic default of the React captionAs prop.',
      },
    },
  },
};
export const WithAccessibility: Story = { args: { alt: 'Portrait of Ada Lovelace', caption: 'Ada Lovelace' } };
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('image'),
};
