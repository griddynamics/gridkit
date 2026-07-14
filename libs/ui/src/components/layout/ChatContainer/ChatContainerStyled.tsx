import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { Button, type ButtonProps } from '@components';
import { ButtonVariant, type BoxStyles } from '@types';
import { getMediaQuery } from '@tokens';

import type { SidebarWrapperStyledProps, ChatCommonStyledProps, SidebarToggleButtonStyledProps } from './';

export const MainWrapperStyled = forwardRef<HTMLDivElement, ChatCommonStyledProps>((props, forwardedRef) => {
  const { theme: { chat, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const computedStyles = [get(themeChat, 'wrapper.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const MainHeaderStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const computedStyles = [get(themeChat, 'mainHeader', {}), boxStyles];
  return <header css={computedStyles} {...restNotStyledProps} />;
};

export const BodyStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const computedStyles = [get(themeChat, 'body', {}), boxStyles];

  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const SidebarWrapperStyled = (props: SidebarWrapperStyledProps) => {
  const { theme: { chat, ...rest } = {}, $open, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeChat, 'sidebarWrapper.default', {}),
    get(themeChat, $open ? 'sidebarWrapper.open' : 'sidebarWrapper.close', {}),
    getMediaQuery({ max: get(rest, 'breakpoints.md') }, get(chat, ['sidebarWrapper', 'md'], (t: any) => ({}))(rest)),
    boxStyles,
  ];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const SidebarStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, $open, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeChat, 'sidebar.default', {}),
    get(themeChat, $open ? 'sidebar.open' : 'sidebar.close', {}),
    boxStyles,
  ];

  return <aside css={computedStyles} {...restNotStyledProps} />;
};

export const SidebarMinifiedStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, $open, ...restProps } = props;
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeChat, 'sidebarMinified.default', {}),
    get(themeChat, $open ? 'sidebarMinified.open' : 'sidebarMinified.close', {}),
  ];

  return <aside css={computedStyles} {...restProps} />;
};

export const SidebarHeaderStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const computedStyles = [get(themeChat, 'sidebarHeader', {}), get(themeChat, 'sidebar.open', {}), boxStyles];

  return <header css={computedStyles} {...restNotStyledProps} />;
};

export const SidebarContentWrapperStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, ...restProps } = props;
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const computedStyles = [get(themeChat, 'sidebarContentWrapper', {}), get(themeChat, 'sidebar.open', {})];

  return <div css={computedStyles} {...restProps} />;
};

export const ContentStyled = (props: ChatCommonStyledProps) => {
  const { theme: { chat, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeChat, 'content.default', {}),
    getMediaQuery({ max: get(rest, 'breakpoints.md') }, get(chat, 'content.md', {})),
    getMediaQuery(
      { min: get(rest, 'breakpoints.md'), max: get(rest, 'breakpoints.xl') },
      get(chat, 'content.mdXl', {})
    ),
    getMediaQuery({ min: get(rest, 'breakpoints.xl') }, get(chat, 'content.xl', {})),
    boxStyles,
    styles,
  ];

  return <main css={computedStyles} {...restNotStyledProps} />;
};

export const SidebarToggleButtonStyled = (props: SidebarToggleButtonStyledProps) => {
  const { theme: { chat, ...rest } = {}, $open, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeChat = new Proxy(chat || {}, tokensHandler(rest));
  const openStyles = $open ? get(themeChat, 'toggleButton.open') : {};
  const btnProps = get(themeChat, 'toggleButton.attrs', { variant: ButtonVariant.Text });
  const computedStyles = { ...get(themeChat, 'toggleButton.default'), ...openStyles, ...boxStyles };

  return <Button {...({ ...btnProps, ...restNotStyledProps } as ButtonProps)} isIcon styles={computedStyles} />;
};
