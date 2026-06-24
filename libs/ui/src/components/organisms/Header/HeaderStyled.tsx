'use client';
import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, resolveThemeColor, tokensHandler } from '@tokens/utils';
import { Column, Row } from '@components/layout';
import type { BoxStyles } from '@types';

import type {
  HeaderStyledProps,
  HeaderCommonStyledProps,
  HeaderCommonRowStyledProps,
  HeaderCommonColumnStyledProps,
} from './Header.types';

export const HeaderStyled = forwardRef<HTMLDivElement, HeaderStyledProps>((props, forwardedRef) => {
  const { theme: { flexContainer, header, colors, ...rest } = {}, styles, $backgroundColor, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const backgroundColor = resolveThemeColor(colors, $backgroundColor);
  const computedStyles = [
    get(flexContainer, 'default', {}),
    get(themeHeader, 'container', {}),
    boxStyles,
    backgroundColor ? { backgroundColor } : {},
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TopBannerRowStyled = (props: HeaderCommonRowStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Row css={get(themeHeader, 'topBannerRow', {})} {...restProps} />;
};

export const NavigationRowStyled = (props: HeaderCommonRowStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Row css={get(themeHeader, 'navigationRow.default', {})} {...restProps} />;
};

export const SearchColumnStyled = (props: HeaderCommonColumnStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Column css={get(themeHeader, 'searchColumn.default', {})} {...restProps} />;
};

export const ActionsColumnStyled = (props: HeaderCommonColumnStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Column css={get(themeHeader, 'actionsColumn.default', {})} {...restProps} />;
};

export const MenuRowStyled = (props: HeaderCommonRowStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));

  return <Row css={get(themeHeader, 'menuRow.default', {})} {...restProps} />;
};

export const MenuColumnStyled = (props: HeaderCommonRowStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Row css={get(themeHeader, 'menuRow.column', {})} {...restProps} />;
};

export const ChildrenRowStyled = (props: HeaderCommonRowStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Row css={get(themeHeader, 'children.default', {})} {...restProps} />;
};

export const MobileMenuOpenedDropdownWrapperStyled = (props: HeaderCommonStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <div css={get(themeHeader, 'mobile.openedDropdownWrapper', {})} {...restProps} />;
};

export const CloseMenuIconWrapperStyled = (props: HeaderCommonStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <div css={get(themeHeader, 'mobile.closeMenuIconWrapper', {})} {...restProps} />;
};

export const MobileMenuWrapperStyled = (props: HeaderCommonStyledProps) => {
  const { theme: { header, flexContainer, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  const computedStyles = [get(flexContainer, 'default', {}), get(themeHeader, 'mobile.menuWrapper', {})];

  return <div css={computedStyles} {...restProps} />;
};

export const MobileMenuItemWrapperStyled = (props: HeaderCommonRowStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <Row css={get(themeHeader, 'mobile.menuItemWrapper', {})} {...restProps} />;
};

export const OpenMenuIconWrapperStyled = (props: HeaderCommonStyledProps) => {
  const { theme: { header, ...rest } = {}, ...restProps } = props;
  const themeHeader = new Proxy(header || {}, tokensHandler(rest));
  return <div css={get(themeHeader, 'mobile.openMenuIconWrapper', {})} {...restProps} />;
};
