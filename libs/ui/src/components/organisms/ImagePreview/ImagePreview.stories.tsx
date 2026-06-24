import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';

import { ImagePreview, ImagePreviewItem } from './';
import {
  defaultActions,
  withCounterActions,
  thumbnailsLeftActions,
  noArrowsActions,
  singleImageActions,
} from './ImagePreview.stories.play';

const sampleImages: ImagePreviewItem[] = [
  { src: 'https://picsum.photos/600/400?random=1', alt: 'Nature landscape' },
  { src: 'https://picsum.photos/600/400?random=2', alt: 'City skyline' },
  { src: 'https://picsum.photos/600/400?random=3', alt: 'Mountain view' },
  { src: 'https://picsum.photos/600/400?random=4', alt: 'Beach sunset' },
  { src: 'https://picsum.photos/600/400?random=5', alt: 'Forest trail' },
];

const meta: Meta<typeof ImagePreview> = {
  title: 'Organisms/ImagePreview',
  component: ImagePreview,
  tags: ['autodocs'],
  args: {
    images: sampleImages,
  },
  argTypes: {
    showThumbnails: {
      description: 'Controls the visibility of the thumbnail strip',
      control: { type: 'boolean' },
      table: {
        category: 'Display Controls',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showCounter: {
      description: 'Displays a counter indicating the current image position',
      control: { type: 'boolean' },
      table: {
        category: 'Display Controls',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showArrows: {
      description: 'Controls the visibility of navigation arrows',
      control: { type: 'boolean' },
      table: {
        category: 'Display Controls',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    thumbnailPosition: {
      description: 'Position of the thumbnail strip relative to the main image',
      control: { type: 'select' },
      options: ['bottom', 'left'],
      table: {
        category: 'Display Controls',
        type: { summary: '"bottom" | "left"' },
        defaultValue: { summary: '"bottom"' },
      },
    },
    initialIndex: {
      description: 'The index of the image to display initially',
      control: { type: 'number' },
      table: {
        category: 'Behavior',
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    onImageChange: {
      description: 'Callback fired when the active image changes',
      action: 'imageChanged',
      table: {
        category: 'Behavior',
        type: { summary: '(index: number) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    images: {
      description: 'Array of image objects to display in the preview',
      table: {
        category: 'Content',
        type: { summary: 'ImagePreviewItem[]' },
      },
    },
    renderOverlay: {
      description: 'Custom render function for overlay content on each image',
      table: {
        category: 'Content',
        type: { summary: '(image: ImagePreviewItem, index: number) => ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`ImagePreview\` component is a flexible image viewer designed for browsing through a collection of images with navigation controls and thumbnail previews.
<br/>
<br/>
<h3>Key Features:</h3>
<ul>
<li>
<b>Navigation Controls</b>
<ul>
<li>Arrow navigation (previous/next)</li>
<li>Thumbnail strip for direct image selection</li>
<li>Image counter indicator</li>
</ul>
</li>
<li>
<b>Layout Options</b>
<ul>
<li>Thumbnails at the bottom</li>
<li>Thumbnails on the left</li>
<li>Configurable initial image index</li>
</ul>
</li>
<li><b>Customization</b> – Overlay rendering, flexible styling via theme tokens</li>
<li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
</ul>
<br/>
<h3>Props:</h3>
<ul>
<li><b>Content</b>
<ul>
<li><code>images</code>: Array of image items with src, alt, and caption</li>
<li><code>renderOverlay</code>: Custom overlay renderer per image</li>
</ul>
</li>
<li><b>Behavior</b>
<ul>
<li><code>initialIndex</code>: Starting image index</li>
<li><code>onImageChange</code>: Callback on image navigation</li>
</ul>
</li>
<li><b>Display Controls</b>
<ul>
<li><code>showThumbnails</code>: Toggle thumbnail strip</li>
<li><code>showCounter</code>: Toggle image counter</li>
<li><code>showArrows</code>: Toggle navigation arrows</li>
<li><code>thumbnailPosition</code>: Position thumbnails bottom or left</li>
</ul>
</li>
</ul>
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ImagePreview>;

export const Default: Story = {
  args: {
    images: sampleImages,
    onImageChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default ImagePreview with five sample images, navigation arrows, and bottom thumbnails.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ImagePreview {...args} />
    </div>
  ),
};
Default.play = defaultActions;

export const WithCounter: Story = {
  args: {
    images: sampleImages,
    showCounter: true,
    showThumbnails: false,
    onImageChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'ImagePreview with the image counter visible and thumbnails hidden. Useful for compact layouts where a simple position indicator is preferred.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ImagePreview {...args} />
    </div>
  ),
};
WithCounter.play = withCounterActions;

export const ThumbnailsLeft: Story = {
  args: {
    images: sampleImages,
    thumbnailPosition: 'left',
    onImageChange: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          'ImagePreview with the thumbnail strip positioned on the left side of the main image instead of the bottom.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ImagePreview {...args} />
    </div>
  ),
};
ThumbnailsLeft.play = thumbnailsLeftActions;

export const NoArrows: Story = {
  args: {
    images: sampleImages,
    showArrows: false,
    onImageChange: action('onImageChange'),
  },
  parameters: {
    docs: {
      description: {
        story: 'ImagePreview without navigation arrows. Users can navigate using the thumbnail strip only.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ImagePreview {...args} />
    </div>
  ),
};
NoArrows.play = noArrowsActions;

export const SingleImage: Story = {
  args: {
    images: [sampleImages[0]],
  },
  parameters: {
    docs: {
      description: {
        story: 'ImagePreview with a single image. Navigation controls are unnecessary in this configuration.',
      },
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <ImagePreview {...args} />
    </div>
  ),
};
SingleImage.play = singleImageActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ imagePreview: defaultTheme.imagePreview }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
