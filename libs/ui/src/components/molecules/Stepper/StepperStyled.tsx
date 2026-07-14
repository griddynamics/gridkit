import { forwardRef } from 'react';
import { get } from '@utils';
import { tokensHandler } from '@tokens/utils';

import { StepCommonStyledProps, StepEntityStyledProps, StepperStyledProps, StepStyledProps } from './Stepper.types';

export const StepperStyled = forwardRef<HTMLDivElement, StepperStyledProps>((props, forwardRef) => {
  const { theme: { stepper, ...rest } = {}, styles = {}, ...restProps } = props;
  const themeStepper = new Proxy(stepper || {}, tokensHandler(rest));
  const computedStyles = [get(themeStepper, 'default', {}), styles];

  return <div css={computedStyles} {...restProps} ref={forwardRef} />;
});

export const SeparatorStyled = (props: StepCommonStyledProps) => {
  const { theme: { stepper, ...rest } = {}, $status, ...restProps } = props;
  const themeStepper = new Proxy(stepper || {}, tokensHandler(rest));
  const componentStyles = get(themeStepper, 'separator', {});

  const computedStyles = [get(componentStyles, 'default', {}), get(componentStyles, $status, {})];
  return <div css={computedStyles} {...restProps} />;
};

export const StepStyled = (props: StepStyledProps) => {
  const { theme: { stepper, ...rest } = {}, $status, ...restProps } = props;
  const themeStepper = new Proxy(stepper || {}, tokensHandler(rest));
  const componentStyles = get(themeStepper, 'step', {});

  const computedStyles = [get(componentStyles, 'default', {}), get(componentStyles, $status, {})];

  return <div css={computedStyles} {...restProps} />;
};

export const StepIconStyled = (props: StepEntityStyledProps) => {
  const { theme: { stepper, ...rest } = {}, $status, $validationStatus, ...restProps } = props;
  const themeStepper = new Proxy(stepper || {}, tokensHandler(rest));
  const componentStyles = get(themeStepper, 'stepIcon', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, [$status, 'default'], {}),
    get(componentStyles, [$status, $validationStatus], {}),
  ];

  return <div css={computedStyles} {...restProps} />;
};

export const StepLabelStyled = (props: StepEntityStyledProps) => {
  const { theme: { stepper, ...rest } = {}, $status, $validationStatus, ...restProps } = props;
  const themeStepper = new Proxy(stepper || {}, tokensHandler(rest));
  const componentStyles = get(themeStepper, 'stepLabel', {});

  const computedStyles = [
    get(componentStyles, 'default', {}),
    get(componentStyles, $status, {}),
    get(componentStyles, $validationStatus, {}),
  ];

  return <div css={computedStyles} {...restProps} />;
};
