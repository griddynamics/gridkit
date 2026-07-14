import { DataSchema } from 'gd-form-configurator';

export const resolveSchema = (dataSchema: DataSchema, schemaPath: string | undefined): DataSchema | undefined => {
  if (!schemaPath) {
    return undefined;
  }

  const pathSegments = schemaPath
    .replace('#/properties/', '')
    .split('/')
    .filter((segment) => segment !== 'properties');

  let currentSchema: DataSchema | undefined = dataSchema;

  for (const segment of pathSegments) {
    if (currentSchema?.properties) {
      currentSchema = currentSchema.properties[segment];
    } else {
      return undefined;
    }
  }

  return currentSchema;
};
