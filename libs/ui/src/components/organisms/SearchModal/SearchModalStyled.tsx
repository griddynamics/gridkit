'use client';
import { CSSObject } from '@emotion/react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { Modal } from '@components/organisms/Modal';

import type { BoxStyles } from '@types';
import type { SearchModalStyledProps, SearchModalCommonStyledProps } from './';

export const SearchModalStyled = (props: SearchModalStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = [get(themeSearchModal, 'default', {}), boxStyles, styles] as unknown as CSSObject;

  return <Modal styles={computedStyles} isCustomView={true} closeOnEscape={true} {...restNotStyledProps} />;
};

export const SearchModalWrapperStyled = (props: SearchModalCommonStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = [get(themeSearchModal, 'wrapper', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} />;
};
