'use client';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import { Input } from '@components';
import type { BoxStyles } from '@types';

import type { SearchInputStyledProps } from './';

export const SearchInputStyled = (props: SearchInputStyledProps) => {
  const { theme: { search, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSearch = new Proxy(search || {}, tokensHandler(rest));
  const computedStyles = [get(themeSearch, 'input.default', {}), boxStyles, styles];
  return <Input css={computedStyles} {...restNotStyledProps} />;
};
