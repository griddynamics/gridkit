'use client';
import { forwardRef, PropsWithChildren } from 'react';

import { useTheme } from '@hooks/useTheme';
import { get } from '@utils';

import {
  COMPONENT_NAME,
  DEFAULT_LOADER_ITEMS_COUNT,
  DEFAULT_NO_HISTORY_RESULTS,
  DEFAULT_NO_RESULTS,
  DEFAULT_NEW_SEARCH,
} from './constants';
import { SearchModalStyled, SearchModalWrapperStyled } from './SearchModalStyled';
import { SearchInput } from './SearchInput';
import { SearchLoader } from './SearchLoader';
import { SearchItems } from './SearchItems';
import type { SearchModalProps, SearchModalSectionProps } from './SearchModal.types';

const SearchSection = ({
  section,
  theme,
  testId,
}: {
  section: SearchModalSectionProps;
  theme: Record<string, unknown>;
  testId: string;
}) => {
  const sectionStyles = get(theme, 'searchModal.section.default', {});
  const sectionTitleStyles = get(theme, 'searchModal.section.title', {});

  return (
    <div css={sectionStyles} data-testid={testId}>
      {section.title && <div css={sectionTitleStyles}>{section.title}</div>}
      {section.content}
    </div>
  );
};

export const SearchModal = forwardRef<HTMLDivElement, PropsWithChildren<SearchModalProps>>((props, forwardedRef) => {
  const {
    children,
    onResultClick,
    results = [],
    historyResults = [],
    searchValue = '',
    isLoading = false,
    noHistoryResultsLabel = DEFAULT_NO_HISTORY_RESULTS,
    noResultsLabel = DEFAULT_NO_RESULTS,
    newSearchCta = DEFAULT_NEW_SEARCH,
    loaderItemsCount = DEFAULT_LOADER_ITEMS_COUNT,
    modalProps = {},
    searchProps = {},
    popularItems,
    aiSuggestions,
    articles,
    ...rest
  } = props;
  const { theme } = useTheme();

  let searchItems = historyResults;
  let noItemsLabel = noHistoryResultsLabel;
  let newCta = newSearchCta;

  if (searchValue) {
    searchItems = results;
    noItemsLabel = noResultsLabel;
    newCta = '';
  }

  const showSections = !searchValue && !isLoading;

  return (
    <SearchModalStyled theme={theme} ref={forwardedRef} data-testid={COMPONENT_NAME} {...modalProps} {...rest}>
      <SearchInput onEndIconClick={modalProps?.onClose} {...searchProps} defaultValue={searchValue} />
      <SearchModalWrapperStyled theme={theme}>
        {isLoading ? (
          <SearchLoader itemsCount={loaderItemsCount} />
        ) : (
          <SearchItems
            onItemClick={onResultClick}
            items={searchItems}
            newSearchCta={newCta}
            noItemsLabel={noItemsLabel}
          />
        )}
        {showSections && popularItems && (
          <SearchSection section={popularItems} theme={theme} testId={`${COMPONENT_NAME}-popular`} />
        )}
        {showSections && aiSuggestions && (
          <SearchSection section={aiSuggestions} theme={theme} testId={`${COMPONENT_NAME}-ai-suggestions`} />
        )}
        {showSections && articles && (
          <SearchSection section={articles} theme={theme} testId={`${COMPONENT_NAME}-articles`} />
        )}
      </SearchModalWrapperStyled>
      {children}
    </SearchModalStyled>
  );
});

SearchModal.displayName = COMPONENT_NAME;
