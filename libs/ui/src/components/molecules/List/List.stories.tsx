import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Row, Column, Typography } from '@components';
import { ListVariant, TypographyVariant } from '@types';
import { defaultTheme } from '@tokens';

import { COMPONENT_NAME } from './constants';
import { List, ListProps } from './';

const meta: Meta<typeof List> = {
  title: 'Molecules/List',
  component: List,
  argTypes: {
    // Data
    items: {
      description: 'Array of items to be rendered in the list',
      table: {
        category: 'Data',
        type: { summary: 'Array<ReactNode>' },
        defaultValue: { summary: '[]' },
      },
    },

    // Layout
    variant: {
      description: 'Determines the style and structure of the list',
      options: Object.values(ListVariant),
      table: {
        category: 'Layout',
        type: { summary: 'ListVariant' },
        defaultValue: { summary: 'ListVariant.Unordered' },
      },
    },

    // Styling
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
      description: 'Size variant controlling font size and spacing of list items',
      table: {
        category: 'Styling',
        type: { summary: '"sm" | "md"' },
        defaultValue: { summary: '"md"' },
      },
    },
    styles: {
      description: 'Custom styles to override default theme tokens',
      table: {
        category: 'Styling',
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    className: {
      description: 'Additional CSS class names',
      table: {
        category: 'Styling',
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`List\` component is a versatile UI element designed to display a collection of items in an organized and styled manner.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>List Variants</b>
  <ul>
  <li>Ordered - Numbered lists</li>
  <li>Unordered - Bullet points</li>
  <li>Custom markers - Circle, decimal, disc styles</li>
  </ul>
  </li>
  <li>
  <b>Content Flexibility</b>
  <ul>
  <li>String content</li>
  <li>React components</li>
  <li>Mixed content types</li>
  </ul>
  </li>
  <li><b>Accessibility</b> - Semantic HTML structure</li>
  <li><b>Theming</b> - Customizable styles via theme tokens</li>
  <li><b>Responsive</b> - Adapts to container width</li>
  </ul>
  <br/>
  <h3>Theme Tokens:</h3>
  <ul>
  <li><b>Typography</b>
  <ul>
  <li><code>fontSize</code>: Text size</li>
  <li><code>lineHeight</code>: Line spacing</li>
  <li><code>fontWeight</code>: Text weight</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>gap</code>: Space between items</li>
  <li><code>padding</code>: Internal spacing</li>
  <li><code>margin</code>: External spacing</li>
  </ul>
  </li>
  <li><b>Colors</b>
  <ul>
  <li><code>color</code>: Text color</li>
  <li><code>backgroundColor</code>: Background color</li>
  <li><code>markerColor</code>: List marker color</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof List>;

export default meta;
const Template: StoryFn<PropsWithChildren<ListProps<any>>> = (args) => <List {...args} />;

export const ListVariants = Template.bind({});
ListVariants.args = {
  items: [`${COMPONENT_NAME} item 1`, `${COMPONENT_NAME} item 2`, `${COMPONENT_NAME} item 3`],
  variant: ListVariant.OrderedCircle,
};

const sampleItems = ['First item in the list', 'Second item in the list', 'Third item in the list'];

export const SizeVariants: StoryFn = () => (
  <Column gap="24px">
    <Row gap="16px" alignItems="flex-start">
      <Typography variant={TypographyVariant.Body2}>Small:</Typography>
      <List items={sampleItems} variant={ListVariant.UnorderedDot} size="sm" />
    </Row>
    <Row gap="16px" alignItems="flex-start">
      <Typography variant={TypographyVariant.Body2}>Medium (Default):</Typography>
      <List items={sampleItems} variant={ListVariant.UnorderedDot} size="md" />
    </Row>
  </Column>
);
SizeVariants.parameters = {
  layout: 'padded',
  docs: {
    description: {
      story:
        'List component supports two size variants: `sm` and `md` (default), which control font size and spacing of list items.',
    },
    source: {
      code: `<List items={items} variant={ListVariant.UnorderedDot} size="sm" />
<List items={items} variant={ListVariant.UnorderedDot} size="md" />`,
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ list: defaultTheme.list }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
