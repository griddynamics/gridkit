import type { ReactNode } from 'react';
import { Search, SearchModal } from '@components';
import { SearchItems } from '@components/organisms/SearchModal/SearchItems';
import type { A2UIComponent } from '../../../ai';
import {
  getComponentStyles,
  getSelectItems,
  getObjectArrayField,
  getObjectField,
  isRecord,
  dispatchComponentActions,
} from '../helpers';

type SearchModalItemSpec = {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  date?: number;
  items?: SearchModalItemSpec[];
};

type SearchModalSectionSpec = {
  title?: string;
  items: SearchModalItemSpec[];
};

function normalizeSearchModalItem(
  rawItem: Record<string, unknown>,
  parentId: string,
  index: number
): SearchModalItemSpec | null {
  const title = typeof rawItem['title'] === 'string' ? rawItem['title'] : undefined;
  if (!title) {
    return null;
  }

  const rawItems = Array.isArray(rawItem['items']) ? rawItem['items'].filter(isRecord) : undefined;

  return {
    id: typeof rawItem['id'] === 'string' ? rawItem['id'] : `${parentId}_item_${index + 1}`,
    title,
    description: typeof rawItem['description'] === 'string' ? rawItem['description'] : undefined,
    icon: typeof rawItem['icon'] === 'string' ? rawItem['icon'] : undefined,
    date: typeof rawItem['date'] === 'number' ? rawItem['date'] : undefined,
    ...(rawItems
      ? {
          items: rawItems
            .map((item, childIndex) => normalizeSearchModalItem(item, `${parentId}_group_${index + 1}`, childIndex))
            .filter((item): item is SearchModalItemSpec => item !== null),
        }
      : {}),
  };
}

function getSearchModalItems(component: A2UIComponent, fieldName: 'results' | 'historyResults') {
  return getObjectArrayField(component, fieldName)
    .map((item, index) => normalizeSearchModalItem(item, `${component.id}_${fieldName}`, index))
    .filter((item): item is SearchModalItemSpec => item !== null);
}

function getSearchModalSection(component: A2UIComponent, fieldName: 'popularItems' | 'aiSuggestions' | 'articles') {
  const rawSection = getObjectField(component, fieldName);
  if (!rawSection) {
    return undefined;
  }

  const items = Array.isArray(rawSection['items'])
    ? rawSection['items']
        .filter(isRecord)
        .map((item, index) => normalizeSearchModalItem(item, `${component.id}_${fieldName}`, index))
        .filter((item): item is SearchModalItemSpec => item !== null)
    : [];

  return {
    title: typeof rawSection['title'] === 'string' ? rawSection['title'] : undefined,
    items,
  } satisfies SearchModalSectionSpec;
}

function buildSearchModalSection(
  section: SearchModalSectionSpec | undefined,
  onItemClick?: (event: unknown, item: string | SearchModalItemSpec) => void
) {
  if (!section || section.items.length === 0) {
    return undefined;
  }

  return {
    title: section.title,
    content: <SearchItems items={section.items} onItemClick={onItemClick as never} />,
  };
}

export const searchRenderers = {
  search: (
    component: A2UIComponent,
    _renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => (
    <Search
      key={component.id}
      value={typeof component.value === 'string' ? component.value : undefined}
      placeholder={component.placeholder}
      items={getSelectItems(component)}
      emptyItemsResult={component.emptyItemsResult}
      width={
        typeof component.width === 'string'
          ? component.width
          : typeof component.styling?.width === 'string'
            ? component.styling?.width
            : undefined
      }
      onType={
        dispatchAction && component.actions?.length
          ? (value: string) => dispatchComponentActions(component, dispatchAction, { trigger: 'type', value })
          : undefined
      }
      onSelect={
        dispatchAction && component.actions?.length
          ? ({ data, index }) =>
              dispatchComponentActions(component, dispatchAction, {
                trigger: 'select',
                option: data,
                value: data.value,
                label: data.name,
                index,
              })
          : undefined
      }
    />
  ),
  'search-modal': (
    component: A2UIComponent,
    renderChildren: (children?: A2UIComponent[]) => ReactNode[],
    dispatchAction?: (actionId: string, extraPayload?: Record<string, unknown>) => boolean
  ) => {
    const handleItemClick =
      dispatchAction && component.actions?.length
        ? (_event: unknown, item: string | SearchModalItemSpec) =>
            dispatchComponentActions(component, dispatchAction, {
              trigger: 'select',
              item,
              value: typeof item === 'string' ? item : item.title,
            })
        : undefined;

    return (
      <SearchModal
        key={component.id}
        searchValue={component.searchValue}
        isLoading={component.isLoading}
        results={getSearchModalItems(component, 'results')}
        historyResults={getSearchModalItems(component, 'historyResults')}
        noHistoryResultsLabel={component.noHistoryResultsLabel}
        noResultsLabel={component.noResultsLabel}
        newSearchCta={component.newSearchCta}
        loaderItemsCount={component.loaderItemsCount}
        onResultClick={handleItemClick as never}
        popularItems={
          buildSearchModalSection(getSearchModalSection(component, 'popularItems'), handleItemClick) as never
        }
        aiSuggestions={
          buildSearchModalSection(getSearchModalSection(component, 'aiSuggestions'), handleItemClick) as never
        }
        articles={buildSearchModalSection(getSearchModalSection(component, 'articles'), handleItemClick) as never}
        modalProps={{ isOpen: true }}
        searchProps={component.placeholder ? { placeholder: component.placeholder } : undefined}
        styles={getComponentStyles(component.styling)}
      >
        {renderChildren(component.children)}
      </SearchModal>
    );
  },
};
