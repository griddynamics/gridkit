import type {
  ChangeEvent,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  ReactNode,
  ElementType,
  PropsWithChildren,
} from 'react';

import type { EnumOrPrimitive, InputColorVariant, InputVariantType, SizeVariant } from '@types';
import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export interface BaseInputFieldProps extends CommonCssComponentProps<HTMLInputElement> {
  readOnly?: boolean;
  id?: string; // To allow associating the label with the input
  name?: string;
  variant?: EnumOrPrimitive<InputVariantType>;
  color?: InputColorVariant;
  label?: string;
  value?: string;
  placeholder?: string;
  defaultValue?: string | number; // Default value for controlled components
  onClick?: (event: MouseEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onMouseDown?: (event: MouseEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  ariaRequired?: boolean;
  ariaDescribedBy?: string; // For associating error messages or hints
  role?: string;
  inputmode?: string;
  tabIndex?: number;
  debounceCallbackTime?: number;
}
export type InputFieldRestHtmlProps = Partial<Omit<HTMLInputElement, keyof InputFieldProps | 'type'>>;

// Extending BaseInputFieldProps: Radio button-specific properties
export interface RadioButtonProps extends Omit<BaseInputFieldProps, 'type'> {
  type: InputVariantType.Radio;
  checked?: boolean;
  defaultChecked?: boolean;
}

// Extending BaseInputFieldProps: Checkbox-specific properties
export interface CheckboxFieldProps extends Omit<BaseInputFieldProps, 'type' | 'value'> {
  type: InputVariantType.Checkbox;
  checked?: boolean;
  defaultChecked?: boolean;
}

export type InputFieldProps = (BaseInputFieldProps | RadioButtonProps | CheckboxFieldProps) & {
  wrapperAs?: keyof HTMLElementTagNameMap | ElementType;
  width?: string;
  label?: ReactNode;
  helperText?: ReactNode;
  adornmentStart?: ReactNode;
  adornmentEnd?: ReactNode;
};
export interface InputAdornmentProps extends CommonCssComponentProps, PropsWithChildren {}
export interface InputWrapperProps extends CommonCssComponentProps<HTMLBaseElement>, PropsWithChildren {
  as?: keyof HTMLElementTagNameMap | ElementType;
  width?: string;
  withGap?: boolean;
}
export interface InputHelperProps extends CommonCssComponentProps, PropsWithChildren {
  color?: InputColorVariant;
  size?: EnumOrPrimitive<SizeVariant>;
}

export interface InputWrapperPropsStyled extends CommonCssComponentStyledProps<HTMLBaseElement>, PropsWithChildren {
  $as?: keyof HTMLElementTagNameMap | ElementType;
  $withGap?: boolean;
}

export interface InputHelperPropsStyled extends CommonCssComponentStyledProps, PropsWithChildren {
  $color?: InputColorVariant;
  $size?: EnumOrPrimitive<SizeVariant>;
}

export interface InputPropsStyled extends CommonCssComponentStyledProps<HTMLInputElement> {
  $isMouseInteraction: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: EnumOrPrimitive<InputVariantType>;
  $variant?: EnumOrPrimitive<InputVariantType>;
  $color?: InputColorVariant;
}
