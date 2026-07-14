'use client';
import { MouseEvent } from 'react';

import { get } from '@utils';
import { useTheme } from '@hooks/useTheme';
import { InputVariantType } from '@types';
import { Icon } from '@components/atoms/Icon';

import type { SearchInputProps } from '../SearchModal.types';
import { COMPONENT_NAME, DEFAULT_PLACEHOLDER, DEFAULT_CLOSE_ICON } from './constants';
import { SearchInputStyled, SearchEndIconWrapperStyled } from './SearchInputStyled';

export const SearchInput = (props: SearchInputProps = {}) => {
  const { placeholder = DEFAULT_PLACEHOLDER, onEndIconClick, ...rest } = props;
  const { theme } = useTheme();
  const closeIconProps = get(theme, 'searchModal.input.icons.close', { name: DEFAULT_CLOSE_ICON });

  const handleEndIconClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onEndIconClick?.(event);
  };

  return (
    <SearchInputStyled
      theme={theme}
      variant={InputVariantType.Search}
      data-testid={COMPONENT_NAME}
      placeholder={placeholder}
      adornmentEnd={
        <SearchEndIconWrapperStyled theme={theme} onClick={handleEndIconClick}>
          <Icon {...closeIconProps} />
        </SearchEndIconWrapperStyled>
      }
      {...rest}
    />
  );
};

SearchInput.displayName = COMPONENT_NAME;
