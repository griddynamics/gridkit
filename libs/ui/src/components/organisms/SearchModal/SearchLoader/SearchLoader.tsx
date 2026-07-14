'use client';
import { useTheme } from '@hooks/useTheme';

import { Skeleton } from '@components/atoms/Skeleton';

import { SearchLoaderProps } from '../SearchModal.types';
import { COMPONENT_NAME } from './constants';
import { SearchLoaderStyled } from './SearchLoaderStyled';

export const SearchLoader = (props: SearchLoaderProps) => {
  const { itemsCount } = props;
  const { theme } = useTheme();

  return (
    <SearchLoaderStyled theme={theme} data-testid={COMPONENT_NAME}>
      {Array.from({ length: itemsCount }).map((_, idx) => (
        <Skeleton key={idx} height="20px" />
      ))}
    </SearchLoaderStyled>
  );
};

SearchLoader.displayName = COMPONENT_NAME;
