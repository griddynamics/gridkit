import { ErrorObject } from 'ajv';
import { shallow } from 'zustand/shallow';
import { getNestedValue, parseFieldName } from 'gd-form-configurator';
import { useFormStore, useFormEngine } from '../context';

export const useControl = (scope: string) => {
  const path = parseFieldName(scope);
  const engine = useFormEngine();

  const { data, errors, enablement } = useFormStore(
    (state: any) => ({
      data: state.data,
      errors: state.errors,
      enablement: state.enablement,
    }),
    shallow
  );

  const value = getNestedValue(data, path, '');
  const controlErrors = errors.filter((e: ErrorObject) => e.instancePath === `/${path.replace(/\./g, '/')}`);

  const setValue = (newValue: any) => {
    engine.updateField(path, () => newValue);
  };

  return {
    value: value ?? '',
    setValue,
    errors: controlErrors,
    isDisabled: enablement[path] === false,
    isVisible: engine.getVisibility(path, data),
  };
};
