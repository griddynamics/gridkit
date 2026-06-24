'use client';
import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { BreadcrumbsStyledProps } from './';

export const BreadcrumbsStyled = forwardRef<HTMLDivElement, BreadcrumbsStyledProps>((props, forwardRef) => {
  const { theme: { breadcrumbs, ...rest } = {}, $bordered = false, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeBreadcrumbs = new Proxy(breadcrumbs || {}, tokensHandler(rest));
  const componentStyles = [
    get(themeBreadcrumbs, 'default', {}),
    $bordered ? get(themeBreadcrumbs, 'bordered', {}) : {},
    boxStyles,
    styles,
  ];

  return <div css={componentStyles} {...restNotStyledProps} ref={forwardRef} />;
});

export const BreadcrumbItemStyled = (props: BreadcrumbsStyledProps) => {
  const { theme: { breadcrumbs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeBreadcrumbs = new Proxy(breadcrumbs || {}, tokensHandler(rest));
  const componentStyles = [get(themeBreadcrumbs, 'item.default', {}), styles];

  return <div css={componentStyles} {...restProps} />;
};

export const SeparatorStyled = (props: BreadcrumbsStyledProps) => {
  const { theme: { breadcrumbs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeBreadcrumbs = new Proxy(breadcrumbs || {}, tokensHandler(rest));
  const componentStyles = [get(themeBreadcrumbs, 'separator.default', {}), styles];

  return <div css={componentStyles} {...restProps} />;
};

export const ItemStartStyled = (props: BreadcrumbsStyledProps) => {
  const { theme: { breadcrumbs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeBreadcrumbs = new Proxy(breadcrumbs || {}, tokensHandler(rest));
  const componentStyles = [get(themeBreadcrumbs, 'item.itemStart', {}), styles];

  return <div css={componentStyles} {...restProps} />;
};

export const ItemEndStyled = (props: BreadcrumbsStyledProps) => {
  const { theme: { breadcrumbs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeBreadcrumbs = new Proxy(breadcrumbs || {}, tokensHandler(rest));
  const componentStyles = [get(themeBreadcrumbs, 'item.itemEnd', {}), styles];

  return <div css={componentStyles} {...restProps} />;
};
