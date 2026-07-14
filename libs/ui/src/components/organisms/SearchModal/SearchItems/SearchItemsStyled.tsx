'use client';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { Row, Column, Button, ButtonProps, RowProps, ColumnProps } from '@components';

import type { SearchItemContentStyledProps, SearchModalCommonStyledProps } from '../SearchModal.types';

export const SearchItemsStyled = (props: SearchModalCommonStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'items.default', {});

  return <div css={computedStyles} {...restProps} />;
};

export const NewSearchButtonStyled = (props: SearchModalCommonStyledProps<HTMLButtonElement> & ButtonProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const componentProps = get(themeSearchModal, 'items.newSearchBtn', {});
  const computedStyles = get(componentProps, 'styles', {});
  const attr = get(componentProps, 'attrs', {});

  return <Button css={computedStyles} {...({ ...attr, ...restProps } as ButtonProps)} />;
};

export const SearchNoItemsStyled = (props: SearchModalCommonStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'items.noResult', {});

  return <div css={computedStyles} {...restProps} />;
};

export const SearchGroupTitleStyled = (props: SearchModalCommonStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'items.groupTitle', {});

  return <div css={computedStyles} {...restProps} />;
};

export const SearchItemStyled = (props: SearchModalCommonStyledProps<HTMLButtonElement> & ButtonProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const componentProps = get(themeSearchModal, 'items.item', {});
  const computedStyles = get(componentProps, 'styles', {});
  const attr = get(componentProps, 'attrs', {});

  return <Button css={computedStyles} {...({ ...attr, ...restProps } as ButtonProps)} />;
};

export const SearchItemRowStyled = (props: SearchModalCommonStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'items.itemRow', {});

  return <Row css={computedStyles} {...(restProps as RowProps)} />;
};

export const SearchItemColumnStyled = (props: SearchModalCommonStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, 'items.itemColumn', {});

  return <Column css={computedStyles} {...(restProps as ColumnProps)} />;
};

export const SearchItemContentStyled = (props: SearchItemContentStyledProps) => {
  const { theme: { searchModal, ...rest } = {}, $variant = 'default', ...restProps } = props;
  const themeSearchModal = new Proxy(searchModal || {}, tokensHandler(rest));
  const computedStyles = get(themeSearchModal, `items.itemContent.${$variant}`, {});

  return <div css={computedStyles} {...restProps} />;
};
