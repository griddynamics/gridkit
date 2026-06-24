import type { FormEvent, PropsWithChildren } from 'react';

import type { CommonCssComponentProps, CommonCssComponentStyledProps } from '@components';

export type FormFieldValue = string | number | boolean;
export type FormFieldsData = Record<string, { value: FormFieldValue; isChecked?: boolean }>;
export type FormOnChangeEventData = {
  event: FormEvent<Element>;
  changedControlNames: string[];
  controlValues: FormFieldsData;
  formData: FormFieldsData;
};
export type FormOnSubmitEventData = {
  event: FormEvent<Element>;
  formData: FormFieldsData;
};
export interface FormAriaProps {
  ariaLabelBy?: string;
  describedBy?: string;
}

export interface FormEventHandlers {
  onSubmit?: (formOnSubmitEventData: FormOnSubmitEventData) => void;
  onChange?: (formOnChangeEventData: FormOnChangeEventData) => void;
  onFormSubmit?: (formOnSubmitEventData: FormOnSubmitEventData) => void;
  onFormChange?: (formOnChangeEventData: FormOnChangeEventData) => void;
}

export interface FormProps
  extends
    Omit<CommonCssComponentProps<HTMLFormElement>, 'onSubmit' | 'onChange'>,
    FormAriaProps,
    FormEventHandlers,
    PropsWithChildren {}

export interface FormStyledProps extends CommonCssComponentStyledProps<HTMLFormElement>, PropsWithChildren {}
