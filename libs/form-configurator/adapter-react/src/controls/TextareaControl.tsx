import React from 'react';
import { Textarea } from '@griddynamics/ui';
import { parseFieldName, styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';
import { createLabel, getErrorStyles, generateControlId } from '../lib/labelUtils';

export const TextareaControl: React.FC<ReactControlProps> = ({
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

  const textareaId = generateControlId('textarea', path, scope);
  const fieldName = parseFieldName(scope);
  const displayLabel = createLabel(label || '', required);
  const hasErrors = errors.length > 0;
  const { labelColor } = getErrorStyles(hasErrors);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const minLength = schema?.minLength;
  const maxLength = schema?.maxLength;

  return (
    <div className={styleClasses.textareaControl.root}>
      <label htmlFor={textareaId} className={`${styleClasses.textareaControl.label} ${labelColor || ''}`}>
        {displayLabel}
      </label>
      <Textarea
        id={textareaId}
        name={fieldName}
        value={value || ''}
        onChange={handleChange}
        disabled={!isEnabled}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={label}
        style={{ width: '100%' } as React.CSSProperties}
        aria-invalid={hasErrors}
        aria-describedby={hasErrors ? `${textareaId}-error` : undefined}
      />
      {schema && (minLength !== undefined || maxLength !== undefined) && (
        <div className={styleClasses.textareaControl.hint}>
          {minLength && `Min: ${minLength} characters`}
          {minLength && maxLength && ' • '}
          {maxLength && `Max: ${maxLength} characters`}
        </div>
      )}
    </div>
  );
};
