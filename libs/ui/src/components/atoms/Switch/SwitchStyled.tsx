'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { HiddenCheckboxStyledProps, SwitchLabelStyledProps, SwitchStyledProps } from './';

export const HiddenCheckboxStyled = (props: HiddenCheckboxStyledProps) => {
  const { theme: { switchToken, ...rest } = {}, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSwitchToken = new Proxy(switchToken || {}, tokensHandler(rest));
  const computedStyles = [get(themeSwitchToken, 'checkbox', {}), boxStyles, styles];

  return <input type="checkbox" css={computedStyles} {...restNotStyledProps} />;
};

export const SwitchWrapperStyled = forwardRef<HTMLLabelElement, SwitchStyledProps<HTMLLabelElement>>(
  (props, forwardedRef) => {
    const { theme: { switchToken, ...rest } = {}, styles = {}, $disabled, ...restProps } = props;
    const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
    const themeSwitchToken = new Proxy(switchToken || {}, tokensHandler(rest));

    return (
      <label
        css={[
          get(themeSwitchToken, 'wrapper.default', {}),
          $disabled ? get(themeSwitchToken, 'wrapper.disabled', {}) : {},
          boxStyles,
          styles,
        ]}
        {...restNotStyledProps}
        ref={forwardedRef}
      />
    );
  }
);

export const SwitchLabelStyled = (props: SwitchLabelStyledProps) => {
  const { theme: { switchToken, ...rest } = {}, $label, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSwitchToken = new Proxy(switchToken || {}, tokensHandler(rest));

  return (
    <span
      css={[
        get(themeSwitchToken, 'label.default', {}),
        get(themeSwitchToken, ['label', $label], {}),
        boxStyles,
        styles,
      ]}
      {...restNotStyledProps}
    />
  );
};

export const SwitchSliderStyled = (props: SwitchStyledProps<HTMLLabelElement>) => {
  const { theme: { switchToken, ...rest } = {}, $checked, $disabled, styles, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSwitchToken = new Proxy(switchToken || {}, tokensHandler(rest));

  return (
    <span
      css={[
        get(themeSwitchToken, 'slider.default', {}),
        $checked ? get(themeSwitchToken, 'slider.checked', {}) : {},
        $disabled ? get(themeSwitchToken, 'slider.disabled', {}) : {},
        boxStyles,
        styles,
      ]}
      {...restNotStyledProps}
    />
  );
};

export const SwitchStyled = (props: SwitchStyledProps<HTMLLabelElement>) => {
  const { theme: { switchToken, ...rest } = {}, styles, $checked, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeSwitchToken = new Proxy(switchToken || {}, tokensHandler(rest));
  const computedStyles = [
    get(themeSwitchToken, 'default', {}),
    $checked && get(themeSwitchToken, 'checked', {}),
    boxStyles,
    styles,
  ];

  return <span css={computedStyles} {...restNotStyledProps} />;
};
