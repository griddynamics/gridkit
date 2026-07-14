'use client';
import { forwardRef } from 'react';
import { get } from '@utils';
import { getBoxStyles, tokensHandler } from '@tokens/utils';
import type { BoxStyles } from '@types';

import type { CheckboxStyledProps, CheckboxInputStyledProps, CheckboxIndicatorStyledProps } from './Checkbox.types';

export const CheckboxWrapperStyled = forwardRef<HTMLLabelElement, CheckboxStyledProps>((props, forwardedRef) => {
  const { theme: { checkbox: checkboxToken, ...rest } = {}, $disabled, styles = {}, ...restProps } = props;
  const { boxStyles, restProps: restNotStyledProps } = getBoxStyles(restProps as BoxStyles);
  const themeCheckbox = new Proxy(checkboxToken || {}, tokensHandler(rest));

  return (
    <label
      css={[
        get(themeCheckbox, 'wrapper.default', {}),
        $disabled ? get(themeCheckbox, 'wrapper.disabled', {}) : {},
        boxStyles,
        styles,
      ]}
      {...restNotStyledProps}
      ref={forwardedRef}
    />
  );
});

export const CheckboxInputStyled = forwardRef<HTMLInputElement, CheckboxInputStyledProps>((props, forwardedRef) => {
  const { theme: { checkbox: checkboxToken, ...rest } = {}, styles, ...restProps } = props;
  const themeCheckbox = new Proxy(checkboxToken || {}, tokensHandler(rest));
  const computedStyles = [get(themeCheckbox, 'input.default', {}), styles];

  return <input type="checkbox" css={computedStyles} {...restProps} ref={forwardedRef} />;
});

export const CheckboxIndicatorStyled = (props: CheckboxIndicatorStyledProps) => {
  const {
    theme: { checkbox: checkboxToken, ...rest } = {},
    $checked,
    $indeterminate,
    $disabled,
    $size = 'md',
    styles,
    ...restProps
  } = props;
  const themeCheckbox = new Proxy(checkboxToken || {}, tokensHandler(rest));
  const sizeValues = get(themeCheckbox, ['size', $size], { width: '18px', height: '18px' });

  return (
    <span
      css={[
        get(themeCheckbox, 'indicator.default', {}),
        { width: sizeValues.width, height: sizeValues.height },
        $checked ? get(themeCheckbox, 'indicator.checked', {}) : {},
        $indeterminate ? get(themeCheckbox, 'indicator.indeterminate', {}) : {},
      ]}
      {...restProps}
    />
  );
};
