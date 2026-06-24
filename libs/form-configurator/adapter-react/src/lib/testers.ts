import { UISchema, DataSchema } from 'gd-form-configurator';

export const createTester =
  (name: string) =>
  (uischema: UISchema): number => {
    return uischema.type === 'Control' && (uischema as any).options?.custom === name ? 2 : -1;
  };

export const createFormatTester =
  (format: string) =>
  (uischema: UISchema, schema: DataSchema): number => {
    return uischema.type === 'Control' && schema.format === format ? 2 : -1;
  };

export const createTypeTester =
  (type: string) =>
  (uischema: UISchema, schema: DataSchema): number => {
    return uischema.type === 'Control' && schema.type === type ? 1 : -1;
  };

export const createTypeFormatTester =
  (type: string, format: string) =>
  (uischema: UISchema, schema: DataSchema): number => {
    return uischema.type === 'Control' && schema.type === type && schema.format === format ? 3 : -1;
  };

export const passwordTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'password' ? 3 : -1;
};

export const emailTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'email' ? 3 : -1;
};

export const uriTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && (schema.format === 'uri' || schema.format === 'url') ? 3 : -1;
};

export const dateTimeTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'date-time' ? 3 : -1;
};

export const dateTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'date' ? 3 : -1;
};

export const timeTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'time' ? 3 : -1;
};

export const telTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'tel' ? 3 : -1;
};

export const textareaTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' &&
    schema.type === 'string' &&
    ((schema.maxLength && schema.maxLength > 100) || schema.format === 'textarea')
    ? 2
    : -1;
};

export const rangeTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' &&
    schema.type === 'number' &&
    (schema.minimum !== undefined || schema.maximum !== undefined)
    ? 2
    : -1;
};

export const fileTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'file' ? 3 : -1;
};

export const colorTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'color' ? 3 : -1;
};

export const searchTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.format === 'search' ? 3 : -1;
};

export const arrayTester = (uischema: UISchema, schema: DataSchema): number => {
  return uischema.type === 'Control' && schema.type === 'array' ? 3 : -1;
};
