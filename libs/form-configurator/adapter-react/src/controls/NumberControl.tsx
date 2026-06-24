import React from 'react';
import { ErrorObject } from 'ajv';
import { Input } from '@griddynamics/ui';
import { parseFieldName, styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';
import { createLabel, getErrorStyles, getErrorAriaAttributes, generateControlId } from '../lib/labelUtils';

export const NumberControl: React.FC<ReactControlProps> = ({
  path,
  scope,
  label,
  isVisible,
  required,
  value,
  errors,
  isEnabled,
  onChange,
}) => {
  if (!isVisible) {
    return null;
  }

  const inputId = generateControlId('number', path, scope);
  const fieldName = parseFieldName(scope);
  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = createLabel(label || '', required);
  const hasErrors = errors.length > 0;
  const { labelColor, errorMessageClass } = getErrorStyles(hasErrors);
  const errorAriaAttributes = getErrorAriaAttributes(hasErrors, inputId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      onChange(undefined);
    } else {
      const numericValue = Number(inputValue);
      onChange(isNaN(numericValue) ? inputValue : numericValue);
    }
  };

  return (
    <div className={styleClasses.controlContainer.root}>
      <div className={`${styleClasses.controlContainer.labelText} ${labelColor || ''}`}>{displayLabel}</div>
      <Input
        id={inputId}
        name={fieldName}
        variant="number"
        color={hasErrors ? 'error' : 'primary'}
        value={value != null ? String(value) : ''}
        onChange={handleChange}
        disabled={!isEnabled}
        required={required}
        {...errorAriaAttributes}
      />
      {hasErrors && (
        <div id={`${inputId}-error`} className={errorMessageClass}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
