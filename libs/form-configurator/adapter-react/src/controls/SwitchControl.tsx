import React from 'react';
import { ErrorObject } from 'ajv';
import { Switch } from '@griddynamics/ui';
import { styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';
import { createLabel, getErrorStyles } from '../lib/labelUtils';

export const SwitchControl: React.FC<ReactControlProps> = ({
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

  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = createLabel(label || '', required);
  const hasErrors = errors.length > 0;
  const { labelColor, errorMessageClass } = getErrorStyles(hasErrors);

  const handleChange = (checked: boolean) => {
    onChange(checked);
  };

  return (
    <div className={styleClasses.switchControl.root}>
      <div className={`${styleClasses.switchControl.labelWrapper} ${labelColor || ''}`}>{displayLabel}</div>
      <Switch checked={!!value} onValueChange={handleChange} disabled={!isEnabled} />
      {hasErrors && <div className={errorMessageClass}>{errorMessage}</div>}
    </div>
  );
};
