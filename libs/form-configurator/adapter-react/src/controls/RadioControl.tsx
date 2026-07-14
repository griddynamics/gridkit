import React from 'react';
import { ErrorObject } from 'ajv';
import { Input } from '@griddynamics/ui';
import { styleClasses } from 'gd-form-configurator';
import { SelectableControlProps } from '../types';

export const RadioControl: React.FC<SelectableControlProps> = ({
  scope,
  path,
  label,
  options,
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

  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = required ? `${label || ''} *` : label || '';

  const handleChange = (optionValue: any) => {
    onChange(optionValue);
  };

  return (
    <div className={styleClasses.radioControl.root}>
      <div className={styleClasses.radioControl.labelWrapper}>{displayLabel}</div>
      {options?.map((option, index) => {
        const inputId = `radio-${scope.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`;

        return (
          <div key={option.value} className={styleClasses.radioControl.item}>
            <Input
              id={inputId}
              label={option.label}
              variant="radio"
              name={`radio-${scope}`}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={!isEnabled}
              required={required}
            />
          </div>
        );
      })}
      {errorMessage && <div className={styleClasses.control.errorMessage}>{errorMessage}</div>}
    </div>
  );
};
