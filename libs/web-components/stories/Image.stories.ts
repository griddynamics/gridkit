import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { GdImage } from '../src';
import { defaultTokenViewer, element, sectionedArgTypes } from './helpers';

type Args = Partial<
  Pick<GdImage, 'as' | 'captionAs' | 'src' | 'alt' | 'width' | 'height' | 'caption' | 'placeholder' | 'objectFit'>
>;
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
  argTypes: {
    ...sectionedArgTypes('Image', {}),
    as: {
      description: 'Semantic element used by the internal image wrapper',
      control: 'select',
      options: ['div', 'figure'],
      table: { type: { summary: `'div' | 'figure'` }, defaultValue: { summary: 'div' }, category: 'Core Properties' },
    },
    captionAs: {
      description: 'Semantic element used for the caption',
      control: 'select',
      options: ['figcaption', 'p', 'span'],
      table: {
        type: { summary: `'figcaption' | 'p' | 'span'` },
        defaultValue: { summary: 'figcaption' },
        category: 'Core Properties',
      },
    },
    placeholder: {
      description: 'Text displayed in a Skeleton while the image loads',
      control: 'text',
      table: { type: { summary: 'string' }, category: 'Content & Display' },
    },
    fallbackComponent: {
      description: 'Element assigned to the fallback slot and displayed when the source is missing or fails to load',
      control: { disable: true },
      table: { type: { summary: 'HTMLElement (slot="fallback")' }, category: 'Content & Display' },
    },
    styles: {
      description: 'CSS property values applied to the internal image element',
      control: { disable: true },
      table: { type: { summary: 'Record<string, string | number>' }, category: 'Styling' },
    },
    onClick: {
      description: 'Listen for the native click event on gd-image',
      control: { disable: true },
      table: { type: { summary: 'EventListener' }, category: 'Events' },
    },
    onError: {
      description: 'Listen for the gd-error custom event',
      control: { disable: true },
      table: { type: { summary: 'EventListener<CustomEvent>' }, category: 'Events' },
    },
    onLoad: {
      description: 'Listen for the gd-load custom event',
      control: { disable: true },
      table: { type: { summary: 'EventListener<CustomEvent>' }, category: 'Events' },
    },
    objectFit: {
      description: 'Native object-fit behavior',
      control: 'select',
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
  },
  render: (args: Args) => element('gd-image', args),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<Args>;
export const Default: Story = { name: 'Default Image', args: COMMON_ARGS };
export const WithCaption: Story = {
  name: 'Image With Caption',
  args: { ...COMMON_ARGS, caption: 'This is a sample caption below the image.' },
};
export const WithPlaceholder: Story = {
  name: 'Image With Placeholder',
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
  name: 'Clickable Image',
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
  name: 'Image With As Prop',
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
  name: 'Image With captionAs Prop',
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
  name: 'Image With Accessibility',
  args: { ...COMMON_ARGS, alt: 'Test image' },
};
export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('image'),
};
