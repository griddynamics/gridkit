'use client';
import { forwardRef, useRef, useCallback, useImperativeHandle, type ChangeEvent, type Ref } from 'react';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { Select, SelectRef } from '@components/atoms/Select';
import { InputRole } from '@types';

import { SearchProps } from './Search.types';

import {
  COMPONENT_NAME,
  DEFAULT_EMPTY_SEARCH_RESULTS_PLACEHOLDER,
  DEFAULT_SEARCH_PLACEHOLDER,
  DEFAULT_SEARCH_WIDTH,
} from './constants';
import { SearchInputStyled } from './SearchStyled';

export const Search = forwardRef((props: SearchProps, forwardedRef: Ref<SelectRef>) => {
  const {
    children,
    emptyItemsResult = DEFAULT_EMPTY_SEARCH_RESULTS_PLACEHOLDER,
    placeholder = DEFAULT_SEARCH_PLACEHOLDER,
    renderOption,
    onType,
    onSelect,
    onChange,
    value,
    width = DEFAULT_SEARCH_WIDTH,
    items,
  } = props;
  const ariaControls = get(props, 'aria-controls');
  const selectRef = useRef<SelectRef>(null);
  const { theme } = useTheme();

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const searchValue = get(event, 'target.value');
      onChange?.(event);
      if (!searchValue) {
        selectRef?.current?.close?.();
        return;
      }

      selectRef?.current?.open?.();
      onType?.(searchValue);
    },
    [selectRef, onType, onChange]
  );
  useImperativeHandle(forwardedRef, () => selectRef.current as SelectRef);

  return (
    <Select
      ref={selectRef}
      width={width}
      autoOpen={false}
      emptyItemsResult={emptyItemsResult}
      renderOption={renderOption}
      items={items}
      initiator={
        <SearchInputStyled
          value={value}
          onChange={handleInputChange}
          aria-required={!!selectRef?.current?.isOpen}
          aria-controls={ariaControls}
          aria-expanded={!!selectRef?.current?.isOpen}
          placeholder={placeholder}
          theme={theme}
          role={InputRole.Combobox}
        />
      }
      onSelect={onSelect}
    >
      {children}
    </Select>
  );
});

Search.displayName = COMPONENT_NAME;
