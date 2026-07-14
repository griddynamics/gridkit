import React from 'react';
import { ErrorObject } from 'ajv';
import { Input } from '@griddynamics/ui';
import { styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';
import { createLabel, getErrorStyles, getErrorAriaAttributes, generateControlId } from '../lib/labelUtils';

export const RangeControl: React.FC<ReactControlProps> = ({
  scope,
  path,
  label,
  isVisible,
  required,
  value,
  errors,
  isEnabled,
  onChange,
  schema,
}) => {
  if (!isVisible) {
    return null;
  }

  const inputId = generateControlId('range', path, scope);
  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = createLabel(label || '', required);
  const hasErrors = errors.length > 0;
  const { labelColor, errorMessageClass } = getErrorStyles(hasErrors);
  const errorAriaAttributes = getErrorAriaAttributes(hasErrors, inputId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = Number(e.target.value);
    onChange(isNaN(numericValue) ? e.target.value : numericValue);
  };

  const min = schema?.minimum || 0;
  const max = schema?.maximum || 100;
  const step = (schema as any)?.multipleOf || 1;

  const currentValue = value != null ? value : min;

  return (
    <div className={styleClasses.rangeControl.root}>
      <div className={styleClasses.rangeControl.header}>
        <label className={`${styleClasses.rangeControl.labelWrapper} ${labelColor || ''}`}>{displayLabel}</label>
        <span className={styleClasses.rangeControl.value}>{currentValue}</span>
      </div>
      <Input
        id={inputId}
        variant="range"
        color={hasErrors ? 'error' : 'primary'}
        value={String(currentValue)}
        onChange={handleChange}
        disabled={!isEnabled}
        required={required}
        min={String(min)}
        max={String(max)}
        step={step}
        {...errorAriaAttributes}
      />
      {hasErrors && <div className={errorMessageClass}>{errorMessage}</div>}
      {schema && (schema.minimum !== undefined || schema.maximum !== undefined) && (
        <div className={styleClasses.rangeControl.hint}>
          Range: {min} - {max}
        </div>
      )}
    </div>
  );
};
