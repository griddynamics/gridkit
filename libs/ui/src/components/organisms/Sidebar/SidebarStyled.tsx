'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import type { BoxStyles } from '@types';
import type { SidebarStyledProps, SidebarItemStyledProps, SidebarGroupStyledProps } from './Sidebar.types';

export const SidebarStyled = forwardRef<HTMLElement, SidebarStyledProps>((props, forwardedRef) => {
  const { theme: { sidebar, ...rest } = {}, $collapsed, $width, $collapsedWidth, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSidebar = new Proxy(sidebar || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeSidebar, 'container.default', {}),
    { width: $collapsed ? $collapsedWidth : $width },
    boxStyles,
    styles,
  ];

  return <nav css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const SidebarHeaderStyled = forwardRef<
  HTMLDivElement,
  { theme?: Record<string, unknown>; children?: React.ReactNode }
>((props, forwardedRef) => {
  const { theme: { sidebar, ...rest } = {} as Record<string, unknown>, ...restProps } = props;
  const themeSidebar = new Proxy(sidebar || {}, tokensHandler(rest));

  return <div css={get(themeSidebar, 'header.default', {})} {...restProps} ref={forwardedRef} />;
});

export const SidebarContentStyled = forwardRef<
  HTMLDivElement,
  { theme?: Record<string, unknown>; children?: React.ReactNode }
>((props, forwardedRef) => {
  const { theme: { sidebar, ...rest } = {} as Record<string, unknown>, ...restProps } = props;
  const themeSidebar = new Proxy(sidebar || {}, tokensHandler(rest));

  return <div css={get(themeSidebar, 'content.default', {})} {...restProps} ref={forwardedRef} />;
});

export const SidebarFooterStyled = forwardRef<
  HTMLDivElement,
  { theme?: Record<string, unknown>; children?: React.ReactNode }
>((props, forwardedRef) => {
  const { theme: { sidebar, ...rest } = {} as Record<string, unknown>, ...restProps } = props;
  const themeSidebar = new Proxy(sidebar || {}, tokensHandler(rest));

  return <div css={get(themeSidebar, 'footer.default', {})} {...restProps} ref={forwardedRef} />;
});

export const SidebarItemStyled = forwardRef<HTMLButtonElement, SidebarItemStyledProps>((props, forwardedRef) => {
  const {
    theme: { sidebar, ...rest } = {},
    $isActive,
    $depth,
    $disabled,
    $collapsed,
    styles = {},
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSidebar = new Proxy(sidebar || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeSidebar, 'item.default', {}),
    $depth > 0
      ? {
          paddingLeft: `${
            (get(themeSidebar, 'item.nested.paddingBase', 16) as number) +
            $depth * (get(themeSidebar, 'item.nested.paddingMultiplier', 16) as number)
          }px`,
        }
      : {},
    $isActive ? get(themeSidebar, 'item.active', {}) : {},
    $disabled ? get(themeSidebar, 'item.disabled', {}) : {},
    $collapsed ? get(themeSidebar, 'item.collapsed', {}) : {},
    boxStyles,
    styles,
  ];

  return <button type="button" css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const SidebarGroupStyled = forwardRef<HTMLDivElement, SidebarGroupStyledProps>((props, forwardedRef) => {
  const { theme: { sidebar, ...rest } = {}, $isExpanded, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSidebar = new Proxy(sidebar || {}, tokensHandler(rest));

  const computedStyles = [
    get(themeSidebar, 'group.default', {}),
    $isExpanded ? get(themeSidebar, 'group.expanded', {}) : get(themeSidebar, 'group.collapsed', {}),
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});
