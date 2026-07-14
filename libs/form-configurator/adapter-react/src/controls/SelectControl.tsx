import React from 'react';
import { ErrorObject } from 'ajv';
import { Select } from '@griddynamics/ui';
import { styleClasses } from 'gd-form-configurator';
import { SelectableControlProps } from '../types';
import { createLabel, getErrorStyles } from '../lib/labelUtils';

export const SelectControl: React.FC<SelectableControlProps> = ({
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
  const displayLabel = createLabel(label || '', required);
  const hasErrors = errors.length > 0;
  const { labelColor, errorMessageClass } = getErrorStyles(hasErrors);

  const handleChange = (payload: any) => {
    if (payload && typeof payload === 'object' && payload.value !== undefined) {
      onChange(payload.value);
    }
  };

  const selectedOption = options?.find((opt) => opt.value === value);
  const selectValue = selectedOption ? { name: selectedOption.label || '', value: selectedOption.value } : undefined;

  return (
    <div className={styleClasses.selectControl.root}>
      <label className={`${styleClasses.selectControl.label} ${labelColor || ''}`}>{displayLabel}</label>
      <Select
        value={selectValue}
        onChange={handleChange}
        items={options?.map((opt) => ({ name: opt.label || '', value: opt.value })) || []}
        placeholder={label || ''}
        disabled={!isEnabled}
        style={hasErrors ? { borderColor: '#d32f2f' } : undefined}
      />
      {hasErrors && <div className={errorMessageClass}>{errorMessage}</div>}
    </div>
  );
};
