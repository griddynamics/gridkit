import { useState } from 'react';
import type { ComponentType, PropsWithChildren } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import { TokenViewer } from '@stories/components/TokenViewer';

import { defaultTheme } from '@tokens';
import { Icon, Typography, Column } from '@components';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  type AccordionWrapperProps,
  type AccordionBaseProps,
  type AccordionHeaderProps,
  type AccordionContextType,
} from './';
import {
  allowMultipleExpandWithIconActions,
  asInlineActions,
  controlledActions,
  defaultActions,
  defaultExpandedActions,
  withOnChangeActions,
} from './Accordion.stories.play';
import { ACCORDION_ITEMS } from './constants';

const meta: Meta<typeof Accordion> = {
  title: 'Molecules/Accordion',
  component: Accordion,
  argTypes: {
    // State & Control
    value: {
      description: 'Controls which accordion items are expanded (controlled mode)',
      control: 'object',
      table: {
        category: 'State & Control',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    defaultValue: {
      description: 'Sets initially expanded items (uncontrolled mode)',
      control: 'object',
      table: {
        category: 'State & Control',
        type: { summary: 'string[]' },
        defaultValue: { summary: '[]' },
      },
    },
    allowMultipleExpand: {
      description: 'Allows multiple items to be expanded simultaneously',
      control: 'boolean',
      table: {
        category: 'State & Control',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    withoutSeparator: {
      description: 'Shows separator between accordion items',
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    isInline: {
      description: 'Shows accordion items header as inline',
      control: 'boolean',
      table: {
        category: 'Appearance',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },

    // Content
    children: {
      description:
        'AccordionItem components to be rendered. Each item should contain AccordionHeader and AccordionContent.',
      control: false,
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },

    // Events
    onChange: {
      description: 'Callback when expanded items change',
      action: 'changed',
      table: {
        category: 'Events',
        type: { summary: '(value: string[]) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  subcomponents: {
    AccordionHeader: AccordionHeader as ComponentType<AccordionHeaderProps>,
    AccordionContent: AccordionContent as ComponentType<AccordionContextType>,
    AccordionItem: AccordionItem as ComponentType<AccordionBaseProps>,
  },
  tags: ['autodocs', 'ecommerce'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
  The \`Accordion\` component is used to display collapsible content sections. It helps organize information in a compact way by hiding or revealing content as needed.
  <br/>
  <br/>
  <h3>Subcomponents:</h3>
  <ul>
  <li><b>AccordionItem</b>
  <ul>
  <li><code>id</code>: string - Unique identifier for the item</li>
  <li><code>styles</code>: object - Custom CSS properties</li>
  <li><code>className</code>: string - Custom CSS class</li>
  <li>Box style props: padding, margin, width, height, flex, gap, etc.</li>
  </ul>
  </li>
  <li><b>AccordionHeader</b>
  <ul>
  <li><code>expandIcon</code>: ReactNode - Custom expand/collapse icon</li>
  <li><code>styles</code>: object - Custom CSS properties</li>
  <li><code>className</code>: string - Custom CSS class</li>
  <li>Box style props: padding, margin, width, height, flex, gap, etc.</li>
  </ul>
  </li>
  <li><b>AccordionContent</b>
  <ul>
  <li><code>styles</code>: object - Custom CSS properties</li>
  <li><code>className</code>: string - Custom CSS class</li>
  <li>Box style props: padding, margin, width, height, flex, gap, etc.</li>
  </ul>
  </li>
  </ul>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Controlled & Uncontrolled Modes</b>
  <ul>
  <li>Manual state management via value/onChange</li>
  <li>Automatic state handling with defaultValue</li>
  </ul>
  </li>
  <li>
  <b>Flexibility</b>
  <ul>
  <li>Single or multiple expanded items</li>
  <li>Custom icon support</li>
  <li>Nested content structure</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard navigation</li>
  <li><b>Customization</b> – Themeable styles and animations</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin/padding</code>: Overall spacing</li>
  <li><code>gap</code>: Space between accordion items</li>
  </ul>
  </li>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width</code>: Container width</li>
  <li><code>maxHeight</code>: Maximum content height</li>
  </ul>
  </li>
  </ul>
        `,
      },
    },
  },
};

export default meta;

const Template: StoryFn<PropsWithChildren<AccordionWrapperProps>> = (args) => {
  return (
    <Accordion {...args} isInline>
      {ACCORDION_ITEMS.map((item) => {
        return (
          <AccordionItem
            key={item.id}
            id={item.id}
            onClick={(e) => {
              e.stopPropagation();
              console.log(e);
            }}
          >
            <AccordionHeader>{item.title}</AccordionHeader>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

// ============= Main Accordion Stories =============

export const Default = Template.bind({});
Default.args = {};
Default.parameters = {
  docs: {
    description: {
      story: 'Basic accordion with default settings. Uses `isInline` prop for inline layout.',
    },
    source: {
      code: `import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from 'gd-design-library';

const accordionItems = [
  { id: 'item1', title: 'Title 1', content: 'Content 1' },
  { id: 'item2', title: 'Title 2', content: 'Content 2' },
  { id: 'item3', title: 'Title 3', content: 'Content 3' },
];

<Accordion isInline>
  {accordionItems.map((item) => (
    <AccordionItem key={item.id} id={item.id}>
      <AccordionHeader>{item.title}</AccordionHeader>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
    },
  },
};
Default.play = defaultActions;

export const AllowMultipleExpandWithIcon: StoryObj<typeof Accordion> = {
  render: () => (
    <Accordion allowMultipleExpand>
      {ACCORDION_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>{item.title}</AccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Allows multiple accordion items to be expanded at the same time.',
      },
      source: {
        code: `import { Accordion, AccordionItem, AccordionHeader, AccordionContent, Icon } from 'gd-design-library';

const accordionItems = [
  { id: 'item1', title: 'Title 1', content: 'Content 1' },
  { id: 'item2', title: 'Title 2', content: 'Content 2' },
  { id: 'item3', title: 'Title 3', content: 'Content 3' },
];

<Accordion allowMultipleExpand>
  {accordionItems.map((item) => (
    <AccordionItem key={item.id} id={item.id}>
      <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>
        {item.title}
      </AccordionHeader>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
      },
    },
  },
};
AllowMultipleExpandWithIcon.play = allowMultipleExpandWithIconActions;

export const DefaultExpanded: StoryObj<typeof Accordion> = {
  render: () => (
    <Accordion defaultValue={['item1', 'item2']}>
      {ACCORDION_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionHeader>{item.title}</AccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accordion with some items expanded by default using the `defaultValue` prop.',
      },
      source: {
        code: `import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from 'gd-design-library';

const accordionItems = [
  { id: 'item1', title: 'Title 1', content: 'Content 1' },
  { id: 'item2', title: 'Title 2', content: 'Content 2' },
  { id: 'item3', title: 'Title 3', content: 'Content 3' },
];

<Accordion defaultValue={['item1', 'item2']}>
  {accordionItems.map((item) => (
    <AccordionItem key={item.id} id={item.id}>
      <AccordionHeader>{item.title}</AccordionHeader>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
      },
    },
  },
};
DefaultExpanded.play = defaultExpandedActions;

export const WithoutSeparator: StoryObj<typeof Accordion> = {
  render: () => (
    <Accordion withoutSeparator>
      {ACCORDION_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id}>
          <AccordionHeader>{item.title}</AccordionHeader>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accordion without separators between items.',
      },
      source: {
        code: `import { Accordion, AccordionItem, AccordionHeader, AccordionContent } from 'gd-design-library';

const accordionItems = [
  { id: 'item1', title: 'Title 1', content: 'Content 1' },
  { id: 'item2', title: 'Title 2', content: 'Content 2' },
  { id: 'item3', title: 'Title 3', content: 'Content 3' },
];

<Accordion withoutSeparator>
  {accordionItems.map((item) => (
    <AccordionItem key={item.id} id={item.id}>
      <AccordionHeader>{item.title}</AccordionHeader>
      <AccordionContent>{item.content}</AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
      },
    },
  },
};

export const AsInline: StoryObj<typeof Accordion> = {
  render: () => (
    <Accordion isInline>
      <AccordionItem id="item1">
        <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>Title 1</AccordionHeader>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Accordion as inline view.',
      },
      source: {
        code: `<Accordion isInline>
  <AccordionItem id="item1">
    <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>Title 1</AccordionHeader>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
</Accordion>`,
      },
    },
  },
};
AsInline.play = asInlineActions;

export const WithBoxStyles: StoryObj<typeof Accordion> = {
  render: () => (
    <Accordion allowMultipleExpand>
      {ACCORDION_ITEMS.map((item) => (
        <AccordionItem key={item.id} id={item.id} margin="8px 0" padding="12px">
          <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />} padding="12px 16px">
            {item.title}
          </AccordionHeader>
          <AccordionContent marginTop="8px">{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the use of boxStyles props (padding, margin, etc.) on AccordionItem, AccordionHeader, and AccordionContent. These props allow for precise control over layout and spacing without needing custom CSS.',
      },
      source: {
        code: `import { Accordion, AccordionItem, AccordionHeader, AccordionContent, Icon } from 'gd-design-library';

const accordionItems = [
  { id: 'item1', title: 'Title 1', content: 'Content 1' },
  { id: 'item2', title: 'Title 2', content: 'Content 2' },
  { id: 'item3', title: 'Title 3', content: 'Content 3' },
];

<Accordion allowMultipleExpand>
  {accordionItems.map((item) => (
    <AccordionItem
      key={item.id}
      id={item.id}
      margin="8px 0"
      padding="12px"
    >
      <AccordionHeader
        expandIcon={<Icon name="keyboardArrowDown" size="xs" />}
        padding="12px 16px"
      >
        {item.title}
      </AccordionHeader>
      <AccordionContent marginTop="8px">
        {item.content}
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>`,
      },
    },
  },
};

export const WithOnChange: StoryObj<typeof Accordion> = {
  args: {
    onChange: fn(),
  },
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openedItems, setOpenedItems] = useState<string[]>([]);

    const handleChange = (items: string[]) => {
      args.onChange?.(items);
      setOpenedItems(items);
    };

    return (
      <Column gap="16px">
        <Typography data-testid="Opened-items">
          Opened items: {openedItems.length > 0 ? openedItems.join(', ') : 'None'}
        </Typography>
        <Accordion onChange={handleChange}>
          {ACCORDION_ITEMS.map((item) => (
            <AccordionItem key={item.id} id={item.id}>
              <AccordionHeader>{item.title}</AccordionHeader>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Accordion with `onChange` callback that tracks which items are opened. The callback receives an array of opened item IDs. Click on accordion items to see the onChange callback fire and the opened items update.',
      },
      source: {
        code: `import { useState } from 'react';
import { Accordion, AccordionItem, AccordionHeader, AccordionContent, Typography, Column } from 'gd-design-library';

const accordionItems = [
  { id: 'item1', title: 'Title 1', content: 'Content 1' },
  { id: 'item2', title: 'Title 2', content: 'Content 2' },
  { id: 'item3', title: 'Title 3', content: 'Content 3' },
];

const Example = () => {
  const [openedItems, setOpenedItems] = useState<string[]>([]);

  const handleChange = (items: string[]) => {
    console.log('Opened items:', items);
    setOpenedItems(items);
  };

  return (
    <Column gap="16px">
      <Typography>
        Opened items: {openedItems.length > 0 ? openedItems.join(', ') : 'None'}
      </Typography>
      <Accordion onChange={handleChange}>
        {accordionItems.map((item) => (
          <AccordionItem key={item.id} id={item.id}>
            <AccordionHeader>{item.title}</AccordionHeader>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Column>
  );
};`,
      },
    },
  },
};
WithOnChange.play = withOnChangeActions;

export const Controlled: StoryObj<typeof Accordion> = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [openedItems, setOpenedItems] = useState<string[]>(['item1']);

    const handleChange = (items: string[]) => {
      action('onChange')(items);
      setOpenedItems(items);
    };

    return (
      <Column gap="16px">
        <Typography data-testid="Opened-items">
          Controlled Accordion - Opened items: {openedItems.length > 0 ? openedItems.join(', ') : 'None'}
        </Typography>
        <Accordion value={openedItems} onChange={handleChange} allowMultipleExpand>
          {ACCORDION_ITEMS.map((item) => (
            <AccordionItem key={item.id} id={item.id}>
              <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>{item.title}</AccordionHeader>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Column>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Controlled Accordion using `value` and `onChange` props for external state management. The `value` prop controls which items are expanded, and `onChange` is called when items are toggled. This example also demonstrates `allowMultipleExpand` to allow multiple items to be open simultaneously.',
      },
      source: {
        code: `import { useState } from 'react';
import { 
  Accordion, 
  AccordionItem, 
  AccordionHeader, 
  AccordionContent, 
  Typography, 
  Column,
  Icon 
} from 'gd-design-library';

const ControlledAccordionExample = () => {
  const [openedItems, setOpenedItems] = useState<string[]>(['item1']);

  const handleChange = (items: string[]) => {
    console.log('Opened items:', items);
    setOpenedItems(items);
  };

  const accordionItems = [
    { id: 'item1', title: 'Title 1', content: 'Content 1' },
    { id: 'item2', title: 'Title 2', content: 'Content 2' },
    { id: 'item3', title: 'Title 3', content: 'Content 3' },
  ];

  return (
    <Column gap="16px">
      <Typography>
        Opened items: {openedItems.length > 0 ? openedItems.join(', ') : 'None'}
      </Typography>
      <Accordion 
        value={openedItems} 
        onChange={handleChange} 
        allowMultipleExpand
      >
        {accordionItems.map((item) => (
          <AccordionItem key={item.id} id={item.id}>
            <AccordionHeader expandIcon={<Icon name="keyboardArrowDown" size="xs" />}>
              {item.title}
            </AccordionHeader>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Column>
  );
};`,
      },
    },
  },
};
Controlled.play = controlledActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ accordion: defaultTheme.accordion }} />;
