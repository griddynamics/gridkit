import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Typography, FlexContainer } from '@components';

import { ContentCarousel } from './';
import { defaultActions, customScrollStepActions } from './ContentCarousel.stories.play';

export default {
  title: 'Organisms/ContentCarousel',
  component: ContentCarousel,
  argTypes: {
    items: {
      description: 'Array of items to be displayed in the carousel',
      table: {
        type: { summary: 'T[]' },
        defaultValue: { summary: '[]' },
        category: 'Content & Data',
      },
      control: 'object',
    },
    renderItem: {
      description: 'Function to render individual carousel items',
      table: {
        type: { summary: '(item: T, index: number) => ReactNode' },
        defaultValue: { summary: 'undefined' },
        category: 'Content & Data',
      },
    },
    showArrows: {
      description: 'Controls the visibility of navigation arrows',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
        category: 'Navigation & Controls',
      },
      control: 'boolean',
    },
    showDots: {
      description: 'Controls the visibility of navigation dots',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
        category: 'Navigation & Controls',
      },
      control: 'boolean',
    },
    isFocusable: {
      description: 'Enables keyboard navigation and focus management',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'undefined' },
        category: 'Accessibility & Interaction',
      },
      control: 'boolean',
    },
    visibleItems: {
      description: 'Number of items visible at once in the carousel viewport',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined (all items)' },
        category: 'Navigation & Controls',
      },
      control: { type: 'number', min: 1, max: 10, step: 1 },
    },
    scrollStep: {
      description: 'Number of items to scroll when navigating. Controls how many items advance per navigation action.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
        category: 'Navigation & Controls',
      },
      control: { type: 'number', min: 1, max: 5, step: 1 },
    },
    scrollAlignment: {
      description:
        'Alignment of items when scrolling. Left aligns items to left border (default), centered aligns active item in center.',
      table: {
        type: { summary: "'left' | 'centered'" },
        defaultValue: { summary: "'left'" },
        category: 'Navigation & Controls',
      },
      control: { type: 'select' },
      options: ['left', 'centered'],
    },
    styles: {
      description: 'Custom styles to override default carousel styling',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: 'undefined' },
        category: 'Styling & Appearance',
      },
      control: 'object',
    },
  },
  tags: ['autodocs', 'ecommerce'],
  parameters: {
    docs: {
      description: {
        component: `
The \`ContentCarousel\` component is a sophisticated, production-ready carousel implementation built on Embla Carousel with advanced navigation, accessibility features, and seamless content presentation capabilities.

<h3>🎯 Core Capabilities</h3>
<ul>
<li><b>Smart Navigation:</b> Step-by-slide-width scrolling for precise content navigation</li>
<li><b>Flexible Content:</b> Generic TypeScript support for any data type with custom rendering</li>
<li><b>Touch & Gesture Support:</b> Native touch/swipe gestures with momentum scrolling</li>
<li><b>Keyboard Navigation:</b> Full keyboard accessibility with arrow key support</li>
<li><b>Responsive Design:</b> Adaptive layout that works across all device sizes</li>
</ul>

<h3>⚙️ Advanced Features</h3>
<ul>
<li><b>Visible Items Control:</b> Set how many items are visible at once with the visibleItems prop</li>
<li><b>Custom Scroll Step:</b> Control how many items advance per navigation with scrollStep (default: 1)</li>
<li><b>Scroll Alignment:</b> Choose between left (default), centered, or right alignment for item positioning</li>
<li><b>Dynamic Content Loading:</b> Optimized rendering for large datasets and lazy loading</li>
<li><b>Theme Integration:</b> Complete design token system with customizable styling</li>
<li><b>Accessibility First:</b> WCAG 2.1 AA compliant with ARIA landmarks and screen reader support</li>
<li><b>Performance Optimized:</b> Efficient rendering with minimal re-renders and memory usage</li>
</ul>

<h3>🎨 Navigation & Controls</h3>
<ul>
<li><b>Arrow Navigation:</b> Customizable left/right arrows with disabled states</li>
<li><b>Dot Indicators:</b> Progressive dot navigation with active state visualization</li>
<li><b>Touch Gestures:</b> Native swipe support with momentum and snap behavior</li>
<li><b>Keyboard Shortcuts:</b> Arrow keys, Home, End, and Page Up/Down support</li>
<li><b>Focus Management:</b> Proper focus handling and tab order for accessibility</li>
</ul>

<h3>🔧 Technical Implementation</h3>
<ul>
<li><b>Embla Carousel:</b> Built on industry-standard carousel library for reliability</li>
<li><b>TypeScript Support:</b> Full type safety with generic item support</li>
<li><b>Ref Forwarding:</b> Imperative API access for programmatic control</li>
<li><b>Event Handling:</b> Comprehensive event system for slide changes and interactions</li>
<li><b>State Management:</b> Reactive state updates with scroll position tracking</li>
</ul>

<h3>📱 Responsive Behavior</h3>
<ul>
<li><b>Adaptive Sizing:</b> Automatically adjusts to container and content dimensions</li>
<li><b>Breakpoint Support:</b> Different behaviors across mobile, tablet, and desktop</li>
<li><b>Touch Optimization:</b> Optimized touch targets and gesture recognition</li>
<li><b>Performance Scaling:</b> Efficient rendering for both small and large content sets</li>
</ul>

<h3>🎯 Common Use Cases</h3>
<ul>
<li><b>Product Galleries:</b> E-commerce product image carousels with zoom support</li>
<li><b>Content Showcases:</b> Featured articles, testimonials, or portfolio items</li>
<li><b>Media Players:</b> Image galleries, video previews, or audio playlists</li>
<li><b>Navigation Menus:</b> Category browsers or feature highlighters</li>
<li><b>Data Visualization:</b> Chart carousels or dashboard widget browsers</li>
</ul>

<h3>♿ Accessibility Features</h3>
<ul>
<li><b>Keyboard Navigation:</b> Full keyboard support with logical tab order</li>
<li><b>Screen Reader Support:</b> ARIA labels, roles, and live regions</li>
<li><b>Focus Management:</b> Proper focus handling and visual indicators</li>
<li><b>High Contrast:</b> Support for high contrast mode and reduced motion</li>
<li><b>Touch Accessibility:</b> Appropriate touch targets and gesture alternatives</li>
</ul>
        `,
      },
    },
  },
} as Meta<typeof ContentCarousel>;

