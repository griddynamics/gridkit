import { Meta, StoryFn } from '@storybook/react';
import { action } from 'storybook/actions';

import { fn } from 'storybook/test';
import { TokenViewer } from '@stories/components/TokenViewer';
import { ButtonVariant } from '@types';
import { Icon } from '@components/atoms/Icon';
import { Button } from '@components/atoms/Button';
import { Column, Row, Typography } from '@components';

import { defaultTheme } from '@tokens';
import { answersWithActions, answerWithStatusActions, defaultActions } from './ChatBubble.stories.play';
import { ChatBubble, ChatBubbleProps } from '.';

const meta: Meta<typeof ChatBubble> = {
  title: 'Organisms/ChatBubble',
  component: ChatBubble,
  args: {
    variant: 'answer',
    actions: [],
  },
  argTypes: {
    // Content & Behavior
    children: {
      description: 'Content to be displayed within the chat bubble',
      table: {
        type: { summary: 'ReactNode' },
        defaultValue: { summary: 'undefined' },
        category: 'Content & Behavior',
      },
    },
    actions: {
      description: 'Array of action buttons to be displayed below the message',
      table: {
        type: { summary: 'ReactNode[]' },
        defaultValue: { summary: '[]' },
        category: 'Content & Behavior',
      },
    },
    // Appearance & Styling
    variant: {
      description: 'Determines the visual style and behavior of the chat bubble',
      table: {
        type: { summary: '"question" | "answer"' },
        defaultValue: { summary: 'question' },
        category: 'Appearance & Styling',
      },
    },
    status: {
      description: 'Indicates the current state of the message',
      table: {
        type: { summary: '"pending" | "fulfilled" | undefined' },
        defaultValue: { summary: 'undefined' },
        category: 'Appearance & Styling',
      },
    },
    size: {
      description: 'Size variant of the chat bubble',
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      table: {
        type: { summary: '"sm" | "md" | "lg"' },
        defaultValue: { summary: '"md"' },
        category: 'Appearance & Styling',
      },
    },
    styles: {
      description: 'Custom styles object for the chat bubble',
      control: 'object',
      table: {
        category: 'Appearance & Styling',
        type: { summary: 'BoxCssComponentProps<HTMLDivElement>' },
      },
    },
    className: {
      description: 'Additional CSS class names to apply to the chat bubble',
      control: 'text',
      table: {
        category: 'Appearance & Styling',
      },
    },
    // Box Props - Layout & Sizing
    overflow: {
      description: 'CSS overflow property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    minWidth: {
      description: 'CSS min-width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    width: {
      description: 'CSS width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    maxWidth: {
      description: 'CSS max-width property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    minHeight: {
      description: 'CSS min-height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    height: {
      description: 'CSS height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    maxHeight: {
      description: 'CSS max-height property',
      control: 'text',
      table: {
        category: 'Layout & Sizing',
      },
    },
    // Box Props - Spacing
    margin: {
      description: 'CSS margin property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginTop: {
      description: 'CSS margin-top property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginRight: {
      description: 'CSS margin-right property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginBottom: {
      description: 'CSS margin-bottom property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    marginLeft: {
      description: 'CSS margin-left property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    padding: {
      description: 'CSS padding property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingTop: {
      description: 'CSS padding-top property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingRight: {
      description: 'CSS padding-right property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingBottom: {
      description: 'CSS padding-bottom property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    paddingLeft: {
      description: 'CSS padding-left property',
      control: 'text',
      table: {
        category: 'Spacing',
      },
    },
    // Box Props - Flexbox & Layout
    position: {
      description: 'CSS position property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexDirection: {
      description: 'CSS flex-direction property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    justifyContent: {
      description: 'CSS justify-content property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    alignItems: {
      description: 'CSS align-items property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    alignContent: {
      description: 'CSS align-content property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexWrap: {
      description: 'CSS flex-wrap property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flex: {
      description: 'CSS flex property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexGrow: {
      description: 'CSS flex-grow property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexShrink: {
      description: 'CSS flex-shrink property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    flexBasis: {
      description: 'CSS flex-basis property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    order: {
      description: 'CSS order property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
    gap: {
      description: 'CSS gap property',
      control: 'text',
      table: {
        category: 'Flexbox & Layout',
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`ChatBubble\` component is a versatile UI element designed for displaying chat messages with various interaction patterns.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Message Types</b>
  <ul>
  <li>Question - User messages</li>
  <li>Answer - Bot/System responses</li>
  <li>Status indicators</li>
  </ul>
  </li>
  <li>
  <b>Interactive Elements</b>
  <ul>
  <li>Action buttons</li>
  <li>Copy functionality</li>
  <li>Voice playback</li>
  <li>Feedback controls</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>States</b> – Pending, fulfilled message states</li>
  <li><b>Theming</b> – Custom styling and theme integration</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width</code>: Bubble width</li>
  <li><code>maxWidth</code>: Maximum width constraint</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin</code>: External spacing</li>
  <li><code>padding</code>: Internal content padding</li>
  <li><code>gap</code>: Space between message and actions</li>
  </ul>
  </li>
  <li><code>position</code>: Bubble positioning</li>
  <li><code>borderRadius</code>: Corner rounding</li>
  </ul>
          `,
      },
    },
  },
} as Meta<typeof ChatBubble>;

export default meta;
const Template: StoryFn<ChatBubbleProps> = (args) => <ChatBubble {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Hi! Can you help me generate an SVG icon from some code?',
};
Default.play = defaultActions;

export const AnswerWithActions = Template.bind({});
AnswerWithActions.args = {
  variant: 'answer',
  children: "Sure! Please paste the code you'd like me to convert, and I’ll generate the SVG file for you.",
  actions: [
    <Button key="volumeUp" isIcon variant={ButtonVariant.Text} onClick={fn(action('Voice clicked!'))}>
      <Icon name="volumeUp" />
    </Button>,
    <Button key="contentCopy" isIcon variant={ButtonVariant.Text} onClick={fn(action('Copy clicked!'))}>
      <Icon name="contentCopy" />
    </Button>,
    <Button key="thumbUp" isIcon variant={ButtonVariant.Text} onClick={fn(action('Like clicked!'))}>
      <Icon name="thumbUp" />
    </Button>,
    <Button key="thumbDown" isIcon variant={ButtonVariant.Text} onClick={fn(action('Dislike clicked!'))}>
      <Icon name="thumbDown" />
    </Button>,
  ],
};
AnswerWithActions.play = answersWithActions;

export const AnswerWithStatus = Template.bind({});
AnswerWithStatus.args = {
  variant: 'answer',
  children: 'Pending..',
  status: 'pending',
};
AnswerWithStatus.play = answerWithStatusActions;

export const WithSizes: StoryFn = () => (
  <Column gap="20px">
    <Typography variant="h6">Small</Typography>
    <ChatBubble variant="answer" size="sm">
      This is a small chat bubble with compact padding and font size.
    </ChatBubble>
    <Typography variant="h6">Medium (Default)</Typography>
    <ChatBubble variant="answer" size="md">
      This is the default medium chat bubble.
    </ChatBubble>
    <Typography variant="h6">Large</Typography>
    <ChatBubble variant="answer" size="lg">
      This is a large chat bubble with increased padding and font size.
    </ChatBubble>
  </Column>
);
WithSizes.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'ChatBubble supports three size variants: `sm`, `md` (default), and `lg`, controlling padding and font size.',
    },
    source: {
      code: `<ChatBubble variant="answer" size="sm">Small</ChatBubble>
<ChatBubble variant="answer" size="md">Medium</ChatBubble>
<ChatBubble variant="answer" size="lg">Large</ChatBubble>`,
    },
  },
};

