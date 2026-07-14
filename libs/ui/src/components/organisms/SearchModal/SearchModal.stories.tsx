import { useState } from 'react';
import { Meta, StoryFn, StoryObj } from '@storybook/react-vite';

import { TokenViewer } from '@stories/components/TokenViewer';
import { defaultTheme } from '@tokens';
import { Button, Column } from '@components';
import { SearchModal, SearchModalHistoryResultItemProps, SearchModalProps, SearchModalResultItemProps } from './';
import { withSearchModalActions } from './SearchModal.stories.play';

const today = new Date().getTime();
const lastDays = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  return date.getTime();
});

const ItemsList = [
  {
    id: 'uid-1',
    icon: 'folder',
    title: 'Search Result very very very very very very very very very very very very very very very very very long 1',
    description:
      'This is the first search result very very very very very very very very very very very very very very very very very long description',
    date: today,
  },
  {
    id: 'uid-2',
    title: 'Search Result 2',
    icon: 'folderOpen',
    description: 'Another search result with details',
    date: today,
  },
  {
    id: 'uid-3',
    title: 'Search Result 3',
    icon: 'folderOpen',
    description: 'Another search result with details',
    date: today,
  },
  {
    id: 'uid-4',
    title: 'Search Result 1',
    icon: 'portrait',
    description: 'Description for the third search result',
    date: lastDays[1],
  },
  {
    id: 'uid-5',
    title: 'Search Result  very very very very very very very very very very very very very very very very very long 1',
    icon: 'wifiTethering',
    date: lastDays[4],
  },
  {
    id: 'uid-6',
    title: 'Search Result 2',
    description: 'Final search result description',
    date: lastDays[5],
  },
  {
    id: 'uid-7',
    title: 'Search Result 3',
    description: 'Final search result description',
    date: lastDays[6],
  },
  {
    id: 'uid-8',
    title: 'Search Result 4',
    description: 'Final search result description',
    date: lastDays[11],
  },
  {
    id: 'uid-9',
    title: 'Search Result  very very very very very very very very very very very very very very very very very long 9',
    icon: 'wifiTethering',
  },
];
const HistoryItemsList = [
  {
    title: 'Today',
    items: [
      {
        id: 'uid-1',
        title: 'Search Result 1',
        icon: 'folder',
        description: 'This is the first search result description',
        date: today,
      },
      {
        id: 'uid-2',
        title:
          'Search Result very very very very very very very very very very very very very very very very very long 2',
        description:
          'Another search result with  very very very very very very very very very very very very very very very very very long description ',
        icon: 'folderOpen',
        date: today,
      },
      {
        id: 'uid-3',
        title: 'Search Result 3',
        icon: 'folderOpen',
        description: 'Another search result with details',
        date: today,
      },
    ],
  },
  {
    title: 'Yesterday',
    items: [
      {
        id: 'uid-4',
        title: 'Search Result 1',
        icon: 'portrait',
        description: 'Description for the third search result',
        date: lastDays[1],
      },
    ],
  },
  {
    title: 'Last 7 days',
    items: [
      {
        id: 'uid-5',
        title: 'Search Result 1',
        icon: 'wifiTethering',
        date: lastDays[4],
      },
      {
        id: 'uid-6',
        title:
          'Search Result very very very very very very very very very very very very very very very very very long 2',
        description:
          'Final search result very very very very very very very very very very very very very very very very very long description ',
        date: lastDays[5],
      },
      {
        id: 'uid-7',
        title: 'Search Result 3',
        description: 'Final search result description',
        date: lastDays[6],
      },
      {
        id: 'uid-8',
        title: 'Search Result 4',
        description: 'Final search result description',
        date: lastDays[11],
      },
    ],
  },
];