type Story = StoryObj<typeof ContentCarousel>;

const items = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  content: `Slide ${i + 1}`,
}));

const renderItem = (item: { id: number; content: string }) => (
  <FlexContainer
    width="200px"
    height="200px"
    justifyContent="center"
    alignItems="center"
    style={{
      backgroundColor: '#f0f0f0',
      border: '1px solid #ccc',
      borderRadius: '8px',
    }}
  >
    <Typography>{item.content}</Typography>
  </FlexContainer>
);

export const Default: Story = {
  args: {
    items,
    renderItem,
    showArrows: true,
    showDots: true,
    isFocusable: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<ContentCarousel
  items={items}
  renderItem={(item) => (
    <FlexContainer
      width="200px"
      height="200px"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <Typography>{item.content}</Typography>
    </FlexContainer>
  )}
  showArrows
  showDots
  isFocusable
/>`,
        language: 'tsx',
      },
    },
  },
};
Default.play = defaultActions;

export const MultipleVisibleItems: Story = {
  args: {
    items,
    renderItem,
    showArrows: true,
    showDots: true,
    isFocusable: true,
    visibleItems: 3,
    scrollStep: 1,
    scrollAlignment: 'left',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows 3 items at once with left alignment (default). Each navigation scrolls 1 item width.',
      },
      source: {
        code: `<ContentCarousel
  items={items}
  renderItem={(item) => (
    <FlexContainer
      width="200px"
      height="200px"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <Typography>{item.content}</Typography>
    </FlexContainer>
  )}
  showArrows
  showDots
  isFocusable
  visibleItems={3}
  scrollStep={1}
  scrollAlignment="left"
/>`,
        language: 'tsx',
      },
    },
  },
};

export const CenteredAlignment: Story = {
  args: {
    items,
    renderItem,
    showArrows: true,
    showDots: true,
    isFocusable: true,
    visibleItems: 3,
    scrollStep: 1,
    scrollAlignment: 'centered',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows 3 items at once with centered alignment. Items align to center.',
      },
      source: {
        code: `<ContentCarousel
  items={items}
  renderItem={(item) => (
    <FlexContainer
      width="200px"
      height="200px"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <Typography>{item.content}</Typography>
    </FlexContainer>
  )}
  showArrows
  showDots
  isFocusable
  visibleItems={3}
  scrollStep={1}
  scrollAlignment="centered"
/>`,
        language: 'tsx',
      },
    },
  },
};

export const CustomScrollStep: Story = {
  args: {
    items,
    renderItem,
    visibleItems: 3,
    scrollStep: 3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows 3 items at once. Each navigation scrolls 3 item widths.',
      },
      source: {
        code: `<ContentCarousel
  items={items}
  scrollStep={3}
  visibleItems={3}
  renderItem={(item) => (
    <FlexContainer
      width="200px"
      height="200px"
      justifyContent="center"
      alignItems="center"
      style={{
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '8px'
      }}
    >
      <Typography>{item.content}</Typography>
    </FlexContainer>
  )}
  showArrows
  showDots
  isFocusable
  visibleItems={3}
  scrollStep={2}
  scrollAlignment="left"
/>`,
        language: 'tsx',
      },
    },
  },
};
CustomScrollStep.play = customScrollStepActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ carousel: defaultTheme.carousel }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
