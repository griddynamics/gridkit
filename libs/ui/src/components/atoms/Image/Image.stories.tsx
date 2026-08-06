import { action } from 'storybook/actions';
import type { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';

import { InlineNotification } from '@components';

import { COMPONENT_NAME } from './constants';
import { Image, type ImageProps } from '.';

const COMMON_ARGS = {
  id: 'test-image',
  src: 'https://picsum.photos/150/150',
  alt: 'Test image',
  width: 150,
  height: 150,
  className: 'custom-class',
  placeholder: 'Loading...',
  caption: 'Test Caption',
};

const createStory = ({ name, args = {} }: { name: string; args?: ImageProps }): StoryObj<typeof Image> => ({
  name,
  args: { ...COMMON_ARGS, ...args },
});

const meta: Meta<ImageProps> = {
  title: 'Atoms/Image',
  component: Image,
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
        'Polymorphic prop that changes the rendered wrapper element while preserving all Image styles. Accepts HTML tag names (e.g., "div", "span", "figure") or React components. Useful for semantic HTML and accessibility.',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
        defaultValue: { summary: 'div' },
        category: 'Core Properties',
      },
      control: { type: 'text' },
    },
    captionAs: {
      description:
        'Polymorphic prop that changes the rendered caption element while preserving all Image caption styles. Accepts HTML tag names (e.g., "figcaption", "p", "span") or React components. Defaults to "figcaption" for semantic HTML. Useful for custom caption styling or when not using semantic figure/caption structure.',
      table: {
        type: { summary: 'keyof HTMLElementTagNameMap | ElementType' },
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
      description: 'Component to display when image fails to load',
      table: {
        type: { summary: 'ReactNode' },
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
        type: { summary: '(event: React.MouseEvent) => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    onError: {
      description: 'Error event handler when image fails to load',
      table: {
        type: { summary: '() => void' },
        defaultValue: { summary: 'undefined' },
        category: 'Events',
      },
    },
    onLoad: {
      description: 'Load event handler when image successfully loads',
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
  The \`Image\` component provides a complete solution for handling images in React applications. It supports progressive loading with placeholders, error states, accessibility features, and extensive customization options.
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
  <li>Fallback component support</li>
  <li>Error state management</li>
  <li>Graceful degradation</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and semantic markup</li>
  <li><b>Polymorphic Support</b>
  <ul>
  <li>Use <code>as</code> prop to render wrapper as different HTML elements (e.g., <code>as="figure"</code> for semantic image containers)</li>
  <li>Use <code>captionAs</code> prop to render caption as different HTML elements (e.g., <code>captionAs="p"</code> for paragraph captions, defaults to <code>"figcaption"</code>)</li>
  </ul>
  </li>
  <li><b>Customization</b> – Styling via props and CSS</li>
  <li><b>Interaction</b> – Click handling and events</li>
  </ul>
        

  <br/>
  <br/>

<h3>🧩 Web Components track (CTORNDSD-646)</h3>
<b>Verdict — Native &lt;img&gt; + shared token CSS.</b> Medium confidence. It does carry load/error/fallback state, but &lt;img&gt; discovery by crawlers is load-bearing and srcset/sizes/loading/fetchpriority are native attributes a wrapper must re-plumb. Ship the fallback as a documented pattern instead of an element.
<br/>
Decision rule and full rationale: <code>docs/webcomponents-migration/05-native-html-guidelines.md</code>.
`,
      },
    },
  },
};

export default meta;

type Story = StoryObj<ImageProps>;

export const Default: Story = createStory({
  name: `Default ${COMPONENT_NAME}`,
});

export const WithCaption: Story = createStory({
  name: `${COMPONENT_NAME} With Caption`,
  args: {
    caption: 'This is a sample caption below the image.',
  },
});

export const WithPlaceholder: Story = createStory({
  name: `${COMPONENT_NAME} With Placeholder`,
  args: {
    placeholder: 'Loading image...',
  },
});

export const Clickable: Story = createStory({
  name: `Clickable ${COMPONENT_NAME}`,
  args: {
    onClick: action('Image clicked!'),
    caption: 'Click me!',
  },
});

export const FallbackImage: Story = createStory({
  name: 'Fallback Image',
  args: {
    src: undefined,
    fallbackComponent: <InlineNotification variant="error">Fallback component</InlineNotification>,
    caption: undefined,
  },
});

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
        'Image with `as="figure"` - demonstrates polymorphic prop usage for semantic HTML. The wrapper element is rendered as a `<figure>` instead of the default `<div>`, which is semantically correct for images with captions.',
    },
    source: {
      code: `
import { Image } from 'gd-design-library';

const Example = () => {
  return (
    <Image
      src="https://picsum.photos/300/300"
      alt="Sample image"
      width={300}
      height={300}
      as="figure"
      caption="Image with semantic figure wrapper"
    />
  );
};
`,
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
        'Image with `captionAs="p"` - demonstrates polymorphic caption prop usage. The caption element is rendered as a `<p>` instead of the default `<figcaption>`. Useful when not using semantic figure/caption structure or when custom caption styling is needed.',
    },
    source: {
      code: `
import { Image } from 'gd-design-library';

const Example = () => {
  return (
    <Image
      src="https://picsum.photos/300/300"
      alt="Sample image"
      width={300}
      height={300}
      caption="Image with custom caption element (p tag)"
      captionAs="p"
    />
  );
};
`,
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
    options: {
      rules: {
        'color-contrast': { enabled: false },
      },
    },
  },
  docs: {
    disable: true,
  },
};
WithAccessibility.tags = ['a11y'];

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ image: defaultTheme.image }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