const SearchModalWrapper = (args: SearchModalProps) => {
  const {
    isLoading: argIsLoading,
    searchValue: argSearchValue = '',
    results: argResults = [],
    historyResults: argHistoryResults = [],
    modalProps,
    searchProps,
    ...rest
  } = args;
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(argSearchValue);
  const [isLoading, setIsLoading] = useState(argIsLoading);
  const [results, setResults] =
    useState<(SearchModalResultItemProps | SearchModalHistoryResultItemProps | never)[]>(argResults);
  const [historyResults, setHistoryResults] =
    useState<(SearchModalResultItemProps | SearchModalHistoryResultItemProps | never)[]>(argHistoryResults);

  return (
    <>
      <Button data-testid="open-modal" onClick={() => setIsOpen(true)}>
        Open Search Modal
      </Button>
      <SearchModal
        {...rest}
        isLoading={isLoading}
        searchValue={searchValue}
        results={results}
        historyResults={historyResults}
        searchProps={{
          ...searchProps,
          onChange: async (event) => {
            searchProps?.onChange?.(event);
            const searchQuery = event?.target?.value || '';
            setSearchValue(searchQuery);

            try {
              const resultData = await new Promise<(SearchModalResultItemProps | never)[]>((resolve, reject) => {
                setIsLoading(true);
                setTimeout(() => {
                  const emptyStateTriggers = ['empty', 'no results'];
                  const shouldShowEmpty = emptyStateTriggers.some(
                    (trigger) => searchQuery.toLowerCase().trim() === trigger.toLowerCase()
                  );
                  const shouldShowError = searchQuery.toLowerCase().trim() === 'error';

                  if (shouldShowEmpty) {
                    resolve([]);
                  } else if (shouldShowError) {
                    reject(new Error('Failed to fetch results'));
                  } else {
                    resolve(ItemsList);
                  }

                  setIsLoading(false);
                }, 700);
              });
              setResults(resultData);
              setHistoryResults(HistoryItemsList);
            } catch (error) {
              console.error(error);
              setResults([]);
              setIsLoading(false);
            }
          },
        }}
        modalProps={{
          ...modalProps,
          isOpen,
          onClose: () => {
            modalProps?.onClose?.();
            setIsOpen(false);
          },
        }}
      />
    </>
  );
};