export const WithImageGallery: StoryFn = () => (
  <Column gap="20px" maxWidth="400px">
    <ChatBubble variant="answer">
      Here are the images you requested:
      <ChatBubble.ImageGallery
        images={[
          { src: 'https://picsum.photos/200/200?random=1', alt: 'Image 1' },
          { src: 'https://picsum.photos/200/200?random=2', alt: 'Image 2' },
          { src: 'https://picsum.photos/200/200?random=3', alt: 'Image 3' },
          { src: 'https://picsum.photos/200/200?random=4', alt: 'Image 4' },
          { src: 'https://picsum.photos/200/200?random=5', alt: 'Image 5' },
          { src: 'https://picsum.photos/200/200?random=6', alt: 'Image 6' },
        ]}
        onImageClick={(index) => action('Image clicked')(index)}
      />
    </ChatBubble>
  </Column>
);
WithImageGallery.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'The `ChatBubble.ImageGallery` sub-component displays images in a 2x2 grid. When more than 4 images are provided, a "+N" overlay appears on the last visible image.',
    },
    source: {
      code: `<ChatBubble variant="answer">
  Here are the images:
  <ChatBubble.ImageGallery
    images={[
      { src: '/img1.jpg', alt: 'Image 1' },
      { src: '/img2.jpg', alt: 'Image 2' },
    ]}
    onImageClick={(index) => console.log(index)}
  />
</ChatBubble>`,
    },
  },
};

export const WithLinkPreview: StoryFn = () => (
  <Column gap="20px" maxWidth="400px">
    <ChatBubble variant="answer">
      Check out this article:
      <ChatBubble.LinkPreview
        url="https://example.com/article"
        title="Understanding Design Systems"
        description="A comprehensive guide to building scalable design systems for modern applications."
        thumbnail="https://picsum.photos/400/200?random=10"
        domain="example.com"
        onClick={(e) => {
          e.preventDefault();
          action('Link clicked')();
        }}
      />
    </ChatBubble>
  </Column>
);
WithLinkPreview.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'The `ChatBubble.LinkPreview` sub-component renders a rich URL preview card with thumbnail, title, description, and domain.',
    },
    source: {
      code: `<ChatBubble variant="answer">
  Check out this article:
  <ChatBubble.LinkPreview
    url="https://example.com"
    title="Article Title"
    description="Article description..."
    thumbnail="/thumbnail.jpg"
    domain="example.com"
  />
</ChatBubble>`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ chatbubble: defaultTheme.chatbubble }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
