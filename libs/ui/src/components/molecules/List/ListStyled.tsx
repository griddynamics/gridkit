'use client';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { ListVariant, type BoxStyles } from '@types';

import type { ListStyledProps } from './List.types';

export const ListWrapperStyled = (props: ListStyledProps) => {
  const { theme: { list, ...rest } = {}, $variant = ListVariant.OrderedCircle, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeList = new Proxy(list || {}, tokensHandler(rest));
  const componentStyles = get(themeList, 'wrapper', {});

  const computedStyles = [get(componentStyles, 'default', {}), get(componentStyles, $variant, {}), boxStyles, styles];
  return <ul css={computedStyles} {...restNotStyledProps} />;
};

export const ListItemStyled = (props: ListStyledProps<HTMLLIElement>) => {
  const {
    theme: { list, ...rest } = {},
    $variant = ListVariant.OrderedCircle,
    $size = 'md',
    styles,
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeList = new Proxy(list || {}, tokensHandler(rest));
  const componentStyles = get(themeList, 'item', {});
  const sizeStyles = get(themeList, `size.${$size}`, {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, $variant, {}),
    sizeStyles,
    boxStyles,
    styles,
  ];
  return <li css={computedStyles} {...restNotStyledProps} />;
};
