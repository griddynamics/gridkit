import { action } from 'storybook/actions';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { defaultTheme } from 'gd-design-library/tokens';
import type { GdImage } from '../src';
import { defaultTokenViewer, element } from './helpers';
import { formattedSource } from './layout-story-helpers';

type Args = Partial<Pick<GdImage, 'src' | 'alt' | 'width' | 'height' | 'caption' | 'placeholder' | 'objectFit'>> & {
  id?: string;
  className?: string;
  as?: string;
  captionAs?: string;
  styles?: Record<string, string | number>;
  fallbackComponent?: never;
  'aria-label'?: string;
  role?: string;
  onClick?: (event: MouseEvent) => void;
  onError?: (event: Event) => void;
  onLoad?: (event: Event) => void;
};

const COMPONENT_NAME = 'Image';

const COMMON_ARGS = {
  id: 'test-image',
  src: 'https://picsum.photos/150/150',
  alt: 'Test image',
  width: 150,
  height: 150,
  className: 'custom-class',
};

const createStory = ({ name, args = {} }: { name: string; args?: Args }): StoryObj<Args> => ({
  name,
  args: { ...COMMON_ARGS, ...args },
});

// Equivalent of the inline error notification used as the fallback content of the source story:
// an inline-flex row with the theme error icon and a small medium-weight message.
const fallbackNotification = (message: string) => {
  const theme = defaultTheme as unknown as {
    spacing: Record<string, string>;
    font: {
      family: string;
      weight: Record<string, string | number>;
      size: Record<string, string>;
      line: { height: Record<string, string> };
    };
  };
  const notification = document.createElement('div');
  notification.slot = 'fallback';
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.style.cssText = `display:inline-flex;align-items:center;gap:${theme.spacing.xs};width:max-content`;
  const text = document.createElement('span');
  text.style.cssText = [
    'flex:1',
    `font-family:${theme.font.family}`,
    `font-weight:${theme.font.weight.medium}`,
    `font-size:${theme.font.size.small}`,
    `line-height:${theme.font.line.height.small}`,
  ].join(';');
  text.textContent = message;
  notification.append(element('gd-icon', { name: 'error', fill: 'icon.error' }), text);
  return notification;
};

