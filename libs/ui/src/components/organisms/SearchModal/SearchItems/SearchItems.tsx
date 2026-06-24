'use client';
import { Fragment, MouseEvent } from 'react';

import { get, formatDate } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { Icon } from '@components/atoms/Icon';

import { SearchItemsProps, SearchModalResultItemProps } from '../SearchModal.types';
import {
  COMPONENT_NAME,
  COMPONENT_GROUP_TITLE,
  COMPONENT_EMPTY_NAME,
  NEW_SEARCH,
  NEW_CHAT_ICON,
  NO_RESULTS_ICON,
  COMPONENT_ITEM_NAME,
} from './constants';
import { getIcon } from './utils';
import {
  SearchItemsStyled,
  NewSearchButtonStyled,
  SearchNoItemsStyled,
  SearchGroupTitleStyled,
  SearchItemStyled,
  SearchItemContentStyled,
  SearchItemRowStyled,
  SearchItemColumnStyled,
} from './SearchItemsStyled';

export const SearchItems = (props: SearchItemsProps = {}) => {
  const { items, onItemClick, newSearchCta, noItemsLabel } = props;
  const { theme } = useTheme();
  const newChatIconProps = get(theme, 'searchModal.items.icons.newChat', { name: NEW_CHAT_ICON });
  const noResultsIconProps = get(theme, 'searchModal.items.icons.noResults', { name: NO_RESULTS_ICON });
  const itemIconProps = get(theme, 'searchModal.items.icons.item', {});

  const handleItemClick = (item: string | SearchModalResultItemProps) => (event: MouseEvent<HTMLButtonElement>) => {
    onItemClick?.(event, item);
  };
  const renderItems = (item: SearchModalResultItemProps, idx: number) => (
    <SearchItemStyled
      iconStart={getIcon(item?.icon, itemIconProps)}
      key={item?.id || `${COMPONENT_ITEM_NAME}-${idx}`}
      theme={theme}
      onClick={handleItemClick(item)}
      data-testid={COMPONENT_ITEM_NAME}
    >
      <SearchItemRowStyled theme={theme}>
        <SearchItemColumnStyled theme={theme}>
          <SearchItemContentStyled theme={theme} $variant="title" title={item.title}>
            {item.title}
          </SearchItemContentStyled>
          {item?.description && (
            <SearchItemContentStyled theme={theme} $variant="description" title={item.description}>
              {item.description}
            </SearchItemContentStyled>
          )}
        </SearchItemColumnStyled>
        {item?.date && (
          <SearchItemContentStyled theme={theme} $variant="date">
            {formatDate({ date: item.date })}
          </SearchItemContentStyled>
        )}
      </SearchItemRowStyled>
    </SearchItemStyled>
  );

  return (
    <SearchItemsStyled theme={theme} data-testid={COMPONENT_NAME}>
      {newSearchCta && (
        <NewSearchButtonStyled
          theme={theme}
          onClick={handleItemClick(NEW_SEARCH)}
          iconStart={<Icon {...newChatIconProps} />}
        >
          {newSearchCta}
        </NewSearchButtonStyled>
      )}
      {items?.length ? (
        items.map((item, idx) => {
          const isGroupTitle = 'items' in item;

          return isGroupTitle ? (
            <Fragment key={item?.id || `${COMPONENT_ITEM_NAME}-${idx}`}>
              <SearchGroupTitleStyled theme={theme} data-testid={COMPONENT_GROUP_TITLE} title={item.title}>
                {item.title}
              </SearchGroupTitleStyled>
              {(item?.items || []).map((subItem, subItemIdx) => renderItems(subItem, subItemIdx))}
            </Fragment>
          ) : (
            renderItems(item as SearchModalResultItemProps, idx)
          );
        })
      ) : (
        <SearchNoItemsStyled theme={theme} data-testid={COMPONENT_EMPTY_NAME}>
          {!newSearchCta && <Icon {...noResultsIconProps} />}
          {noItemsLabel}
        </SearchNoItemsStyled>
      )}
    </SearchItemsStyled>
  );
};

SearchItems.displayName = COMPONENT_NAME;
