'use client';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { Input, CommonCssComponentStyledProps } from '@components';

import type { SearchInputProps } from '../SearchModal.types';

export const SearchInputStyled = (props: SearchInputProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'input.default', {});

  return <Input styles={computedStyles} {...restProps} />;
};

export const SearchEndIconWrapperStyled = (props: CommonCssComponentStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'input.endIcon', {});

  return <div css={computedStyles} {...restProps} />;
};