const meta = {
  title: 'Atoms/Image',
  component: 'gd-image',
  args: {
    width: 300,
    height: 300,
    alt: 'Sample image',
    src: 'https://picsum.photos/300/300',
  },
  argTypes: {
    // Core Properties
    as: {
      description:
        'Changes the rendered wrapper element while preserving all Image styles. Accepts HTML tag names (e.g., "div", "span", "figure"). Useful for semantic HTML and accessibility.',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap' },
        defaultValue: { summary: 'div' },
        category: 'Core Properties',
      },
      control: { type: 'text' },
    },
    captionAs: {
      description:
        'Changes the rendered caption element while preserving all Image caption styles. Accepts HTML tag names (e.g., "figcaption", "p", "span") (caption-as attribute). Defaults to "figcaption" for semantic HTML. Useful for custom caption styling or when not using semantic figure/caption structure.',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap' },
        defaultValue: { summary: 'figcaption' },
        category: 'Core Properties',
      },
      control: { type: 'text' },
    },
    src: {
      description: 'Source URL of the image',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'required' },
        category: 'Core Properties',
      },
    },
    alt: {
      description: 'Alternative text for the image',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'required' },
        category: 'Core Properties',
      },
    },
    id: {
      description: 'Unique identifier for the image',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Core Properties',
      },
    },

    // Dimensions
    width: {
      description: 'Width of the image in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Dimensions',
      },
    },
    height: {
      description: 'Height of the image in pixels',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'Dimensions',
      },
    },

    // Content & Display
    caption: {
      description: 'Caption text to display below the image',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Content & Display',
      },
    },
    placeholder: {
      description: 'Text to display while image is loading',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Content & Display',
      },
    },
    fallbackComponent: {
      description: 'Content to display when image fails to load (fallback slot)',
      table: {
        type: { summary: 'Node' },
        defaultValue: { summary: 'undefined' },
        category: 'Content & Display',
      },
    },

    // Styling
    className: {
      description: 'Additional CSS classes to apply',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Styling',
      },
    },
    styles: {
      description: 'Custom CSS styles object',
      table: {
        type: { summary: 'CSSObject' },
        defaultValue: { summary: 'undefined' },
        category: 'Styling',
      },
    },
    objectFit: {
      description: 'CSS object-fit property for image scaling',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'Styling',
      },
    },

    // Events
    onClick: {
      description: 'Click event handler for the image',
      table: {
        type: { summary: '(event: MouseEvent) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    onError: {
      description: 'Error event handler when image fails to load (gd-error event)',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    onLoad: {
      description: 'Load event handler when image successfully loads (gd-load event)',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Image\` component provides a complete solution for handling images in web applications. It supports progressive loading with placeholders, error states, accessibility features, and extensive customization options.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Progressive Loading</b>
  <ul>
  <li>Built-in loading states</li>
  <li>Customizable placeholders</li>
  <li>Load success/error callbacks</li>
  </ul>
  </li>
  <li>
  <b>Error Handling</b>
  <ul>
  <li>Fallback content support</li>
  <li>Error state management</li>
  <li>Graceful degradation</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and semantic markup</li>
  <li><b>Polymorphic Support</b>
  <ul>
  <li>Use <code>as</code> attribute to render wrapper as different HTML elements (e.g., <code>as="figure"</code> for semantic image containers)</li>
  <li>Use <code>caption-as</code> attribute to render caption as different HTML elements (e.g., <code>caption-as="p"</code> for paragraph captions, defaults to <code>"figcaption"</code>)</li>
  </ul>
  </li>
  <li><b>Customization</b> – Styling via properties and CSS</li>
  <li><b>Interaction</b> – Click handling and events</li>
  </ul>
`,
      },
    },
  },
  render: ({ onClick, onError, onLoad, 'aria-label': ariaLabel, role, ...props }: Args) => {
    const image = element('gd-image', props as Partial<GdImage>);
    if (ariaLabel) image.setAttribute('aria-label', ariaLabel);
    if (role) image.setAttribute('role', role);
    // The source attaches the click handler to the image itself, not to the caption.
    if (onClick)
      image.addEventListener('click', (event) => {
        if (event.composedPath()[0] instanceof HTMLImageElement) onClick(event);
      });
    if (onError) image.addEventListener('gd-error', onError);
    if (onLoad) image.addEventListener('gd-load', onLoad);
    return image;
  },
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = createStory({
  name: `Default ${COMPONENT_NAME}`,
});
Default.parameters = formattedSource(`<gd-image
  id="test-image"
  class="custom-class"
  src="https://picsum.photos/150/150"
  alt="Test image"
  width="150"
  height="150"
></gd-image>`);

export const WithCaption: Story = createStory({
  name: `${COMPONENT_NAME} With Caption`,
  args: {
    caption: 'This is a sample caption below the image.',
  },
});
WithCaption.parameters = formattedSource(`<gd-image
  id="test-image"
  class="custom-class"
  src="https://picsum.photos/150/150"
  alt="Test image"
  width="150"
  height="150"
  caption="This is a sample caption below the image."
></gd-image>`);

export const WithPlaceholder: Story = createStory({
  name: `${COMPONENT_NAME} With Placeholder`,
  args: {
    placeholder: 'Loading image...',
  },
});
WithPlaceholder.parameters = formattedSource(`<gd-image
  id="test-image"
  class="custom-class"
  src="https://picsum.photos/150/150"
  alt="Test image"
  width="150"
  height="150"
  placeholder="Loading image..."
></gd-image>`);

export const Clickable: Story = createStory({
  name: `Clickable ${COMPONENT_NAME}`,
  args: {
    onClick: action('Image clicked!') as unknown as (event: MouseEvent) => void,
    caption: 'Click me!',
  },
});
Clickable.parameters = formattedSource(`<gd-image
  id="test-image"
  class="custom-class"
  src="https://picsum.photos/150/150"
  alt="Test image"
  width="150"
  height="150"
  caption="Click me!"
></gd-image>

<script type="module">
  document.querySelector('gd-image').addEventListener('click', () => {
    console.log('Image clicked!');
  });
</script>`);

export const FallbackImage: Story = createStory({
  name: 'Fallback Image',
  args: {
    src: undefined,
    caption: undefined,
  },
});
FallbackImage.render = (args: Args) => {
  const image = meta.render(args);
  image.append(fallbackNotification('Fallback component'));
  return image;
};
FallbackImage.parameters = formattedSource(`<gd-image
  id="test-image"
  class="custom-class"
  alt="Test image"
  width="150"
  height="150"
>
  <div slot="fallback" role="alert" aria-live="assertive" style="display: inline-flex; align-items: center; gap: 4px">
    <gd-icon name="error" fill="icon.error"></gd-icon>
    <span>Fallback component</span>
  </div>
</gd-image>`);

export const WithAsProp: Story = createStory({
  name: `${COMPONENT_NAME} With As Prop`,
  args: {
    as: 'figure',
    caption: 'Image with semantic figure wrapper',
  },
});
WithAsProp.parameters = {
  docs: {
    description: {
      story:
        'Image with `as="figure"` - demonstrates polymorphic attribute usage for semantic HTML. The wrapper element is rendered as a `<figure>` instead of the default `<div>`, which is semantically correct for images with captions.',
    },
    source: {
      code: `
<gd-image
  src="https://picsum.photos/300/300"
  alt="Sample image"
  width="300"
  height="300"
  as="figure"
  caption="Image with semantic figure wrapper"
></gd-image>
`,
      language: 'html',
      transform: (source: string) => source,
    },
  },
};

export const WithCaptionAsProp: Story = createStory({
  name: `${COMPONENT_NAME} With captionAs Prop`,
  args: {
    caption: 'Image with custom caption element (p tag)',
    captionAs: 'p',
  },
});
WithCaptionAsProp.parameters = {
  docs: {
    description: {
      story:
        'Image with `caption-as="p"` - demonstrates polymorphic caption attribute usage. The caption element is rendered as a `<p>` instead of the default `<figcaption>`. Useful when not using semantic figure/caption structure or when custom caption styling is needed.',
    },
    source: {
      code: `
<gd-image
  src="https://picsum.photos/300/300"
  alt="Sample image"
  width="300"
  height="300"
  caption="Image with custom caption element (p tag)"
  caption-as="p"
></gd-image>
`,
      language: 'html',
      transform: (source: string) => source,
    },
  },
};

export const WithAccessibility: Story = createStory({
  name: `${COMPONENT_NAME} With Accessibility`,
  args: {
    'aria-label': 'Accessible Image',
    role: 'img',
  },
});
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};
WithAccessibility.tags = ['a11y'];

export const DefaultTokens: Story = {
  render: () => defaultTokenViewer('image'),
  parameters: { layout: 'padded' },
};
