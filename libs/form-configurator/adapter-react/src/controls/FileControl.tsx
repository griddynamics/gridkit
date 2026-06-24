import React from 'react';
import { ErrorObject } from 'ajv';
import { InputFile } from '@griddynamics/ui';
import { styleClasses } from 'gd-form-configurator';
import { ReactControlProps } from '../types';

export const FileControl: React.FC<ReactControlProps> = ({
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

  const errorMessage = errors.length > 0 ? errors.map((err: ErrorObject) => err.message).join(', ') : undefined;
  const displayLabel = required ? `${label || ''} *` : label || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const fileData = {
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64String,
        };
        onChange(JSON.stringify(fileData));
      };
      reader.readAsDataURL(file);
    } else {
      onChange('');
    }
  };

  const accept = (schema as any)?.accept || schema?.format;
  const multiple = (schema as any)?.multiple || false;

  let fileInfo = null;
  if (value && typeof value === 'string' && value.startsWith('{')) {
    try {
      fileInfo = JSON.parse(value);
    } catch {
      fileInfo = { name: value };
    }
  }

  return (
    <div className={styleClasses.fileControl.root}>
      <label className={styleClasses.fileControl.label}>{displayLabel}</label>
      <InputFile
        accept={accept}
        multiple={multiple}
        disabled={!isEnabled}
        onChange={handleChange}
        buttonProps={{
          children: 'Choose File',
          variant: 'outlined',
        }}
      />
      {errorMessage && <div className={styleClasses.control.errorMessage}>{errorMessage}</div>}
      {schema && accept && <div className={styleClasses.fileControl.hint}>Accepted formats: {accept}</div>}
      {fileInfo && (
        <div className={styleClasses.fileControl.info}>
          {fileInfo.name && `Selected: ${fileInfo.name}`}
          {fileInfo.size && ` (${Math.round(fileInfo.size / 1024)} KB)`}
        </div>
      )}
    </div>
  );
};
