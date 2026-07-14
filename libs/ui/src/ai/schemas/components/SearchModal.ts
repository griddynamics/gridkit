const component = {
  name: 'SearchModal',
  import: "import { SearchModal } from 'gd-design-library'",
  description:
    'Modal-style search surface with built-in search field, loading state, history/results sections, and result click handling.',
  a2uiName: 'search-modal',
  category: 'Overlay & Dialog',
  complexity: 'High',
  accessibility: 'WCAG 2.1 AA Compliant',
  props: [
    { name: 'placeholder', type: 'string', description: 'Placeholder text for the internal search input.' },
    { name: 'searchValue', type: 'string', description: 'Current search query value' },
    { name: 'isLoading', type: 'boolean', description: 'Shows a skeleton loader while fetching results' },
    {
      name: 'results',
      type: 'Array<{ id?: string; title: string; description?: string; icon?: string; date?: number; items?: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }>',
      description: 'Live search result items to display. Grouped items use the nested items[] shape.',
    },
    {
      name: 'historyResults',
      type: 'Array<{ id?: string; title: string; description?: string; icon?: string; date?: number; items?: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }>',
      description: 'Recent or grouped history result items shown before a query is typed.',
    },
    {
      name: 'noResultsLabel',
      type: 'string',
      description: 'Empty-state message shown when a live query returns no results',
    },
    {
      name: 'noHistoryResultsLabel',
      type: 'string',
      description: 'Empty-state message shown before any query is typed',
    },
    { name: 'newSearchCta', type: 'string', description: 'Call-to-action label for starting a new search' },
    { name: 'loaderItemsCount', type: 'number', description: 'Number of skeleton loader rows to show during loading' },
    {
      name: 'actions',
      type: 'string[]',
      description:
        'Optional action IDs triggered when a search result or CTA is clicked. The renderer includes the clicked item in the action payload.',
    },
    {
      name: 'popularItems',
      type: '{ title?: string; items: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }',
      description: 'Optional "popular" section shown when the search query is empty.',
    },
    {
      name: 'aiSuggestions',
      type: '{ title?: string; items: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }',
      description: 'Optional AI suggestions section shown when the search query is empty.',
    },
    {
      name: 'articles',
      type: '{ title?: string; items: Array<{ id?: string; title: string; description?: string; icon?: string; date?: number }> }',
      description: 'Optional articles/content section shown when the search query is empty.',
    },
    {
      name: 'children',
      type: 'A2UIComponent[]',
      description: 'Additional components rendered after the main search content.',
    },
    { name: 'styling', type: 'object', description: 'CSS style overrides for the search modal' },
  ],
  examples: [
    '<SearchModal modalProps={{ isOpen, onClose }} results={results} historyResults={recent} />',
    '<SearchModal searchValue={query} isLoading={isLoading} onResultClick={handleResultClick} />',
  ],
};

const compositionTips = [
  'Use SearchModal for global search and command-palette style experiences where focus should move into an overlay.',
  'Drive results, historyResults, and isLoading from external state so the component stays predictable.',
  'Pass modalProps.onClose through to the surrounding state owner; the component assumes the parent controls visibility.',
  'Use distinct empty labels for history and live results so the state change is obvious to users.',
];

export default { component, compositionTips };
