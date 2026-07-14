import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import { Button } from '@components';

import type { BoxStyles } from '@types';
import type {
  SelectWrapperStyledProps,
  SelectInitiatorWrapperStyledProps,
  ArrowIconWrapperStyledProps,
  SelectAdornmentStyledProps,
  DropdownButtonStyledProps,
  SelectSearchInputStyledProps,
} from './Select.types';

export const SelectWrapperStyled = forwardRef<HTMLDivElement, SelectWrapperStyledProps>((props, forwardedRef) => {
  const { theme: { select, ...rest } = {}, styles = {}, $disabled, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSelect = new Proxy(select || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeSelect, 'default', {}),
    $disabled ? get(themeSelect, 'disabled', {}) : {},
    boxStyles,
    styles,
  ];

  return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
});

export const InitiatorWrapperStyled = forwardRef<HTMLDivElement, SelectInitiatorWrapperStyledProps>(
  (props, forwardedRef) => {
    const { theme: { select, ...rest } = {}, styles, ...restProps } = props;
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeSelect = new Proxy(select || {}, tokensHandler(rest));
    const computedStyles = [get(themeSelect, 'initiatorWrapper', {}), boxStyles, styles];

    return <div css={computedStyles} {...restNotStyledProps} ref={forwardedRef} />;
  }
);

export const ArrowIconWrapperStyled = (props: ArrowIconWrapperStyledProps) => {
  const { theme: { select, ...rest } = {}, $isOpen, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSelect = new Proxy(select || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeSelect, 'arrowIconWrapper.default', {}),
    $isOpen
      ? get(themeSelect, 'arrowIconWrapper.transform.open', {})
      : get(themeSelect, 'arrowIconWrapper.transform.close', {}),
    boxStyles,
    styles,
  ];

  return <span css={computedStyles} {...restNotStyledProps} />;
};

export const DropdownButtonStyled = (props: DropdownButtonStyledProps) => {
  const { theme: { select, ...rest } = {}, styles, $color = 'primary', ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSelect = new Proxy(select || {}, tokensHandler(rest));
  const buttonStyles = [
    get(themeSelect, 'button.default', {}),
    get(themeSelect, ['button', $color], {}),
    boxStyles,
    styles,
  ];
  const buttonAttrs = get(themeSelect, 'button.attrs', {});

  return <Button css={buttonStyles} {...{ ...buttonAttrs, ...restNotStyledProps }} />;
};

export const SelectAdornmentStyled = (props: SelectAdornmentStyledProps) => {
  const { theme: { select, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSelect = new Proxy(select || {}, tokensHandler(rest));
  const computedStyles = [get(themeSelect, 'adornment.default', {}), boxStyles, styles];

  return <span css={computedStyles} {...restNotStyledProps} />;
};

export const SelectSearchInputStyled = forwardRef<HTMLInputElement, SelectSearchInputStyledProps>(
  (props, forwardedRef) => {
    const { theme: { select, ...rest } = {}, styles, ...restProps } = props;
    const themeSelect = new Proxy(select || {}, tokensHandler(rest));
    const computedStyles = [get(themeSelect, 'searchInput.default', {}), styles];

    return <input css={computedStyles} {...restProps} ref={forwardedRef} />;
  }
);
