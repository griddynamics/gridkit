import React from 'react';
import { ErrorObject } from 'ajv';
import { Input } from '@griddynamics/ui';
import { styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';
import { generateControlId } from '../lib/labelUtils';

export const CheckboxControl: React.FC<ReactControlProps> = ({
  scope,
  path,
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

  const inputId = generateControlId('checkbox', path, scope);
  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = required ? `${label || ''} *` : label || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className={styleClasses.checkboxControl.root}>
      <Input
        id={inputId}
        label={displayLabel}
        variant="checkbox"
        checked={!!value}
        onChange={handleChange}
        disabled={!isEnabled}
        helperText={errorMessage}
        required={required}
      />
    </div>
  );
};
