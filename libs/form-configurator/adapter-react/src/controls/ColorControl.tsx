import React from 'react';
import { ErrorObject } from 'ajv';
import { Input } from '@griddynamics/ui';
import { parseFieldName, styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';
import { createLabel, getErrorStyles, getErrorAriaAttributes, generateControlId } from '../lib/labelUtils';

export const ColorControl: React.FC<ReactControlProps> = ({
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

  const inputId = generateControlId('color', path, scope);
  const fieldName = parseFieldName(scope);
  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = createLabel(label || '', required);
  const hasErrors = errors.length > 0;
  const { labelColor, errorMessageClass } = getErrorStyles(hasErrors);
  const errorAriaAttributes = getErrorAriaAttributes(hasErrors, inputId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const colorValue = value || '#000000';

  return (
    <div className={styleClasses.colorControl.root}>
      <div className={`${styleClasses.colorControl.labelWrapper} ${labelColor || ''}`}>{displayLabel}</div>
      <div className={styleClasses.colorControl.inputWrapper}>
        <Input
          id={inputId}
          name={fieldName}
          variant="color"
          color={hasErrors ? 'error' : 'primary'}
          value={colorValue}
          onChange={handleChange}
          disabled={!isEnabled}
          required={required}
          className={styleClasses.colorControl.colorInput}
          {...errorAriaAttributes}
        />
        <Input
          variant="text"
          name={`${fieldName}_text`}
          value={colorValue}
          onChange={handleChange}
          disabled={!isEnabled}
          placeholder="#000000"
          className={styleClasses.colorControl.textInput}
        />
        <div
          className={styleClasses.colorControl.preview}
          style={{ backgroundColor: colorValue }}
          title={`Current color: ${colorValue}`}
        />
      </div>
      {hasErrors && (
        <div id={`${inputId}-error`} className={errorMessageClass}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
