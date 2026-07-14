import { forwardRef } from 'react';

import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { ModalContentStyledProps, ModalCommonStyledProps, ModalHeaderStyledProps } from './Modal.types';

export const ModalOverlayStyled = (props: ModalCommonStyledProps) => {
  const { theme: { modal, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const computedStyles = [get(themeModal, 'overlay.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const ModalContentStyled = forwardRef<HTMLDivElement, ModalContentStyledProps>((props, forwardedRef) => {
  const { theme: { modal, ...rest } = {}, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as unknown as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const computedStyles = [get(themeModal, 'content.default', {}), boxStyles, styles];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const ModalHeaderStyled = (props: ModalHeaderStyledProps) => {
  const { theme: { modal, ...rest } = {}, $withTitle, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const componentStyles = get(themeModal, 'header', {});
  const computedStyles = [
    get(componentStyles, 'default', {}),
    $withTitle ? get(componentStyles, 'withTitle', {}) : {},
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} />;
};
export const ModalTitleStyled = (props: ModalCommonStyledProps) => {
  const { theme: { modal, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const computedStyles = [get(themeModal, 'title.default', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const ModalBodyStyled = (props: ModalCommonStyledProps) => {
  const { theme: { modal, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const computedStyles = [get(themeModal, 'body.default', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const ModalFooterStyled = (props: ModalCommonStyledProps) => {
  const { theme: { modal, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const computedStyles = [get(themeModal, 'footer.default', {}), boxStyles, styles];
  return <div css={computedStyles} {...restNotStyledProps} />;
};

export const CloseButtonStyled = (props: ModalCommonStyledProps<HTMLButtonElement>) => {
  const { theme: { modal, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeModal = new Proxy(modal || {}, tokensHandler(rest));
  const computedStyles = [get(themeModal, 'closeButton.default', {}), boxStyles, styles];
  return <button css={computedStyles} {...restNotStyledProps} />;
};
