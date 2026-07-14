import React from 'react';
import { ControlElement, RendererProps, getNestedValue } from 'gd-form-configurator';
import { ReactControlProps } from '../types';

export const withControlAdapter = <T = any,>(Component: React.ComponentType<ReactControlProps<T>>) => {
  return (props: RendererProps) => {
    const { uischema, schema, path, errors, isEnabled, isVisible, engine, isRequired, data } = props;

    if (!('scope' in uischema)) {
      return <div>Invalid UI Schema</div>;
    }

    const { scope, label } = uischema as ControlElement;
    const { enum: enumOptions } = schema;

    const options = enumOptions ? enumOptions.map((opt: any) => ({ label: opt, value: opt })) : [];
    const fieldValue = getNestedValue(data, path, '');

    const controlProps: ReactControlProps<T> = {
      scope,
      label,
      options,
      required: !!isRequired,
      value: fieldValue,
      errors,
      isEnabled,
      isVisible,
      path,
      schema, // Pass the full schema for controls that need it (e.g., ArrayControl)
      onChange: (value: T) => {
        engine.updateField(path, () => value);
      },
    };

    return <Component {...controlProps} />;
  };
};
