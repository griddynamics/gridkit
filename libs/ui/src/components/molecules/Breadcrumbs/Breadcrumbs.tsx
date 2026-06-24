'use client';
import { forwardRef, Fragment } from 'react';

import useTheme from '@hooks/useTheme';

import { COMPONENT_NAME } from './constants';
import {
  BreadcrumbsStyled,
  ItemStartStyled,
  BreadcrumbItemStyled,
  SeparatorStyled,
  ItemEndStyled,
} from './BreadcrumbsStyled';
import type { BreadcrumbsProps } from './';

export const Breadcrumbs = forwardRef<HTMLDivElement, BreadcrumbsProps>((props, forwardedRef) => {
  const {
    separator,
    itemStart,
    itemEnd,
    separatorAfterLastItem = false,
    items = [],
    bordered,
    ariaLabel = 'breadcrumb',
    ...rest
  } = props;
  const { theme } = useTheme();

  return (
    <BreadcrumbsStyled
      ref={forwardedRef}
      $bordered={bordered}
      theme={theme}
      data-testid={COMPONENT_NAME}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
      {...rest}
    >
      {itemStart ? (
        <ItemStartStyled theme={theme} data-testid={`${COMPONENT_NAME}-item-start`}>
          {itemStart}
        </ItemStartStyled>
      ) : null}
      {items.map((item, index) => (
        <Fragment key={`${COMPONENT_NAME}-${index}`}>
          <BreadcrumbItemStyled theme={theme} data-testid={`${COMPONENT_NAME}-item`}>
            {item}
          </BreadcrumbItemStyled>
          {separator && (separatorAfterLastItem || index < items.length - 1) ? (
            <SeparatorStyled theme={theme} data-testid={`${COMPONENT_NAME}-separator`}>
              {separator}
            </SeparatorStyled>
          ) : null}
        </Fragment>
      ))}
      {itemEnd ? (
        <ItemEndStyled theme={theme} data-testid={`${COMPONENT_NAME}-item-end`}>
          {itemEnd}
        </ItemEndStyled>
      ) : null}
    </BreadcrumbsStyled>
  );
});

Breadcrumbs.displayName = COMPONENT_NAME;