const meta: Meta<typeof SearchModal> = {
  title: 'Organisms/SearchModal',
  component: SearchModalWrapper,

  argTypes: {
    results: {
      description: 'Array of search results to display',
      table: {
        type: { summary: 'SearchModalResultItemProps[]' },
        defaultValue: { summary: '[]' },
      },
    },
    historyResults: {
      description: 'Array of historical search results',
      table: {
        type: { summary: 'SearchModalHistoryResultItemProps[]' },
        defaultValue: { summary: '[]' },
      },
    },
    wrapperStyle: {
      description: 'Custom styles for the modal wrapper',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    resultItemStyle: {
      description: 'Custom styles for result items',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    historyStyle: {
      description: 'Custom styles for history section',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    loaderStyle: {
      description: 'Custom styles for loader component',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    searchInputStyle: {
      description: 'Custom styles for search input',
      table: {
        type: { summary: 'CSSProperties' },
        defaultValue: { summary: '{}' },
      },
    },
    searchValue: {
      description: 'Current search input value',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '""' },
      },
    },
    noResultsLabel: {
      description: 'Text to display when no results are found',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"No Results"' },
      },
    },
    noHistoryResultsLabel: {
      description: 'Text to display when no history is available',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"You have no conversations"' },
      },
    },
    newSearchCta: {
      description: 'Call to action text for new search',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '"New chat"' },
      },
    },
    isLoading: {
      description: 'Loading state of the search',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    loaderItemsCount: {
      description: 'Number of skeleton items to show while loading',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '7' },
      },
    },
    onResultClick: {
      description: 'Callback function when a result item is clicked',
      table: {
        type: { summary: '(event: React.MouseEvent, item: SearchModalResultItemProps) => void' },
      },
    },
    modalProps: {
      description: 'Properties for the modal component',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ isOpen: false, width: "500px", height: "300px" }' },
      },
    },
    searchProps: {
      description: 'Properties for the search input',
      table: {
        type: { summary: 'object' },
        defaultValue: { summary: '{ placeholder: "Search in chats...", debounceCallbackTime: 300 }' },
      },
    },
  },

  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
  The \`SearchModal\` component is a powerful search interface that combines modal functionality with real-time search capabilities. It provides a seamless way to search through content while maintaining search history.
  <br/>
  <br/>
  <h3>Key Features:</h3>
  <ul>
  <li><b>Real-time Search</b> - Dynamic searching with loading states</li>
  <li><b>Search History</b> - Maintains and displays search history</li>
  <li><b>Customizable Results</b> - Flexible result item rendering</li>
  <li><b>Loading States</b> - Visual feedback during searches</li>
  <li><b>Empty States</b> - Handles no results scenarios</li>
  <li><b>Modal Integration</b> - Built-in modal functionality</li>
  <li><b>Keyboard Navigation</b> - Full keyboard accessibility</li>
  </ul>
  <br/>
  <h3>Layout Options:</h3>
  <ul>
  <li><b>Modal Dimensions</b>
  <ul>
  <li>Configurable width and height</li>
  <li>Responsive layout adaptation</li>
  </ul>
  </li>
  <li><b>Result Display</b>
  <ul>
  <li>List view with icons</li>
  <li>Grouped history items</li>
  <li>Loading skeleton layout</li>
  </ul>
  </li>
  <li><b>Search Input</b>
  <ul>
  <li>Customizable placeholder</li>
  <li>Debounced input handling</li>
  <li>Clear input button</li>
  </ul>
  </li>
  </ul>
        `,
      },

      source: {
        code: `
import { useState } from 'react';
import { Button, SearchModal } from 'gd-design-library';

const today = new Date().getTime();
const lastDays = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(today);
  date.setDate(date.getDate() - i);
  return date.getTime();
});
const ItemsList = [
  {
    id: 'uid-1',
    icon: 'folder',
    title: 'Search Result very very very very very very very very very very very very very very very very very long 1',
    description:
      'This is the first search result very very very very very very very very very very very very very very very very very long description',
    date: today,
  },
  {
    id: 'uid-2',
    title: 'Search Result 2',
    icon: 'folderOpen',
    description: 'Another search result with details',
    date: today,
  },
  {
    id: 'uid-3',
    title: 'Search Result 3',
    icon: 'folderOpen',
    description: 'Another search result with details',
    date: today,
  },
  {
    id: 'uid-4',
    title: 'Search Result 1',
    icon: 'portrait',
    description: 'Description for the third search result',
    date: lastDays[1],
  },
  {
    id: 'uid-5',
    title: 'Search Result  very very very very very very very very very very very very very very very very very long 1',
    icon: 'wifiTethering',
    date: lastDays[4],
  },
  {
    id: 'uid-6',
    title: 'Search Result 2',
    description: 'Final search result description',
    date: lastDays[5],
  },
  {
    id: 'uid-7',
    title: 'Search Result 3',
    description: 'Final search result description',
    date: lastDays[6],
  },
  {
    id: 'uid-8',
    title: 'Search Result 4',
    description: 'Final search result description',
    date: lastDays[11],
  },
  {
    id: 'uid-9',
    title: 'Search Result  very very very very very very very very very very very very very very very very very long 9',
    icon: 'wifiTethering',
  },
];
const HistoryItemsList = [
  {
    title: 'Today',
    items: [
      {
        id: 'uid-1',
        title: 'Search Result 1',
        icon: 'folder',
        description: 'This is the first search result description',
        date: today,
      },
      {
        id: 'uid-2',
        title:
          'Search Result very very very very very very very very very very very very very very very very very long 2',
        description:
          'Another search result with  very very very very very very very very very very very very very very very very very long description ',
        icon: 'folderOpen',
        date: today,
      },
      {
        id: 'uid-3',
        title: 'Search Result 3',
        icon: 'folderOpen',
        description: 'Another search result with details',
        date: today,
      },
    ],
  },
  {
    title: 'Yesterday',
    items: [
      {
        id: 'uid-4',
        title: 'Search Result 1',
        icon: 'portrait',
        description: 'Description for the third search result',
        date: lastDays[1],
      },
    ],
  },
  {
    title: 'Last 7 days',
    items: [
      {
        id: 'uid-5',
        title: 'Search Result 1',
        icon: 'wifiTethering',
        date: lastDays[4],
      },
      {
        id: 'uid-6',
        title:
          'Search Result very very very very very very very very very very very very very very very very very long 2',
        description:
          'Final search result very very very very very very very very very very very very very very very very very long description ',
        date: lastDays[5],
      },
      {
        id: 'uid-7',
        title: 'Search Result 3',
        description: 'Final search result description',
        date: lastDays[6],
      },
      {
        id: 'uid-8',
        title: 'Search Result 4',
        description: 'Final search result description',
        date: lastDays[11],
      },
    ],
  },
];

const SearchModalWrapper = (props) => {
  const {
    isLoading,
    searchValue = '',
    results = [],
    historyResults = [],
    modalProps,
    searchProps,
    ...rest
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(argSearchValue);
  const [isLoading, setIsLoading] = useState(argIsLoading);
  const [results, setResults] =
    useState<(SearchModalResultItemProps | SearchModalHistoryResultItemProps | never)[]>(argResults);
  const [historyResults, setHistoryResults] =
    useState<(SearchModalResultItemProps | SearchModalHistoryResultItemProps | never)[]>(argHistoryResults);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Search Modal
      </Button>
      <SearchModal
        {...rest}
        isLoading={isLoading}
        searchValue={searchValue}
        results={results}
        historyResults={historyResults}
        searchProps={{
          ...searchProps,
          onChange: async (event) => {
            searchProps?.onChange?.(event);
            setSearchValue(event?.target?.value);

            try {
              const resultData = await new Promise<(SearchModalResultItemProps | never)[]>((resolve, reject) => {
                setIsLoading(true);
                setTimeout(() => {
                  const shouldShowData = Math.random() > 0.5;

                  if (shouldShowData) {
                    resolve(ItemsList);
                  } else {
                    reject(new Error('Failed to fetch results'));
                  }
                  setIsLoading(false);
                }, 700);
              });
              setResults(resultData);
              setHistoryResults(HistoryItemsList);
            } catch (error) {
              console.error(error);
              setResults([]);
            }
          },
        }}
        modalProps={{
          ...modalProps,
          isOpen,
          onClose: () => {
            modalProps?.onClose?.();
            setIsOpen(false);
          },
        }}
      />
    </>
  );
};
        `,
      },
    },
  },
} as Meta<typeof SearchModal>;

