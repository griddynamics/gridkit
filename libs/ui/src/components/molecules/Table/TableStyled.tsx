import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';

import { Button, type ButtonProps } from '@components';

import type { BoxStyles } from '@types';
import { CommonCssComponentStyledProps } from '@components/index.types';
import {
  TableStyledProps,
  TableHeadStyledProps,
  TableBodyStyledProps,
  TableFooterStyledProps,
  TableRowStyledProps,
  TableCellStyledProps,
  TableHeaderCellStyledProps,
  TablePaginationStyledProps,
} from './';

export const TableStyled = forwardRef<HTMLTableElement, TableStyledProps>((props, forwardedRef) => {
  const { theme: { table, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const computedStyles = [get(themeTable, 'default', {}), boxStyles, styles];

  return <table css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TableHeadStyled = forwardRef<HTMLTableSectionElement, TableHeadStyledProps>((props, forwardedRef) => {
  const { theme: { table, ...rest } = {}, styles = {}, $sticky, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const componentStyles = get(themeTable, 'header', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, $sticky ? 'sticky' : 'base', {}),
    boxStyles,
    styles,
  ];

  return <thead css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TableRowStyled = forwardRef<HTMLTableRowElement, TableRowStyledProps>((props, forwardedRef) => {
  const {
    theme: { table, ...rest } = {},
    styles = {},
    $expanded,
    $expandable,
    $isHeader,
    $isFooter,
    ...restProps
  } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const componentStyles = get(themeTable, 'row', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    $isHeader && get(componentStyles, 'header', {}),
    $isFooter && get(componentStyles, 'footer', {}),
    !($isHeader || $isFooter) && get(componentStyles, 'body', {}),
    $expandable && get(componentStyles, 'expandable', {}),
    $expanded && get(componentStyles, 'expanded', {}),
    boxStyles,
    styles,
  ];

  return <tr css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TableHeaderCellStyled = forwardRef<HTMLTableCellElement, TableHeaderCellStyledProps>(
  (props, forwardedRef) => {
    const { theme: { table, ...rest } = {}, styles = {}, ...restProps } = props;
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeTable = new Proxy(table || {}, tokensHandler(rest));
    const computedStyles = [get(themeTable, 'headerCell.default', {}), boxStyles, styles];

    return <th css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
  }
);

export const TableCellStyled = forwardRef<HTMLTableCellElement, TableCellStyledProps>((props, forwardedRef) => {
  const { theme: { table, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const computedStyles = [get(themeTable, 'cell.default', {}), boxStyles, styles];

  return <td css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TableBodyStyled = forwardRef<HTMLTableSectionElement, TableBodyStyledProps>((props, forwardedRef) => {
  const { theme: { table, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const computedStyles = [get(themeTable, 'body.default', {}), boxStyles, styles];

  return <tbody css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TableFooterStyled = forwardRef<HTMLTableSectionElement, TableFooterStyledProps>((props, forwardedRef) => {
  const { theme: { table, ...rest } = {}, styles = {}, $sticky, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const componentStyles = get(themeTable, 'footer', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, $sticky ? 'sticky' : 'base', {}),
    boxStyles,
    styles,
  ];

  return <tfoot css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const TablePaginationStyled = forwardRef<HTMLDivElement, TablePaginationStyledProps>((props, forwardedRef) => {
  const { theme: { table, ...rest } = {}, $sticky, ...restProps } = props;
  const themeTable = new Proxy(table || {}, tokensHandler(rest));
  const componentStyles = get(themeTable, 'pagination', {});
  const computedStyles = [get(componentStyles, 'default', {}), $sticky && get(componentStyles, 'sticky', {})];

  return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const ButtonPerPageStyled = forwardRef<HTMLButtonElement, ButtonProps & CommonCssComponentStyledProps>(
  (props, forwardedRef) => {
    const { theme: { table, ...rest } = {}, ...restProps } = props;
    const themeTable = new Proxy(table || {}, tokensHandler(rest));
    const componentStyles = get(themeTable, 'pagination.buttonPerPage', {});

    return (
      <Button
        css={get(componentStyles, 'default', {})}
        {...get(componentStyles, 'attrs', {})}
        {...restProps}
        ref={forwardedRef}
      />
    );
  }
);

export const ButtonPageStyled = forwardRef<HTMLButtonElement, ButtonProps & CommonCssComponentStyledProps>(
  (props, forwardedRef) => {
    const { theme: { table, ...rest } = {}, ...restProps } = props;
    const themeTable = new Proxy(table || {}, tokensHandler(rest));
    const componentStyles = get(themeTable, 'pagination.buttonPage', {});

    return (
      <Button
        css={get(componentStyles, 'default', {})}
        {...get(componentStyles, 'attrs', {})}
        {...restProps}
        ref={forwardedRef}
      />
    );
  }
);

export const TablePaginationLeftSectionStyled = forwardRef<HTMLDivElement, TablePaginationStyledProps>(
  (props, forwardedRef) => {
    const { theme: { table, ...rest } = {}, ...restProps } = props;
    const themeTable = new Proxy(table || {}, tokensHandler(rest));
    const computedStyles = [get(themeTable, 'pagination.leftSection', {})];

    return <div css={computedStyles} {...restProps} ref={forwardedRef} />;
  }
);

export const TablePaginationRightSectionStyled = forwardRef<HTMLDivElement, TablePaginationStyledProps>(
  (props, forwardedRef) => {
    const { theme: { table, ...rest } = {}, ...restProps } = props;
    const themeTable = new Proxy(table || {}, tokensHandler(rest));

    return <div css={get(themeTable, 'pagination.rightSection', {})} {...restProps} ref={forwardedRef} />;
  }
);
