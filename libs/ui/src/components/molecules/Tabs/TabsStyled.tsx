'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';
import { Button } from '@components';
import { ButtonRole, ButtonVariant } from '@types';

import { StyledTextButtonProps, TabLabelStyledProps, TabsStyledProps } from './Tabs.types';

export const TabsStyled = forwardRef<HTMLDivElement, TabsStyledProps>((props, forwardRef) => {
  const { theme: { tabs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  const computedStyles = [get(themeTabs, 'default', {}), styles];

  return <div css={computedStyles} {...restProps} ref={forwardRef} />;
});

export const TabsHeaderStyled = (props: TabsStyledProps) => {
  const { theme: { tabs, ...rest } = {}, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  return <div css={[get(themeTabs, 'header.default', {})]} {...restProps} />;
};

export const TabLabelStyled = (props: TabLabelStyledProps) => {
  const { theme: { tabs, ...rest } = {}, $isDisabled, $isActive, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  const componentStyles = get(themeTabs, 'label', {});
  const baseDisabledStyles = get(componentStyles, 'disabled', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    $isActive ? get(componentStyles, 'active', {}) : {},
    $isDisabled ? get(baseDisabledStyles, 'default', {}) : {},
    $isDisabled && $isActive ? get(baseDisabledStyles, 'active', {}) : {},
  ];
  return <div css={computedStyles} {...restProps} />;
};

export const TabPanelsWrapperStyled = (props: TabsStyledProps) => {
  const { theme: { tabs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  const computedStyles = [get(themeTabs, 'panelsWrapper.default', {}), styles];
  return <div css={computedStyles} {...restProps} />;
};

export const TabPanelStyled = (props: TabsStyledProps) => {
  const { theme: { tabs, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  const computedStyles = [get(themeTabs, 'panel.default', {}), styles];
  return <div css={computedStyles} {...restProps} />;
};

export const NoticeCounterStyled = (props: TabLabelStyledProps) => {
  const { theme: { tabs, ...rest } = {}, $isDisabled, $isActive, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  const componentStyles = get(themeTabs, 'noticeCounter', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    $isActive ? get(componentStyles, 'active', {}) : {},
    $isDisabled ? get(componentStyles, 'disabled', {}) : {},
  ];

  return <span css={computedStyles} {...restProps} />;
};

export const TextButtonStyled = (props: StyledTextButtonProps) => {
  const { theme: { tabs, ...rest } = {}, ...restProps } = props;
  const themeTabs = new Proxy(tabs || {}, tokensHandler(rest));
  const computedStyles = [get(themeTabs, 'tabButton.default', {})];
  return <Button css={computedStyles} variant={ButtonVariant.Text} role={ButtonRole.Tab} {...restProps} />;
};