export default meta;
type Story = StoryObj<typeof SearchModal>;
export const Default: Story = {
  args: {},
};

export const WithSearchModal: Story = {
  args: {},
};
WithSearchModal.play = withSearchModalActions;

export const WithSections: Story = {
  args: {
    popularItems: {
      title: 'Popular',
      content: (
        <Column gap="8px" padding="8px 16px">
          <Button variant="text" size="sm">
            Trending topic 1
          </Button>
          <Button variant="text" size="sm">
            Trending topic 2
          </Button>
          <Button variant="text" size="sm">
            Trending topic 3
          </Button>
        </Column>
      ),
    },
    aiSuggestions: {
      title: 'AI Suggestions',
      content: (
        <Column gap="8px" padding="8px 16px">
          <Button variant="text" size="sm">
            How to get started with...
          </Button>
          <Button variant="text" size="sm">
            Best practices for...
          </Button>
        </Column>
      ),
    },
    articles: {
      title: 'Help Articles',
      content: (
        <Column gap="8px" padding="8px 16px">
          <Button variant="text" size="sm">
            Getting Started Guide
          </Button>
          <Button variant="text" size="sm">
            FAQ
          </Button>
        </Column>
      ),
    },
  },
};
WithSections.parameters = {
  docs: {
    description: {
      story:
        'SearchModal supports `popularItems`, `aiSuggestions`, and `articles` section props. Each section has a `title` and custom `content` ReactNode, displayed when no search query is active.',
    },
  },
};

export const DefaultTokens: StoryFn = () => <TokenViewer tokens={{ searchModal: defaultTheme.searchModal }} />;
DefaultTokens.parameters = {
  layout: 'padded',
};
