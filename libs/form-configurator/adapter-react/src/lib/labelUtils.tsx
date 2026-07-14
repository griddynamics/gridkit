import React from 'react';
import { generateControlId, styleClasses } from 'gd-form-configurator';

export const createLabel = (label: string, required: boolean): React.ReactNode => {
  if (!required) {
    return label;
  }

  return (
    <>
      {label} <span className={styleClasses.controlContainer.required}>*</span>
    </>
  );
};

export const getErrorStyles = (hasErrors: boolean) => ({
  labelColor: hasErrors ? styleClasses.controlContainer.labelError : undefined,
  errorMessageClass: styleClasses.control.errorMessage,
});

export const getErrorAriaAttributes = (hasErrors: boolean, inputId: string) => ({
  'aria-invalid': hasErrors,
  'aria-describedby': hasErrors ? `${inputId}-error` : undefined,
});

export { generateControlId };
