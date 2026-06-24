import { PropsWithChildren } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { Row, Tabs, TabsProps } from '@components';
import { defaultTheme } from '@tokens';
import { defaultActions, withDisabledFirstTabActions, withNoticesTabActions } from './Tabs.stories.play';

const TABS_LIST = [
  {
    label: 'Tab 1',
    id: 'tab-1',
    content: (
      <Row gutter={20} styles={{ padding: '20px' }}>
        Tab 1 Content
      </Row>
    ),
  },
  {
    label: 'Tab 2',
    id: 'tab-2',
    content: (
      <Row gutter={20} styles={{ padding: '20px' }}>
        Tab 2 Content
      </Row>
    ),
  },
  {
    label: 'Tab 3',
    id: 'tab-3',
    content: (
      <Row gutter={20} styles={{ padding: '20px' }}>
        Tab 3 Content
      </Row>
    ),
  },
  {
    label: 'Tab 4',
    id: 'tab-4',
    content: (
      <Row gutter={20} styles={{ padding: '20px' }}>
        Tab 4 Content
      </Row>
    ),
  },
];

const meta = {
  title: 'Molecules/Tabs',
  tags: ['autodocs'],
  component: Tabs,
  args: {
    onTabChange: (newTabIndex: number) => {
      action(`Tab changed to index: ${newTabIndex}`)();
    },
  },
  argTypes: {
    tabs: {
      description: 'Array of tab objects defining the content and behavior of each tab',
      table: {
        type: {
          summary: 'Array<TabProps>',
          detail:
            '{ id?: string | number; label: ReactNode; content: ReactNode; isDisabled?: boolean; noticeCounter?: number | string; }[]',
        },
        defaultValue: { summary: '[]' },
      },
    },
    ariaLabel: {
      description: 'Accessibility label for the tabs component navigation',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    activeTab: {
      description: 'Zero-based index of the initially active tab',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '0' },
      },
    },
    onTabChange: {
      description: 'Callback function triggered when a tab is selected, receiving the new tab index',
      table: {
        type: { summary: '(index: number) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    styles: {
      description: 'Custom CSS properties to override default tab styling',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    id: {
      description: 'Optional unique identifier for a tab',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: 'undefined' },
      },
    },
    label: {
      description: 'Content to display in the tab header',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    content: {
      description: 'Content to display in the tab panel when active',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    isDisabled: {
      description: 'When true, prevents the tab from being selected',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    noticeCounter: {
      description: 'Optional badge or counter to display next to the tab label',
      table: {
        type: { summary: 'number | string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
  The \`Tabs\` component is used to organize content into separate views that can be navigated through tabbed interfaces.
  <br/>
  It enhances user experience by allowing easy navigation between different sections of content without leaving the page.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Customizable Tabs</b> – Supports different tab labels and notice counters to fit various use cases.
  </li>
  <li>
  <b>Disabled Tabs</b> – Allows disabling specific tabs to prevent user interaction.
  </li>
  <li>
  <b>Dynamic Content</b> – Each tab can contain different content, which is displayed when the tab is active.
  </li>
  <li>
  <b>Style Overrides</b> – Supports custom styles to match the design system.
  </li>
  </ul>
  <br/>
  <h3>Accessibility:</h3>
  <ul>
  <li>
  <b>ARIA Support</b> – Implements WAI-ARIA Tabs Pattern with proper roles and attributes.
  </li>
  <li>
  <b>Keyboard Navigation</b>:
  <ul>
  <li><code>Tab</code>: Move focus to the next focusable element</li>
  <li><code>Space/Enter</code>: Activate focused tab</li>
  </ul>
  </li>
  </ul>
  <br/>
  <h3>Usage Guidelines:</h3>
  <ul>
  <li>Use meaningful labels that clearly describe tab content</li>
  <li>Avoid using more than 6 tabs to prevent overwhelming users</li>
  <li>Place most important or frequently used content in leftmost tabs</li>
  <li>Use notice counters sparingly and only when necessary</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width</code>: Overall tabs width</li>
  <li><code>height</code>: Tab panel height</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin</code>: Overall component spacing</li>
  <li><code>padding</code>: Inner content padding</li>
  </ul>
  </li>
  <li><code>position</code>: Tab positioning (top, bottom)</li>
  </ul>
        `,
      },
    },
  },
} as Meta<typeof Tabs>;

export default meta;

const Template: StoryFn<PropsWithChildren<TabsProps>> = (args) => <Tabs {...args} />;

export const Default = Template.bind({});
Default.args = {
  tabs: TABS_LIST,
};
Default.play = defaultActions;

export const WithDisabledFirstTab = Template.bind({});
WithDisabledFirstTab.args = {
  tabs: TABS_LIST.map((tab, idx) => ({ ...tab, isDisabled: idx === 0 })),
};
WithDisabledFirstTab.play = withDisabledFirstTabActions;

export const WithNoticesTab = Template.bind({});
WithNoticesTab.args = {
  tabs: TABS_LIST.map((tab, idx) => ({ ...tab, noticeCounter: ++idx })),
};
WithNoticesTab.play = withNoticesTabActions;

export const WithAccessibility = Template.bind({});
WithAccessibility.args = {
  tabs: TABS_LIST,
};
WithAccessibility.tags = ['a11y'];
WithAccessibility.parameters = {
  a11y: {
    test: 'error',
  },
  docs: {
    disable: true,
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ tabs: defaultTheme.tabs }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
