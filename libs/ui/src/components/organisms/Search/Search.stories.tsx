import { ChangeEvent, useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import type { SelectOnSelect } from '@components';
import {
  DEFAULT_EMPTY_SEARCH_RESULTS_PLACEHOLDER,
  DEFAULT_SEARCH_WIDTH,
  DEFAULT_SEARCH_PLACEHOLDER,
} from './constants';
import { Search, type SearchProps } from './';
import { defaultActions, withItemsActions, withLoadingActions, withNoResultsActions } from './Search.stories.play';

const meta: Meta<typeof Search> = {
  title: 'Organisms/Search',
  component: Search,

  argTypes: {
    items: {
      description: 'Array of items to display in the dropdown',
      table: {
        type: { summary: 'Array<{ name: string; value: string }>' },
        defaultValue: { summary: '[]' },
      },
    },
    emptyItemsResult: {
      description: 'Text displayed when no items match the search',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULT_EMPTY_SEARCH_RESULTS_PLACEHOLDER },
      },
    },
    placeholder: {
      description: 'Placeholder text for the search input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULT_SEARCH_PLACEHOLDER },
      },
    },
    renderOption: {
      description: 'Custom render function for dropdown options',
      table: {
        type: { summary: '(option: SearchResultOption) => ReactNode' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onType: {
      description: 'Callback function triggered on input change',
      table: {
        type: { summary: '(value: string) => void' },
        defaultValue: { summary: 'undefined' },
      },
    },
    onSelect: {
      description: 'Callback when item is selected',
      action: 'selected',
      table: {
        type: {
          summary: 'SelectOnSelect = <T = HTMLDivElement>(props: OnSelectProps<T>) => void',
          detail:
            'OnSelectProps<T = HTMLDivElement> {\n' +
            '  event: MouseEvent<T> | KeyboardEvent<T> | ChangeEvent<T>;\n' +
            '  data?: Option;\n' +
            '  index?: number;\n' +
            '}',
        },
        defaultValue: { summary: undefined },
      },
    },
    value: {
      description: 'Current value of the search input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
    width: {
      description: 'Width of the search component',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: DEFAULT_SEARCH_WIDTH },
      },
    },
    'aria-controls': {
      description: 'ID of the element controlled by the search input',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
      },
    },
  },
  tags: ['autodocs'],

  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`Search\` component is a highly flexible UI element designed to be fully customizable in both design and functionality.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li>
  <b>Search Functionality</b>
  <ul>
  <li>Real-time search filtering</li>
  <li>Customizable search logic</li>
  <li>Dropdown results list</li>
  </ul>
  </li>
  <li>
  <b>Item Selection</b>
  <ul>
  <li>Single item selection</li>
  <li>Keyboard navigation</li>
  <li>Click selection</li>
  </ul>
  </li>
  <li><b>Accessibility</b> – ARIA attributes and keyboard support</li>
  <li><b>States</b> – Focus, hover, active, disabled states</li>
  <li><b>Theming</b> – Customizable styling via theme tokens</li>
  </ul>
  <br/>
  <h3>Layout Props:</h3>
  <ul>
  <li><b>Dimensions</b>
  <ul>
  <li><code>width</code>: Search input width</li>
  <li><code>maxHeight</code>: Maximum height of results list</li>
  </ul>
  </li>
  <li><b>Spacing</b>
  <ul>
  <li><code>margin</code>: Overall component spacing</li>
  <li><code>padding</code>: Inner content spacing</li>
  </ul>
  </li>
  <li><code>position</code>: Dropdown positioning</li>
  <li><code>zIndex</code>: Stacking context for dropdown</li>
  </ul>
\`\`\`tsx
import React, { useState, type ChangeEvent } from 'react';
import { Search, SelectOnSelect } from "gd-design-library";

const GDSearch = () => {
  const [value, setValue] = useState<string>('');
  const onSelect: SelectOnSelect = (data) => {
    setValue((data.data?.value as string) || '');
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Search
      value={value}
      onSelect={onSelect}
      onChange={onChange}
      items={[
        {
          name: 'Item 1',
          value: 'item-1',
        },
        {
          name: 'Item 2',
          value: 'item-2',
        },
        {
          name: 'Item 3',
          value: 'item-3',
        },
      ]}
    />
  );
}
\`\`\`
        `,
      },
    },
  },
};

export default meta;
const Template: StoryFn<SearchProps> = (args) => <Search {...args} />;

export const Default = Template.bind({});
Default.args = {};
Default.play = defaultActions;

export const WithItems: StoryFn<SearchProps> = (args) => {
  const [value, setValue] = useState<string>('');
  const onSelect: SelectOnSelect = (data) => {
    action('onSelect')(data);
    setValue((data.data?.value as string) || '');
  };
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Search
      {...args}
      value={value}
      onSelect={onSelect}
      onChange={onChange}
      items={[
        {
          name: 'Item 1',
          value: 'item-1',
        },
        {
          name: 'Item 2',
          value: 'item-2',
        },
        {
          name: 'Item 3',
          value: 'item-3',
        },
      ]}
    />
  );
};
WithItems.play = withItemsActions;

export const WithLoading: StoryFn<SearchProps> = (args) => {
  const [value, setValue] = useState<string>('');
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Search
      {...args}
      value={value}
      onChange={onChange}
      isLoading={true}
      items={[]}
      emptyItemsResult="Loading results..."
    />
  );
};
WithLoading.play = withLoadingActions;

export const WithNoResults: StoryFn<SearchProps> = (args) => {
  const [value, setValue] = useState<string>('');
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <Search
      {...args}
      value={value}
      onChange={onChange}
      items={[]}
      emptyItemsResult="No products found. Try a different search term."
    />
  );
};
WithNoResults.play = withNoResultsActions;

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ search: defaultTheme.search }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
